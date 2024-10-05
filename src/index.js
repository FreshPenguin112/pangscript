const { InputStream, CommonTokenStream } = require("antlr4");

const SimpleLangLexer = require("../lib/JavaScriptLexer").default;
const SimpleLangParser = require("../lib/JavaScriptParser").default;

const path = require("path");
const { readFileSync } = require("fs");
const input = new InputStream(readFileSync(path.join(__dirname, "test.js")).toString());
const lexer = new SimpleLangLexer(input);
const tokens = new CommonTokenStream(lexer);
const parser = new SimpleLangParser(tokens);
//parser.buildParseTrees = true;
const tree = parser.program();
console.log(tree.toStringTree(null, parser));