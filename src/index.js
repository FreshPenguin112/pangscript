const { InputStream, CommonTokenStream, Token } = require("../lib/antlr4");
const SimpleLangLexer = require("../lib/LuaLexer").default;
const SimpleLangParser = require("../lib/LuaParser").default;
const _visitor = require("./visitor");
const visitor = new _visitor();
const _generator = require("../utils/generator");
const generator = new _generator();
const { readFileSync } = require("fs");
const path = require("path");

generator.addBlock({ "opcode": "event_whenflagclicked", topLevel: true }) //add a whenflagclicked block for the start of the script
console.log(generator.blockIdCounter)
const input = new InputStream(
    readFileSync(path.join(__dirname, "test.lua"), "utf8").toString()
);
const debug = process.argv.includes("--debug") || process.argv.includes("-d");
const lexer = new SimpleLangLexer(input);
/*if (debug) {
    let token = lexer.nextToken();
    while (token.type !== Token.EOF) {
        console.log(`type: ${token.type}, text: ${token.text}`);
        token = lexer.nextToken();
    }
}*/
const tokens = new CommonTokenStream(lexer);
const parser = new SimpleLangParser(tokens);
//debug && console.log(parser.constructor)
//parser.buildParseTrees = true;
const tree = parser.block();
debug &&
    console.log(
        `tree:\n\n${tree.toStringTree(null, parser) || "blank tree"}\n`
    );
//console.log(visitor)
//console.log(parser);
visitor.visitBlock(tree);
let result = visitor.getAndClearBlocks()
debug && console.log("result:\n");
debug && console.log(JSON.stringify(result));
debug && console.log();
