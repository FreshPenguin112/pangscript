const LuaParserVisitor = require("../lib/LuaParserVisitor").default;
const _generator = require("../utils/generator");
//console.log(Object.getOwnPropertyNames(v))
class visitor extends LuaParserVisitor {
    constructor() {
        super();
        this.idCounter = 0;
        this.blocks = {};
        this.generator = new _generator()
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
    visitFunctioncall(ctx) {
        //console.log(ctx.parser.getVocabulary())
        //console.log(ctx.NAME(0).getText())
        switch (this.getText(ctx.NAME(0))) {
            case "print": {
                //console.log(this.visitExp(ctx.args(0).explist(0).exp(0)));
                //let id = generator.letterCount(generator.blockIdCounter+1);
                //this.idCounter++;
                //let parent = generator.letterCount(generator.blockIdCounter-1);
                //let next = generator.letterCount(generator.blockIdCounter+1);
                let blocks = this.blocks;
                if (ctx.args(0).explist(0).exp().length === 1) {this.blocks = this.generator
                    .addBlock({
                        opcode: "looks_say",
                        //id,
                        //next,
                        //parent,
                        inputs: {
                            MESSAGE: [
                                1,
                                [
                                    10,
                                    String(
                                        this.visitExp(
                                            ctx.args(0).explist(0).exp(0)
                                        )
                                    ),
                                ],
                            ],
                        },
                    })} else {
                        this.blocks = this.generator
                    .addBlock({
                        opcode: "looks_sayforsecs",
                        //id,
                        //next,
                        //parent,
                        inputs: {
                            MESSAGE: [1, [10, String(this.visitExp(ctx.args(0).explist(0).exp(0)))]], "SECS": [1, [4, String(this.visitExp(ctx.args(0).explist(0).exp(1)))]],
                        },
                    });
                    };
                    return;
            }
            default: {
                return this.sendText(ctx);
            }
        }
    }
    visitExp(ctx) {
        return this.getText(ctx, true);
    }
}
module.exports = visitor;
