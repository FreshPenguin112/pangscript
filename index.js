// compiler.js — fixed version using string-placeholder preprocessing
// Usage: node compiler.js [input.lang]
// npm install ohm-js

const fs = require("fs");
const ohm = require("ohm-js");

/* -------------------------
  Template JSON (exact skeleton you provided)
--------------------------*/
const templateJson = `{"targets":[{"isStage":true,"name":"Stage","variables":{"\`jEk@4|i[#Fk?(8x)AV.-my variable":["my variable",0]},"lists":{},"broadcasts":{},"customVars":[],"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"name":"backdrop1","dataFormat":"svg","assetId":"cd21514d0531fdffb22204e0ec5ed84a","md5ext":"cd21514d0531fdffb22204e0ec5ed84a.svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[],"id":"p]_uD8#0^Q=ryfqeQLud","volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"on","textToSpeechLanguage":null,"extensionData":{}},{"isStage":false,"name":"Sprite1","variables":{},"lists":{},"broadcasts":{},"customVars":[],"blocks":{"c":{"opcode":"event_whenflagclicked","next":"b","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":24,"y":193},"b":{"opcode":"looks_sayforsecs","next":"a","parent":"c","inputs":{"MESSAGE":[1,[10,"Hello!"]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false},"a":{"opcode":"control_expandableIf","next":null,"parent":"b","inputs":{"BOOL1":[3,"d","e"],"SUBSTACK1":[2,"f"],"SUBSTACK2":[2,"g"]},"fields":{},"shadow":false,"topLevel":false,"mutation":{"tagName":"mutation","children":[],"branches":"2","ends-in-else":"true"}},"e":{"opcode":"checkbox","next":null,"parent":null,"inputs":{},"fields":{"CHECKBOX":["FALSE","O1mAHei2@Eu^K~kk7DHa"]},"shadow":true,"topLevel":true,"x":72,"y":297},"d":{"opcode":"operator_gt","next":null,"parent":"a","inputs":{"OPERAND1":[1,[10,"1"]],"OPERAND2":[1,[10,"0"]]},"fields":{},"shadow":false,"topLevel":false},"f":{"opcode":"looks_sayforsecs","next":null,"parent":"a","inputs":{"MESSAGE":[1,[10,"true"]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false},"g":{"opcode":"looks_sayforsecs","next":null,"parent":"a","inputs":{"MESSAGE":[1,[10,"false"]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"name":"costume1","bitmapResolution":1,"dataFormat":"svg","assetId":"c434b674f2da18ba13cdfe51dbc05ecc","md5ext":"c434b674f2da18ba13cdfe51dbc05ecc.svg","rotationCenterX":26,"rotationCenterY":46}],"sounds":[{"name":"Squawk","assetId":"e140d7ff07de8fa35c3d1595bba835ac","dataFormat":"wav","rate":48000,"sampleCount":17868,"md5ext":"e140d7ff07de8fa35c3d1595bba835ac.wav"}],"id":"5I9nI;7P)jdiR-_X;/%l","volume":100,"layerOrder":1,"visible":true,"x":0,"y":0,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around","extensionData":{}}],"monitors":[],"extensionData":{},"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0","agent":"","platform":{"name":"PenguinMod","url":"https://penguinmod.com/","version":"stable"}}}`;
const TEMPLATE = JSON.parse(templateJson);

/* -------------------------
  Preprocess: extract quoted strings -> placeholders
--------------------------*/
function extractStrings(source) {
  const stringPool = [];
  const re = /"([^"\\]|\\.)*"/g; // matches a JS-style quoted string
  const replaced = source.replace(re, (m) => {
    // m includes surrounding quotes and escapes
    // use JSON.parse to unescape correctly
    let unescaped;
    try {
      unescaped = JSON.parse(m); // returns a JS string
    } catch (e) {
      throw new Error("Invalid string literal: " + m);
    }
    const id = `__STR${stringPool.length}__`;
    stringPool.push(unescaped);
    return id;
  });
  return { text: replaced, pool: stringPool };
}

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
  Grammar (uses placeholders for strings)
--------------------------*/
const grammarSource = `
Scratch {
  StringLiteral = "__STR" number "__"
  boolean = "true" | "false"
  number = digit+
  ident = letter alnum*

  Program = _ Statement*
  Statement = OnCall ";" _ | PrintCall ";" _ | IfStmt _
  OnCall = "on" _ "(" _ StringLiteral _ "," _ InlineBlock _ ")" _
  InlineBlock = "*" _ Block
  PrintCall = "print" _ "(" _ Expr _ ("," _ Options)? _ ")"
  Options = "{" _ "seconds" _ ":" _ number _ "}"
  IfStmt = "if" _ "(" _ Expr _ ")" _ Block _ "else" _ Block _
  Block = "{" _ Statement* "}"
  Expr = Cast
  Cast = Primary (_ "as" _ Type)?
  Primary = Binary | StringLiteral | number | boolean
  Binary = number _ ">" _ number
  Type = ident
  _ = space*
}
`;

/* -------------------------
  Semantics -> AST (StringLiteral resolves to pool index token)
--------------------------*/
const g = ohm.grammar(grammarSource);
const semantics = g.createSemantics();

let sharedStringPool = []; // will be set per-compile

