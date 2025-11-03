// compiler.js — fixed version using string-placeholder preprocessing
// Usage: node compiler.js [input.lang]
// npm install antlr4

const fs = require("fs");
/* -------------------------
  Template JSON (exact skeleton you provided)
--------------------------*/
const templateJson = `{"targets":[{"isStage":true,"name":"Stage","variables":{"\`jEk@4|i[#Fk?(8x)AV.-my variable":["my variable",0]},"lists":{},"broadcasts":{},"customVars":[],"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"name":"backdrop1","dataFormat":"svg","assetId":"cd21514d0531fdffb22204e0ec5ed84a","md5ext":"cd21514d0531fdffb22204e0ec5ed84a.svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[],"id":"p]_uD8#0^Q=ryfqeQLud","volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"on","textToSpeechLanguage":null,"extensionData":{}},{"isStage":false,"name":"Sprite1","variables":{},"lists":{},"broadcasts":{},"customVars":[],"blocks":{"c":{"opcode":"event_whenflagclicked","next":"b","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":24,"y":193},"b":{"opcode":"looks_sayforsecs","next":"a","parent":"c","inputs":{"MESSAGE":[1,[10,"Hello!"]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false},"a":{"opcode":"control_expandableIf","next":null,"parent":"b","inputs":{"BOOL1":[3,"d","e"],"SUBSTACK1":[2,"f"],"SUBSTACK2":[2,"g"]},"fields":{},"shadow":false,"topLevel":false,"mutation":{"tagName":"mutation","children":[],"branches":"2","ends-in-else":"true"}},"e":{"opcode":"checkbox","next":null,"parent":null,"inputs":{},"fields":{"CHECKBOX":["FALSE","O1mAHei2@Eu^K~kk7DHa"]},"shadow":true,"topLevel":true,"x":72,"y":297},"d":{"opcode":"operator_gt","next":null,"parent":"a","inputs":{"OPERAND1":[1,[10,"1"]],"OPERAND2":[1,[10,"0"]]},"fields":{},"shadow":false,"topLevel":false},"f":{"opcode":"looks_sayforsecs","next":null,"parent":"a","inputs":{"MESSAGE":[1,[10,"true"]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false},"g":{"opcode":"looks_sayforsecs","next":null,"parent":"a","inputs":{"MESSAGE":[1,[10,"false"]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"name":"costume1","bitmapResolution":1,"dataFormat":"svg","assetId":"c434b674f2da18ba13cdfe51dbc05ecc","md5ext":"c434b674f2da18ba13cdfe51dbc05ecc.svg","rotationCenterX":26,"rotationCenterY":46}],"sounds":[{"name":"Squawk","assetId":"e140d7ff07de8fa35c3d1595bba835ac","dataFormat":"wav","rate":48000,"sampleCount":17868,"md5ext":"e140d7ff07de8fa35c3d1595bba835ac.wav"}],"id":"5I9nI;7P)jdiR-_X;/%l","volume":100,"layerOrder":1,"visible":true,"x":0,"y":0,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around","extensionData":{}}],"monitors":[],"extensionData":{},"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0","agent":"","platform":{"name":"PenguinMod","url":"https://penguinmod.com/","version":"stable"}}}`;
const TEMPLATE = JSON.parse(templateJson);

/* -------------------------
  Preprocess: extract quoted strings -> placeholders
--------------------------*/
/* (string-placeholder preprocessing removed — grammar now parses quoted strings directly) */

/* -------------------------
  Deterministic letter ID generator (a, b, ... z, aa, ab, ...)
--------------------------*/
function makeLetterIdGenerator() {
  let n = 0;
  return function nextId() {
    let x = n;
    let s = "";
    while (true) {
      const digit = x % 26;
      s = String.fromCharCode(97 + digit) + s; // 'a' + digit
      x = Math.floor(x / 26) - 1;
      if (x < 0) break;
    }
    n += 1;
    return s;
  };
}

/* -------------------------
  Parser using ANTLR4 runtime (JavaScript)
  This code expects generated parser/lexer/visitor files to exist:
    - PangLexer.js
    - PangParser.js
    - PangVisitor.js  (or PangParserVisitor.js depending on generation)

  You must generate these with the ANTLR tool (Java) locally, for example:

    # download ANTLR jar (if you don't have it already)
    curl -O https://www.antlr.org/download/antlr-4.9.3-complete.jar

    # generate JavaScript parser files (run from this repo directory)
    java -jar antlr-4.9.3-complete.jar -Dlanguage=JavaScript -visitor Pang.g4

  After running that, `PangLexer.js`, `PangParser.js`, and `PangVisitor.js` (or similar) will be created.
  Then `npm install antlr4` and this script will use the runtime to parse.

  The code below attempts to require generated modules and will show instructions if they are missing.

--------------------------*/

