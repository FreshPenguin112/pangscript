const LuaParserVisitor = require("../lib/LuaParserVisitor").default;

class visitor extends LuaParserVisitor {
    constructor(generator) {
        super();
        this.generator = generator;
        this.procRegistry = {}; // name -> {proccode, argIds, argNames, returns, optype}
    }

    _genId() {
        // Use generator's letterCount for unique IDs
        return this.generator.letterCount(this.generator.blockIdCounter++);
    }

    isType(ctx, type) {
        try {
            return !!ctx[type]();
        } catch (e) {
            return false;
        }
    }
    getText(ctx, parse = false) {
        try {
            return parse ? JSON.parse(ctx.getText()) : ctx.getText();
        } catch (e) {
            return "";
        }
    }

    // --- Main entry for statements ---
    visitStatement(ctx) {
        if (ctx.funcname && ctx.funcbody) {
            return this.visitFunctiondef(ctx);
        }
        // Find a functioncall child node (robust for most grammars)
        if (ctx.children) {
            for (const child of ctx.children) {
                if (child.constructor && child.constructor.name === "FunctioncallContext") {
                    return this.visitFunctioncall(child);
                }
            }
            // Fallback: visit all children and return the first non-undefined result
            for (const child of ctx.children) {
                const result = this.visit(child);
                if (result !== undefined) return result;
            }
        }
        return undefined;
    }

    visitFunctiondef(ctx) {
        // Get function name
        let funcName = ctx.funcname
            ? this.getText(ctx.funcname())
            : ctx.NAME
            ? this.getText(ctx.NAME())
            : "myblock";

        // Get parameter names
        let funcbody = ctx.funcbody && ctx.funcbody();
        if (!funcbody || !funcbody.children) return;
        let argNames = [];
        let parlist = funcbody.children.find(
            (child) =>
                child.constructor && child.constructor.name === "ParlistContext"
        );
        if (parlist && parlist.children && parlist.children.length > 0) {
            let namelist = parlist.children.find(
                (child) =>
                    child.constructor &&
                    child.constructor.name === "NamelistContext"
            );
            if (namelist) {
                argNames = namelist.children
                    .filter(
                        (child) =>
                            child.symbol &&
                            child.symbol.type &&
                            child.symbol.text
                    )
                    .map((child) => child.symbol.text);
            }
        }
        let argIds = argNames.map(() => this._genId());

        // Return type annotation
        let returnType = "string";
        let hasReturnAnnotation = false;
        if (funcbody.returntype) {
            const typeNode = funcbody.returntype();
            if (typeNode) {
                hasReturnAnnotation = true;
                returnType = this.getText(typeNode.children[1]);
            }
        }

        // Detect return
        let block = funcbody.block();
        let hasReturn = false;
        if (block && block.retstatement) {
            let ret = block.retstatement();
            if (ret) hasReturn = true;
        }
        if (hasReturnAnnotation && returnType === "nil" && hasReturn) {
            throw new Error(
                `Function "${funcName}" is annotated as returning nil but has a return statement.`
            );
        }
        if (!hasReturnAnnotation && hasReturn) returnType = "string";
        if (hasReturnAnnotation && returnType === "nil") {
            hasReturn = false;
            returnType = null;
        }

        // proccode
        let proccode =
            funcName +
            (argNames.length ? " " + argNames.map(() => "%s").join(", ") : "");

        // Store in registry for calls
        this.procRegistry[funcName] = {
            proccode,
            argIds,
            argNames,
            returns: hasReturn,
            optype: hasReturn ? `"${returnType}"` : "null",
        };

        // IDs for blocks
        const defId = this._genId();
        const protoId = this._genId();

        // Prototype block
        this.generator.addBlock({
            opcode: "procedures_prototype",
            id: protoId,
            parent: defId,
            next: null,
            shadow: true,
            mutation: {
                tagName: "mutation",
                children: [],
                proccode,
                argumentids: JSON.stringify(argIds),
                argumentnames: JSON.stringify(argNames),
                argumentdefaults: JSON.stringify(argNames.map(() => "")),
                warp: "true",
                returns: hasReturn ? "true" : "null",
                edited: "true",
                optype: hasReturn ? `"${returnType}"` : "null",
                color: JSON.stringify(["#FF6680", "#FF4D6A", "#FF3355"]),
            },
        });

        // Argument reporters
        argIds.forEach((id, i) => {
            this.generator.addBlock({
                opcode: "argument_reporter_string_number",
                id,
                parent: protoId,
                next: null,
                shadow: true,
                fields: { VALUE: [argNames[i], ""] },
                mutation: {
                    color: JSON.stringify(["#FF6680", "#FF4D6A", "#FF3355"]),
                },
            });
        });

        // --- SIMPLIFIED BODY PARSING ---
        let bodyBlockIds = [];
        if (block && block.children) {
            for (const child of block.children) {
                if (child.constructor && child.constructor.name.endsWith("StatementContext")) {
                    const stmtId = this.visit(child);
                    console.log(`Generated block ID for statement: ${stmtId}`);
                    if (stmtId) bodyBlockIds.push(stmtId);
                }
            }
            // Chain them
            for (let i = 0; i < bodyBlockIds.length; i++) {
                const id = bodyBlockIds[i];
                this.generator.blocks[id].parent = defId;
                this.generator.blocks[id].next = bodyBlockIds[i + 1] || null;
            }
        }

        // Definition block
        this.generator.addBlock({
            opcode: hasReturn ? "procedures_definition_return" : "procedures_definition",
            id: defId,
            parent: null,
            next: null,
            topLevel: true,
            inputs: { custom_block: [1, protoId] },
            // Attach children for easy reference (optional, not used by Scratch)
            children: bodyBlockIds
        });

        // Optionally, you can also attach children to the prototype or elsewhere if you want
        // this.generator.blocks[protoId].children = bodyBlockIds;

        return defId;
    }

