const { InputStream, CommonTokenStream, Token } = require("antlr4");
const SimpleLangLexer = require("../lib/LuaLexer").default;
const SimpleLangParser = require("../lib/LuaParser").default;
const _visitor = require("./visitor");
const _generator = require("../utils/generator");
const CompilerError = require('../utils/CompilerError');
const generator = new _generator();
const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

generator.addBlock({ opcode: "event_whenflagclicked", topLevel: true, next: null, id: "a" }); // Ensure id is "a" for reference
//console.log(generator.blockIdCounter);
const debug = process.argv.includes("--debug") || process.argv.includes("-d");
const infile = process.argv.includes("-i") || process.argv.includes("--infile") ? process.argv[(process.argv.indexOf("-i") == -1 ? process.argv.indexOf("--infile") : process.argv.indexOf("-i")) + 1] : "test.lua";
const outfile = process.argv.includes("-o") || process.argv.includes("--outfile") ? process.argv[(process.argv.indexOf("-o") == -1 ? process.argv.indexOf("-outfile") : process.argv.indexOf("-o")) + 1] : "../indexTest.pmp"
const input = new InputStream(
    readFileSync(path.join(process.cwd(), infile), "utf8").toString()
);
const visitor = new _visitor(input);
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
try {
    visitor.visitBlock(tree);
} catch (err) {
    if (err instanceof CompilerError) {
        // Only print the user-friendly error
        console.error(err.toString());
    } else {
        // Print full stack for unexpected errors
        console.error(err.stack || err);
    }
    process.exit(1);
}
let result = visitor.getAndClearBlocks();
const mergedBlocks = { ...a, ...result.blocks };
visitor.generator.importBlocks(mergedBlocks);

// --- Chain main function body under whenflagclicked ---
if (visitor.mainBodyBlockIds && visitor.mainBodyBlockIds.length > 0) {
    const firstBlockId = visitor.mainBodyBlockIds[0].entry ?? visitor.mainBodyBlockIds[0];
    visitor.generator.blocks[firstBlockId].parent = "a";
    visitor.generator.blocks["a"].next = firstBlockId;
}

debug && console.log("blocks:\n");
debug && console.log(JSON.stringify(visitor.generator.getBlocks()));
debug && console.log();
//console.log("result:\n");
console.log(`saved to file: ${outfile}`);
console.log();
writeFileSync(
    path.join(process.cwd(), outfile),
    visitor.generator.getProject()
);