const antlr4 = require('antlr4');

const PangLexer = require('./lib/PangLexer').default;
const PangParser = require('./lib/PangParser').default;
const PangVisitor = require('./lib/PangVisitor').default;

// Build a simple AST visitor by extending the generated visitor
class AstBuilder extends PangVisitor {
  // visit program: list of statements
  visitProgram(ctx) {
    const stmts = [];
    for (let i = 0; i < ctx.statement().length; i++) stmts.push(this.visit(ctx.statement(i)));
    return stmts.filter(s => s != null);
  }
  visitStatement(ctx) {
    // statement -> onCall ';'
    if (ctx.onCall()) return this.visit(ctx.onCall());
    return null;
  }
  visitOnCall(ctx) {
    // onCall: 'on' '(' STRING ',' inlineBlock ')'
    const str = ctx.STRING().getText();
    let event;
    try { event = JSON.parse(str); } catch (e) { event = str.replace(/^\"|\"$/g, ''); }
    const body = this.visit(ctx.inlineBlock());
    return { type: 'On', event, body };
  }
  visitInlineBlock(ctx) { return this.visit(ctx.block()); }
  visitBlock(ctx) {
    const stmts = [];
    for (let i = 0; i < ctx.statement().length; i++) stmts.push(this.visit(ctx.statement(i)));
    return { type: 'Block', body: stmts };
  }
  visitPrintCall(ctx) {
    // print '(' expr (',' options)? ')'
    const exprCtx = ctx.expr();
    const expr = this.visit(exprCtx);
    const optsCtx = ctx.options();
    const options = optsCtx ? this.visit(optsCtx) : null;
    return { type: 'Print', expr, options };
  }
  visitIfStmt(ctx) {
    const cond = this.visit(ctx.expr());
    const thenB = this.visit(ctx.block(0));
    const elseB = this.visit(ctx.block(1));
    return { type: 'If', cond, thenBlock: thenB, elseBlock: elseB };
  }
  visitExpr(ctx) {
    if (ctx.primary().length === 2) {
      // Binary
      const left = this.visit(ctx.primary(0));
      const right = this.visit(ctx.primary(1));
      return { type: 'Binary', op: '>', left, right };
    }
    return this.visit(ctx.primary(0));
  }
  visitPrimary(ctx) {
    if (ctx.NUMBER()) return { type: 'Literal', litType: 'number', value: Number(ctx.NUMBER().getText()) };
    if (ctx.STRING()) {
      const s = ctx.STRING().getText();
      try { return { type: 'Literal', litType: 'string', value: JSON.parse(s) }; } catch (e) { return { type: 'Literal', litType: 'string', value: s.replace(/^\"|\"$/g, '') }; }
    }
    if (ctx.getText() === 'true' || ctx.getText() === 'false') return { type: 'Literal', litType: 'boolean', value: ctx.getText() === 'true' };
    if (ctx.printCall()) return this.visit(ctx.printCall());
    return null;
  }
  visitOptions(ctx) {
    // { 'seconds' : NUMBER }
    return { seconds: Number(ctx.NUMBER().getText()) };
  }
}

// helper to parse and build AST
function parseWithAntlr(source) {
  const chars = new antlr4.InputStream(source);
  const lexer = new PangLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new PangParser(tokens);
  parser.buildParseTrees = true;
  const tree = parser.program();
  const visitor = new AstBuilder();
  return visitor.visit(tree);
}

/* -------------------------
  Emitter: create blocks map (targets[1].blocks)
--------------------------*/
function emitProject(astStmts) {
  const blocks = {};
  const genId = makeLetterIdGenerator();

  function emitSequence(stmts, containerParent = null) {
    let firstId = null;
    let lastId = null;
    for (const st of stmts) {
      const { first, last } = emitStmt(st);
      if (!firstId) firstId = first;
      if (lastId) {
        blocks[lastId].next = first;
        // following sample: set parent of new first to previous last
        blocks[first].parent = lastId;
      } else if (containerParent != null) {
        blocks[first].parent = containerParent;
      }
      lastId = last;
    }
    return { first: firstId, last: lastId };
  }

  function emitStmt(stmt) {
    if (stmt.type === "Print") return emitPrint(stmt);
    if (stmt.type === "If") return emitIf(stmt);
    throw new Error("emitStmt: unsupported stmt type " + stmt.type);
  }

  function emitPrint(node) {
    let text = "";
    if (node.expr && node.expr.type === "Literal" && node.expr.litType === "string") {
      text = node.expr.value;
    } else {
      text = String((node.expr && node.expr.value) ?? "");
    }

    const id = genId();
    const hasSecs = node.options && typeof node.options.seconds === "number";
    const opcode = hasSecs ? "looks_sayforsecs" : "looks_say";
    const inputs = hasSecs ? { MESSAGE: [1, [10, text]], SECS: [1, [4, String(node.options.seconds)]] } : { MESSAGE: [1, [10, text]] };

    blocks[id] = { opcode, next: null, parent: null, inputs, fields: {}, shadow: false, topLevel: false };
    return { first: id, last: id };
  }

  function emitIf(node) {
    const cond = node.cond;
    if (cond.type !== "Binary" || cond.op !== ">") throw new Error("emitIf: only '>' supported");

    const condId = genId();
    blocks[condId] = { opcode: "operator_gt", next: null, parent: null, inputs: { OPERAND1: [1, [10, String(cond.left.value)]], OPERAND2: [1, [10, String(cond.right.value)]] }, fields: {}, shadow: false, topLevel: false };

    const checkboxId = genId();
    const checkboxUnique = Math.random().toString(36).slice(2, 10);
    blocks[checkboxId] = { opcode: "checkbox", next: null, parent: null, inputs: {}, fields: { CHECKBOX: ["FALSE", checkboxUnique] }, shadow: true, topLevel: true, x: 72, y: 297 };

    const thenSeq = emitSequence(node.thenBlock.body, null);
    const elseSeq = emitSequence(node.elseBlock.body, null);

    const ifId = genId();
    blocks[ifId] = { opcode: "control_expandableIf", next: null, parent: null, inputs: { BOOL1: [3, condId, checkboxId], SUBSTACK1: [2, thenSeq.first || null], SUBSTACK2: [2, elseSeq.first || null] }, fields: {}, shadow: false, topLevel: false, mutation: { tagName: "mutation", children: [], branches: "2", "ends-in-else": "true" } };

    blocks[condId].parent = ifId;
    if (thenSeq.first) blocks[thenSeq.first].parent = ifId;
    if (elseSeq.first) blocks[elseSeq.first].parent = ifId;

    return { first: ifId, last: ifId };
  }

  // top-level: only allow On statements
  for (const s of astStmts) {
    if (s.type !== "On") throw new Error("Top-level must be 'on' statements");
    if (s.event !== "flag") throw new Error("Only 'flag' event supported in this compiler");

    const eventId = genId();
    const seq = emitSequence(s.body.body, eventId);
    blocks[eventId] = { opcode: "event_whenflagclicked", next: seq.first || null, parent: null, inputs: {}, fields: {}, shadow: false, topLevel: true, x: 24, y: 193 };
    if (seq.first) blocks[seq.first].parent = eventId;
  }

  return blocks;
}

/* -------------------------
  CLI: glue
--------------------------*/
const input = process.argv[2] ? fs.readFileSync(process.argv[2], "utf8") : `// example
on("flag", *{
  print("Hello!", {seconds: 2});
  if (1 > 0) {
    print(true, {seconds: 2});
  } else {
    print("false", {seconds: 2});
  }
});
`;

// Strip single-line // comments and leading blank lines; strings are parsed directly by the grammar
const cleaned = input.replace(/^\s*\/\/.*$/gm, "").replace(/^\n+/, "");

// Parse with ANTLR and build AST
let ast;
try {
  ast = parseWithAntlr(cleaned);
  console.log('AST built (ANTLR)');
} catch (e) {
  console.error("Parse/AST error:", e && e.message || e);
  process.exit(1);
}

// (type checking and casting removed)

// Emit blocks
let blocksMap;
try {
  blocksMap = emitProject(ast);
  console.log('Emit OK');
} catch (e) {
  console.error("Emit error:", e && e.message || e);
  process.exit(1);
}

// Produce final project JSON, preserving exact skeleton
const out = JSON.parse(JSON.stringify(TEMPLATE));
out.targets[1].blocks = blocksMap;
out.targets[0].blocks = out.targets[0].blocks || {};

// Write to file
fs.writeFileSync("project.json", JSON.stringify(out, null, 2), "utf8");
console.log("✅ project.json written with", Object.keys(blocksMap).length, "blocks.");
