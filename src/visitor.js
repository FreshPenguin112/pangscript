const LuaParserVisitor = require("../lib/LuaParserVisitor").default;
const _generator = require("../utils/generator");
//console.log(Object.getOwnPropertyNames(v))
class visitor extends LuaParserVisitor {
    constructor() {
        super();
        this.idCounter = 0;
        this.blocks = {};
        this.generator = new _generator();
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
        //console.log(this.visitChildren(ctx))
        let x = this.visitChildren(ctx);
        return x instanceof Array ? x[0] : x;
    }
    visitConcatenation(ctx) {}
    visitFunctioncall(ctx) {
        switch (this.getText(ctx.NAME(0))) {
            case "print": {
                // The flag block is always the previous block (blockIdCounter is already at the next free letter)
                const flagId = this.generator.letterCount(this.generator.blockIdCounter - 1);

                // Say block
                const sayId = this.generator.letterCount(this.generator.blockIdCounter);
                this.generator.blockIdCounter++; // Reserve for say block

                // Check if there are two expressions (for say for secs)
                const explist = ctx.args(0).explist(0);
                const exps = explist.exp ? explist.exp() : [];
                if (exps.length === 2) {
                    // say for secs
                    let msg = this.visitExp(exps[0], sayId);
                    let secs = this.visitExp(exps[1], sayId);

                    this.blocks = this.generator.addBlock({
                        opcode: "looks_sayforsecs",
                        id: sayId,
                        parent: flagId,
                        next: null,
                        inputs: {
                            MESSAGE: msg,
                            SECS: typeof secs === "object" ? secs : [1, [4, String(secs)]],
                        },
                    });
                } else {
                    // say
                    let x = this.visitExp(explist, sayId);

                    this.blocks = this.generator.addBlock({
                        opcode: "looks_say",
                        id: sayId,
                        parent: flagId,
                        next: null, // End of chain
                        inputs: {
                            MESSAGE: x,
                        },
                    });
                }
                return;
            }
            default: {
                return this.sendText(ctx);
            }
        }
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
}
module.exports = visitor;
