const { InputStream, CommonTokenStream, Token } = require("../lib/antlr4");
const SimpleLangLexer = require("../lib/LuaLexer").default;
const SimpleLangParser = require("../lib/LuaParser").default;
const _visitor = require("./visitor");
const visitor = new _visitor();
const { compiler } = require("./compile");
const { compile } = new compiler();
const { readFileSync } = require("fs");
const path = require("path");

// Read input file
//const code = readFileSync(args[0], "utf8");

// Create compiler instance
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
// comment out until compiler is ready to be tested
debug && console.log("compiled:\n");
debug && console.log(compile(tree) || "blank compiled output");
debug && console.log();

//console.log(visitor)
//console.log(parser);
let result = visitor.visitBlock(tree);
debug && console.log("result:\n");
if (result instanceof Array)
    result.forEach((x) => console.log(x || "blank output"));
else console.log(result || "blank output");
debug && console.log();