semantics.addOperation("ast", {
  Program(_ws, stmts) {
    return stmts.children.map(c => c.ast());
  },
  OnCall(_on, _sp1, _lp, _sp2, strTok, _sp3, _comma, _sp4, inline, _sp5, _rp, _sp6) {
    // strTok.sourceString is like "__STR0__"
    const idx = parseInt(strTok.sourceString.match(/__STR([0-9]+)__/)[1], 10);
    return { type: "On", event: sharedStringPool[idx], body: inline.ast() };
  },
  InlineBlock(_star, _sp, block) {
    return block.ast();
  },
  PrintCall(_print, _sp1, _lp, _sp2, expr, opts, _sp3, _rp) {
    return { type: "Print", expr: expr.ast(), options: opts.children.length ? opts.ast() : null };
  },
  Options(_lb, _sp1, _sec, _sp2, _colon, _sp3, num, _sp4, _rb) {
    return { seconds: parseInt(num.sourceString, 10) };
  },
  IfStmt(_if, _sp1, _lp, _sp2, expr, _sp3, _rp, _sp4, block1, _sp5, _else, _sp6, block2, _sp7) {
    return { type: "If", cond: expr.ast(), thenBlock: block1.ast(), elseBlock: block2.ast() };
  },
  Block(_lb, _sp1, stmts, _rb) {
    return { type: "Block", body: stmts.children.map(c => c.ast()) };
  },
  // Expr / Cast / Primary
  Cast(primary, rest) {
    const base = primary.ast();
    if (rest.children.length) {
      const typeTok = rest.child(1).sourceString;
      return { type: "Cast", expr: base, to: typeTok };
    }
    return base;
  },
  Primary_binary(bin) { return bin.ast(); },
  Binary(n1, _sp1, _gt, _sp2, n2) {
    return { type: "Binary", op: ">", left: { type: "Literal", litType: "number", value: parseInt(n1.sourceString, 10) }, right: { type: "Literal", litType: "number", value: parseInt(n2.sourceString, 10) } };
  },
  // StringLiteral resolved to the string value using sharedStringPool
  StringLiteral(tok) {
    const m = tok.sourceString.match(/__STR([0-9]+)__/);
    const idx = parseInt(m[1], 10);
    return { type: "Literal", litType: "string", value: sharedStringPool[idx] };
  },
  boolean(b) { return { type: "Literal", litType: "boolean", value: b.sourceString === "true" }; },
  number(n) { return { type: "Literal", litType: "number", value: parseInt(n.sourceString, 10) }; },
  Type(id) { return id.sourceString; },
  ident(_) { return this.sourceString; },
  _(_) { return null; }
});

/* -------------------------
  Simple static type checker
--------------------------*/
function normalizeTypeName(s) {
  const t = s.toLowerCase();
  if (["str", "string"].includes(t)) return "string";
  if (["num", "number"].includes(t)) return "number";
  if (["bool", "boolean"].includes(t)) return "boolean";
  return t;
}

function typeOfExpr(expr) {
  if (!expr) return "void";
  switch (expr.type) {
    case "Literal": return expr.litType;
    case "Binary": return "boolean";
    case "Cast": return normalizeTypeName(expr.to);
    default: throw new Error("Unknown expr type in typeOfExpr: " + expr.type);
  }
}

function typeCheckAst(astStmts) {
  function walkStmt(s) {
    if (s.type === "On") {
      s.body.body.forEach(walkStmt);
    } else if (s.type === "Print") {
      const t = typeOfExpr(s.expr);
      if (t !== "string") {
        if (!(s.expr.type === "Cast" && normalizeTypeName(s.expr.to) === "string")) {
          throw new Error(`TypeError: print() expects string but got ${t}`);
        }
      }
    } else if (s.type === "If") {
      const condType = typeOfExpr(s.cond);
      if (condType !== "boolean") throw new Error("TypeError: if condition must be boolean");
      s.thenBlock.body.forEach(walkStmt);
      s.elseBlock.body.forEach(walkStmt);
    } else {
      throw new Error("Unknown statement for typecheck: " + JSON.stringify(s));
    }
  }
  astStmts.forEach(walkStmt);
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
    if (node.expr.type === "Literal" && node.expr.litType === "string") text = node.expr.value;
    else if (node.expr.type === "Cast") {
      if (node.expr.expr.type === "Literal") text = String(node.expr.expr.value);
      else text = String(node.expr.expr.value ?? "");
    } else text = String(node.expr.value ?? "");

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
    print(true as str, {seconds: 2});
  } else {
    print("false", {seconds: 2});
  }
});
`;

// Extract strings -> placeholders + pool
let extracted;
try {
  extracted = extractStrings(input);
} catch (e) {
  console.error("String extraction error:", e.message);
  process.exit(1);
}
const cleaned = extracted.text;
sharedStringPool = extracted.pool;

// Parse with Ohm
const match = g.match(cleaned);
if (!match.succeeded()) {
  console.error("Parse error:", match.message);
  process.exit(1);
}

// Build AST
let ast;
try {
  ast = semantics(match).ast();
} catch (e) {
  console.error("AST error:", e.message);
  process.exit(1);
}

// Typecheck
try {
  typeCheckAst(ast);
} catch (e) {
  console.error("Type check error:", e.message);
  process.exit(1);
}

// Emit blocks
let blocksMap;
try {
  blocksMap = emitProject(ast);
} catch (e) {
  console.error("Emit error:", e.message);
  process.exit(1);
}

// Produce final project JSON, preserving exact skeleton
const out = JSON.parse(JSON.stringify(TEMPLATE));
out.targets[1].blocks = blocksMap;
out.targets[0].blocks = out.targets[0].blocks || {};

// Write to file
fs.writeFileSync("project.json", JSON.stringify(out, null, 2), "utf8");
console.log("✅ project.json written with", Object.keys(blocksMap).length, "blocks.");
