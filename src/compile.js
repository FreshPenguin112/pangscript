const _generator = require('../utils/generator');
const generator = new _generator();
function letterCount(num) {
    let letters = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    while (num > 0) {
      num--; // Adjust for 0-indexing
      result = letters[num % 26] + result;
      num = Math.floor(num / 26);
    }
    return result;
  }
function compile(ast) {
    let ast2 = {};
    let i = 1;
    generator.addBlock({ "opcode": "event_whenflagclicked", topLevel: true });
    i++; // flag block is id "a" so index should be 2 so next blocks will have ids starting from "b"
    for (const node of ast.body) {
        ast2[`${node.type}_${letterCount(i++)}`];
    }
}
module.exports = compile;