const { InputStream, CommonTokenStream, Token } = require("antlr4");
const SimpleLangLexer = require("../lib/LuaLexer").default;
const SimpleLangParser = require("../lib/LuaParser").default;
const _visitor = require("./visitor");
const visitor = new _visitor();
const _generator = require("../utils/generator");
const generator = new _generator();
const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

generator.addBlock({ opcode: "event_whenflagclicked", topLevel: true }); //add a whenflagclicked block for the start of the script
//console.log(generator.blockIdCounter);
const input = new InputStream(
    readFileSync(path.join(__dirname, "test.lua"), "utf8").toString()
);
const debug = process.argv.includes("--debug") || process.argv.includes("-d");
const outfile = process.argv.includes("-o") || process.argv.includes("--outfile") ? process.argv[(process.argv.indexOf("-o") == -1 ? process.argv.indexOf("-outfile") : process.argv.indexOf("-o")) + 1] : "../indexTest.pmp"
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

let a = generator.getBlocks();
visitor.generator.blockIdCounter++;
visitor.visitBlock(tree);
let result = visitor.getAndClearBlocks();
const mergedBlocks = { ...a, ...result.blocks };
visitor.generator.importBlocks(mergedBlocks);
debug && console.log("blocks:\n");
debug && console.log(JSON.stringify(visitor.generator.getBlocks()));
debug && console.log();
debug && console.log("result:\n");
debug && console.log(`saved to file: ${outfile}`);
debug && console.log();
debug && writeFileSync(
    path.join(__dirname, outfile),
    visitor.generator.getProject()
);
