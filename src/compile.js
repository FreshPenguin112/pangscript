class compiler {
    constructor() {
        this._generator = require('../utils/generator');
        this.generator = new this._generator();
    }
    letterCount(num) {
        let letters = "abcdefghijklmnopqrstuvwxyz";
        let result = "";
        while (num > 0) {
            num--; // Adjust for 0-indexing
            result = letters[num % 26] + result;
            num = Math.floor(num / 26);
        }
        return result;
    }
    getText(node) { return JSON.parse(node.raw) || node.value }
    /*traverse(ast) {
        while (true) {
            let i = ast.lex()
            console.log(i)
            if (i.value === "<eof>") break;
        }
    }*/
    compile(ast) {
        /*let ast2 = {};
        let i = 1;
        generator.addBlock({ "opcode": "event_whenflagclicked", topLevel: true });
        i++; // flag block is id "a" so index should be 2 so next blocks will have ids starting from "b"
        //console.log(ast.body)
        for (var node of ast.body) {
            console.log("node: ")
            // console.log(JSON.parse(node.expression.arguments[0].raw))
            console.log(node)
            console.log("node arguments: ")
            console.log(node.expression.arguments)
            console.log("value: ")
            //console.log(getText(node.expression.arguments[0]))
            ast2[`${node.type}_${this.letterCount(i++)}`] = node.value;
        }
        console.log(ast2)*/

    }
}
module.exports = { compiler/*, traverse */ };