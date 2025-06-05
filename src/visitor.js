const LuaParserVisitor = require("../lib/LuaParserVisitor").default;
const _generator = require("../utils/generator");
//console.log(Object.getOwnPropertyNames(v))
class visitor extends LuaParserVisitor {
    constructor() {
        super();
        this.idCounter = 0;
        this.blocks = {};
        this.generator = new _generator();
        this.customBlocks = {};
        this.mainBodyBlockIds = []; // Store main's body block ids
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
        if (
            ctx.children &&
            ctx.children.length === 3 &&
            ctx.children[0].getText() === "function" &&
            ctx.children[1].constructor.name === "FuncnameContext" &&
            ctx.children[2].constructor.name === "FuncbodyContext"
        ) {
            const funcnameCtx = ctx.children[1];
            const funcbodyCtx = ctx.children[2];
            const funcName = funcnameCtx.getText();

            // Special handling for main
            if (funcName === "main") {
                // Visit the body and collect block IDs
                const block = funcbodyCtx.block();
                let bodyBlockIds = [];
                if (block && block.children) {
                    for (const child of block.children) {
                        if (
                            child.constructor &&
                            child.constructor.name.endsWith("StatementContext")
                        ) {
                            const stmtId = this.visit(child);
                            if (stmtId) bodyBlockIds.push(stmtId);
                        }
                    }
                }
                // Save for index.js to chain under flag
                this.mainBodyBlockIds = bodyBlockIds;
                // Do NOT emit any blocks for main itself
                return null;
            }

            // Get parameter names
            const parlist = funcbodyCtx.parlist();
            let argumentnames = [];
            if (parlist && parlist.namelist) {
                const namelist = parlist.namelist();
                if (namelist && namelist.NAME) {
                    const names = namelist.NAME();
                    for (let i = 0; i < names.length; i++) {
                        argumentnames.push(names[i].getText());
                    }
                }
            }

            // Special rule for "main" function: must have no arguments
            if (funcName === "main" && argumentnames.length > 0) {
                throw new Error(
                    'The "main" function must not have any arguments.'
                );
            }

            // --- Normal function/procedure block generation ---
            let argumentids = argumentnames.map(() =>
                this.generator.letterCount(this.generator.blockIdCounter++)
            );
            let argumentdefaults = argumentnames.map(() => "");
            let proccode =
                funcName +
                (argumentnames.length
                    ? " " + argumentnames.map(() => "%s").join(", ")
                    : "");
            const defId = this.generator.letterCount(
                this.generator.blockIdCounter++
            );
            const protoId = this.generator.letterCount(
                this.generator.blockIdCounter++
            );

            // Add prototype block
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
                    argumentids: JSON.stringify(argumentids),
                    argumentnames: JSON.stringify(argumentnames),
                    argumentdefaults: JSON.stringify(argumentdefaults),
                    warp: "true",
                    returns: "null",
                    edited: "true",
                    optype: "null",
                    color: JSON.stringify(["#FF6680", "#FF4D6A", "#FF3355"]),
                },
            });

            // Add argument blocks
            argumentids.forEach((id, i) => {
                this.generator.addBlock({
                    opcode: "argument_reporter_string_number",
                    id,
                    parent: protoId,
                    next: null,
                    shadow: true,
                    fields: { VALUE: [argumentnames[i], ""] },
                    mutation: {
                        color: JSON.stringify([
                            "#FF6680",
                            "#FF4D6A",
                            "#FF3355",
                        ]),
                    },
                });
            });

            // --- BODY PARSING ---
            const block = funcbodyCtx.block();
            let bodyBlockIds = [];
            if (block && block.children) {
                for (const child of block.children) {
                    if (
                        child.constructor &&
                        child.constructor.name.endsWith("StatementContext")
                    ) {
                        const stmtId = this.visit(child);
                        if (stmtId) bodyBlockIds.push(stmtId);
                    }
                }
            }

            // Add the definition block FIRST so it exists in generator.blocks
            this.generator.addBlock({
                opcode: "procedures_definition",
                id: defId,
                parent: null,
                // next will be set below
                topLevel: true,
                inputs: { custom_block: [1, protoId] },
                children: bodyBlockIds,
            });

            // --- CHAINING FIX ---
            if (bodyBlockIds.length > 0) {
                // Set parent and next using actual block IDs
                this.generator.blocks[bodyBlockIds[0]].parent = defId;
                this.generator.blocks[defId].next = bodyBlockIds[0];
                for (let i = 1; i < bodyBlockIds.length; i++) {
                    const prevId = bodyBlockIds[i - 1];
                    const currId = bodyBlockIds[i];
                    this.generator.blocks[currId].parent = prevId;
                    this.generator.blocks[prevId].next = currId;
                }
                this.generator.blocks[bodyBlockIds[bodyBlockIds.length - 1]].next = null;
            } else {
                this.generator.blocks[defId].next = null;
            }

            this.customBlocks[funcName] = {
                proccode,
                argumentids,
                argumentnames,
                protoId,
                defId,
            };

            return defId;
        }

        // fallback to default
        let x = this.visitChildren(ctx);
        return x instanceof Array ? x[0] : x;
    }
    visitConcatenation(ctx) {}
    visitFunctioncall(ctx) {
        const funcName = this.getText(ctx.NAME ? ctx.NAME(0) : ctx);
        if (funcName === "print") {
            const explist = ctx.args(0).explist(0);
            const exps = explist.exp ? explist.exp() : [];
            let messageInput;
            let joinBlockIds = [];

            // Build the message input (join chain if needed)
            if (exps.length > 0) {
                let left = this.visitExp(exps[0]);
                for (let i = 1; i < exps.length - (exps.length > 1 ? 1 : 0); i++) {
                    const right = this.visitExp(exps[i]);
                    const joinId = this.generator.addBlock({
                        opcode: "operator_join",
                        inputs: {
                            STRING1: typeof left === "string"
                                ? [1, [10, left]]
                                : left,
                            STRING2: typeof right === "string"
                                ? [1, [10, right]]
                                : right,
                        },
                        parent: null,
                        next: null,
                        shadow: false,
                        topLevel: false,
                    });
                    joinBlockIds.push(joinId);
                    left = [3, joinId, [10, ""]];
                }
                messageInput = left;
            } else {
                messageInput = [1, [10, ""]];
            }

            // If there is a second argument, use sayforsecs
            let blockId;
            if (exps.length > 1) {
                const secs = this.visitExp(exps[exps.length - 1]);
                blockId = this.generator.addBlock({
                    opcode: "looks_sayforsecs",
                    inputs: {
                        MESSAGE: typeof messageInput === "string"
                            ? [1, [10, messageInput]]
                            : messageInput,
                        SECS: typeof secs === "object"
                            ? secs
                            : [1, [4, String(secs)]],
                    },
                    parent: null,
                    next: null,
                    shadow: false,
                    topLevel: false,
                });
            } else {
                blockId = this.generator.addBlock({
                    opcode: "looks_say",
                    inputs: {
                        MESSAGE: typeof messageInput === "string"
                            ? [1, [10, messageInput]]
                            : messageInput,
                    },
                    parent: null,
                    next: null,
                    shadow: false,
                    topLevel: false,
                });
            }

            // Set parent of join blocks to the say/sayforsecs block
            for (const joinId of joinBlockIds) {
                this.generator.blocks[joinId].parent = blockId;
            }

            return blockId;
        }
        // User-defined function call
        const proc = this.customBlocks[funcName];
        if (!proc) {
            return this.sendText(ctx);
        }
        const callId = this.generator.letterCount(
            this.generator.blockIdCounter++
        );
        let callArgs = [];
        if (ctx.args && typeof ctx.args === "function") {
            const argsCtx = ctx.args();
            if (
                argsCtx &&
                argsCtx.explist &&
                typeof argsCtx.explist === "function"
            ) {
                const explist = argsCtx.explist(0);
                if (explist && explist.exp) callArgs = explist.exp();
            }
        }
        let callInputs = {};
        for (let i = 0; i < proc.argumentids.length; i++) {
            callInputs[proc.argumentids[i]] = callArgs[i]
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
                tagName: "mutation",
                children: [],
                proccode: proc.proccode,
                argumentids: JSON.stringify(proc.argumentids),
                warp: "false",
                returns: "null",
                optype: "null",
                color: JSON.stringify(["#FF6680", "#FF4D6A", "#FF3355"]),
            },
        });
        return callId;
    }
    visitExp(ctx, parentId = null) {
        // If it's a string literal
        if (ctx.STRING) {
            return ctx.getText().slice(1, -1); // Remove quotes
        }

        // Concatenation: exp .. exp
        if (
            ctx.children &&
            ctx.children.length >= 3 &&
            ctx.children.some((child) => this.getText(child) === "..")
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
                const joinId = this.generator.letterCount(
                    this.generator.blockIdCounter
                );
                this.generator.blockIdCounter++; // Reserve for join block

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

            // Map Lua operator to Scratch/PenguinMod opcode and input names
            const opMap = {
                "+": { opcode: "operator_add", left: "NUM1", right: "NUM2" },
                "-": {
                    opcode: "operator_subtract",
                    left: "NUM1",
                    right: "NUM2",
                },
                "*": {
                    opcode: "operator_multiply",
                    left: "NUM1",
                    right: "NUM2",
                },
                "/": { opcode: "operator_divide", left: "NUM1", right: "NUM2" },
            };

            if (opMap[op]) {
                const { opcode, left, right } = opMap[op];
                const blockId = this.generator.letterCount(
                    this.generator.blockIdCounter
                );
                this.generator.blockIdCounter++; // Reserve for this block

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
    visitFunctiondef(ctx) {
        // Get function name and body
        const funcbody = ctx.funcbody();
        const parlist = funcbody.parlist();
        const block = funcbody.block();

        // Generate a unique id for the prototype and definition
        const protoId = this.generator.letterCount(
            this.generator.blockIdCounter++
        );
        const defId = this.generator.letterCount(
            this.generator.blockIdCounter++
        );

        // Gather argument names
        let argumentnames = [];
        let argumentids = [];
        let argumentdefaults = [];
        if (parlist && parlist.namelist) {
            const namelist = parlist.namelist();
            if (namelist && namelist.NAME) {
                const names = namelist.NAME();
                for (let i = 0; i < names.length; i++) {
                    const argName = names[i].getText();
                    argumentnames.push(argName);
                    argumentids.push(protoId + "_arg" + i);
                    argumentdefaults.push("");
                }
            }
        }

        // Create the prototype block
        const prototype = {
            opcode: "procedures_prototype",
            id: protoId,
            next: null,
            parent: defId,
            inputs: {},
            shadow: true,
            mutation: {
                tagName: "mutation",
                children: [],
                proccode:
                    "myfunction" + argumentnames.map(() => " %s").join(""),
                argumentids: JSON.stringify(argumentids),
                argumentnames: JSON.stringify(argumentnames),
                argumentdefaults: JSON.stringify(argumentdefaults),
                warp: "false",
            },
        };

        // Create the definition block
        const definition = {
            opcode: "procedures_definition",
            id: defId,
            next: null,
            parent: null,
            inputs: {
                custom_block: [1, protoId],
            },
            topLevel: true,
            x: 0,
            y: 0,
        };

        // Add blocks to generator
        this.generator.addBlock(prototype);
        this.generator.addBlock(definition);

        // Visit the function body (block)
        if (block) {
            this.visitBlock(block);
        }

        // Optionally, store custom block info for calls
        // this.customBlocks[funcName] = { prototype, definition };

        return;
    }
}
module.exports = visitor;