    visitFunctioncall(ctx) {
        const funcName = this.getText(ctx.NAME ? ctx.NAME(0) : ctx);
        if (funcName === "print") {
            const sayId = this._genId();
            const explist = ctx.args(0).explist(0);
            let x = this.visitExp(explist, sayId);
            this.generator.addBlock({
                opcode: "looks_say",
                id: sayId,
                parent: null,
                next: null,
                inputs: { MESSAGE: x },
            });
            return sayId;
        }
        // User-defined function call
        const proc = this.procRegistry[funcName];
        if (!proc) {
            throw new Error(`Function "${funcName}" is not defined or not registered in procRegistry.`);
        }
        const callId = this._genId();
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
            callInputs[proc.argIds[i]] = callArgs[i]
                ? this.visitExp(callArgs[i], callId)
                : [1, [10, ""]];
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
                color: JSON.stringify(["#FF6680", "#FF4D6A", "#FF3355"]),
            },
        });
        return callId;
    }

    visitFunctioncallContext(ctx) {
        return this.visitFunctioncall(ctx);
    }

    visitExp(ctx, parentId = null) {
        // Concatenation: exp .. exp
        if (
            ctx.children &&
            ctx.children.length >= 3 &&
            ctx.children.some((child) => this.getText(child) === "..")
        ) {
            let exps = [];
            for (let i = 0; i < ctx.children.length; i++) {
                if (ctx.children[i].constructor.name.endsWith("ExpContext")) {
                    exps.push(ctx.children[i]);
                }
            }
            let currentInput = this.visitExp(exps[0], null);
            for (let i = 1; i < exps.length; i++) {
                const joinId = this._genId();
                const left =
                    typeof currentInput === "object"
                        ? currentInput
                        : [1, [10, String(currentInput)]];
                const rightVal = this.visitExp(exps[i], joinId);
                const right =
                    typeof rightVal === "object"
                        ? rightVal
                        : [1, [10, String(rightVal)]];
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
            const opMap = {
                "+": { opcode: "operator_add", left: "NUM1", right: "NUM2" },
                "-": { opcode: "operator_subtract", left: "NUM1", right: "NUM2" },
                "*": { opcode: "operator_multiply", left: "NUM1", right: "NUM2" },
                "/": { opcode: "operator_divide", left: "NUM1", right: "NUM2" },
            };
            if (opMap[op]) {
                const { opcode, left, right } = opMap[op];
                const blockId = this._genId();
                const leftVal = this.visitExp(leftCtx, blockId);
                const rightVal = this.visitExp(rightCtx, blockId);
                this.generator.addBlock({
                    opcode,
                    id: blockId,
                    parent: parentId,
                    next: null,
                    inputs: {
                        [left]:
                            typeof leftVal === "object"
                                ? leftVal
                                : [1, [4, String(leftVal)]],
                        [right]:
                            typeof rightVal === "object"
                                ? rightVal
                                : [1, [4, String(rightVal)]],
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
}

module.exports = visitor;
