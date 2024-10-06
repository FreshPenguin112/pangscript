const { InputStream, CommonTokenStream } = require("../antlr4");
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
const input = new InputStream(readFileSync(path.join(__dirname, "test.lua"), "utf8").toString());
const lexer = new SimpleLangLexer(input);
const tokens = new CommonTokenStream(lexer);
const parser = new SimpleLangParser(tokens);
//parser.buildParseTrees = true;
const tree = parser.block();
console.log(tree.toStringTree(null, parser));
// comment out until compiler is ready to be tested
//console.log(compile(tree))
//console.log(visitor)
console.log(visitor.visitBlock(tree));