const LuaParserVisitor = require("../lib/LuaParserVisitor").default;
const _generator = require("../utils/generator");

class visitor extends LuaParserVisitor {
    constructor() {
        super();
        this.blocks = {};
        this.generator = new _generator();
        this.procRegistry = {}; // name -> {proccode, argIds, argNames, returns, optype}
    }
    // isType and getText methods are just ripped straight from fplus
    /*
    might not even need isType because the you can just define
    visit methods for each type you need.
    fplus would've been way easier to make if i knew this lmao
    */
    isType(ctx, type) {
        return (() => {
            try {
                return !!ctx[type]();
            } catch (e) {
                return false;
            }
        })();
    }
    getText(ctx, parse = false) {
        return (() => {
            try {
                return parse ? JSON.parse(ctx.getText()) : ctx.getText();
            } catch (e) {
                return "";
            }
        })();
    }
    getName(ctx) {
        return (() => {
            try {
                return (
                    /*
                    shitty precedence order(based on what name you would most likely be looking for) 
                    to try and get token name lol
                    for example a statement would have the following precedence order,
                    statement ||
                    BREAK(the lexer token that equals the literal word "break") ||
                    break(what BREAK equals, matches the literal word "break" anywhere in the input)
                    */
                    ctx.parser.ruleNames[ctx.ruleIndex] ||
                    ctx.parser.symbolicNames[ctx.start.type] ||
                    ctx.parser.literalNames[ctx.start.type]
                );
            } catch (e) {
                return null;
            }
        })();
    }
    sendText(ctx, name = false) {
        return `${name || this.getName(ctx)}: ${this.getText(ctx)}`;
    }
    getAndClearBlocks() {
        let blocksCopy = { ...this.blocks };
        this.blocks = {};
        return blocksCopy;
    }
    visitStatement(ctx) {
        // Handle function definitions at statement level
        if (ctx.funcname && ctx.funcbody) {
            return this.visitFunctiondef(ctx);
        }
        return this.visitChildren(ctx);
    }
    visitFunctiondef(ctx) {
        // Get function name (for local functions, use NAME, for global use funcname)
        let funcName = "myblock";
        if (ctx.funcname) {
            funcName = this.getText(ctx.funcname());
        } else if (ctx.NAME) {
            funcName = this.getText(ctx.NAME());
        }

        // Get parameter names robustly
        let funcbody = ctx.funcbody && ctx.funcbody();
        if (!funcbody || !funcbody.children) {
            // Defensive: skip or return if funcbody is missing or malformed
            return;
        }
        let argNames = [];
        let parlist = funcbody.children.find(child =>
            child.constructor && child.constructor.name === "ParlistContext"
        );
        if (parlist && parlist.children && parlist.children.length > 0) {
            let namelist = parlist.children.find(child =>
                child.constructor && child.constructor.name === "NamelistContext"
            );
            if (namelist) {
                argNames = namelist.children
                    .filter(child => child.symbol && child.symbol.type && child.symbol.text)
                    .map(child => child.symbol.text);
            }
        }

        // Add this line to generate unique IDs for each argument
        let argIds = argNames.map(() => this._genUid());

        // --- NEW: Get return type annotation if present ---
        let returnType = "string"; // default
        let hasReturnAnnotation = false;
        if (funcbody.returntype) {
            const typeNode = funcbody.returntype();
            if (typeNode) {
                hasReturnAnnotation = true;
                returnType = this.getText(typeNode.children[1]); // skip the colon
            }
        }

        // Detect return: look for retstatement in block
        let block = funcbody.block();
        let hasReturn = false;
        if (block && block.retstatement) {
            let ret = block.retstatement();
            if (ret) {
                hasReturn = true;
            }
        }

        // --- ENFORCE nil return type means no return allowed ---
        if (hasReturnAnnotation && returnType === "nil" && hasReturn) {
            throw new Error(`Function "${funcName}" is annotated as returning nil but has a return statement.`);
        }

        // If no annotation but has return, default to string
        if (!hasReturnAnnotation && hasReturn) {
            returnType = "string";
        }

        // If annotated as nil, treat as not returning
        if (hasReturnAnnotation && returnType === "nil") {
            hasReturn = false;
            returnType = null;
        }

        // Build proccode (e.g. "join %s and %s")
        let proccode = funcName + (argNames.length ? " " + argNames.map(() => "%s").join(", ") : "");

        // Store in registry for calls
        this.procRegistry[funcName] = {
            proccode,
            argIds,
            argNames,
            returns: hasReturn,
            optype: hasReturn ? `"${returnType}"` : "null"
        };

        // IDs for blocks
        const defId = this.generator.letterCount(this.generator.blockIdCounter++);
        const protoId = this.generator.letterCount(this.generator.blockIdCounter++);

        // Create prototype block
        this.generator.addBlock({
            opcode: "procedures_prototype",
            id: protoId,
            parent: defId,
            next: null,
            shadow: true,
            mutation: {
                proccode,
                argumentids: JSON.stringify(argIds || []),
                argumentnames: JSON.stringify(argNames || []),
                argumentdefaults: JSON.stringify((argNames || []).map(() => "")),
                warp: "true",
                returns: hasReturn ? "true" : "null",
                edited: "true",
                optype: hasReturn ? `"${returnType}"` : "null",
                color: JSON.stringify(["#FF6680", "#FF4D6A", "#FF3355"])
            }
        });

        // Argument reporter blocks
        argIds.forEach((id, i) => {
            this.blocks[id] = this.generator.addBlock({
                opcode: "argument_reporter_string_number",
                id,
                parent: protoId,
                next: null,
                shadow: true,
                fields: { VALUE: [argNames[i], ""] },
                mutation: {
                    color: JSON.stringify(["#FF6680", "#FF4D6A", "#FF3355"])
                }
            });
        });

        // Visit function body (statements)
        let bodyFirstId = null;
        let lastBodyId = null;
        if (block && block.statement) {
            const stmts = Array.isArray(block.statement()) ? block.statement() : [block.statement()];
            for (let stmt of stmts) {
                const stmtId = this.visit(stmt);
                if (stmtId) {
                    // If the block isn't already saved, save it
                    if (!this.blocks[stmtId]) {
                        // You may need to return the block object from visitFunctioncall etc.
                        // For now, assume the block is created in the visit method and saved there
                        // If not, you can add logic here to create/save it
                    }
                    if (!bodyFirstId) bodyFirstId = stmtId;
                    if (lastBodyId && this.blocks[lastBodyId]) {
                        this.blocks[lastBodyId].next = stmtId;
                    }
                    lastBodyId = stmtId;
                    // Set parent to defId for top-level body blocks
                    if (this.blocks[stmtId]) this.blocks[stmtId].parent = defId;
                }
            }
        }

        // Definition block, chain prototype and body
        this.blocks[defId] = this.generator.addBlock({
            opcode: hasReturn ? "procedures_definition_return" : "procedures_definition",
            id: defId,
            parent: null,
            next: null,
            topLevel: true,
            inputs: { custom_block: [1, protoId] }
        });

        // Chain prototype to first body block
        if (bodyFirstId && this.blocks[protoId]) {
            this.blocks[protoId].next = bodyFirstId;
        }

        // If hasReturn, generate a procedures_return block (already handled above)
        // ...existing return block logic...

        return defId;
    }
    visitFunctioncall(ctx) {
        const funcName = this.getText(ctx.NAME ? ctx.NAME(0) : ctx);
        if (funcName === "print") {
            const flagId = this.generator.letterCount(this.generator.blockIdCounter - 1);
            const sayId = this.generator.letterCount(this.generator.blockIdCounter);
            this.generator.blockIdCounter++;
            const explist = ctx.args(0).explist(0);
            let x = this.visitExp(explist, sayId);
            this.blocks[sayId] = this.generator.addBlock({
                opcode: "looks_say",
                id: sayId,
                parent: null, // will be set by functiondef
                next: null,
                inputs: { MESSAGE: x }
            });
            return sayId;
        }
        // User-defined function call
        const proc = this.procRegistry[funcName];
        if (!proc) {
            throw new Error(`Function "${funcName}" is not defined or not registered in procRegistry.`);
        }

        const callId = this.generator.letterCount(this.generator.blockIdCounter++);
        // Gather argument expressions
        let callArgs = [];
        if (ctx.args && typeof ctx.args === "function") {
            const argsCtx = ctx.args();
            if (argsCtx && argsCtx.explist && typeof argsCtx.explist === "function") {
                const explist = argsCtx.explist(0);
                if (explist && explist.exp) callArgs = explist.exp();
            }
        }
        let callInputs = {};
        for (let i = 0; i < proc.argIds.length; i++) {
            callInputs[proc.argIds[i]] = callArgs[i] ? this.visitExp(callArgs[i], callId) : [1, [10, ""]];
        }
        this.generator.addBlock({
            opcode: "procedures_call",
            id: callId,
            parent: null,
            next: null,
            inputs: callInputs,
            mutation: {
                proccode: proc.proccode,
                argumentids: JSON.stringify(proc.argIds),
                warp: "false",
                returns: proc.returns ? "true" : "null",
                optype: proc.optype,
                color: JSON.stringify(["#FF6680", "#FF4D6A", "#FF3355"])
            }
        });
        return [3, callId, [4, ""]];
    }
    visitExp(ctx, parentId = null) {
        // Concatenation: exp .. exp
        if (
            ctx.children &&
            ctx.children.length >= 3 &&
            ctx.children.some(child => this.getText(child) === "..")
        ) {
            // Find all exp children and all '..' operators
            let exps = [];
            for (let i = 0; i < ctx.children.length; i++) {
                if (ctx.children[i].constructor.name.endsWith("ExpContext")) {
                    exps.push(ctx.children[i]);
                }
            }
            // Left-associative: (((a .. b) .. c) .. d)
            let currentInput = this.visitExp(exps[0], null);
            for (let i = 1; i < exps.length; i++) {
                const joinId = this.generator.letterCount(this.generator.blockIdCounter);
                this.generator.blockIdCounter++; // Reserve for join block

                const left = typeof currentInput === "object" ? currentInput : [1, [10, String(currentInput)]];
                const rightVal = this.visitExp(exps[i], joinId);
                const right = typeof rightVal === "object" ? rightVal : [1, [10, String(rightVal)]];
                this.generator.addBlock({
                    opcode: "operator_join",
                    id: joinId,
                    parent: parentId,
                    next: null,
                    inputs: {
                        STRING1: left,
                        STRING2: right,
                    },
                });
                currentInput = [3, joinId, [10, ""]];
            }
            return currentInput;
        }

        // Arithmetic: exp + exp, exp - exp, exp * exp, exp / exp
        if (
            ctx.children &&
            ctx.children.length === 3 &&
            ctx.children[0].constructor.name.endsWith("ExpContext") &&
            ctx.children[2].constructor.name.endsWith("ExpContext")
        ) {
            const leftCtx = ctx.children[0];
            const op = this.getText(ctx.children[1]);
            const rightCtx = ctx.children[2];

            // Map Lua operator to Scratch/PenguinMod opcode and input names
            const opMap = {
                "+": { opcode: "operator_add", left: "NUM1", right: "NUM2" },
                "-": { opcode: "operator_subtract", left: "NUM1", right: "NUM2" },
                "*": { opcode: "operator_multiply", left: "NUM1", right: "NUM2" },
                "/": { opcode: "operator_divide", left: "NUM1", right: "NUM2" },
            };

            if (opMap[op]) {
                const { opcode, left, right } = opMap[op];
                const blockId = this.generator.letterCount(this.generator.blockIdCounter);
                this.generator.blockIdCounter++; // Reserve for this block

                const leftVal = this.visitExp(leftCtx, blockId);
                const rightVal = this.visitExp(rightCtx, blockId);

                this.generator.addBlock({
                    opcode,
                    id: blockId,
                    parent: parentId,
                    next: null,
                    inputs: {
                        [left]: typeof leftVal === "object" ? leftVal : [1, [4, String(leftVal)]],
                        [right]: typeof rightVal === "object" ? rightVal : [1, [4, String(rightVal)]],
                    },
                });

                return [3, blockId, [4, ""]];
            }
        }

        // Not a concat or arithmetic, fallback to child or text
        if (
            ctx.exp &&
            typeof ctx.exp === "function" &&
            ctx.exp().length === 1
        ) {
            return this.visitExp(ctx.exp(0), parentId);
        }
        return this.getText(ctx, true);
    }
    _genUid() {
        // Simple unique ID for argument IDs (replace with a better one if needed)
        return Math.random().toString(36).substr(2, 16);
    }
}

module.exports = visitor;
