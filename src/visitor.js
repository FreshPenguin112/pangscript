const v = require("../lib/LuaParserVisitor").default;
//console.log(Object.getOwnPropertyNames(v))
class visitor extends v {
    // isType and getText methods are just ripped straight from fplus
    isType(ctx, type) {
        return (() => {
            try {
                return ctx[type]();
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


    visitStat(ctx) {
        return "functioncall"//`functioncall: ${this.getText(ctx)}`; 
    }
    visitBlock(ctx) {
        return this.visitChildren(ctx);
    }
}
module.exports = visitor; 