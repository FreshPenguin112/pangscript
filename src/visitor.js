const LuaParserVisitor = require("../lib/LuaParserVisitor").default;
const _generator = require("../utils/generator");
const generator = new _generator();
//console.log(Object.getOwnPropertyNames(v))
class visitor extends LuaParserVisitor {
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
    getText(ctx) {
        return (() => {
            try {
                return ctx.getText();
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
    visitStatement(ctx) {
        return this.visitChildren(ctx) instanceof Array
            ? this.visitChildren(ctx)[0]
            : this.visitChildren(ctx);
    }
    visitFunctioncall(ctx) {
        //console.log(ctx.parser.getVocabulary())
        //console.log(ctx.NAME(0).getText())
        switch (this.getText(ctx.NAME(0))) {
            case "print": {
                return this.sendText(ctx, "print");
            }
            default: {
                return this.sendText(ctx);
            }
        }
    }
}
module.exports = visitor;
