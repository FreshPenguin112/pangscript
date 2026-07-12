// compiler.js — fixed version using string-placeholder preprocessing
// Usage: node compiler.js [input.lang]
// npm install antlr4

const fs = require("fs");
const path = require("path");
let archiver;
function ensureArchiver() {
  if (archiver) return archiver;
  try {
    /* eslint-disable global-require */
    archiver = require("archiver");
    /* eslint-enable global-require */
    return archiver;
  } catch (e) {
    console.error('Missing dependency "archiver". Run `npm install archiver` to enable .pmp packaging.');
    process.exit(1);
  }
}
/* -------------------------
  Template JSON (exact skeleton you provided)
--------------------------*/
const templateJson = `{"targets":[{"isStage":true,"name":"Stage","variables":{"\`jEk@4|i[#Fk?(8x)AV.-my variable":["my variable",0]},"lists":{},"broadcasts":{},"customVars":[],"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"name":"backdrop1","dataFormat":"svg","assetId":"cd21514d0531fdffb22204e0ec5ed84a","md5ext":"cd21514d0531fdffb22204e0ec5ed84a.svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[],"id":"p]_uD8#0^Q=ryfqeQLud","volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"on","textToSpeechLanguage":null,"extensionData":{}},{"isStage":false,"name":"Sprite1","variables":{},"lists":{},"broadcasts":{},"customVars":[],"blocks":{"c":{"opcode":"event_whenflagclicked","next":"b","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":24,"y":193},"b":{"opcode":"looks_sayforsecs","next":"a","parent":"c","inputs":{"MESSAGE":[1,[10,"Hello!"]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false},"a":{"opcode":"control_expandableIf","next":null,"parent":"b","inputs":{"BOOL1":[3,"d","e"],"SUBSTACK1":[2,"f"],"SUBSTACK2":[2,"g"]},"fields":{},"shadow":false,"topLevel":false,"mutation":{"tagName":"mutation","children":[],"branches":"2","ends-in-else":"true"}},"e":{"opcode":"checkbox","next":null,"parent":null,"inputs":{},"fields":{"CHECKBOX":["FALSE","O1mAHei2@Eu^K~kk7DHa"]},"shadow":true,"topLevel":true,"x":72,"y":297},"d":{"opcode":"operator_gt","next":null,"parent":"a","inputs":{"OPERAND1":[1,[10,"1"]],"OPERAND2":[1,[10,"0"]]},"fields":{},"shadow":false,"topLevel":false},"f":{"opcode":"looks_sayforsecs","next":null,"parent":"a","inputs":{"MESSAGE":[1,[10,"true"]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false},"g":{"opcode":"looks_sayforsecs","next":null,"parent":"a","inputs":{"MESSAGE":[1,[10,"false"]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"name":"costume1","bitmapResolution":1,"dataFormat":"svg","assetId":"c434b674f2da18ba13cdfe51dbc05ecc","md5ext":"c434b674f2da18ba13cdfe51dbc05ecc.svg","rotationCenterX":26,"rotationCenterY":46}],"sounds":[{"name":"Squawk","assetId":"e140d7ff07de8fa35c3d1595bba835ac","dataFormat":"wav","rate":48000,"sampleCount":17868,"md5ext":"e140d7ff07de8fa35c3d1595bba835ac.wav"}],"id":"5I9nI;7P)jdiR-_X;/%l","volume":100,"layerOrder":1,"visible":true,"x":0,"y":0,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around","extensionData":{}}],"monitors":[],"extensionData":{},"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0","agent":"","platform":{"name":"PenguinMod","url":"https://penguinmod.com/","version":"stable"}}}`;
const TEMPLATE = JSON.parse(templateJson);

// Input type codes used in Scratch block inputs. See user's reference.
const InputTypes = {
  math_number: 4,
  math_positive_number: 5,
  math_whole_number: 6,
  math_integer: 7,
  math_angle: 8,
  colour_picker: 9,
  text: 10,
  event_broadcast_menu: 11,
  data_variable: 12,
  data_listcontents: 13,
};

function getTypeofLabel(type) {
  if (type == null) return null;
  const raw = String(type).trim();
  if (!raw) return null;
  const lowered = raw.toLowerCase();
  if (["string", "str", "text"].includes(lowered)) return "string";
  if (["number", "num", "int", "float", "double"].includes(lowered)) return "number";
  if (["boolean", "bool"].includes(lowered)) return "boolean";
  if (["array", "list", "tuple"].includes(lowered)) return "array";
  if (["object", "obj", "class"].includes(lowered)) return "object";
  if (["function", "func", "lambda"].includes(lowered)) return "function";
  if (["void", "undefined", "null"].includes(lowered)) return "undefined";
  if (raw.endsWith("[]")) return "array";
  if (raw.startsWith("Object{")) return "object";
  return null;
}

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

const antlr4 = require("antlr4");

const PangLexer = require("./lib/PangLexer").default;
const PangParser = require("./lib/PangParser").default;
const PangVisitor = require("./lib/PangVisitor").default;
// pm-blocks metadata for input names/types
const blocksMeta = require("./blocks").processedBlocks;
// Load DogeisCut processedBlocks additions (mutates blocks.processedBlocks)
require("./blocks_dogeiscut_additions");

// Helpers to choose DogeisCut opcodes when available in blocks metadata.
function makeGet(prop, receiver) {
  // dogeiscut 'get' expects (OBJECT, KEY)
  if (blocksMeta && blocksMeta["dogeiscutObject_get"])
    return { opcode: "dogeiscutObject_get", inputs: [receiver, prop] };
  return { opcode: "jwClass_getProp", inputs: [prop, receiver] };
}
function makeGetPath(arrayParam, receiver) {
  // dogeiscut 'getPath' expects (ARRAY, OBJECT)
  if (blocksMeta && blocksMeta["dogeiscutObject_getPath"])
    return { opcode: "dogeiscutObject_getPath", inputs: [arrayParam, receiver] };
  // fallback: chain gets using jwClass_getProp for array-paths not supported
  return { opcode: "jwClass_getProp", inputs: [arrayParam, receiver] };
}
function makeSet(prop, receiver, val) {
  // dogeiscut 'set' expects (OBJECT, KEY, VALUE)
  if (blocksMeta && blocksMeta["dogeiscutObject_set"])
    return { opcode: "dogeiscutObject_set", inputs: [receiver, prop, val] };
  // fallback to jwClass_setProp but ensure parameter ordering matches older shape
  return { opcode: "jwClass_setProp", inputs: [prop, receiver, val] };
}
function makeSetPath(arrayParam, receiver, val) {
  if (blocksMeta && blocksMeta["dogeiscutObject_setPath"])
    return { opcode: "dogeiscutObject_setPath", inputs: [receiver, arrayParam, val] };
  // fallback: not supporting setPath specially; use jwClass_setProp
  return { opcode: "jwClass_setProp", inputs: [arrayParam, receiver, val] };
}

// Map a receiver name to its tagged thread temp (e.g. a lambda param `a`
// becomes `__arg0`) when it appears in the active paramMap; otherwise emit a
// plain Var node. This keeps method calls on lambda arguments resolving to
// `__arg0` thread temps instead of falling back to a global variable get.
function mapReceiverName(name, paramMap) {
  if (name && paramMap && Object.prototype.hasOwnProperty.call(paramMap, name))
    return { type: "Var", name: paramMap[name], scope: "thread" };
  return { type: "Var", name };
}

// helper counter for generating short temporary variable names used by
// inline wrappers (e.g., constructor invocation sequences)
// helper counters for generating synthetic temporary variable names used by
// inline wrappers, arg setters, constructor temps, etc.
let __pw_temp_counter = 0;
let __pw_arg_counter = 0;
// Argument UID map: assign a small random uid per logical argument/key so
// all occurrences of the same argument share the same uid (no global run uid).
const __pw_arg_uid_map = Object.create(null);
function genRandomUid() {
  return Math.random().toString(36).slice(2, 7);
}
function getUidForKey(key) {
  if (!key) return genRandomUid();
  if (!__pw_arg_uid_map[key]) __pw_arg_uid_map[key] = genRandomUid();
  return __pw_arg_uid_map[key];
}
function getTaggedArgName(scopeKey, origName) {
  const uid = getUidForKey(scopeKey);
  const clean = String(origName).replace(/^_+/, "");
  return `__${uid}_${clean}`;
}

function __pw_newTemp(prefix = "temp") {
  __pw_temp_counter += 1;
  const clean = String(prefix).replace(/^_+/, "");
  return `__${genRandomUid()}_${clean}${__pw_temp_counter}`;
}

// If a scopeKey is provided, reuse a UID for that key so the generated
// arg name is stable across uses. Otherwise, prefer deterministic indexed
// names like __arg0 so lambda call wrappers share the same naming as the
// lambda definition.
function __pw_newArgTemp(base = "value", scopeKey = null) {
  __pw_arg_counter += 1;
  const clean = String(base).replace(/^_+/, "");
  if (scopeKey) return getTaggedArgName(scopeKey, clean);
  return `__arg${__pw_arg_counter - 1}`;
}

// Build a simple AST visitor by extending the generated visitor
class AstBuilder extends PangVisitor {
  normalizeTypeName(type) {
    if (!type) return "Any";
    const raw = String(type).trim();
    if (!raw) return "Any";
    const lowered = raw.toLowerCase();
    if (["string", "str", "text"].includes(lowered)) return "String";
    if (["number", "num", "int", "float", "double"].includes(lowered)) return "Number";
    if (["boolean", "bool"].includes(lowered)) return "Boolean";
    if (["array", "list", "tuple"].includes(lowered)) return "Array";
    if (["object", "obj", "class"].includes(lowered)) return "Object";
    if (["function", "func", "lambda"].includes(lowered)) return "Function";
    if (["void", "undefined", "null"].includes(lowered)) return "Void";
    if (["any", "unknown", "mixed"].includes(lowered)) return "Any";
    if (raw.endsWith("[]")) return `${this.normalizeTypeName(raw.slice(0, -2))}[]`;
    return raw;
  }

  inferType(node) {
    if (!node) return "Any";
    if (typeof node === "string") return this.normalizeTypeName(node);
    if (node.type === "Literal") {
      if (node.litType === "number") return "Number";
      if (node.litType === "string") return "String";
      if (node.litType === "boolean") return "Boolean";
      return "Any";
    }
    if (node.type === "Array") {
      if (!Array.isArray(node.elements) || node.elements.length === 0) return "Array";
      let elementType = null;
      for (const item of node.elements) {
        const itemType = this.inferType(item);
        if (!itemType || itemType === "Any") return "Any";
        if (elementType === null) elementType = itemType;
        else if (itemType !== elementType) return "Array";
      }
      return `${this.normalizeTypeName(elementType)}[]`;
    }
    if (node.type === "Lambda") return "Function";
    if (node.type === "New") return "Object";
    if (node.type === "Object") {
      // Structural object literal inference: if all properties have concrete types,
      // produce a shaped Object type string; otherwise mark as Any (ambiguous).
      if (!node.props || !Array.isArray(node.props)) return "Object";
      const parts = [];
      for (const p of node.props) {
        if (p && p.computed) return "Any";
        if (!p || typeof p.key !== "string") return "Any";
        const t = this.inferType(p && p.value ? p.value : null);
        if (!t || t === "Any") return "Any";
        // escape ':' and ',' in keys if needed (simple identifier keys expected)
        parts.push(`${p.key}:${t}`);
      }
      return `Object{${parts.join(",")}}`;
    }
    if (node.type === "Typeof") return "String";
    if (node.type === "Cast") return this.normalizeTypeName(node.typeName || node.inferredType || "Any");
    if (node.type === "Member" || node.type === "MemberCall" || node.type === "Call") return "Any";
    if (node.type === "Binary") {
      const op = node.op;
      if (["+", "-", "*", "/", "%", "**", "<<", ">>", ">>>", "&", "^", "|"].includes(op)) return "Number";
      if (["<", "<=", ">", ">=", "==", "!=", "===", "!==", "&&", "||"].includes(op)) return "Boolean";
      if (op === "..") return "String";
      return "Any";
    }
    if (node.type === "Unary") {
      if (node.op === "!" || node.op === "&&" || node.op === "||") return "Boolean";
      return "Number";
    }
    if (node.type === "Ternary") {
      const thenType = this.inferType(node.thenExpr);
      const elseType = this.inferType(node.elseExpr);
      if (thenType && elseType && thenType === elseType) return thenType;
      return "Any";
    }
    if (node.type === "Declare")
      return this.normalizeTypeName(node.typeAnnotation || node.inferredType || "Any");
    return null;
  }

  // visit program: list of statements
  visitProgram(ctx) {
    const stmts = [];
    for (let i = 0; i < ctx.statement().length; i++) stmts.push(this.visit(ctx.statement(i)));
    return stmts.filter((s) => s != null);
  }

  visitStatement(ctx) {
    // statement can be a statementItem (onCall/printCall/varDecl/assign) or an ifStmt.
    const item = ctx.statementItem ? ctx.statementItem() : null;
    if (item) {
      if (item.onCall && item.onCall()) return this.visit(item.onCall());
      if (item.printCall && item.printCall()) return this.visit(item.printCall());
      if (item.functionCall && item.functionCall()) return this.visit(item.functionCall());
      if (item.varDecl && item.varDecl()) return this.visit(item.varDecl());
      if (item.assignStmt && item.assignStmt()) return this.visit(item.assignStmt());
      if (item.returnStmt && item.returnStmt()) return this.visit(item.returnStmt());
      if (item.classDecl && item.classDecl()) return this.visit(item.classDecl());
      if (item.breakStmt && item.breakStmt()) return this.visit(item.breakStmt());
      if (item.continueStmt && item.continueStmt()) return this.visit(item.continueStmt());
      return null;
    }
    //console.log(ctx.ifStmt && ctx.ifStmt() ? ctx.ifStmt().getText() : null);
    if (ctx.ifStmt && ctx.ifStmt()) return this.visit(ctx.ifStmt());
    if (ctx.forStmt && ctx.forStmt()) return this.visit(ctx.forStmt());
    if (ctx.whileStmt && ctx.whileStmt()) return this.visit(ctx.whileStmt());
    return null;
  }

  visitOnCall(ctx) {
    // onCall: 'on' '(' STRING ',' (arrowFunction | inlineBlock | block) ')'
    const str = ctx.STRING().getText();
    let event;
    try {
      event = JSON.parse(str);
    } catch (e) {
      event = str.replace(/^\"|\"$/g, "");
    }
    // Accept an arrowFunction, inlineBlock, or a normal block
    let body = null;
    const afCtx = ctx.arrowFunction && typeof ctx.arrowFunction === "function" ? ctx.arrowFunction() : null;
    const ibCtx = ctx.inlineBlock && typeof ctx.inlineBlock === "function" ? ctx.inlineBlock() : null;
    const bCtx = ctx.block && typeof ctx.block === "function" ? ctx.block() : null;
    if (afCtx) {
      const lambda = this.visit(afCtx);
      // Extract just the body from the Lambda, since on() expects a Block
      body = lambda && lambda.body ? lambda.body : { type: "Block", body: [] };
    } else if (ibCtx) body = this.visit(ibCtx);
    else if (bCtx) body = this.visit(bCtx);
    else body = { type: "Block", body: [] };
    return { type: "On", event, body };
  }

  // inlineBlock now contains an `inlineBlockBody` instead of a normal `block`.
  // Build a Block AST from its inlineStatement children.
  visitInlineBlock(ctx) {
    const bodyCtx = ctx.inlineBlockBody();
    const stmts = [];
    // Support multiple possible inline block shapes: old `inlineStatement` list
    // or a direct `statement` list. Be permissive so the grammar can evolve.
    if (bodyCtx) {
      if (bodyCtx.inlineStatement) {
        for (let i = 0; i < bodyCtx.inlineStatement().length; i++) {
          const st = bodyCtx.inlineStatement(i);
          if (st.statementItem && st.statementItem()) {
            const si = st.statementItem();
            if (si.onCall && si.onCall()) stmts.push(this.visit(si.onCall()));
            else if (si.printCall && si.printCall()) stmts.push(this.visit(si.printCall()));
            else if (si.functionCall && si.functionCall()) stmts.push(this.visit(si.functionCall()));
            else if (si.varDecl && si.varDecl()) stmts.push(this.visit(si.varDecl()));
            else if (si.assignStmt && si.assignStmt()) stmts.push(this.visit(si.assignStmt()));
            else if (si.returnStmt && si.returnStmt()) stmts.push(this.visit(si.returnStmt()));
            else if (si.classDecl && si.classDecl()) stmts.push(this.visit(si.classDecl()));
            else if (si.breakStmt && si.breakStmt()) stmts.push(this.visit(si.breakStmt()));
            else if (si.continueStmt && si.continueStmt()) stmts.push(this.visit(si.continueStmt()));
          } else if (st.ifStmt && st.ifStmt()) {
            stmts.push(this.visit(st.ifStmt()));
          } else if (st.forStmt && st.forStmt()) {
            stmts.push(this.visit(st.forStmt()));
          } else if (st.whileStmt && st.whileStmt()) {
            stmts.push(this.visit(st.whileStmt()));
          } else if (st.classDecl && st.classDecl()) {
            stmts.push(this.visit(st.classDecl()));
          }
        }
      } else if (bodyCtx.statement) {
        for (let i = 0; i < bodyCtx.statement().length; i++) {
          const s = this.visit(bodyCtx.statement(i));
          if (s) stmts.push(s);
        }
      }
    }
    return { type: "Block", body: stmts };
  }

  visitBlock(ctx) {
    const stmts = [];
    for (let i = 0; i < ctx.statement().length; i++) {
      const s = this.visit(ctx.statement(i));
      if (s != null) stmts.push(s);
    }
    return { type: "Block", body: stmts };
  }

  visitPrintCall(ctx) {
    // print '(' expr (',' options)? ')'
    const exprCtx = ctx.expr();
    const expr = exprCtx ? this.visit(exprCtx) : null;
    const optsCtx = ctx.options_ ? ctx.options_() : ctx.options ? ctx.options() : null;
    const options = optsCtx ? this.visitOptions_(optsCtx) : null;
    return { type: "Print", expr, options };
  }

  visitFunctionCall(ctx) {
    // IDENT '(' (expr (',' expr)*)? ')'
    // memberExpr '(' ... ')' — support dotted names like `obj.method`
    // Support chained calls like `obj.m1(...).m2(...)` by parsing the
    // functionCall children and grouping argument lists per-call. The
    // parse shape is: memberExpr '(' args ')' ('.' IDENT '(' args ')')*
    let memberExpr = null;
    try {
      memberExpr = ctx.memberExpr ? ctx.memberExpr() : null;
    } catch (e) {
      memberExpr = null;
    }
    // collect base identifiers from memberExpr (e.g., ['num','add'])
    const baseNames = [];
    if (memberExpr && memberExpr.IDENT) {
      const idNodes = memberExpr.IDENT();
      if (Array.isArray(idNodes)) {
        for (let i = 0; i < idNodes.length; i++) baseNames.push(idNodes[i].getText());
      } else if (idNodes) baseNames.push(idNodes.getText());
    }

    // Walk children to extract argument-groups for each `(...)` pair and
    // the method name that precedes each group. Track the index of the
    // last closing parenthesis so we can also detect trailing `.IDENT`
    // property accesses that have no parentheses (e.g., `call().prop`).
    const children = ctx.children || [];
    const calls = []; // sequence of { baseNames?:[], methodName?:string, args:[] }
    let lastParenIndex = -1;
    for (let i = 0; i < children.length; i++) {
      const ch = children[i];
      const txt = ch && ch.getText ? ch.getText() : null;
      if (txt === "(") {
        // identify whether this group's method comes from the base memberExpr
        const prev = children[i - 1];
        let isBase = false;
        if (
          prev &&
          prev.constructor &&
          prev.constructor.name &&
          prev.constructor.name.endsWith("MemberExprContext")
        ) {
          isBase = true;
        }
        // collect expr contexts until matching ')'
        const args = [];
        let j = i + 1;
        for (; j < children.length; j++) {
          const inner = children[j];
          const innerText = inner && inner.getText ? inner.getText() : null;
          if (innerText === ")") break;
          if (
            inner &&
            inner.constructor &&
            inner.constructor.name &&
            inner.constructor.name.endsWith("ExprContext")
          ) {
            args.push(this.visit(inner));
          }
        }
        // advance i to position of ')'
        i = j;
        lastParenIndex = j;
        if (isBase) {
          calls.push({ baseNames: baseNames.slice(), args });
        } else {
          // For suffix calls, only treat as method-name call when the '(' is
          // directly preceded by '. IDENT' in the children sequence. This
          // prevents earlier IDENTs (from prior calls) being mistaken for the
          // current method name (e.g., num.test()("x")).
          let methodName = null;
          const prevChild = children[i - 1];
          const prevPrevChild = children[i - 2];
          const prevText = prevChild && prevChild.getText ? prevChild.getText() : null;
          const prevPrevText = prevPrevChild && prevPrevChild.getText ? prevPrevChild.getText() : null;
          if (prevText && /^[A-Za-z_][A-Za-z0-9_]*$/.test(prevText) && prevPrevText === ".") {
            methodName = prevText;
          } else if (
            prevChild &&
            prevChild.constructor &&
            prevChild.constructor.name &&
            prevChild.constructor.name.endsWith("MemberExprContext")
          ) {
            // If the immediate preceding child is a MemberExprContext, prefer its last IDENT
            try {
              const ids = prevChild.IDENT
                ? Array.isArray(prevChild.IDENT())
                  ? prevChild.IDENT().map((x) => x.getText())
                  : [prevChild.IDENT().getText()]
                : [];
              if (ids && ids.length > 0) methodName = ids[ids.length - 1];
            } catch (e) { }
          }
          calls.push({ methodName, args });
        }
      }
    }

    // Detect any trailing property access tokens after the last ')', e.g.
    // `num.add(5).add(6).num` where `.num` has no parentheses. Collect a
    // list of property names (in order) to attach to the resulting AST.
    const trailingProps = [];
    let k = lastParenIndex + 1;
    while (k < children.length) {
      const tok = children[k];
      const txt = tok && tok.getText ? tok.getText() : null;
      if (txt === ".") {
        const next = children[k + 1];
        const nextText = next && next.getText ? next.getText() : null;
        if (nextText && /^[A-Za-z_][A-Za-z0-9_]*$/.test(nextText)) {
          trailingProps.push(nextText);
          k += 2;
          continue;
        }
      }
      break;
    }

    // Build nested AST from the calls list. The first entry uses baseNames
    // to form either a `Call` or `MemberCall`. Subsequent entries become
    // MemberCall nodes whose receiver is the previous call AST.
    if (calls.length === 0) {
      // No parentheses groups — this is a pure member-access chain like `a.b.c`.
      // Reconstruct the identifier chain from the parsed pieces and return
      // a `Member` AST so downstream code emits property-getters.
      const chain = [];
      if (baseNames && baseNames.length > 0) {
        chain.push(...baseNames);
      }
      // Collect any dotted identifiers present in the children sequence
      for (let i = 0; i < children.length; i++) {
        const tok = children[i];
        const t = tok && tok.getText ? tok.getText() : null;
        if (t === ".") {
          const next = children[i + 1];
          const nextText = next && next.getText ? next.getText() : null;
          if (nextText && /^[A-Za-z_][A-Za-z0-9_]*$/.test(nextText)) {
            // avoid duplicating the last entry when baseNames already included it
            if (chain.length === 0 || chain[chain.length - 1] !== nextText) chain.push(nextText);
            i++;
            continue;
          }
        }
        // If children include raw IDENT tokens (unlikely here), collect them
        if (t && /^[A-Za-z_][A-Za-z0-9_]*$/.test(t)) {
          if (chain.length === 0 || chain[chain.length - 1] !== t) chain.push(t);
        }
      }
      if (chain.length <= 1) return null;
      return { type: "Member", chain };
    }
    let ast = null;
    const first = calls[0];
    if (first.baseNames) {
      if (first.baseNames.length <= 1)
        ast = { type: "Call", name: first.baseNames[0] || "", args: first.args };
      else ast = { type: "MemberCall", chain: first.baseNames, args: first.args };
    } else {
      ast = { type: "Call", name: first.methodName || "", args: first.args };
    }
    for (let k = 1; k < calls.length; k++) {
      const c = calls[k];
      ast = { type: "MemberCall", chain: [ast, c.methodName], args: c.args };
    }

    // Attach any trailing property accesses (e.g., `.num`) collected earlier
    // so expressions like `num.add(5).add(6).num` become a Member node whose
    // receiver is the chained call AST.
    if (trailingProps && trailingProps.length > 0) {
      for (let pi = 0; pi < trailingProps.length; pi++) {
        const pname = trailingProps[pi];
        ast = { type: "Member", chain: [ast, pname] };
      }
    }
    return ast;
  }

  visitTypeAnnotation(ctx) {
    if (!ctx || !ctx.typeName || typeof ctx.typeName !== "function") return null;
    const tn = ctx.typeName();
    return tn ? this.visit(tn) : null;
  }

  visitTypeName(ctx) {
    if (!ctx) return null;
    const idNodes = ctx.IDENT ? ctx.IDENT() : [];
    const names = [];
    if (Array.isArray(idNodes)) {
      for (const node of idNodes) if (node && node.getText) names.push(node.getText());
    } else if (idNodes && idNodes.getText) {
      names.push(idNodes.getText());
    }
    const base = names.length > 0 ? names[0] : null;
    const isArray = !!(ctx.children && ctx.children.some((ch) => ch && ch.getText && ch.getText() === "["));
    return base ? (isArray ? `${base}[]` : base) : null;
  }

  visitObjectKey(ctx) {
    if (!ctx) return { key: null, typeAnnotation: null, computed: false, computedExpr: null };
    const typed = ctx.typedObjectKey ? ctx.typedObjectKey() : null;
    if (typed) return this.visit(typed);
    const computed = ctx.computedObjectKey ? ctx.computedObjectKey() : null;
    if (computed)
      return {
        key: this.visit(computed),
        typeAnnotation: null,
        computed: true,
        computedExpr: this.visit(computed),
      };
    if (ctx.STRING && ctx.STRING()) {
      const raw = ctx.STRING().getText();
      let value = raw;
      try {
        value = JSON.parse(raw);
      } catch (e) {
        value = raw.replace(/^"|"$/g, "");
      }
      return { key: value, typeAnnotation: null, computed: false, computedExpr: null };
    }
    if (ctx.IDENT && ctx.IDENT())
      return { key: ctx.IDENT().getText(), typeAnnotation: null, computed: false, computedExpr: null };
    return {
      key: ctx.getText ? ctx.getText() : null,
      typeAnnotation: null,
      computed: false,
      computedExpr: null,
    };
  }

  visitTypedObjectKey(ctx) {
    if (!ctx) return { key: null, typeAnnotation: null, computed: false, computedExpr: null };
    const typeName = ctx.typeName ? this.visit(ctx.typeName()) : null;
    const identNode = ctx.IDENT ? ctx.IDENT() : null;
    if (identNode)
      return { key: identNode.getText(), typeAnnotation: typeName, computed: false, computedExpr: null };
    const computed = ctx.computedObjectKey ? ctx.computedObjectKey() : null;
    if (computed)
      return {
        key: this.visit(computed),
        typeAnnotation: typeName,
        computed: true,
        computedExpr: this.visit(computed),
      };
    return { key: null, typeAnnotation: typeName, computed: false, computedExpr: null };
  }

  visitComputedObjectKey(ctx) {
    const exprCtx = ctx.expr ? (Array.isArray(ctx.expr()) ? ctx.expr(0) : ctx.expr()) : null;
    return exprCtx ? this.visit(exprCtx) : null;
  }

  visitParamDecl(ctx) {
    if (!ctx) return { name: null, typeAnnotation: null, defaultValue: null };
    const name = ctx.IDENT && typeof ctx.IDENT === "function" ? ctx.IDENT().getText() : null;
    let typeAnnotation = null;
    try {
      const ann = ctx.typeAnnotation ? ctx.typeAnnotation() : null;
      typeAnnotation = ann ? this.visit(ann) : null;
    } catch (e) { }
    let defaultValue = null;
    try {
      if (ctx.expr && typeof ctx.expr === "function") {
        const dflt = ctx.expr();
        if (dflt) defaultValue = this.visit(dflt);
      }
    } catch (e) { }
    return { name, typeAnnotation, defaultValue };
  }

  visitArrowFunction(ctx) {
    // arrowFunction : '(' (paramDecl (',' paramDecl)*)? ')' '=>' (block | inlineBlock)
    //               | paramDecl '=>' (block | inlineBlock)
    const paramInfos = [];
    try {
      if (ctx.paramDecl && typeof ctx.paramDecl === "function") {
        const paramNodes = ctx.paramDecl();
        if (Array.isArray(paramNodes)) {
          for (const node of paramNodes) {
            const info = this.visit(node);
            if (info && info.name) paramInfos.push(info);
          }
        } else if (paramNodes) {
          const info = this.visit(paramNodes);
          if (info && info.name) paramInfos.push(info);
        }
      }
    } catch (e) { }
    const body = ctx.block
      ? this.visit(ctx.block())
      : ctx.inlineBlock
        ? this.visit(ctx.inlineBlock())
        : { type: "Block", body: [] };
    return {
      type: "Lambda",
      params: paramInfos.map((p) => p.name),
      paramTypes: paramInfos.map((p) => p.typeAnnotation),
      paramDefaults: paramInfos.map((p) => p.defaultValue),
      body,
    };
  }

  visitMemberExpr(ctx) {
    const ids = [];
    if (!ctx) return ids;
    const idNodes = ctx.IDENT ? ctx.IDENT() : [];
    if (Array.isArray(idNodes)) {
      for (let i = 0; i < idNodes.length; i++) ids.push(idNodes[i].getText());
    } else if (idNodes) ids.push(idNodes.getText());
    return ids;
  }

  visitArrayLiteral(ctx) {
    const exprs = ctx.expr ? (Array.isArray(ctx.expr()) ? ctx.expr() : [ctx.expr()]) : [];
    const elements = [];
    for (let i = 0; i < exprs.length; i++) {
      const e = exprs[i];
      if (e) elements.push(this.visit(e));
    }
    return { type: "Array", elements };
  }

  visitObjectLiteral(ctx) {
    const pairs = ctx.objectPair
      ? Array.isArray(ctx.objectPair())
        ? ctx.objectPair()
        : [ctx.objectPair()]
      : [];
    const props = [];
    for (let i = 0; i < pairs.length; i++) {
      const p = pairs[i];
      if (!p) continue;
      let keyInfo = { key: null, typeAnnotation: null, computed: false, computedExpr: null };
      const keyCtx = p.objectKey ? p.objectKey() : null;
      if (keyCtx) keyInfo = this.visit(keyCtx);
      else if (p.optionKey) {
        const legacy = p.optionKey();
        if (legacy && legacy.STRING && legacy.STRING()) {
          let value = legacy.STRING().getText();
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = value.replace(/^"|"$/g, "");
          }
          keyInfo = { key: value, typeAnnotation: null, computed: false, computedExpr: null };
        } else if (legacy && legacy.IDENT && legacy.IDENT()) {
          keyInfo = {
            key: legacy.IDENT().getText(),
            typeAnnotation: null,
            computed: false,
            computedExpr: null,
          };
        }
      }

      // value expression
      let expr = null;
      const exprCtx = p.expr ? (Array.isArray(p.expr()) ? p.expr(0) : p.expr()) : null;
      if (exprCtx) expr = this.visit(exprCtx);

      props.push({
        key: keyInfo.key,
        value: expr,
        keyType: keyInfo.typeAnnotation,
        computed: !!keyInfo.computed,
        computedExpr: keyInfo.computedExpr,
      });
    }
    // Diagnostic: log props and inferred types (temporary)
    // mark that objects are used so emitter includes the Objects extension
    objectsUsed = true;
    return { type: "Object", props };
  }

  visitClassDecl(ctx) {
    // class IDENT ( 'extends' IDENT )? '{' classMember* '}'
    const idNodes = ctx.IDENT ? ctx.IDENT() : [];
    const name =
      Array.isArray(idNodes) && idNodes.length > 0
        ? idNodes[0].getText()
        : idNodes && idNodes.getText
          ? idNodes.getText()
          : "";
    const ext = Array.isArray(idNodes) && idNodes.length > 1 ? idNodes[1].getText() : null;
    const members = [];
    if (ctx.classMember) {
      const cms = Array.isArray(ctx.classMember()) ? ctx.classMember() : [ctx.classMember()];
      for (let i = 0; i < cms.length; i++) members.push(this.visit(cms[i]));
    }
    // Also accept top-level statements inside class body (e.g., `this.foo = ...;`)
    if (ctx.statementItem) {
      const sis = Array.isArray(ctx.statementItem()) ? ctx.statementItem() : [ctx.statementItem()];
      for (let i = 0; i < sis.length; i++) {
        const si = sis[i];
        if (si.assignStmt && si.assignStmt()) members.push(this.visit(si.assignStmt()));
        else if (si.varDecl && si.varDecl()) members.push(this.visit(si.varDecl()));
        else if (si.functionCall && si.functionCall()) members.push(this.visit(si.functionCall()));
        else if (si.printCall && si.printCall()) members.push(this.visit(si.printCall()));
        else if (si.classDecl && si.classDecl()) members.push(this.visit(si.classDecl()));
        else if (si.onCall && si.onCall()) members.push(this.visit(si.onCall()));
        else if (si.breakStmt && si.breakStmt()) members.push(this.visit(si.breakStmt()));
        else if (si.continueStmt && si.continueStmt()) members.push(this.visit(si.continueStmt()));
      }
    }
    return { type: "Class", name, extends: ext, members };
  }

  visitClassMember(ctx) {
    // Class member now supports optional modifiers: ('static')? ('get'|'set')? '*'? IDENT(...) or constructor(...)
    const children = ctx.children || [];
    // find index of the opening parenthesis to inspect tokens before it
    let parenIndex = -1;
    for (let i = 0; i < children.length; i++) {
      const ch = children[i];
      if (ch && ch.getText && ch.getText() === "(") {
        parenIndex = i;
        break;
      }
    }
    let isStatic = false;
    let isGetter = false;
    let isSetter = false;
    let isGenerator = false;
    let name = "";
    // inspect tokens before '(' for modifiers and the method name (last IDENT before '(')
    if (parenIndex !== -1) {
      for (let i = 0; i < parenIndex; i++) {
        const ch = children[i];
        if (!ch || !ch.getText) continue;
        const t = ch.getText();
        if (t === "static") isStatic = true;
        else if (t === "get") isGetter = true;
        else if (t === "set") isSetter = true;
        else if (t === "*") isGenerator = true;
        else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(t)) name = t;
      }
    }
    const params = [];
    const paramTypes = [];
    try {
      if (ctx.paramDecl && typeof ctx.paramDecl === "function") {
        const paramNodes = ctx.paramDecl();
        if (Array.isArray(paramNodes)) {
          for (const node of paramNodes) {
            const info = this.visit(node);
            if (info && info.name) {
              params.push(info.name);
              paramTypes.push(info.typeAnnotation);
            }
          }
        } else if (paramNodes) {
          const info = this.visit(paramNodes);
          if (info && info.name) {
            params.push(info.name);
            paramTypes.push(info.typeAnnotation);
          }
        }
      }
    } catch (e) { }
    // If name still empty but the literal 'constructor' appeared, use that
    if (!name && parenIndex !== -1) {
      for (let i = 0; i < parenIndex; i++) {
        const ch = children[i];
        if (ch && ch.getText && ch.getText() === "constructor") {
          name = "constructor";
          break;
        }
      }
    }
    let returnType = null;
    try {
      const ann = ctx.typeAnnotation ? ctx.typeAnnotation() : null;
      returnType = ann ? this.visit(ann) : null;
    } catch (e) { }
    const body = ctx.block ? this.visit(ctx.block()) : { type: "Block", body: [] };
    return {
      type: "Method",
      name,
      params,
      paramTypes,
      returnType,
      body,
      static: isStatic,
      getter: isGetter,
      setter: isSetter,
      generator: isGenerator,
    };
  }

  visitVarDecl(ctx) {
    // ('let' | 'const') IDENT typeAnnotation? ('=' expr)?
    const kindToken = ctx.getChild(0).getText();
    const hasExplicitKind = kindToken === "let" || kindToken === "const";
    const name = ctx.IDENT().getText();
    let value = null;
    if (ctx.expr && ctx.expr()) value = this.visit(ctx.expr());
    let typeAnnotation = null;
    try {
      const ann = ctx.typeAnnotation ? ctx.typeAnnotation() : null;
      typeAnnotation = ann ? this.visit(ann) : null;
    } catch (e) { }
    const inferredType = value ? this.inferType(value) : null;
    if (!hasExplicitKind && ctx.expr && ctx.expr()) {
      return { type: "Assign", name, value, targetType: typeAnnotation || null };
    }
    if (!value) return; // this way variables made like this: `let foo;` get their type as undefined, if they were made they would be set to an empty string, which runtime typeof resolves to type string and not undefined, it only does undefined for non existant variables, so we just dont make a declaration
    return { type: "Declare", kind: kindToken, name, value, typeAnnotation, inferredType };
  }

  visitReturn(ctx) {
    // 'return' expr?
    const exprCtx = ctx.expr ? ctx.expr() : null;
    const value = exprCtx ? this.visit(exprCtx) : null;
    return { type: "Return", value };
  }

  visitAssignStmt(ctx) {
    if (!ctx.expr || !ctx.expr()) return null;
    const value = this.visit(ctx.expr());
    // If parser provides memberExpr (member chain), prefer that form
    try {
      if (ctx.memberExpr && typeof ctx.memberExpr === "function" && ctx.memberExpr()) {
        const me = ctx.memberExpr();
        const raw = me.getText ? me.getText() : "";
        const chain = raw ? raw.split(".") : [];
        return { type: "Assign", memberChain: chain, value };
      }
    } catch (e) { }

    // Fallback: attempt to extract left-hand side from the full text of
    // the ctx (handles cases where the ANTLR parser wasn't regenerated
    // and ctx.memberExpr() is not available). This will catch forms like
    // `this.foo = 5` or `obj.prop = x` and produce a memberChain.
    try {
      if (ctx.getText && typeof ctx.getText === "function") {
        const full = ctx.getText();
        // split on the first '=' to isolate the left side
        const parts = full.split("=");
        let left = parts && parts.length > 0 ? parts[0] : "";
        // remove whitespace so `this . foo` also becomes `this.foo`
        left = String(left).replace(/\s+/g, "");
        if (left) {
          const chain = left.split(".");
          if (Array.isArray(chain) && chain.length >= 2) {
            return { type: "Assign", memberChain: chain, value };
          }
        }
      }
    } catch (e) { }

    // Final fallback: IDENT or THIS token (single-name assignment)
    const name = ctx.IDENT ? ctx.IDENT().getText() : ctx.THIS ? ctx.THIS().getText() : "";
    return { type: "Assign", name, value };
  }

  visitIfStmt(ctx) {
    // Collect all expr() occurrences for conditions
    const exprs = ctx.expr ? (Array.isArray(ctx.expr()) ? ctx.expr() : [ctx.expr()]) : [];
    // Blocks and single-statement forms can both appear as clause bodies.
    const blocksCtx = ctx.block ? (Array.isArray(ctx.block()) ? ctx.block() : [ctx.block()]) : [];
    const stmtCtxs = ctx.statement
      ? Array.isArray(ctx.statement())
        ? ctx.statement().slice()
        : [ctx.statement()]
      : [];
    const cases = [];
    // For each condition, prefer corresponding block() when present; otherwise consume a statement() and wrap it as a Block.
    for (let i = 0; i < exprs.length; i++) {
      const cond = this.visit(exprs[i]);
      let thenB = null;
      if (blocksCtx[i]) thenB = this.visit(blocksCtx[i]);
      else if (stmtCtxs && stmtCtxs.length > 0) {
        const sctx = stmtCtxs.shift();
        const s = this.visit(sctx);
        thenB = s && s.type === "Block" ? s : { type: "Block", body: s ? (Array.isArray(s) ? s : [s]) : [] };
      } else thenB = { type: "Block", body: [] };
      cases.push({ cond, thenBlock: thenB });
    }
    let elseBlock = null;
    // If an explicit else block was provided, prefer it; otherwise if any statement contexts remain use the last as else
    if (blocksCtx.length > exprs.length) {
      elseBlock = this.visit(blocksCtx[blocksCtx.length - 1]);
    } else if (stmtCtxs && stmtCtxs.length > 0) {
      const last = stmtCtxs.shift();
      const s = this.visit(last);
      elseBlock =
        s && s.type === "Block" ? s : { type: "Block", body: s ? (Array.isArray(s) ? s : [s]) : [] };
    }
    return { type: "If", cases, elseBlock };
  }

  visitForStmt(ctx) {
    // for '(' (varDecl | assignStmt)? ';' expr? ';' (assignStmt | functionCall | expr)? ')' block
    let init = null;
    if (ctx.varDecl && ctx.varDecl()) init = this.visit(ctx.varDecl());
    else if (ctx.assignStmt && ctx.assignStmt()) init = this.visit(ctx.assignStmt());

    // expr in the middle may be present as ctx.expr(); handle both single and array shapes
    let cond = null;
    try {
      const exprs = ctx.expr ? ctx.expr() : null;
      if (exprs) {
        if (Array.isArray(exprs)) cond = this.visit(exprs[0]);
        else cond = this.visit(exprs);
      }
    } catch (e) { }

    // update part: assignStmt | functionCall | expr
    let update = null;
    const assignNodes = ctx.assignStmt ? ctx.assignStmt() : null;
    if (assignNodes && (Array.isArray(assignNodes) ? assignNodes.length : 0) > 0) {
      const asn = Array.isArray(assignNodes) ? assignNodes[assignNodes.length - 1] : assignNodes;
      update = this.visit(asn);
    } else {
      const fcNodes = ctx.functionCall ? ctx.functionCall() : null;
      if (fcNodes && (Array.isArray(fcNodes) ? fcNodes.length : 0) > 0) {
        const fc = Array.isArray(fcNodes) ? fcNodes[fcNodes.length - 1] : fcNodes;
        update = this.visit(fc);
      } else {
        try {
          const exprs = ctx.expr ? ctx.expr() : null;
          // if multiple expr() were provided, the second expr (index 1) is the update
          if (exprs) {
            if (Array.isArray(exprs) && exprs.length > 1) update = this.visit(exprs[1]);
            else if (!Array.isArray(exprs) && exprs) update = this.visit(exprs);
          }
        } catch (e) { }
      }
    }

    let body = null;
    if (ctx.block && ctx.block()) body = this.visit(ctx.block());
    else if (ctx.statement && ctx.statement()) {
      const sctxs = Array.isArray(ctx.statement()) ? ctx.statement() : [ctx.statement()];
      const stmts = [];
      for (let i = 0; i < sctxs.length; i++) {
        const s = this.visit(sctxs[i]);
        if (s) stmts.push(s);
      }
      body = { type: "Block", body: stmts };
    } else body = { type: "Block", body: [] };
    return { type: "For", init, cond, update, body };
  }

  visitBreakStmt(ctx) {
    return { type: "Break" };
  }

  visitContinueStmt(ctx) {
    return { type: "Continue" };
  }

  visitWhileStmt(ctx) {
    // while '(' expr ')' block
    const condCtx = ctx.expr ? ctx.expr() : null;
    const cond = condCtx ? this.visit(condCtx) : null;
    let body = null;
    if (ctx.block && ctx.block()) body = this.visit(ctx.block());
    else if (ctx.statement && ctx.statement()) {
      const sctxs = Array.isArray(ctx.statement()) ? ctx.statement() : [ctx.statement()];
      const stmts = [];
      for (let i = 0; i < sctxs.length; i++) {
        const s = this.visit(sctxs[i]);
        if (s) stmts.push(s);
      }
      body = { type: "Block", body: stmts };
    } else body = { type: "Block", body: [] };
    return { type: "While", cond, body };
  }

  visitExpr(ctx) {
    if (ctx.children && ctx.children.some((c) => c && c.getText && c.getText() === "as")) {
      const targetExpr = this.visit(ctx.expr(0));
      const targetType = ctx.typeName ? this.visit(ctx.typeName()) : null;
      return { type: "Cast", expr: targetExpr, typeName: targetType };
    }

    // Prefer explicit unary handling for leading unary operators
    if (ctx.children && ctx.children[0] && ctx.children[0].getText) {
      const firstTok = ctx.children[0].getText();
      if (firstTok === "typeof") {
        return { type: "Typeof", expr: this.visit(ctx.expr(0)) };
      }
      // Handle *typeof (force runtime typeof, bypassing compile-time resolution)
      if (firstTok === "*" && ctx.children[1] && ctx.children[1].getText && ctx.children[1].getText() === "typeof") {
        return { type: "Typeof", expr: this.visit(ctx.expr(0)), forceRuntime: true };
      }
      if (firstTok === "new") {
        // new <functionCall>
        if (ctx.functionCall && ctx.functionCall())
          return { type: "New", callee: this.visit(ctx.functionCall()) };
      }
      if (
        firstTok === "!" ||
        firstTok === "~" ||
        firstTok === "+" ||
        firstTok === "-" ||
        firstTok === "++" ||
        firstTok === "--"
      ) {
        return { type: "Unary", op: firstTok, operand: this.visit(ctx.expr(0)) };
      }
    }

    // Ternary conditional: expr '?' expr ':' expr
    if (ctx.children && ctx.children.length === 5) {
      const hasQuestion = ctx.children.some(
        (c) => c && typeof c.getText === "function" && c.getText() === "?",
      );
      if (hasQuestion) {
        const cond = this.visit(ctx.expr(0));
        const thenExpr = this.visit(ctx.expr(1));
        const elseExpr = this.visit(ctx.expr(2));
        return { type: "Ternary", cond, thenExpr, elseExpr };
      }
    }

    // Flatten left-recursive binary expression tree into operands and operators
    const operands = [];
    const operators = [];
    const self = this;

    function isBinaryNode(n) {
      return (
        n &&
        typeof n.expr === "function" &&
        n.expr(0) &&
        n.expr(1) &&
        n.children &&
        n.children.length === 3 &&
        n.children[1].getText() !== "?"
      );
    }

    function helper(n) {
      if (!n) return;
      //console.log(n)
      if (isBinaryNode(n)) {
        helper(n.expr(0));
        operators.push(n.children[1].getText());
        helper(n.expr(1));
      } else {
        // no-op: keep helper focused on atomic node handling
        // atomic node: handle primary/function/print/ident/number/string specially
        // If the node is a raw terminal containing a numeric string (e.g., '-2'),
        // treat it as a numeric literal. Some lexer shapes produce a single
        // terminal token for negative numbers in certain contexts.
        if (n && n.getText && typeof n.getText === "function") {
          const txt = n.getText();
          if (/^-?\d+(?:\.\d+)?$/.test(txt)) {
            operands.push({ type: "Literal", litType: "number", value: Number(txt) });
            return;
          }
        }

        if (typeof n.primary === "function" && n.primary()) {
          operands.push(self.visit(n.primary()));
          return;
        }
        if (typeof n.functionCall === "function" && n.functionCall()) {
          operands.push(self.visit(n.functionCall()));
          return;
        }
        if (typeof n.printCall === "function" && n.printCall()) {
          operands.push(self.visit(n.printCall()));
          return;
        }
        if (n.NUMBER && typeof n.NUMBER === "function" && n.NUMBER()) {
          operands.push({ type: "Literal", litType: "number", value: Number(n.NUMBER().getText()) });
          return;
        }
        if (n.STRING && typeof n.STRING === "function" && n.STRING()) {
          const s = n.STRING().getText();
          try {
            operands.push({ type: "Literal", litType: "string", value: JSON.parse(s) });
            return;
          } catch (e) {
            operands.push({ type: "Literal", litType: "string", value: s.replace(/^"|"$/g, "") });
            return;
          }
        }
        if (n.getText && (n.getText() === "true" || n.getText() === "false")) {
          operands.push({ type: "Literal", litType: "boolean", value: n.getText() === "true" });
          return;
        }
        //console.log(n)
        if (n.THIS && typeof n.THIS === "function" && n.THIS()) {
          operands.push({ type: "This" });
          return;
        }
        if (n.IDENT && typeof n.IDENT === "function" && n.IDENT()) {
          operands.push({ type: "Var", name: n.IDENT().getText() });
          return;
        }
        // fallback to visiting the node
        const val = self.visit(n);
        operands.push(val);
      }
    }

    helper(ctx);

    if (operators.length === 0) {
      return operands[0] || null;
    }

    // Precedence levels (high -> low). Matches JavaScript operator precedence order.
    const PRECEDENCE_LEVELS = [
      ["**"],
      ["*", "/"],
      // include string concat '..' alongside + and - so concatenation chains are combined
      ["+", "-", ".."],
      ["<<", ">>", ">>>"],
      ["<", "<=", ">", ">="],
      ["==", "!=", "===", "!=="],
      ["&"],
      ["^"],
      ["|"],
      ["&&"],
      ["||"],
    ];

    let values = operands.slice();
    let ops = operators.slice();

    for (let level = 0; level < PRECEDENCE_LEVELS.length; level++) {
      const levelOps = PRECEDENCE_LEVELS[level];
      const rightAssoc = level === 0; // `**` is right-associative
      if (rightAssoc) {
        for (let i = ops.length - 1; i >= 0; i--) {
          if (levelOps.includes(ops[i])) {
            const left = values[i];
            const right = values[i + 1];
            const combined = { type: "Binary", op: ops[i], left, right };
            values.splice(i, 2, combined);
            ops.splice(i, 1);
          }
        }
      } else {
        for (let i = 0; i < ops.length; i++) {
          if (levelOps.includes(ops[i])) {
            const left = values[i];
            const right = values[i + 1];
            const combined = { type: "Binary", op: ops[i], left, right };
            values.splice(i, 2, combined);
            ops.splice(i, 1);
            i--;
          }
        }
      }
    }

    return values[0] || null;
  }
  // Handle the new `atom` grammar rule introduced when `primary` was split.
  // This mirrors the previous primary-level literal/ident/member handling
  // so generated visitors for `atom` will produce the same AST shapes.
  visitAtom(ctx) {
    if (!ctx) return null;
    if (ctx.NUMBER && typeof ctx.NUMBER === "function" && ctx.NUMBER()) {
      const txt = ctx.NUMBER().getText();
      const val = /^0[xX]/.test(txt) ? parseInt(txt, 16) : Number(txt);
      return { type: "Literal", litType: "number", value: val };
    }
    if (ctx.STRING && typeof ctx.STRING === "function" && ctx.STRING()) {
      const s = ctx.STRING().getText();
      try {
        return { type: "Literal", litType: "string", value: JSON.parse(s) };
      } catch (e) {
        return { type: "Literal", litType: "string", value: s.replace(/^\"|\"$/g, "") };
      }
    }
    if (ctx.getText && (ctx.getText() === "true" || ctx.getText() === "false"))
      return { type: "Literal", litType: "boolean", value: ctx.getText() === "true" };
    if (ctx.getText && ctx.getText() === "this") return { type: "This" };
    if (ctx.printCall && ctx.printCall()) return this.visit(ctx.printCall());
    if (ctx.inlineBlock && ctx.inlineBlock()) {
      const body = this.visit(ctx.inlineBlock());
      return { type: "Lambda", params: [], body };
    }
    if (ctx.arrowFunction && ctx.arrowFunction()) return this.visit(ctx.arrowFunction());
    if (ctx.arrayLiteral && ctx.arrayLiteral()) return this.visit(ctx.arrayLiteral());
    if (ctx.objectLiteral && ctx.objectLiteral()) return this.visit(ctx.objectLiteral());
    if (ctx.functionCall && ctx.functionCall()) return this.visit(ctx.functionCall());
    if (ctx.memberExpr && ctx.memberExpr()) {
      const chain = this.visit(ctx.memberExpr());
      if (Array.isArray(chain) && chain.length === 1) return { type: "Var", name: chain[0] };
      return { type: "Member", chain };
    }
    // parenthesized expression: atom may include '(' expr ')'
    if (ctx.expr && ctx.expr()) {
      const e = Array.isArray(ctx.expr()) ? ctx.expr(0) : ctx.expr();
      if (e) return this.visit(e);
    }
    if (ctx.IDENT && ctx.IDENT()) return { type: "Var", name: ctx.IDENT().getText() };
    return null;
  }
  visitPrimary(ctx) {
    // Normalize primary by delegating to `atom` when present (new grammar),
    // otherwise fall back to legacy token checks.
    let base = null;
    if (ctx.atom && typeof ctx.atom === "function" && ctx.atom()) {
      base = this.visit(ctx.atom());
    } else {
      if (ctx.NUMBER && typeof ctx.NUMBER === "function" && ctx.NUMBER()) {
        const txt = ctx.NUMBER().getText();
        const val = /^0[xX]/.test(txt) ? parseInt(txt, 16) : Number(txt);
        base = { type: "Literal", litType: "number", value: val };
      } else if (ctx.STRING && typeof ctx.STRING === "function" && ctx.STRING()) {
        const s = ctx.STRING().getText();
        try {
          base = { type: "Literal", litType: "string", value: JSON.parse(s) };
        } catch (e) {
          base = { type: "Literal", litType: "string", value: s.replace(/^\"|\"$/g, "") };
        }
      } else if (ctx.getText && (ctx.getText() === "true" || ctx.getText() === "false")) {
        base = { type: "Literal", litType: "boolean", value: ctx.getText() === "true" };
      } else if (ctx.getText && ctx.getText() === "this") {
        base = { type: "This" };
      } else if (ctx.printCall && ctx.printCall()) {
        base = this.visit(ctx.printCall());
      } else if (ctx.inlineBlock && ctx.inlineBlock()) {
        const body = this.visit(ctx.inlineBlock());
        base = { type: "Lambda", params: [], body };
      } else if (ctx.arrowFunction && ctx.arrowFunction()) {
        base = this.visit(ctx.arrowFunction());
      } else if (ctx.arrayLiteral && ctx.arrayLiteral()) {
        base = this.visit(ctx.arrayLiteral());
      } else if (ctx.objectLiteral && ctx.objectLiteral()) {
        base = this.visit(ctx.objectLiteral());
      } else if (ctx.functionCall && ctx.functionCall()) {
        base = this.visit(ctx.functionCall());
      } else if (ctx.memberExpr && ctx.memberExpr()) {
        const chain = this.visit(ctx.memberExpr());
        if (Array.isArray(chain) && chain.length === 1) base = { type: "Var", name: chain[0] };
        else base = { type: "Member", chain };
      } else if (ctx.expr && ctx.expr()) {
        const e = Array.isArray(ctx.expr()) ? ctx.expr(0) : ctx.expr();
        if (e) base = this.visit(e);
      } else if (ctx.IDENT && ctx.IDENT()) {
        base = { type: "Var", name: ctx.IDENT().getText() };
      } else base = null;
    }

    // Postfix ++/--: when present wrap the base into a Postfix AST node
    if (ctx.INCR && ctx.INCR()) return { type: "Postfix", op: "++", operand: base };
    if (ctx.DECR && ctx.DECR()) return { type: "Postfix", op: "--", operand: base };

    const bracketExprs = [];
    if (ctx.children) {
      for (let i = 0; i < ctx.children.length; i++) {
        const ch = ctx.children[i];
        const text = ch && ch.getText ? ch.getText() : null;
        if (text === "[") {
          let j = i + 1;
          let inner = null;
          while (j < ctx.children.length) {
            const innerCh = ctx.children[j];
            if (innerCh && innerCh.getText && innerCh.getText() === "]") break;
            if (
              innerCh &&
              innerCh.constructor &&
              innerCh.constructor.name &&
              innerCh.constructor.name.endsWith("ExprContext")
            ) {
              inner = innerCh;
            }
            j++;
          }
          if (inner) bracketExprs.push(inner);
        }
      }
    }
    if (bracketExprs.length > 0) {
      let current = base;
      for (const exprCtx of bracketExprs) {
        current = { type: "Index", receiver: current, index: this.visit(exprCtx) };
      }
      return current;
    }

    return base;
  }
  // Build options object from options_ context
  visitOptions_(ctx) {
    const obj = {};
    const pairs = ctx.optionPair ? ctx.optionPair() : [];
    for (let i = 0; i < pairs.length; i++) {
      const p = pairs[i];
      // optionKey can be STRING or IDENT
      let key = null;
      const keyCtx = p.optionKey();
      if (keyCtx.STRING && keyCtx.STRING()) {
        try {
          key = JSON.parse(keyCtx.STRING().getText());
        } catch (e) {
          key = keyCtx
            .STRING()
            .getText()
            .replace(/^\"|\"$/g, "");
        }
      } else if (keyCtx.IDENT && keyCtx.IDENT()) {
        key = keyCtx.IDENT().getText();
      }
      // optionValue
      const valCtx = p.optionValue();
      let val = null;
      // Prefer primitive typed values if present
      if (valCtx.STRING && valCtx.STRING()) {
        try {
          val = JSON.parse(valCtx.STRING().getText());
        } catch (e) {
          val = valCtx
            .STRING()
            .getText()
            .replace(/^\"|\"$/g, "");
        }
      } else if (valCtx.NUMBER && valCtx.NUMBER()) {
        val = Number(valCtx.NUMBER().getText());
      } else if (valCtx.getText && (valCtx.getText() === "true" || valCtx.getText() === "false")) {
        val = valCtx.getText() === "true";
      } else {
        // If the option value can be an expression (grammar may allow it), prefer the AST sub-node
        try {
          // if optionValue contains an expr rule, visit it to get its AST representation
          if (valCtx.expr && valCtx.expr()) {
            // valCtx.expr() may return a single ctx or array depending on generation; handle both
            const exprCtx =
              typeof valCtx.expr === "function"
                ? Array.isArray(valCtx.expr())
                  ? valCtx.expr(0)
                  : valCtx.expr()
                : null;
            if (exprCtx) {
              val = this.visit(exprCtx);
            }
          }
        } catch (e) {
          // ignore and fall back
        }
        // fallback to raw text if still null
        if (val == null) val = valCtx.getText ? valCtx.getText() : null;
      }
      if (key != null) obj[key] = val;
    }
    return obj;
  }
}
const { ParseTreeWalker } = require("antlr4");

function nodeToString(node, parser, indent = "") {
  const { children } = node;
  // terminal node
  if (!children || children.length === 0) {
    return indent + node.getText();
  }
  const ruleName =
    node.constructor.name === "TerminalNodeImpl"
      ? node.getText()
      : parser.ruleNames[node.ruleIndex] || node.constructor.name;
  let out = indent + ruleName;
  for (const ch of children) {
    out += "\n" + nodeToString(ch, parser, indent + "  ");
  }
  return out;
}

// helper to parse and build AST
function parseWithAntlr(source) {
  const chars = new antlr4.InputStream(source);
  const lexer = new PangLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new PangParser(tokens);
  parser.buildParseTrees = true;
  const tree = parser.program();
  //console.log(nodeToString(tree, parser));
  const visitor = new AstBuilder();
  return visitor.visit(tree);
}

/* -------------------------
  Emitter: create blocks map (targets[1].blocks)
--------------------------*/
// Delegate block/project generation to lib/generator.js so index.js contains no
// manual block generation logic.
function performStaticTypeAnalysis(rootAst) {
  const scopes = [new Map()];

  function pushScope() {
    scopes.push(new Map());
  }

  function popScope() {
    scopes.pop();
  }

  function normalizeTypeName(type) {
    return new AstBuilder().normalizeTypeName(type);
  }

  function isTypeCompatible(declaredType, inferredType) {
    const declared = normalizeTypeName(declaredType);
    const inferred = normalizeTypeName(inferredType);
    if (!declared || !inferred || declared === "Any" || inferred === "Any") return true;
    if (declared === inferred) return true;
    if (declared === "Object" && inferred && inferred.startsWith("Object{")) return true;
    if (declared === "Array" && inferred && inferred.endsWith("[]")) return true;
    if (declared.endsWith("[]") && inferred.endsWith("[]")) {
      const declaredItem = normalizeTypeName(declared.slice(0, -2));
      const inferredItem = normalizeTypeName(inferred.slice(0, -2));
      return isTypeCompatible(declaredItem, inferredItem);
    }
    if (declared === "Number" && inferred === "Number") return true;
    if (declared === "String" && inferred === "String") return true;
    if (declared === "Boolean" && inferred === "Boolean") return true;
    if (declared === "Array" && inferred === "Array") return true;
    if (declared === "Object" && inferred === "Object") return true;
    if (declared === "Function" && inferred === "Function") return true;
    return false;
  }

  function isConcreteType(type) {
    const normalized = normalizeTypeName(type);
    return Boolean(normalized && normalized !== "Any" && normalized !== "Unknown" && normalized !== "Void");
  }

  function inferPropertyTypeFromShape(type, propertyName) {
    const normalized = normalizeTypeName(type);
    if (!normalized || !propertyName) return null;
    const shapeMatch = normalized.match(/^Object\{(.+)\}$/);
    if (!shapeMatch) return null;
    const parts = shapeMatch[1].split(",");
    for (const part of parts) {
      const [name, valueType] = part.split(":");
      if (name && name.trim() === String(propertyName)) return normalizeTypeName(valueType);
    }
    return null;
  }

  function lookupType(name) {
    for (let i = scopes.length - 1; i >= 0; i--) {
      if (scopes[i].has(name)) return scopes[i].get(name);
    }
    return null;
  }

  function setType(name, type) {
    if (!name) return;
    scopes[scopes.length - 1].set(name, normalizeTypeName(type));
  }

  function visitExpression(node) {
    if (!node) return "Any";
    if (Array.isArray(node)) {
      let inferred = "Any";
      for (const item of node) {
        const itemType = visitExpression(item);
        if (itemType && itemType !== "Any") inferred = itemType;
      }
      return inferred;
    }

    switch (node.type) {
      case "Literal": {
        const litType =
          node.litType === "number"
            ? "Number"
            : node.litType === "string"
              ? "String"
              : node.litType === "boolean"
                ? "Boolean"
                : "Any";
        node.inferredType = litType;
        return litType;
      }
      case "Var": {
        const found = lookupType(node.name);
        node.inferredType = found || "Any";
        return node.inferredType;
      }
      case "Typeof": {
        // If forceRuntime is true, do NOT resolve at compile time.
        if (node.forceRuntime) {
          node.inferredType = "String";
          return "String";
        }

        const innerType = visitExpression(node.expr);
        const resolvedType = getTypeofLabel(innerType);
        if (resolvedType) {
          Object.assign(node, {
            type: "Literal",
            litType: "string",
            value: resolvedType,
            inferredType: "String",
          });
        } else {
          node.inferredType = "String";
        }
        return "String";
      }
      case "Binary": {
        const leftType = visitExpression(node.left);
        const rightType = visitExpression(node.right);
        let inferred = "Any";
        if (["+", "-", "*", "/", "%", "**", "<<", ">>", ">>>", "&", "^", "|"].includes(node.op))
          inferred = "Number";
        else if (["<", "<=", ">", ">=", "==", "!=", "===", "!==", "&&", "||"].includes(node.op))
          inferred = "Boolean";
        else if (node.op === "..") inferred = "String";
        if (node.op === "+" && (leftType === "String" || rightType === "String")) inferred = "String";
        node.inferredType = inferred;
        return inferred;
      }
      case "Unary": {
        const operandType = visitExpression(node.operand);
        const inferred = node.op === "!" ? "Boolean" : operandType === "String" ? "String" : "Number";
        node.inferredType = inferred;
        return inferred;
      }
      case "Cast": {
        const innerType = visitExpression(node.expr);
        const target = normalizeTypeName(node.typeName);
        if (
          target &&
          target !== "Any" &&
          innerType &&
          innerType !== "Any" &&
          !isTypeCompatible(target, innerType)
        ) {
          throw new Error(`Type error: cannot cast ${innerType} to ${target}`);
        }
        node.inferredType = target || innerType || "Any";
        return node.inferredType;
      }
      case "Index": {
        const receiverType = node.receiver ? visitExpression(node.receiver) : "Any";
        let inferred = "Any";
        if (receiverType && receiverType.endsWith("[]")) {
          inferred = normalizeTypeName(receiverType.slice(0, -2));
        }
        node.inferredType = inferred;
        return inferred;
      }
      case "Ternary": {
        const thenType = visitExpression(node.thenExpr);
        const elseType = visitExpression(node.elseExpr);
        const inferred = thenType === elseType ? thenType : "Any";
        node.inferredType = inferred;
        return inferred;
      }
      case "Array": {
        if (!Array.isArray(node.elements) || node.elements.length === 0) {
          node.inferredType = "Array";
          return "Array";
        }
        let elementType = null;
        for (const item of node.elements) {
          const itemType = visitExpression(item);
          if (!itemType || itemType === "Any") {
            node.inferredType = "Any";
            return "Any";
          }
          if (elementType === null) elementType = itemType;
          else if (itemType !== elementType) {
            node.inferredType = "Array";
            return "Array";
          }
        }
        const arrayType = `${normalizeTypeName(elementType)}[]`;
        node.inferredType = arrayType;
        return arrayType;
      }
      case "Object": {
        if (!node.props || !Array.isArray(node.props) || node.props.length === 0) {
          node.inferredType = "Object";
          return "Object";
        }
        const staticParts = [];
        for (const p of node.props) {
          if (!p) continue;
          if (p.computed && p.computedExpr) {
            visitExpression(p.computedExpr);
            continue;
          }
          if (!p.key || typeof p.key !== "string") {
            continue;
          }
          const t = visitExpression(p && p.value ? p.value : null);
          if (!t || t === "Any") {
            node.inferredType = "Any";
            return "Any";
          }
          staticParts.push(`${p.key}:${t}`);
        }
        if (staticParts.length === 0) {
          node.inferredType = "Object";
          return "Object";
        }
        const shaped = `Object{${staticParts.join(",")}}`;
        node.inferredType = shaped;
        return node.inferredType;
      }
      case "Lambda": {
        node.inferredType = "Function";
        return "Function";
      }
      case "New": {
        node.inferredType = "Object";
        return "Object";
      }
      case "Call": {
        node.inferredType = "Any";
        return "Any";
      }
      case "Member":
      case "MemberCall": {
        const chain = Array.isArray(node.chain) ? node.chain : [];
        const receiverNode = chain.length > 0 ? chain[0] : null;
        const propertyName = chain.length > 1 ? chain[chain.length - 1] : null;
        const receiverType =
          typeof receiverNode === "string" ? lookupType(receiverNode) : visitExpression(receiverNode);
        const inferredPropertyType = propertyName
          ? inferPropertyTypeFromShape(receiverType, propertyName)
          : null;
        node.inferredType = inferredPropertyType || "Any";
        return node.inferredType;
      }
      default:
        return "Any";
    }
  }

  function visitStatements(stmts, scopeOverride = null, methodReturnType = null) {
    const activeScope = scopeOverride || scopes[scopes.length - 1];
    if (!stmts || !Array.isArray(stmts)) return;
    for (const stmt of stmts) {
      visitStatement(stmt, activeScope, methodReturnType);
    }
  }

  function visitStatement(stmt, currentScope = scopes[scopes.length - 1], methodReturnType = null) {
    if (!stmt) return;
    if (Array.isArray(stmt)) {
      for (const item of stmt) visitStatement(item, currentScope, methodReturnType);
      return;
    }

    switch (stmt.type) {
      case "Declare": {
        const explicitType = stmt.typeAnnotation ? normalizeTypeName(stmt.typeAnnotation) : null;
        const valueType = stmt.value ? visitExpression(stmt.value) : "Any";
        let effectiveType = explicitType || valueType || "Any";
        if (stmt.typeAnnotation && stmt.value && !isTypeCompatible(effectiveType, valueType)) {
          throw new Error(`Type error: cannot assign ${valueType} to ${effectiveType}`);
        }
        if (stmt.typeAnnotation && !stmt.value) {
          effectiveType = explicitType;
        } else if (!stmt.typeAnnotation && stmt.value && !isConcreteType(valueType)) {
          throw new Error(
            `Type inference error: cannot infer a concrete type for ${stmt.name} without an explicit type annotation`,
          );
        }
        stmt.inferredType = effectiveType;
        setType(stmt.name, effectiveType);
        break;
      }
      case "Assign": {
        const valueType = stmt.value ? visitExpression(stmt.value) : "Any";
        const targetType = lookupType(stmt.name) || stmt.targetType || null;
        if (targetType && !isTypeCompatible(targetType, valueType)) {
          throw new Error(`Type error: cannot assign ${valueType} to ${targetType}`);
        }
        if (stmt.name) {
          const mergedType = targetType || valueType;
          if (targetType && mergedType && mergedType !== "Any") {
            setType(stmt.name, mergedType);
          } else if (!targetType) {
            setType(stmt.name, valueType);
          }
        }
        break;
      }
      case "Return": {
        const valueType = stmt.value ? visitExpression(stmt.value) : "Any";
        if (methodReturnType && !isTypeCompatible(methodReturnType, valueType)) {
          throw new Error(`Type error: return value ${valueType} does not match ${methodReturnType}`);
        }
        break;
      }
      case "Print": {
        if (stmt.expr) visitExpression(stmt.expr);
        break;
      }
      case "Block": {
        pushScope();
        visitStatements(stmt.body, scopes[scopes.length - 1]);
        popScope();
        break;
      }
      case "If": {
        for (const clause of stmt.cases || []) {
          visitExpression(clause.cond);
          const branchBlock = clause.thenBlock;
          if (branchBlock && Array.isArray(branchBlock.body)) {
            for (const child of branchBlock.body) {
              if (child && child.type === "Assign" && child.name) {
                const declaredType = lookupType(child.name);
                if (declaredType && declaredType !== "Any") {
                  const valueType = child.value ? visitExpression(child.value) : "Any";
                  if (!isTypeCompatible(declaredType, valueType)) {
                    throw new Error(`Type error: cannot assign ${valueType} to ${declaredType}`);
                  }
                }
              }
            }
          }
          visitStatement(branchBlock, currentScope, methodReturnType);
        }
        if (stmt.elseBlock) {
          if (stmt.elseBlock && Array.isArray(stmt.elseBlock.body)) {
            for (const child of stmt.elseBlock.body) {
              if (child && child.type === "Assign" && child.name) {
                const declaredType = lookupType(child.name);
                if (declaredType && declaredType !== "Any") {
                  const valueType = child.value ? visitExpression(child.value) : "Any";
                  if (!isTypeCompatible(declaredType, valueType)) {
                    throw new Error(`Type error: cannot assign ${valueType} to ${declaredType}`);
                  }
                }
              }
            }
          }
          visitStatement(stmt.elseBlock, currentScope, methodReturnType);
        }
        break;
      }
      case "For": {
        if (stmt.init) visitStatement(stmt.init, currentScope, methodReturnType);
        if (stmt.cond) visitExpression(stmt.cond);
        if (stmt.update) visitStatement(stmt.update, currentScope, methodReturnType);
        if (stmt.body) visitStatement(stmt.body, currentScope, methodReturnType);
        break;
      }
      case "While": {
        if (stmt.cond) visitExpression(stmt.cond);
        if (stmt.body) visitStatement(stmt.body, currentScope, methodReturnType);
        break;
      }
      case "On": {
        if (stmt.body) visitStatement(stmt.body, currentScope, methodReturnType);
        break;
      }
      case "Method": {
        const methodScope = new Map();
        if (Array.isArray(stmt.params) && Array.isArray(stmt.paramTypes)) {
          stmt.params.forEach((name, index) => {
            const declaredType = stmt.paramTypes[index] ? normalizeTypeName(stmt.paramTypes[index]) : "Any";
            methodScope.set(name, declaredType);
          });
        }
        const returnType = stmt.returnType ? normalizeTypeName(stmt.returnType) : null;
        if (stmt.body && stmt.body.body) visitStatements(stmt.body.body, methodScope, returnType);
        break;
      }
      case "Class": {
        for (const member of stmt.members || []) visitStatement(member, currentScope, methodReturnType);
        break;
      }
      default:
        break;
    }
  }

  for (const node of rootAst) {
    if (node && node.type === "On" && node.body && node.body.body) {
      visitStatements(node.body.body);
    } else {
      visitStatement(node);
    }
  }
}

const generator = require("./lib/generator");

/* -------------------------
  CLI: glue
--------------------------*/
const input = process.argv[2]
  ? fs.readFileSync(process.argv[2], "utf8")
  : fs.readFileSync(path.join(__dirname, "test.pang"), "utf8");
const outJSONLocation = process.argv[3] || path.join(__dirname, "project.json");

// Do not strip comments here; ANTLR grammar handles both // and /* */ comments via lexer rules.
const cleaned = input;

// Decide whether input is nested JSON or source code. We must always use
// nested JSON internally, so convert any parsed AST into nested JSON first.
let nestedInput = null;
let usedClasses = false;
let arraysUsed = false;
let objectsUsed = false;
let lambdasUsed = false;
// Try parse as JSON first (user may have provided nested JSON file)
try {
  const parsed = JSON.parse(cleaned);
  if (Array.isArray(parsed) || (parsed && typeof parsed === "object")) {
    nestedInput = parsed;
  }
} catch (e) {
  // not JSON — fall back to parsing as source code below
}

if (!nestedInput) {
  // Parse with ANTLR and build AST
  let ast;
  try {
    // Preprocess some unsupported syntax into function-call forms the
    // existing grammar can parse. We convert `throw <expr>` -> `jw_throw(<expr>)`
    // and `yield <expr>` -> `jw_yield(<expr>)` so generator emission can
    // transform `jw_yield` calls into array-builder append blocks.
    function preprocessSource(src) {
      let s = src;
      // throw new Error("...") -> jw_throw("...")
      s = s.replace(
        /throw\s+new\s+Error\s*\(\s*("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|[^)]*?)\s*\)/g,
        "jw_throw($1)",
      );
      // general throw <expr> up to a semicolon, newline, or closing brace
      s = s.replace(/\bthrow\b\s+([^;\n\}]+)/g, "jw_throw($1)");
      // yield <expr> -> jw_yield(<expr>) (handle both paren and non-paren forms)
      s = s.replace(/\byield\b\s*\(\s*([^)]*?)\s*\)/g, "jw_yield($1)");
      s = s.replace(/\byield\b\s+([^;\n\}]+)/g, "jw_yield($1)");
      return s;
    }

    const pre = preprocessSource(cleaned);
    ast = parseWithAntlr(pre);
    //console.log('AST built (ANTLR)');
    //console.error("DEBUG_AST:\n" + JSON.stringify(ast, null, 2));
    try {
      //fs.writeFileSync("/tmp/pang_ast_debug.json", JSON.stringify(ast, null, 2), "utf8");
    } catch (e) { }
    // Normalize odd array-shaped nodes that sometimes appear from the
    // ANTLR visitor (e.g., [null, expr] representing a return). This
    // ensures downstream passes see a consistent AST shape.
    function normalizeAstArrays(root) {
      function walk(node) {
        if (!node) return;
        if (Array.isArray(node)) {
          for (const n of node) walk(n);
          return;
        }
        if (node.type === "Block" && Array.isArray(node.body)) {
          const newBody = [];
          for (const item of node.body) {
            if (Array.isArray(item)) {
              // special-case pattern [null, expr] -> Return
              if (
                item.length === 2 &&
                (item[0] === null || item[0] === undefined) &&
                item[1] &&
                typeof item[1] === "object"
              ) {
                newBody.push({ type: "Return", value: item[1] });
                continue;
              }
              // otherwise flatten and push non-null entries
              for (const it of item) {
                if (it == null) continue;
                newBody.push(it);
              }
            } else {
              newBody.push(item);
            }
          }
          node.body = newBody;
        }
        // recurse into children
        for (const k of Object.keys(node)) {
          if (node[k] && typeof node[k] === "object") walk(node[k]);
        }
      }
      walk(root);
    }
    try {
      normalizeAstArrays(ast);
      try {
        performStaticTypeAnalysis(ast);
        //fs.writeFileSync("/tmp/pang_ast_debug_normalized.json", JSON.stringify(ast, null, 2), "utf8");
      } catch (e) {
        console.error("Type analysis error:", e && e.message ? e.message : e);
        process.exit(1);
      }
    } catch (e) {
      // non-fatal; continue with original ast
    }
  } catch (e) {
    console.error("Parse/AST error:", (e && e.message) || e);
    if (e && e.stack) console.error(e.stack);
    process.exit(1);
  }

  // Debug: locate any Print statements that contain concat '..' expressions
  function containsConcat(node) {
    if (!node) return false;
    if (node.type === "Binary" && node.op === "..") return true;
    if (node.type === "Binary") return containsConcat(node.left) || containsConcat(node.right);
    if (node.type === "Ternary")
      return containsConcat(node.cond) || containsConcat(node.thenExpr) || containsConcat(node.elseExpr);
    if (node.type === "Unary") return containsConcat(node.operand);
    if (node.type === "Call" && Array.isArray(node.args)) return node.args.some(containsConcat);
    return false;
  }

  // Enforce const immutability: scan AST in source order and error on assignments
  // to variables previously declared with `const`.
  function enforceConstImmutability(rootAst) {
    const consts = new Set();

    function walkStatement(stmt) {
      if (!stmt) return;
      if (Array.isArray(stmt)) {
        for (const s of stmt) walkStatement(s);
        return;
      }
      switch (stmt.type) {
        case "Declare":
          if (stmt.kind === "const") {
            consts.add(stmt.name);
          }
          break;
        case "Assign":
          if (consts.has(stmt.name)) {
            throw new Error(`Cannot reassign to const '${stmt.name}'`);
          }
          break;
        case "If":
          for (const c of stmt.cases) {
            walkExpression(c.cond);
            walkStatement(c.thenBlock && c.thenBlock.body);
          }
          if (stmt.elseBlock) walkStatement(stmt.elseBlock.body);
          break;
        case "For":
          if (stmt.init) {
            // init may be Declare or Assign. Disallow declaring `const` in for-loop header.
            if (stmt.init.type === "Declare" && stmt.init.kind === "const") {
              throw new Error(`Cannot declare const '${stmt.init.name}' in for-loop header`);
            }
            // If init declares a const elsewhere (not in for header), we still track it.
            if (stmt.init.type === "Declare" && stmt.init.kind === "const") {
              consts.add(stmt.init.name);
            }
            walkStatement(stmt.init);
          }
          if (stmt.cond) walkExpression(stmt.cond);
          if (stmt.update) {
            if (stmt.update.type === "Assign" && consts.has(stmt.update.name)) {
              throw new Error(`Cannot reassign to const '${stmt.update.name}'`);
            }
            // update can be an expression or assign; walk accordingly
            if (stmt.update.type === "Assign") walkStatement(stmt.update);
            else walkExpression(stmt.update);
          }
          // body is a Block
          walkStatement(stmt.body && stmt.body.body);
          break;
        case "While":
          if (stmt.cond) walkExpression(stmt.cond);
          walkStatement(stmt.body && stmt.body.body);
          break;
        case "Block":
          for (const s of stmt.body || []) walkStatement(s);
          break;
        case "On":
          if (stmt.body && stmt.body.body) walkStatement(stmt.body.body);
          break;
        default:
          if (stmt.body && Array.isArray(stmt.body)) walkStatement(stmt.body);
          break;
      }
    }

    function walkExpression(expr) {
      if (!expr) return;
      if (Array.isArray(expr)) {
        for (const e of expr) walkExpression(e);
        return;
      }
      switch (expr.type) {
        case "Binary":
          walkExpression(expr.left);
          walkExpression(expr.right);
          break;
        case "Unary":
          walkExpression(expr.operand);
          break;
        case "Ternary":
          walkExpression(expr.cond);
          walkExpression(expr.thenExpr);
          walkExpression(expr.elseExpr);
          break;
        case "Call":
          for (const a of expr.args || []) walkExpression(a);
          break;
        default:
          break;
      }
    }

    for (const node of rootAst) {
      if (node && node.type === "On" && node.body && node.body.body) {
        for (const st of node.body.body) walkStatement(st);
      } else {
        walkStatement(node);
      }
    }
  }

  try {
    enforceConstImmutability(ast);
  } catch (e) {
    console.error("Const assignment error:", e.message);
    process.exit(1);
  }

  // Ensure no statements exist after a `break` within the same block/substack.
  function enforceNoCodeAfterBreak(rootAst) {
    function walkStatements(stmts) {
      if (!stmts || !Array.isArray(stmts)) return;
      for (let i = 0; i < stmts.length; i++) {
        const s = stmts[i];
        if (!s) continue;
        if (s.type === "Break" || s.type === "Continue") {
          if (i < stmts.length - 1)
            throw new Error(`Cannot have code after '${s.type.toLowerCase()}' in the same block`);
        }
        // Recurse into nested blocks where break rules also apply
        if (s.type === "If") {
          for (const c of s.cases) {
            if (c.thenBlock && c.thenBlock.body) walkStatements(c.thenBlock.body);
          }
          if (s.elseBlock && s.elseBlock.body) walkStatements(s.elseBlock.body);
        } else if (s.type === "For" || s.type === "While" || s.type === "Block" || s.type === "On") {
          if (s.body && s.body.body) walkStatements(s.body.body);
        }
      }
    }
    for (const node of rootAst) {
      if (node && node.type === "On" && node.body && node.body.body) walkStatements(node.body.body);
      else if (node && node.type === "Block" && node.body) walkStatements(node.body);
    }
  }

  try {
    enforceNoCodeAfterBreak(ast);
  } catch (e) {
    console.error("Break placement error:", e.message);
    process.exit(1);
  }
  // Track top-level globals so method-local assignments can default to
  // thread scope unless the variable is already a known global.
  const globalNames = new Set();
  function collectGlobalVariables(root) {
    function walk(node, topLevel) {
      if (!node) return;
      if (Array.isArray(node)) {
        for (const n of node) walk(n, topLevel);
        return;
      }
      if (topLevel) {
        if (node.type === "Declare" && node.name) globalNames.add(node.name);
        else if (node.type === "Assign" && node.name) globalNames.add(node.name);
        else if (node.type === "Class" && node.name) globalNames.add(node.name);
      }
      if (node.type === "Class") return;
      if (node.type === "Block" && Array.isArray(node.body)) return walk(node.body, false);
      if (node.type === "On" && node.body && Array.isArray(node.body.body))
        return walk(node.body.body, false);
      if (node.body && Array.isArray(node.body)) return walk(node.body, false);
    }
    walk(root, true);
  }
  collectGlobalVariables(ast);
  globalNames.add("_INTERNAL__runtime_typeof__AABBCCDDEE12123434__");

  // Collect class definitions (name -> method param lists) so constructor
  // argument mapping can be emitted later during nested conversion.
  const classRegistry = {};
  // Map of variables assigned lambda values -> param name lists
  const varToLambda = {};
  let currentMethodParams = null;
  // Pre-register the potential _INTERNAL__runtime_typeof__AABBCCDDEE12123434__ helper as a lambda-valued
  // global. Calls to it (emitted from the Typeof fallback in exprToNested)
  // may happen before we know whether the helper declaration itself will
  // be injected (that decision is only made at the very end of the
  // pipeline). Without this, such calls fall through to being emitted as a
  // raw, nonexistent opcode named "_INTERNAL__runtime_typeof__AABBCCDDEE12123434__" instead of invoking the
  // lambda stored in the global variable of the same name.
  const RUNTIME_TYPEOF_PARAMS = ["v", "isVarName", "type"];
  varToLambda["_INTERNAL__runtime_typeof__AABBCCDDEE12123434__"] = {
    arr: RUNTIME_TYPEOF_PARAMS.map((_, i) => `__arg${i}`),
    map: RUNTIME_TYPEOF_PARAMS.reduce((m, p, i) => {
      m[p] = `__arg${i}`;
      return m;
    }, {}),
    params: RUNTIME_TYPEOF_PARAMS.slice(),
  };
  function getClassMethodKey(className, methodName, kind = "method") {
    if (!className || !methodName) return methodName;
    // Class methods should always use literal names to avoid UID-based
    // selector mismatches across branches and simplify generated class code.
    return methodName;
  }
  // Helpers to access method param/return metadata which may store
  // getter/setter/method variants. Returns arrays or null.
  function getMethodParams(className, methodName, kind = "method") {
    if (!className || !methodName) return null;
    const cls = classRegistry[className];
    if (!cls || !cls.methods) return null;
    const v = cls.methods[methodName];
    if (!v) return null;
    if (Array.isArray(v)) return v;
    if (typeof v === "object") return v[kind] || v.method || v.getter || v.setter || null;
    return null;
  }
  function getMethodReturns(className, methodName, kind = "method") {
    if (!className || !methodName) return null;
    const cls = classRegistry[className];
    if (!cls || !cls.methodReturns) return null;
    const v = cls.methodReturns[methodName];
    if (!v) return null;
    if (Array.isArray(v)) return v;
    if (typeof v === "object") return v[kind] || v.method || v.getter || v.setter || null;
    return null;
  }
  function getMethodReturnOriginals(className, methodName, kind = "method") {
    if (!className || !methodName) return null;
    const cls = classRegistry[className];
    if (!cls || !cls.methodReturnOriginals) return null;
    const v = cls.methodReturnOriginals[methodName];
    if (!v) return null;
    if (Array.isArray(v)) return v;
    if (typeof v === "object") return v[kind] || v.method || v.getter || v.setter || null;
    return null;
  }
  // Helper to query method metadata flags (getter/setter/static)
  function hasMethodFlag(className, methodName, flag) {
    if (!className || !methodName || !flag) return false;
    const cls = classRegistry[className];
    if (!cls || !cls.methodInfo || !cls.methodInfo[methodName]) return false;
    const info = cls.methodInfo[methodName];
    if (flag === "getter") return !!info.getter;
    if (flag === "setter") return !!info.setter;
    if (flag === "static") return !!info.static;
    return false;
  }
  // Helper to choose an argument temp name for method calls.
  // Prefer recorded tagged param names when available; otherwise use a
  // deterministic indexed arg temp so lambda wrappers stay stable and
  // consistent across object-property calls.
  function getArgTempForCall(className, methodName, kind = "method", base = "value", index = 0) {
    if (className && methodName) {
      const params = getMethodParams(className, methodName, kind);
      if (Array.isArray(params) && params.length > index) return params[index];
    }
    return `__arg${index}`;
  }
  // Record lambdas stored as properties of an object literal so that later
  // calls like `obj.fn(a, b)` can set the proper indexed arg temps
  // (`__arg0`, `__arg1`, ...) before invoking the lambda. Keyed by the
  // dotted path `${targetName}.${propKey}`.
  function recordObjectLambdaProps(targetName, objNode) {
    if (!targetName || !objNode || objNode.type !== "Object" || !Array.isArray(objNode.props)) return;
    for (const p of objNode.props) {
      if (!p || !p.value || p.value.type !== "Lambda") continue;
      const key = p.key;
      if (typeof key !== "string") continue;
      const lp = Array.isArray(p.value.params)
        ? p.value.params.slice()
        : p.value.params
          ? [p.value.params]
          : [];
      const arr = lp.map((_, i) => `__arg${i}`);
      const map = {};
      lp.forEach((x, i) => {
        if (x) map[x] = `__arg${i}`;
      });
      varToLambda[`${targetName}.${key}`] = { arr, map, params: lp.slice() };
    }
  }
  // Build the thread-scoped setter blocks that bind each argument to its
  // indexed lambda arg temp (`__arg0`, `__arg1`, ...) before a lambda call.
  // Returns an array of `SPtempVars_setVar` nested blocks.
  function buildLambdaArgSetters(vinfo, args, inMethod, paramMap) {
    const setters = [];
    const hasNamed = vinfo && Array.isArray(vinfo.arr) && vinfo.arr.length > 0;
    const count = hasNamed ? Math.max(vinfo.arr.length, args ? args.length : 0) : args ? args.length : 0;
    for (let i = 0; i < count; i++) {
      const pname = hasNamed ? vinfo.arr[i] : `__arg${i}`;
      const argExpr = args && args[i] ? exprToNested(args[i], inMethod, paramMap) : "";
      setters.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
    }
    return setters;
  }
  // Resolve lambda tracking info for a member-call chain, supporting both
  // top-level object properties (`obj.fn`) and static class members.
  function getMemberLambdaInfo(chain) {
    if (!Array.isArray(chain) || chain.length < 2) return null;
    const first = chain[0];
    if (typeof first !== "string") return null;
    const prop = chain[chain.length - 1];
    const dotted = `${first}.${prop}`;
    if (varToLambda[dotted]) return varToLambda[dotted];
    // also try intermediate chains for nested objects (e.g. a.b.fn)
    for (let i = 1; i < chain.length - 1; i++) {
      const prefix = chain.slice(0, i + 1).join(".");
      const suffix = chain[chain.length - 1];
      const key = `${prefix}.${suffix}`;
      if (varToLambda[key]) return varToLambda[key];
    }
    return null;
  }
  function getClassGlobalRef(className) {
    if (!className) return null;
    if (
      (className === emittingClass && emittingStaticMethod) ||
      (className === emittingClass && emittingClassStaticInit)
    ) {
      return { opcode: "jwClass_self", inputs: [], noPlaceholder: true };
    }
    return { opcode: "SPtempVars_getVar", inputs: ["global", String(className)], noPlaceholder: true };
  }
  function resolveReceiverClass(receiverName, fallbackClass = null, params = null) {
    if (!receiverName) return fallbackClass || null;
    if (receiverName === "this") return fallbackClass || emittingClass || null;
    if (typeof receiverName === "string") {
      if (varToClass[receiverName]) return varToClass[receiverName];
      if (classRegistry[receiverName]) return receiverName;
      if (fallbackClass && Array.isArray(params) && params.includes(receiverName)) return fallbackClass;
      if (emittingClass && Array.isArray(params) && params.includes(receiverName)) return emittingClass;
      if (currentMethodParams && currentMethodParams.includes(receiverName))
        return emittingClass || fallbackClass || null;
    }
    return fallbackClass || null;
  }
  function getClassStaticGet(className, propName) {
    const classRef = getClassGlobalRef(className);
    if (!classRef) return null;
    return { opcode: "jwClass_getStatic", inputs: [propName, classRef] };
  }
  function getClassStaticSet(className, propName, value) {
    const classRef = getClassGlobalRef(className);
    if (!classRef) return null;
    return { opcode: "jwClass_setStatic", inputs: [propName, classRef, value] };
  }
  function isClassStaticReceiverChain(chain) {
    return (
      Array.isArray(chain) &&
      chain.length >= 2 &&
      typeof chain[0] === "string" &&
      chain[0] !== "this" &&
      classRegistry[chain[0]]
    );
  }
  function buildClassStaticReceiver(chain) {
    const className = chain[0];
    const firstProp = chain[1];
    const classRef = getClassGlobalRef(className);
    let receiver = getClassStaticGet(className, firstProp) || makeGet(firstProp, classRef);
    for (let i = 2; i < chain.length - 1; i++) receiver = makeGet(chain[i], receiver);
    return receiver;
  }
  // Build an object/property receiver nested from a chain of names (used by
  // array helper method dispatch). Remaps lambda-parameter receiver names to
  // their tagged thread temps so method calls on lambda arguments resolve to
  // `__arg0` rather than a global variable get.
  function buildMemberChainReceiver(chainItems, inMethod, paramMap) {
    if (!Array.isArray(chainItems) || chainItems.length === 0) return null;
    const first = chainItems[0];
    if (typeof first === "string" && first === "this" && emittingClass && emittingStaticMethod) {
      let receiver = getClassStaticGet(emittingClass, chainItems[1]);
      for (let i = 2; i < chainItems.length; i++) receiver = makeGet(chainItems[i], receiver);
      return receiver;
    }
    if (isClassStaticReceiverChain(chainItems)) return buildClassStaticReceiver(chainItems);
    let receiver = null;
    if (typeof first === "string") {
      receiver =
        first === "this"
          ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true }
          : mapReceiverName(first, paramMap);
    } else if (typeof first === "object") {
      receiver = exprToNested(first, inMethod, paramMap);
    } else {
      receiver = { type: "Var", name: String(first) };
    }
    for (let i = 1; i < chainItems.length; i++) receiver = makeGet(chainItems[i], receiver);
    return receiver;
  }
  function collectClasses(root) {
    function walk(node) {
      if (!node) return;
      if (Array.isArray(node)) {
        for (const n of node) walk(n);
        return;
      }
      if (node.type === "Class") {
        const name = node.name;
        classRegistry[name] = {
          methods: {},
          methodInfo: {},
          methodReturns: {},
          methodReturnOriginals: {},
          instanceReturningMethods: {},
        };
        // Mark that classes are present/used as soon as we discover one.
        usedClasses = true;
        for (const m of node.members || []) {
          // Detect simple static property assignments in the class body such as
          // `MyClass.foo = ...` (these appear as Assign members with a
          // memberChain whose first element is the class name). Record such
          // names so the emitter can later treat them as static properties.
          if (m && m.type === "Assign" && Array.isArray(m.memberChain) && m.memberChain.length >= 2) {
            const base = m.memberChain[0];
            const pname = m.memberChain[1];
            if (base === name) {
              classRegistry[name].staticProps = classRegistry[name].staticProps || {};
              classRegistry[name].staticProps[pname] = true;
              continue;
            }
          }
          // generate tagged param names for this method so call-sites
          // and the method body use the same synthetic thread-var names.
          const origParams = Array.isArray(m.params) ? m.params.slice() : m.params ? [m.params] : [];
          // Use a per-method scope key so all occurrences of the same method
          // parameter share the same uid-prefixed name.
          const tagged = origParams.map((p, i) =>
            p ? __pw_newArgTemp(p, `class:${name}:${m.name}:param:${i}:${p}`) : p,
          );
          // Allow multiple variants (method/getter/setter) to coexist under
          // the same logical name. Store either an array (legacy) or an
          // object with keys `method`, `getter`, `setter` pointing to
          // param lists.
          const existing = classRegistry[name].methods[m.name];
          if (!existing) {
            if (m.getter) classRegistry[name].methods[m.name] = { getter: tagged };
            else if (m.setter) classRegistry[name].methods[m.name] = { setter: tagged };
            else classRegistry[name].methods[m.name] = tagged;
          } else if (Array.isArray(existing)) {
            // convert legacy array into object
            const obj = { method: existing };
            if (m.getter) obj.getter = tagged;
            else if (m.setter) obj.setter = tagged;
            else obj.method = tagged;
            classRegistry[name].methods[m.name] = obj;
          } else if (typeof existing === "object") {
            if (m.getter) existing.getter = tagged;
            else if (m.setter) existing.setter = tagged;
            else existing.method = tagged;
          } else {
            classRegistry[name].methods[m.name] = tagged;
          }
          const methodId = m.getter ? "getter" : m.setter ? "setter" : "method";
          const methodKey = getTaggedArgName(`class:${name}:method:${m.name}:${methodId}`, m.name);
          // store method metadata flags so later emission can handle static/get/set/generator
          classRegistry[name].methodInfo[m.name] = classRegistry[name].methodInfo[m.name] || {
            static: false,
            getter: false,
            setter: false,
            generator: false,
          };
          const info = classRegistry[name].methodInfo[m.name];
          if (m.getter) info.getterKey = methodKey;
          if (m.setter) info.setterKey = methodKey;
          if (!m.getter && !m.setter) info.key = methodKey;
          info.static = info.static || !!m.static;
          info.getter = info.getter || !!m.getter;
          info.setter = info.setter || !!m.setter;
          info.generator = info.generator || !!m.generator;
          // Error if method is marked as both getter and setter
          if (m.getter && m.setter) {
            throw new Error(`Class '${name}': method '${m.name}' cannot be both a getter and a setter`);
          }
          function findReturnedClass(node) {
            if (!node) return null;
            if (Array.isArray(node)) {
              for (const x of node) {
                const value = findReturnedClass(x);
                if (value) return value;
              }
              return null;
            }
            if (node.type === "Return" && node.value && node.value.type === "New") {
              const callee = node.value.callee;
              if (callee && callee.type === "Call" && typeof callee.name === "string") return callee.name;
              if (
                callee &&
                callee.type === "MemberCall" &&
                Array.isArray(callee.chain) &&
                callee.chain.length > 0
              ) {
                return callee.chain[0];
              }
            }
            if (node.body && Array.isArray(node.body)) return findReturnedClass(node.body);
            if (node.body && node.body.body) return findReturnedClass(node.body.body);
            for (const k of Object.keys(node)) {
              if (node[k] && typeof node[k] === "object") {
                const value = findReturnedClass(node[k]);
                if (value) return value;
              }
            }
            return null;
          }
          const returnedClassName = findReturnedClass(m.body);
          if (returnedClassName) {
            classRegistry[name].instanceReturningMethods[m.name] = returnedClassName;
          }

          // Detect if this method returns a lambda at the top level of its body
          let retLambdaParams = null;
          if (m && m.body && Array.isArray(m.body.body)) {
            for (const st of m.body.body) {
              if (st && st.type === "Return" && st.value && st.value.type === "Lambda") {
                const lp = st.value.params;
                if (Array.isArray(lp)) retLambdaParams = lp.slice();
                else if (lp) retLambdaParams = [lp];
                break;
              }
            }
          }
          // Map returned-lambda param names to tagged names as well and store originals
          // Store returned-lambda param metadata similar to methods: allow
          // getter/setter/method variants to coexist.
          const storeReturn = (keyKind) => {
            if (Array.isArray(retLambdaParams) && retLambdaParams.length > 0) {
              return { orig: retLambdaParams.slice(), tagged: retLambdaParams.map((p, i) => "arg" + i) };
            }
            return { orig: retLambdaParams, tagged: retLambdaParams };
          };
          const retInfo = storeReturn();
          const prevOrig = classRegistry[name].methodReturnOriginals[m.name];
          const prevTagged = classRegistry[name].methodReturns[m.name];
          if (!prevOrig && !prevTagged) {
            if (m.getter || m.setter) {
              const objOrig = {};
              const objTagged = {};
              if (m.getter) objOrig.getter = retInfo.orig;
              if (m.getter) objTagged.getter = retInfo.tagged;
              if (m.setter) objOrig.setter = retInfo.orig;
              if (m.setter) objTagged.setter = retInfo.tagged;
              if (m.getter || m.setter) {
                classRegistry[name].methodReturnOriginals[m.name] = objOrig;
                classRegistry[name].methodReturns[m.name] = objTagged;
              } else {
                classRegistry[name].methodReturnOriginals[m.name] = retInfo.orig;
                classRegistry[name].methodReturns[m.name] = retInfo.tagged;
              }
            } else {
              classRegistry[name].methodReturnOriginals[m.name] = retInfo.orig;
              classRegistry[name].methodReturns[m.name] = retInfo.tagged;
            }
          } else {
            // merge into existing object shapes
            if (typeof prevOrig === "object" && !Array.isArray(prevOrig)) {
              if (m.getter) prevOrig.getter = retInfo.orig;
              if (m.setter) prevOrig.setter = retInfo.orig;
              if (!m.getter && !m.setter) prevOrig.method = retInfo.orig;
              classRegistry[name].methodReturnOriginals[m.name] = prevOrig;
            } else if (Array.isArray(prevOrig)) {
              const obj = { method: prevOrig };
              if (m.getter) obj.getter = retInfo.orig;
              if (m.setter) obj.setter = retInfo.orig;
              classRegistry[name].methodReturnOriginals[m.name] = obj;
            }
            if (typeof prevTagged === "object" && !Array.isArray(prevTagged)) {
              if (m.getter) prevTagged.getter = retInfo.tagged;
              if (m.setter) prevTagged.setter = retInfo.tagged;
              if (!m.getter && !m.setter) prevTagged.method = retInfo.tagged;
              classRegistry[name].methodReturns[m.name] = prevTagged;
            } else if (Array.isArray(prevTagged)) {
              const objt = { method: prevTagged };
              if (m.getter) objt.getter = retInfo.tagged;
              if (m.setter) objt.setter = retInfo.tagged;
              classRegistry[name].methodReturns[m.name] = objt;
            }
          }
        }
        return;
      }
      // descend into common container fields
      if (node.type === "Block" && Array.isArray(node.body)) return walk(node.body);
      if (node.type === "On" && node.body && Array.isArray(node.body.body)) return walk(node.body.body);
      if (node.body && Array.isArray(node.body)) return walk(node.body);
    }
    walk(root);
  }
  collectClasses(ast);
  // Map local variables that are assigned `new ClassName(...)` so we can
  // later identify the class of a receiver variable when emitting method calls.
  const varToClass = {};
  // Map thread-temp names (from inline wrappers) to class names so we can
  // resolve getters/setters on temps produced by `New` inline wrappers.
  const tempToClass = {};
  const knownFactoryMethods = ["alloc", "allocUnsafe", "from", "create", "new"];
  function collectVarAssignments(root) {
    function recordAssignedClass(name, valueNode, currentClassName, methodParams) {
      if (!name || !valueNode) return;
      if (valueNode.type === "New") {
        const callee = valueNode.callee;
        if (callee && callee.type === "Call" && typeof callee.name === "string") {
          varToClass[name] = callee.name;
        }
        return;
      }
      if (valueNode.type === "Call") {
        const call = valueNode;
        if (typeof call.receiver === "string" && classRegistry[call.receiver]) {
          if (knownFactoryMethods.includes(call.method)) {
            varToClass[name] = call.receiver;
          }
        }
        return;
      }
      if (valueNode.type === "MemberCall") {
        const call = valueNode;
        if (Array.isArray(call.chain) && call.chain.length >= 2) {
          const receiverName = call.chain[0];
          const methodName = call.chain[call.chain.length - 1];
          const receiverClass = resolveReceiverClass(receiverName, currentClassName, methodParams);
          if (receiverClass) {
            const cls = classRegistry[receiverClass];
            if (cls && cls.instanceReturningMethods && cls.instanceReturningMethods[methodName]) {
              varToClass[name] = cls.instanceReturningMethods[methodName];
            }
          }
          if (
            typeof receiverName === "string" &&
            classRegistry[receiverName] &&
            knownFactoryMethods.includes(methodName)
          ) {
            varToClass[name] = receiverName;
          }
        }
      }
    }

    function walk(node, currentClassName = null, methodParams = null) {
      if (!node) return;
      if (Array.isArray(node)) {
        for (const n of node) walk(n, currentClassName, methodParams);
        return;
      }
      if (node.type === "Declare") {
        recordAssignedClass(node.name, node.value, currentClassName, methodParams);
      }
      // Track variables initialized to lambda expressions so we know their arg names
      if (node.type === "Declare" && node.value && node.value.type === "Lambda") {
        const lp = node.value.params;
        if (Array.isArray(lp)) {
          const arr = lp.map((p, i) => `__arg${i}`);
          const map = {};
          lp.forEach((p, i) => {
            if (p) map[p] = `__arg${i}`;
          });
          varToLambda[node.name] = { arr, map, params: lp.slice() };
        } else if (lp) {
          const tmp = "__arg0";
          varToLambda[node.name] = { arr: [tmp], map: { [lp]: tmp }, params: [lp] };
        } else varToLambda[node.name] = { arr: [], map: {}, params: [] };
      }
      // Track lambdas stored as properties of an object literal so calls like
      // `obj.fn(a, b)` set the correct indexed arg temps before invoking.
      if (node.type === "Declare" && node.value && node.value.type === "Object") {
        recordObjectLambdaProps(node.name, node.value);
      }
      // element, record the lambda param tagging so later `get(var, idx)` can
      // reuse the same arg temp names. Use the first Lambda element found.
      if (node.type === "Declare" && node.value && node.value.type === "Array") {
        const els = Array.isArray(node.value.elements) ? node.value.elements : [];
        for (let ei = 0; ei < els.length; ei++) {
          const el = els[ei];
          if (el && el.type === "Lambda") {
            const lp = el.params;
            if (Array.isArray(lp)) {
              const arr = lp.map((p, i) => `__arg${i}`);
              const map = {};
              lp.forEach((p, i) => {
                if (p) map[p] = `__arg${i}`;
              });
              varToLambda[node.name] = { arr, map, params: lp.slice() };
            } else if (lp) {
              const tmp = "__arg0";
              varToLambda[node.name] = { arr: [tmp], map: { [lp]: tmp }, params: [lp] };
            } else varToLambda[node.name] = { arr: [], map: {}, params: [] };
            break;
          }
        }
      }
      if (node.type === "Assign") {
        recordAssignedClass(node.name, node.value, currentClassName, methodParams);
      }
      if (node.type === "Assign" && node.value && node.value.type === "Lambda") {
        const lp = node.value.params;
        if (Array.isArray(lp)) {
          const arr = lp.map((p, i) => (p ? `__arg${i}` : p));
          const map = {};
          for (let i = 0; i < lp.length; i++) if (lp[i]) map[lp[i]] = arr[i];
          varToLambda[node.name] = { arr, map, params: lp.slice() };
        } else if (lp) {
          const tmp = "__arg0";
          varToLambda[node.name] = { arr: [tmp], map: { [lp]: tmp }, params: [lp] };
        } else varToLambda[node.name] = { arr: [], map: {}, params: [] };
      }
      // Track lambdas stored as properties of an object literal so calls like
      // `obj.fn(a, b)` set the correct indexed arg temps before invoking.
      if (node.type === "Assign" && node.value && node.value.type === "Object") {
        recordObjectLambdaProps(node.name, node.value);
      }
      // Also handle Assign where RHS is an Array containing a Lambda
      if (node.type === "Assign" && node.value && node.value.type === "Array") {
        const els = Array.isArray(node.value.elements) ? node.value.elements : [];
        for (let ei = 0; ei < els.length; ei++) {
          const el = els[ei];
          if (el && el.type === "Lambda") {
            const lp = el.params;
            if (Array.isArray(lp)) {
              const arr = lp.map((p, i) => (p ? `__arg${i}` : p));
              const map = {};
              for (let i = 0; i < lp.length; i++) if (lp[i]) map[lp[i]] = arr[i];
              varToLambda[node.name] = { arr, map, params: lp.slice() };
            } else if (lp) {
              const tmp = "__arg0";
              varToLambda[node.name] = { arr: [tmp], map: { [lp]: tmp }, params: [lp] };
            } else varToLambda[node.name] = { arr: [], map: {}, params: [] };
            break;
          }
        }
      }
      if (node.type === "Class") {
        const nextClassName = node.name;
        for (const child of node.members || []) {
          if (child && child.type === "Method") {
            const nextParams = Array.isArray(child.params) ? child.params.slice() : [];
            walk(child.body, nextClassName, nextParams);
          } else {
            walk(child, nextClassName, methodParams);
          }
        }
        return;
      }
      if (node.type === "Method") {
        const nextParams = Array.isArray(node.params) ? node.params.slice() : [];
        walk(node.body, currentClassName, nextParams);
        return;
      }
      if (node.type === "Block" && Array.isArray(node.body))
        return walk(node.body, currentClassName, methodParams);
      if (node.type === "On" && node.body && Array.isArray(node.body.body))
        return walk(node.body.body, currentClassName, methodParams);
      if (node.body && Array.isArray(node.body)) return walk(node.body, currentClassName, methodParams);
    }
    walk(root);
  }

  // Emitter state referenced (via closures) during the precollection pass
  // below, so it must be initialized before that pass runs to avoid a
  // temporal-dead-zone error when `resolveReceiverClass` reads it.
  let emittingClass = null;
  let emittingStaticMethod = false;
  let emittingClassStaticInit = false;
  let runtimeTypeofHelperUsed = false;

  collectVarAssignments(ast);

  // Map of method-local declared variable names: { "Class:method": Set<name> }
  const methodLocalDecls = {};
  // Current method key while emitting method bodies (used by stmtToNested)
  let currentEmittingMethodKey = null;
  function collectMethodLocalDecls(root) {
    function walk(node) {
      if (!node) return;
      if (Array.isArray(node)) {
        for (const n of node) walk(n);
        return;
      }
      if (node.type === "Class") {
        const cname = node.name;
        for (const m of node.members || []) {
          if (!m || m.type !== "Method") continue;
          const key = `${cname}:${m.name}`;
          methodLocalDecls[key] = new Set();
          function walkMethod(n) {
            if (!n) return;
            if (Array.isArray(n)) {
              for (const x of n) walkMethod(x);
              return;
            }
            if (n.type === "Declare" && n.name) methodLocalDecls[key].add(n.name);
            // for-loop header declares
            if (n.type === "For" && n.init && n.init.type === "Declare" && n.init.name)
              methodLocalDecls[key].add(n.init.name);
            // descend
            if (n.body && Array.isArray(n.body)) walkMethod(n.body);
            if (n.body && n.body.body) walkMethod(n.body.body);
            for (const k of Object.keys(n)) {
              if (n[k] && typeof n[k] === "object") walkMethod(n[k]);
            }
          }
          walkMethod(m.body);
        }
        return;
      }
      if (node.type === "Block" && Array.isArray(node.body)) return walk(node.body);
      if (node.type === "On" && node.body && Array.isArray(node.body.body)) return walk(node.body.body);
      if (node.body && Array.isArray(node.body)) return walk(node.body);
    }
    walk(root);
  }
  collectMethodLocalDecls(ast);

  // Stack of loop-variable names currently in scope. A `for` loop pushes its
  // counter before emitting its body and pops it afterward. Loop counters are
  // always thread-scoped (they live only for the duration of the iteration),
  // so any reference to one resolves to "thread" regardless of top-level/global
  // classification. This keeps `forVar` (which hard-codes "thread" for the
  // counter) consistent with the `getVar`/`setVar` references inside its body.
  const loopVarStack = [];
  // Helper to decide whether a variable name should be emitted as a
  // thread-scoped temp or a global. Preferences:
  // - explicit `thread` kind -> thread
  // - a loop counter currently in scope -> thread
  // - inside a method: params, synthetic `__` names, and any name declared
  //   in the current method -> thread
  // - otherwise, if a known top-level global -> global
  // - fallback: thread inside methods, global at top-level
  function varScopeForName(name, inMethod, paramMap, kind) {
    if (kind === "thread") return "thread";
    if (name && loopVarStack.includes(name)) return "thread";
    if (inMethod) {
      if (name && paramMap && Object.prototype.hasOwnProperty.call(paramMap, name)) return "thread";
      if (name && name.startsWith("__")) return "thread";
      if (
        currentEmittingMethodKey &&
        methodLocalDecls[currentEmittingMethodKey] &&
        methodLocalDecls[currentEmittingMethodKey].has(name)
      )
        return "thread";
      if (name && globalNames.has(name)) return "global";
      return "thread";
    }
    return "global";
  }

  // When emitting class method bodies we set this to the current class
  // name so `this` receiver lookups can be resolved to the proper
  // `classRegistry` entry (ensures `this.add(...)` uses the same
  // tagged param names as external calls like `num.add(...)`).

  function buildRuntimeTypeofHelperDecl() {
    return {
      type: "On",
      event: "flag",
      body: {
        type: 'Block',
        body: [
          {
            type: "Declare",
            name: "_INTERNAL__runtime_typeof__AABBCCDDEE12123434__",
            kind: "let",
            value: {
              type: "Lambda",
              params: ["v", "isVarName", "type"],
              body: {
                type: "Block",
                body: [
                  {
                    type: "Declare",
                    kind: "let",
                    name: "value",
                    value: { type: "Literal", litType: "string", value: "" },
                  },
                  {
                    type: "If",
                    cases: [
                      {
                        cond: { type: "Var", name: "isVarName" },
                        thenBlock: {
                          type: "Block",
                          body: [
                            {
                              type: "If",
                              cases: [
                                {
                                  cond: {
                                    type: "Binary",
                                    op: "==",
                                    left: { type: "Var", name: "type" },
                                    right: { type: "Literal", litType: "string", value: "global" },
                                  },
                                  thenBlock: {
                                    type: "Block",
                                    body: [
                                      {
                                        type: "If",
                                        cases: [
                                          {
                                            cond: {
                                              type: "Unary",
                                              op: "!",
                                              operand: {
                                                type: "Call",
                                                name: "SPtempVars_varExists",
                                                args: [
                                                  { type: "Literal", litType: "string", value: "global" },
                                                  { type: "Var", name: "v" },
                                                ],
                                              },
                                            },
                                            thenBlock: {
                                              type: "Block",
                                              body: [
                                                {
                                                  type: "Return",
                                                  value: {
                                                    type: "Literal",
                                                    litType: "string",
                                                    value: "undefined",
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        elseBlock: null,
                                      },
                                      {
                                        type: "Assign",
                                        name: "value",
                                        value: {
                                          type: "Call",
                                          name: "SPtempVars_getVar",
                                          args: [
                                            { type: "Literal", litType: "string", value: "global" },
                                            { type: "Var", name: "v" },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                              elseBlock: {
                                type: "Block",
                                body: [
                                  {
                                    type: "If",
                                    cases: [
                                      {
                                        cond: {
                                          type: "Unary",
                                          op: "!",
                                          operand: {
                                            type: "Call",
                                            name: "SPtempVars_varExists",
                                            args: [
                                              { type: "Literal", litType: "string", value: "thread" },
                                              { type: "Var", name: "v" },
                                            ],
                                          },
                                        },
                                        thenBlock: {
                                          type: "Block",
                                          body: [
                                            {
                                              type: "Return",
                                              value: { type: "Literal", litType: "string", value: "undefined" },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    elseBlock: null,
                                  },
                                  {
                                    type: "Assign",
                                    name: "value",
                                    value: {
                                      type: "Call",
                                      name: "SPtempVars_getVar",
                                      args: [
                                        { type: "Literal", litType: "string", value: "thread" },
                                        { type: "Var", name: "v" },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                    elseBlock: {
                      type: "Block",
                      body: [
                        {
                          type: "Assign",
                          name: "value",
                          value: { type: "Var", name: "v" },
                        },
                      ],
                    },
                  },
                  {
                    type: "If",
                    cases: [
                      {
                        cond: {
                          type: "Call",
                          name: "dogeiscutObject_is",
                          args: [
                            {
                              type: "Call",
                              name: "operator_stringify",
                              args: [{ type: "Var", name: "value" }],
                            },
                          ],
                        },
                        thenBlock: {
                          type: "Block",
                          body: [
                            {
                              type: "Return",
                              value: { type: "Literal", litType: "string", value: "object" },
                            },
                          ],
                        },
                      },
                    ],
                    elseBlock: {
                      type: "Block",
                      body: [
                        {
                          type: "If",
                          cases: [
                            {
                              cond: {
                                type: "Call",
                                name: "jwArray_validate",
                                args: [
                                  {
                                    type: "Call",
                                    name: "operator_stringify",
                                    args: [{ type: "Var", name: "value" }],
                                  },
                                ],
                              },
                              thenBlock: {
                                type: "Block",
                                body: [
                                  {
                                    type: "Return",
                                    value: { type: "Literal", litType: "string", value: "array" },
                                  },
                                ],
                              },
                            },
                          ],
                          elseBlock: {
                            type: "Block",
                            body: [
                              {
                                type: "If",
                                cases: [
                                  {
                                    cond: {
                                      type: "Call",
                                      name: "sensing_regextest",
                                      args: [
                                        { type: "Var", name: "value" },
                                        {
                                          type: "Literal",
                                          litType: "string",
                                          value: "^[+-]?(?:\\d+\.?\d*|\\.\d+)$",
                                        },
                                        { type: "Literal", litType: "string", value: "g" },
                                      ],
                                    },
                                    thenBlock: {
                                      type: "Block",
                                      body: [
                                        {
                                          type: "Return",
                                          value: { type: "Literal", litType: "string", value: "number" },
                                        },
                                      ],
                                    },
                                  },
                                ],
                                elseBlock: {
                                  type: "Block",
                                  body: [
                                    {
                                      type: "If",
                                      cases: [
                                        {
                                          cond: {
                                            type: "Call",
                                            name: "sensing_regextest",
                                            args: [
                                              { type: "Var", name: "value" },
                                              { type: "Literal", litType: "string", value: "^(?:true|false)$" },
                                              { type: "Literal", litType: "string", value: "g" },
                                            ],
                                          },
                                          thenBlock: {
                                            type: "Block",
                                            body: [
                                              {
                                                type: "Return",
                                                value: { type: "Literal", litType: "string", value: "boolean" },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                      elseBlock: {
                                        type: "Block",
                                        body: [
                                          {
                                            type: "Return",
                                            value: { type: "Literal", litType: "string", value: "string" },
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        ]
      }
    };
  }

  function hasRuntimeTypeofDefinition(astNodes) {
    let found = false;
    function walk(node) {
      if (!node || found) return;
      if (Array.isArray(node)) {
        for (const child of node) walk(child);
        return;
      }
      if (node.type === "Declare" && node.name === "_INTERNAL__runtime_typeof__AABBCCDDEE12123434__") {
        found = true;
        return;
      }
      if (node.type === "Assign" && node.name === "_INTERNAL__runtime_typeof__AABBCCDDEE12123434__") {
        found = true;
        return;
      }
      for (const key of Object.keys(node)) {
        const child = node[key];
        if (child && typeof child === "object") walk(child);
      }
    }
    walk(astNodes);
    return found;
  }

  // Adjust array index for one-indexed arrays:
  // - If index is a numeric literal, add 1 at compile time.
  // - If index is a numeric string, convert and add 1.
  // - Otherwise (expression/variable), emit an `operator_add` reporter to add 1 at runtime.
  function adjustArrayIndex(idxNested, inMethod, paramMap) {
    if (idxNested === "" || idxNested === undefined || idxNested === null) return idxNested;
    if (typeof idxNested === "number") return idxNested + 1;
    if (typeof idxNested === "string" && /^-?\d+(?:\.\d+)?$/.test(idxNested)) return Number(idxNested) + 1;
    // If the index is a simple variable reference produced by exprToNested
    // (e.g., { type: 'Var', name: 'i' }), emit an explicit SPtempVars_getVar
    // with the correct scope so the index expression doesn't rely on
    // generator varInfo ordering.
    if (idxNested && typeof idxNested === "object" && idxNested.type === "Var") {
      const vname = idxNested.name;
      const getterType = varScopeForName(vname, inMethod, paramMap, undefined);
      return {
        opcode: "operator_add",
        inputs: [{ opcode: "SPtempVars_getVar", inputs: [getterType, String(vname)] }, 1],
      };
    }
    return { opcode: "operator_add", inputs: [idxNested, 1] };
  }

  // collapseDoubleLambdaExec removed — flattenMemberCall emits direct
  // chained executes now and should not produce the redundant
  // jwClass_getProp(SPtempVars_getVar(...)) patterns that required
  // post-processing.

  // Convert AST to nested JSON form (canonical representation generator expects)
  function exprToNested(expr, inMethod = false, paramMap = null) {
    if (!expr) return "";
    // Lambda expressions (arrow functions) -> emit jwLambda_newLambda nested block
    if (expr.type === "Lambda") {
      lambdasUsed = true;
      const origParams = Array.isArray(expr.params) ? expr.params.slice() : expr.params ? [expr.params] : [];
      // reuse provided paramMap (from class/var precollection) or allocate fresh tagged names
      let localParamMap = paramMap || null;
      if (!localParamMap) {
        localParamMap = {};
        origParams.forEach((p, i) => {
          if (p) localParamMap[p] = "__arg" + i;
        });
      }
      let lambdaArg;
      if (!origParams || origParams.length === 0)
        lambdaArg = { opcode: "jwLambda_arg", shadow: true, noPlaceholder: true };
      else if (origParams.length === 1) lambdaArg = localParamMap[origParams[0]];
      else lambdaArg = origParams.map((p) => localParamMap[p]);
      let lambdaBody = [];
      if (expr.body && Array.isArray(expr.body.body)) {
        // For parameters with default values, prepend a guard that applies the
        // default when the corresponding arg temp was not supplied by the caller
        // (an unset thread temp reads as an empty string in the runtime).
        const defaultGuards = [];
        const defaults = Array.isArray(expr.paramDefaults) ? expr.paramDefaults : [];
        for (let i = 0; i < origParams.length; i++) {
          const dflt = defaults[i];
          if (dflt == null) continue;
          const paramName = origParams[i];
          // Only apply the default when the supplied arg temp is empty (an
          // unset thread temp reads as "" in the runtime).
          const cond = {
            type: "Binary",
            op: "==",
            left: { type: "Var", name: paramName },
            right: { type: "Literal", litType: "string", value: "" },
          };
          const setDefault = {
            type: "Assign",
            name: paramName,
            value: dflt,
          };
          defaultGuards.push({
            type: "If",
            cases: [{ cond, thenBlock: { type: "Block", body: [setDefault] } }],
          });
        }
        const bodyStmts = defaultGuards.concat(expr.body.body);
        const raw = bodyStmts.map((s) => stmtToNested(s, true, localParamMap)).filter(Boolean);
        lambdaBody = flattenNestedResults(raw);
        assertReturnTerminal(lambdaBody, "lambda body");
      }
      // If the lambda contains `jw_yield` calls (preprocessed from `yield`),
      // convert into a builder-returning lambda (`jwLambda_newLambdaR`) that
      // produces an array of yielded values when invoked. This allows lambdas
      // to be generators at compile time.
      function containsYieldNode(node) {
        if (!node) return false;
        if (Array.isArray(node)) return node.some(containsYieldNode);
        if (typeof node === "object") {
          if ((node.opcode || node.name) === "jw_yield") return true;
          if (Array.isArray(node.inputs)) {
            for (const inp of node.inputs) if (containsYieldNode(inp)) return true;
          }
          if (Array.isArray(node.children))
            for (const c of node.children) if (containsYieldNode(c)) return true;
        }
        return false;
      }

      if (containsYieldNode(lambdaBody)) {
        function replaceYields(node) {
          if (!node) return node;
          if (Array.isArray(node)) return node.map(replaceYields);
          if (typeof node === "object") {
            const op = node.opcode || node.name;
            if (op === "jw_yield") {
              const val = Array.isArray(node.inputs) && node.inputs.length > 0 ? node.inputs[0] : "";
              return { opcode: "jwArray_builderAppend", inputs: [val] };
            }
            const out = Object.assign({}, node);
            if (Array.isArray(out.inputs))
              out.inputs = out.inputs.map((i) =>
                Array.isArray(i) ? i.map(replaceYields) : typeof i === "object" ? replaceYields(i) : i,
              );
            if (Array.isArray(out.children)) out.children = out.children.map(replaceYields);
            return out;
          }
          return node;
        }
        const builderSubstack = lambdaBody.map(replaceYields);
        const builderBlock = {
          opcode: "jwArray_builder",
          inputs: [{ opcode: "jwArray_builderCurrent", shadow: true, noPlaceholder: true }, builderSubstack],
        };
        return { opcode: "jwLambda_newLambdaR", inputs: [lambdaArg, builderBlock] };
      }
      return { opcode: "jwLambda_newLambda", inputs: [lambdaArg, lambdaBody] };
    }
    // Handle postfix ++/-- expressions (e.g., `x++`)
    if (expr.type === "Postfix") {
      const op = expr.op; // '++' or '--'
      const operand = expr.operand;
      const delta = op === "++" ? 1 : -1;
      // Variable case: simple `x++`
      if (operand && operand.type === "Var") {
        const vname = operand.name;
        const destType = varScopeForName(vname, inMethod, paramMap, undefined);
        const getter = { opcode: "SPtempVars_getVar", inputs: [destType, vname] };
        const tmp = __pw_newTemp("__i");
        const setTmp = { opcode: "SPtempVars_setVar", inputs: ["thread", tmp, getter] };
        const newVal = {
          opcode: op === "++" ? "operator_add" : "operator_subtract",
          inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", tmp] }, 1],
        };
        const setter = { opcode: "SPtempVars_setVar", inputs: [destType, vname, newVal] };
        const ret = {
          opcode: "procedures_return",
          inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", tmp] }],
        };
        return { opcode: "control_inline_stack_output", inputs: [[setTmp, setter, ret]] };
      }
      // Member case: obj.prop++
      if (operand && operand.type === "Member") {
        const chain = operand.chain || [];
        if (chain.length >= 2) {
          let objReceiver =
            chain[0] === "this"
              ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true }
              : { type: "Var", name: chain[0] };
          if (chain.length > 2) {
            if (chain[0] === "this" && emittingClass && emittingStaticMethod) {
              objReceiver = getClassStaticGet(emittingClass, chain[1]);
              for (let i = 2; i < chain.length - 1; i++) objReceiver = makeGet(chain[i], objReceiver);
            } else if (isClassStaticReceiverChain(chain)) {
              objReceiver = buildClassStaticReceiver(chain);
            } else {
              for (let i = 1; i < chain.length - 1; i++) objReceiver = makeGet(chain[i], objReceiver);
            }
          } else if (chain[0] === "this" && emittingClass && emittingStaticMethod) {
            objReceiver = getClassStaticGet(emittingClass, chain[1]);
          }
          const propName = chain[chain.length - 1];
          const setup = [];
          let receiverRef = objReceiver;
          // If receiver is a complex expression, stash into a temp
          if (!(receiverRef && (receiverRef.opcode === "jwClass_self" || receiverRef.type === "Var"))) {
            const rtmp = __pw_newTemp("__r");
            setup.push({ opcode: "SPtempVars_setVar", inputs: ["thread", rtmp, receiverRef] });
            receiverRef = { opcode: "SPtempVars_getVar", inputs: ["thread", rtmp] };
          }
          const currentVal =
            chain.length === 2 && chain[0] === "this" && emittingClass && emittingStaticMethod
              ? getClassStaticGet(emittingClass, propName)
              : makeGet(propName, receiverRef);
          const oldTmp = __pw_newTemp("__i");
          setup.push({ opcode: "SPtempVars_setVar", inputs: ["thread", oldTmp, currentVal] });
          const newVal = {
            opcode: op === "++" ? "operator_add" : "operator_subtract",
            inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", oldTmp] }, 1],
          };
          const setter =
            chain.length === 2 && chain[0] === "this" && emittingClass && emittingStaticMethod
              ? getClassStaticSet(emittingClass, propName, newVal)
              : makeSet(propName, receiverRef, newVal);
          const ret = {
            opcode: "procedures_return",
            inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", oldTmp] }],
          };
          return { opcode: "control_inline_stack_output", inputs: [setup.concat([setter, ret])] };
        }
      }
      // Fallback: evaluate operand and return blank if not assignable
      return "";
    }

    if (expr.type === "Literal") return expr.value;

    if (expr.type === "Typeof") {
      const inner = expr.expr;
      // If forceRuntime is true, skip compile-time resolution and always use runtime helper
      if (!expr.forceRuntime) {
        const innerType =
          inner && typeof inner === "object" && inner.inferredType
            ? inner.inferredType
            : inner && typeof inner === "object" && inner.type === "Literal"
              ? inner.litType === "number"
                ? "Number"
                : inner.litType === "string"
                  ? "String"
                  : inner.litType === "boolean"
                    ? "Boolean"
                    : "Any"
              : null;
        const resolved = getTypeofLabel(innerType);
        if (resolved) return resolved;
      }
      runtimeTypeofHelperUsed = true;

      // Variable operand: don't pass its evaluated value — pass its NAME plus
      // isVarName=true plus its scope ("thread"/"global"), so the helper does
      // a live SPtempVars_getVar lookup instead of testing a value snapshot.
      // Reuse exprToNested's own Var resolution (paramMap tagging, scope calc)
      // rather than duplicating that logic here, so the name/scope always
      // matches what a normal read of the same variable would use.
      if (inner && inner.type === "Var") {
        const varNested = exprToNested(inner, inMethod, paramMap);
        const varName = varNested && varNested.name ? varNested.name : inner.name;
        const scope =
          varNested && varNested.scope ? varNested.scope : varScopeForName(inner.name, inMethod, paramMap, undefined);
        return exprToNested(
          {
            type: "Call",
            name: "_INTERNAL__runtime_typeof__AABBCCDDEE12123434__",
            args: [
              { type: "Literal", litType: "string", value: varName },
              { type: "Literal", litType: "boolean", value: true },
              { type: "Literal", litType: "string", value: scope },
            ],
          },
          inMethod,
          paramMap,
        );
      }

      // Non-variable, non-compile-time-resolvable expression: pass the
      // evaluated value directly as v; isVarName/type stay unset (blank),
      // which the helper's isVarName-false branch already handles correctly.
      return exprToNested({
        type: "Call", name: "_INTERNAL__runtime_typeof__AABBCCDDEE12123434__", args: [inner, { type: "Literal", litType: "boolean", value: false },
          { type: "Literal", litType: "string", value: "" },]
      }, inMethod, paramMap);
    }

    // Prefix ++/-- used as unary: `++x` or `--x`
    if (expr.type === "Unary" && (expr.op === "++" || expr.op === "--")) {
      const op = expr.op;
      const delta = op === "++" ? 1 : -1;
      const target = expr.operand;
      // Var case
      if (target && target.type === "Var") {
        const vname = target.name;
        const destType = varScopeForName(vname, inMethod, paramMap, undefined);
        const getter = { opcode: "SPtempVars_getVar", inputs: [destType, vname] };
        const newVal = { opcode: op === "++" ? "operator_add" : "operator_subtract", inputs: [getter, 1] };
        const setter = { opcode: "SPtempVars_setVar", inputs: [destType, vname, newVal] };
        const ret = {
          opcode: "procedures_return",
          inputs: [{ opcode: "SPtempVars_getVar", inputs: [destType, vname] }],
        };
        return { opcode: "control_inline_stack_output", inputs: [[setter, ret]] };
      }
      // Member case
      if (target && target.type === "Member") {
        const chain = target.chain || [];
        if (chain.length >= 2) {
          let objReceiver =
            chain[0] === "this"
              ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true }
              : { type: "Var", name: chain[0] };
          if (chain.length > 2) {
            if (chain[0] === "this" && emittingClass && emittingStaticMethod) {
              objReceiver = getClassStaticGet(emittingClass, chain[1]);
              for (let i = 2; i < chain.length - 1; i++) objReceiver = makeGet(chain[i], objReceiver);
            } else if (isClassStaticReceiverChain(chain)) {
              objReceiver = buildClassStaticReceiver(chain);
            } else {
              for (let i = 1; i < chain.length - 1; i++) objReceiver = makeGet(chain[i], objReceiver);
            }
          } else if (chain[0] === "this" && emittingClass && emittingStaticMethod) {
            objReceiver = getClassStaticGet(emittingClass, chain[1]);
          }
          const propName = chain[chain.length - 1];
          const setup = [];
          let receiverRef = objReceiver;
          if (!(receiverRef && (receiverRef.opcode === "jwClass_self" || receiverRef.type === "Var"))) {
            const rtmp = __pw_newTemp("__r");
            setup.push({ opcode: "SPtempVars_setVar", inputs: ["thread", rtmp, receiverRef] });
            receiverRef = { opcode: "SPtempVars_getVar", inputs: ["thread", rtmp] };
          }
          const oldTmp = __pw_newTemp("__i");
          setup.push({
            opcode: "SPtempVars_setVar",
            inputs: [
              "thread",
              oldTmp,
              chain.length === 2 && chain[0] === "this" && emittingClass && emittingStaticMethod
                ? getClassStaticGet(emittingClass, propName)
                : makeGet(propName, receiverRef),
            ],
          });
          const newTmp = __pw_newTemp("__n");
          setup.push({
            opcode: "SPtempVars_setVar",
            inputs: [
              "thread",
              newTmp,
              {
                opcode: op === "++" ? "operator_add" : "operator_subtract",
                inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", oldTmp] }, 1],
              },
            ],
          });
          const setter =
            chain.length === 2 && chain[0] === "this" && emittingClass && emittingStaticMethod
              ? getClassStaticSet(emittingClass, propName, {
                opcode: "SPtempVars_getVar",
                inputs: ["thread", newTmp],
              })
              : makeSet(propName, receiverRef, { opcode: "SPtempVars_getVar", inputs: ["thread", newTmp] });
          const ret = {
            opcode: "procedures_return",
            inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", newTmp] }],
          };
          return { opcode: "control_inline_stack_output", inputs: [setup.concat([setter, ret])] };
        }
      }
      return "";
    }
    if (expr.type === "Object") {
      objectsUsed = true;
      const items = Array.isArray(expr.props) ? expr.props : [];
      if (blocksMeta && blocksMeta["dogeiscutObject_builder"]) {
        const substack = [];
        for (const p of items) {
          if (!p) continue;
          const keyNode = p.key !== undefined && p.key !== null ? p.key : "";
          const keyExpr =
            p.computed && p.computedExpr
              ? p.computedExpr
              : p.key && typeof p.key === "object" && p.key.type
                ? p.key
                : null;
          const keyVal =
            typeof keyNode === "string"
              ? String(keyNode)
              : keyExpr
                ? exprToNested(keyExpr, inMethod, paramMap)
                : keyNode;
          if (!p.value) {
            const appendBlk = {
              opcode: "dogeiscutObject_builderAppendEmpty",
              inputs: [keyVal],
            };
            if (p && p.shadow !== undefined) appendBlk.shadow = !!p.shadow;
            if (p && p.noPlaceholder !== undefined) appendBlk.noPlaceholder = !!p.noPlaceholder;
            substack.push(appendBlk);
            continue;
          }
          const valRes = exprToNested(p.value, inMethod, paramMap);
          const val = valRes && typeof valRes === "object" && valRes.type === "lit" ? valRes.value : valRes;
          const appendBlk = {
            opcode: "dogeiscutObject_builderAppend",
            inputs: [keyVal, val],
          };
          if (p && p.shadow !== undefined) appendBlk.shadow = !!p.shadow;
          if (p && p.noPlaceholder !== undefined) appendBlk.noPlaceholder = !!p.noPlaceholder;
          substack.push(appendBlk);
        }
        const builder = {
          opcode: "dogeiscutObject_builder",
          inputs: [{ opcode: "dogeiscutObject_currentObject", shadow: true, noPlaceholder: true }, substack],
        };
        if (expr && expr.shadow !== undefined) builder.shadow = !!expr.shadow;
        if (expr && expr.noPlaceholder !== undefined) builder.noPlaceholder = !!expr.noPlaceholder;
        return builder;
      }
      const obj = {};
      for (const p of items) {
        if (!p) continue;
        const keyNode = p.key !== undefined ? p.key : "";
        const keyExpr =
          p.computed && p.computedExpr
            ? p.computedExpr
            : p.key && typeof p.key === "object" && p.key.type
              ? p.key
              : null;
        const key =
          typeof keyNode === "string"
            ? keyNode
            : keyExpr
              ? exprToNested(keyExpr, inMethod, paramMap)
              : keyNode;
        const valRes = p.value ? exprToNested(p.value, inMethod, paramMap) : null;
        obj[key] = valRes && typeof valRes === "object" && valRes.type === "lit" ? valRes.value : valRes;
      }
      return obj;
    }
    if (expr.type === "Array") {
      arraysUsed = true;
      // Convert array AST into a jwArray_builder pseudocode block where the
      // second input is a single substack array of jwArray_builderAppend blocks.
      const els = Array.isArray(expr.elements) ? expr.elements : [];
      const substack = els.map((e) => {
        return { opcode: "jwArray_builderAppend", inputs: [exprToNested(e, inMethod, paramMap)] };
      });
      const builder = {
        opcode: "jwArray_builder",
        inputs: [{ opcode: "jwArray_builderCurrent", shadow: true, noPlaceholder: true }, substack],
      };
      if (expr && expr.shadow !== undefined) builder.shadow = !!expr.shadow;
      if (expr && expr.noPlaceholder !== undefined) builder.noPlaceholder = !!expr.noPlaceholder;
      return builder;
    }
    if (expr.type === "Var") {
      // If this variable name shadows a param in current paramMap, emit the tagged name
      if (paramMap && expr.name && Object.prototype.hasOwnProperty.call(paramMap, expr.name))
        return { type: "Var", name: paramMap[expr.name], scope: "thread" };
      const scope = varScopeForName(expr.name, inMethod, paramMap, undefined);
      return { type: "Var", name: expr.name, scope };
    }
    if (expr.type === "This") return { opcode: "jwClass_self", inputs: [] };
    if (expr.type === "Index") {
      // Square-bracket array access: map to `jwArray_get` (1-based index).
      const arrNested = exprToNested(expr.receiver, inMethod, paramMap);
      const rawIdx = exprToNested(expr.index, inMethod, paramMap);
      const idxArg = adjustArrayIndex(rawIdx, inMethod, paramMap);
      return { opcode: "jwArray_get", inputs: [{ ...arrNested, noPlaceholder: true }, idxArg] };
    }
    if (expr.type === "Member" || expr.type === "MemberExpr") {
      const chain = expr.chain || [];
      if (chain.length < 1) return "";
      // If the receiver is itself an expression (e.g., a chained call AST),
      // we need to support property access on the result of that expression,
      // including when the receiver expression emitted an inline wrapper
      // (control_inline_stack_output) that stored the object in a temp and
      // returned it via `procedures_return`.
      if (typeof chain[0] === "object") {
        // Build nested representation for the receiver expression
        const recvExpr = chain[0];
        const recvNested = exprToNested(recvExpr, inMethod, paramMap);
        const props = chain.slice(1);
        if (!props || props.length === 0) return recvNested;

        // If recvNested is an inline wrapper we can splice the property
        // access into its final `procedures_return` so the wrapper still
        // executes the calls but returns the requested property value.
        if (
          recvNested &&
          recvNested.opcode === "control_inline_stack_output" &&
          Array.isArray(recvNested.inputs) &&
          Array.isArray(recvNested.inputs[0])
        ) {
          const inlineChildren = recvNested.inputs[0];
          // find the final procedures_return entry
          for (let i = inlineChildren.length - 1; i >= 0; i--) {
            const node = inlineChildren[i];
            if (node && node.opcode === "procedures_return") {
              const retVal = node.inputs && node.inputs[0];
              // If return value is a thread temp getter, attach property access
              if (
                retVal &&
                retVal.opcode === "SPtempVars_getVar" &&
                Array.isArray(retVal.inputs) &&
                retVal.inputs[0] === "thread"
              ) {
                let receiverRef = retVal; // SPtempVars_getVar ['thread', temp]
                // Try to resolve temp->class so we can detect accessor methods
                const tmpName = Array.isArray(retVal.inputs) ? retVal.inputs[1] : null;
                const cls = tmpName && tempToClass[tmpName] ? tempToClass[tmpName] : null;
                // Debug: log temp -> class resolution
                if (tmpName) console.error("[emit] inline tempToClass", tmpName, "=>", cls);
                // compose accessor/call if first prop is a getter on the class
                const firstProp = props && props.length > 0 ? props[0] : null;
                if (cls && firstProp && hasMethodFlag(cls, firstProp, "getter")) {
                  // call the getter and then apply any further property accesses

                  const methodKey = getClassMethodKey(cls, firstProp, "getter");
                  const methodGetter =
                    cls && hasMethodFlag(cls, firstProp, "static")
                      ? getClassStaticGet(cls, methodKey)
                      : makeGet(methodKey, receiverRef);
                  let base = { opcode: "jwLambda_executeR", inputs: [methodGetter, ""] };
                  for (let pi = 1; pi < props.length; pi++) base = makeGet(props[pi], base);
                  inlineChildren[i] = { opcode: "procedures_return", inputs: [base] };
                  return { opcode: "control_inline_stack_output", inputs: [inlineChildren] };
                }
                // Fallback: compose property-get chain; if we resolved a class
                // use static get for the first property.
                let propGet = null;
                for (let pi = 0; pi < props.length; pi++) {
                  const pname = props[pi];
                  if (pi === 0) {
                    const useStatic =
                      cls &&
                      (hasMethodFlag(cls, pname, "static") ||
                        (classRegistry[cls] &&
                          classRegistry[cls].staticProps &&
                          classRegistry[cls].staticProps[pname]));
                    propGet = useStatic ? getClassStaticGet(cls, pname) : makeGet(pname, receiverRef);
                  } else propGet = makeGet(pname, propGet);
                }
                // replace the procedures_return value with property getter
                inlineChildren[i] = { opcode: "procedures_return", inputs: [propGet] };
                return { opcode: "control_inline_stack_output", inputs: [inlineChildren] };
              }
              // If return value is not a temp getter, fallback to wrapping the return value
              // with property getters by producing a new procedures_return that
              // applies jwClass_getProp to the result expression.
              let receiverRefAlt = node.inputs && node.inputs[0] ? node.inputs[0] : null;
              // Try to resolve accessor on known class receiver
              let resolvedClass = null;
              if (
                receiverRefAlt &&
                receiverRefAlt.opcode === "SPtempVars_getVar" &&
                Array.isArray(receiverRefAlt.inputs) &&
                receiverRefAlt.inputs[0] === "thread"
              ) {
                const tmp = receiverRefAlt.inputs[1];
                if (tmp && tempToClass[tmp]) resolvedClass = tempToClass[tmp];
              } else if (receiverRefAlt && receiverRefAlt.opcode === "jwClass_self") {
                if (emittingClass) resolvedClass = emittingClass;
              } else if (receiverRefAlt && receiverRefAlt.type === "Var") {
                const v = receiverRefAlt.name;
                if (varToClass[v]) resolvedClass = varToClass[v];
                else if (classRegistry[v]) resolvedClass = v;
              }
              if (resolvedClass && props.length > 0 && hasMethodFlag(resolvedClass, props[0], "getter")) {
                const methodKey = getClassMethodKey(resolvedClass, props[0], "getter");
                const methodGetter =
                  resolvedClass && hasMethodFlag(resolvedClass, props[0], "static")
                    ? getClassStaticGet(resolvedClass, methodKey)
                    : makeGet(methodKey, receiverRefAlt);
                let base = { opcode: "jwLambda_executeR", inputs: [methodGetter, ""] };
                for (let pi = 1; pi < props.length; pi++) base = makeGet(props[pi], base);
                inlineChildren[i] = { opcode: "procedures_return", inputs: [base] };
                return { opcode: "control_inline_stack_output", inputs: [inlineChildren] };
              }
              let propGetAlt = null;
              for (let pi = 0; pi < props.length; pi++) {
                const pname = props[pi];
                if (pi === 0) {
                  const useStaticAlt =
                    resolvedClass &&
                    (hasMethodFlag(resolvedClass, pname, "static") ||
                      (classRegistry[resolvedClass] &&
                        classRegistry[resolvedClass].staticProps &&
                        classRegistry[resolvedClass].staticProps[pname]));
                  propGetAlt = useStaticAlt
                    ? getClassStaticGet(resolvedClass, pname)
                    : makeGet(pname, receiverRefAlt);
                } else propGetAlt = makeGet(pname, propGetAlt);
              }
              inlineChildren[i] = { opcode: "procedures_return", inputs: [propGetAlt] };
              return { opcode: "control_inline_stack_output", inputs: [inlineChildren] };
            }
          }
        }

        // Otherwise, recvNested is a reporter or nested value; just chain property gets
        let receiverRef = recvNested;
        for (let i = 0; i < props.length; i++) {
          const prop = props[i];
          receiverRef = makeGet(prop, receiverRef);
        }
        return receiverRef;
      }
      // Build nested receiver (object) stopping before the final property
      let objReceiver =
        typeof chain[0] === "string" && chain[0] === "this"
          ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true }
          : mapReceiverName(chain[0], paramMap);
      if (chain.length > 2) {
        // If the base is a static `this` inside a static class method, treat it
        // like a class name receiver and emit static property access.
        if (chain[0] === "this" && emittingClass && emittingStaticMethod) {
          const classNameBase = emittingClass;
          const firstProp = chain[1];
          let result = null;
          if (firstProp && hasMethodFlag(classNameBase, firstProp, "getter")) {
            const methodKeyBase = getClassMethodKey(classNameBase, firstProp, "getter");
            const methodGetter = getClassStaticGet(classNameBase, methodKeyBase);
            const call = { opcode: "jwLambda_executeR", inputs: [methodGetter, ""] };
            result = call;
            for (let i = 2; i < chain.length; i++) {
              const prop = chain[i];
              result = makeGet(prop, result);
            }
          } else {
            result = getClassStaticGet(classNameBase, firstProp);
            for (let i = 2; i < chain.length; i++) {
              const prop = chain[i];
              result = makeGet(prop, result);
            }
          }
          const retNode = { opcode: "procedures_return", inputs: [result] };
          return { opcode: "control_inline_stack_output", inputs: [[retNode]] };
        }

        // If the base is a class name (static access), treat the first
        // property as a static lookup and then continue with any remaining
        // property chain via ordinary property access.
        if (isClassStaticReceiverChain(chain)) {
          objReceiver = buildClassStaticReceiver(chain);
        }
        return objReceiver;
      }
      if (chain.length === 2) {
        const propName = chain[1];
        // Try to detect the receiver's class so we can handle getters
        let receiverClass = null;
        if (typeof chain[0] === "string") {
          receiverClass = resolveReceiverClass(chain[0], emittingClass, currentMethodParams);
        } else if (objReceiver && objReceiver.opcode === "jwClass_self" && emittingClass) {
          receiverClass = emittingClass;
        }
        if (receiverClass && hasMethodFlag(receiverClass, propName, "getter")) {
          // Emit a call to the getter method and return its value.
          // If this is a static getter on a class name or inside a static method,
          // call it via jwClass_getStatic.
          const useStaticGetter =
            (typeof chain[0] === "string" &&
              chain[0] !== "this" &&
              classRegistry[chain[0]] &&
              hasMethodFlag(receiverClass, propName, "static")) ||
            (chain[0] === "this" &&
              emittingClass &&
              emittingStaticMethod &&
              hasMethodFlag(receiverClass, propName, "static"));
          const methodKey = getClassMethodKey(receiverClass, propName, "getter");
          const methodGetter = useStaticGetter
            ? getClassStaticGet(receiverClass, methodKey)
            : makeGet(methodKey, objReceiver);
          return { opcode: "jwLambda_executeR", inputs: [methodGetter, ""] };
        }
        // If accessing a static property on a class name, use jwClass_getStatic.
        if (chain[0] === "this" && emittingClass && emittingStaticMethod) {
          const propGet = getClassStaticGet(emittingClass, propName);
          const retNode2 = { opcode: "procedures_return", inputs: [propGet] };
          return { opcode: "control_inline_stack_output", inputs: [[retNode2]] };
        }
        if (typeof chain[0] === "string" && chain[0] !== "this" && classRegistry[chain[0]]) {
          const classNameBase = chain[0];
          const useStaticBase =
            hasMethodFlag(classNameBase, propName, "static") ||
            (classRegistry[classNameBase] &&
              classRegistry[classNameBase].staticProps &&
              classRegistry[classNameBase].staticProps[propName]);
          if (useStaticBase) {
            const propGet = getClassStaticGet(classNameBase, propName);
            const retNode2 = { opcode: "procedures_return", inputs: [propGet] };
            return { opcode: "control_inline_stack_output", inputs: [[retNode2]] };
          }
        }
        return makeGet(propName, objReceiver);
      }
      return objReceiver;
    }
    if (expr.type === "MemberCall") {
      const chain = expr.chain || [];
      if (chain.length < 2) return "";
      // Receiver may be a simple name or an expression (from a previous call).
      // IMPORTANT: do NOT pre-evaluate object receivers here. If the
      // receiver is an embedded Call/MemberCall AST we must let
      // `flattenMemberCall` emit the steps to avoid double-wrapping
      // (previous code called `exprToNested` too early and produced
      // nested `control_inline_stack_output` wrappers).
      let objReceiver = null;
      const first = chain[0];
      if (typeof first === "string") {
        objReceiver =
          first === "this"
            ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true }
            : mapReceiverName(first, paramMap);
      } else {
        // do not call exprToNested(first) when `first` is an object;
        // flattenMemberCall will handle emitting the necessary steps.
        objReceiver = null;
      }
      // Build getters for any intermediate property names
      if (chain.length > 2) {
        if (chain[0] === "this" && emittingClass && emittingStaticMethod) {
          objReceiver = getClassStaticGet(emittingClass, chain[1]);
          for (let i = 2; i < chain.length - 1; i++) {
            const prop = chain[i];
            objReceiver = makeGet(prop, objReceiver);
          }
        } else if (isClassStaticReceiverChain(chain)) {
          objReceiver = buildClassStaticReceiver(chain);
        } else {
          for (let i = 1; i < chain.length - 1; i++) {
            const prop = chain[i];
            objReceiver = makeGet(prop, objReceiver);
          }
        }
      }
      const methodName = chain[chain.length - 1];
      const arrayHelperMethods = new Set([
        "push",
        "append",
        "get",
        "set",
        "concat",
        "join",
        "sum",
        "length",
        "splice",
      ]);
      if (arrayHelperMethods.has(methodName)) {
        const readChain = chain.slice(0, chain.length - 1);
        const arrayExpr = buildMemberChainReceiver(readChain, inMethod, paramMap);
        if (arrayExpr) {
          switch (methodName) {
            case "push":
            case "append": {
              const valArg = expr.args && expr.args[0] ? exprToNested(expr.args[0], inMethod, paramMap) : "";
              return { opcode: "jwArray_append", inputs: [{ ...arrayExpr, noPlaceholder: true }, valArg] };
            }
            case "set": {
              const rawIdxArg =
                expr.args && expr.args[0] ? exprToNested(expr.args[0], inMethod, paramMap) : "";
              const idxArg = adjustArrayIndex(rawIdxArg, inMethod, paramMap);
              const valArg = expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, paramMap) : "";
              return {
                opcode: "jwArray_set",
                inputs: [{ ...arrayExpr, noPlaceholder: true }, idxArg, valArg],
              };
            }
            case "get": {
              const rawIdxArg =
                expr.args && expr.args[0] ? exprToNested(expr.args[0], inMethod, paramMap) : "";
              const idxArg = adjustArrayIndex(rawIdxArg, inMethod, paramMap);
              return { opcode: "jwArray_get", inputs: [{ ...arrayExpr, noPlaceholder: true }, idxArg] };
            }
            case "sum":
              return { opcode: "jwArray_sum", inputs: [{ ...arrayExpr, noPlaceholder: true }] };
            case "length":
              return { opcode: "jwArray_length", inputs: [{ ...arrayExpr, noPlaceholder: true }] };
            case "concat": {
              const a2 = expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, paramMap) : "";
              return {
                opcode: "jwArray_concat",
                inputs: [
                  { ...arrayExpr, noPlaceholder: true },
                  { ...a2, noPlaceholder: true },
                ],
              };
            }
            case "join": {
              const div = expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, paramMap) : "";
              return { opcode: "jwArray_join", inputs: [{ ...arrayExpr, noPlaceholder: true }, div] };
            }
            case "splice": {
              const rawIdxArg =
                expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, paramMap) : "";
              const idxArg = adjustArrayIndex(rawIdxArg, inMethod, paramMap);
              const itemsArg =
                expr.args && expr.args[2] ? exprToNested(expr.args[2], inMethod, paramMap) : "";
              return {
                opcode: "jwArray_splice",
                inputs: [{ ...arrayExpr, noPlaceholder: true }, idxArg, itemsArg],
              };
            }
          }
        }
      }
      // Resolve the receiver's class for proper method key mapping
      let receiverClass = null;
      if (typeof chain[0] === "string") {
        receiverClass = resolveReceiverClass(chain[0], emittingClass, currentMethodParams);
      }
      const methodKey = receiverClass ? getClassMethodKey(receiverClass, methodName) : methodName;
      const methodGetter = makeGet(methodKey, objReceiver);

      // If this MemberCall represents a chain (previous call ASTs embedded)
      // flatten it into ordered steps and emit an inline wrapper that:
      //  - sets thread-scoped temp vars for each call result
      //  - sets named thread args before each call (when param names known)
      //  - updates the temp with the call result repeatedly
      //  - finally returns the last temp via `procedures_return`
      function flattenMemberCall(node) {
        const steps = [];
        let baseClassName = null;
        function helper(n) {
          if (!n) return;
          // If this is a raw Call AST (e.g. `get(test, 0)`) represent it
          // as an explicit call-step so later emission can treat built-in
          // array helpers (`get`, `set`, etc.) directly instead of
          // pre-evaluating the nested node.
          if (n.type === "Call" && typeof n.name === "string") {
            steps.push({ callName: n.name, args: n.args || [] });
            return;
          }
          const ch = n.chain || [];
          const first = ch[0];
          if (typeof first === "object") {
            // previous call AST - recurse then append this method
            helper(first);
            const method = ch[ch.length - 1];
            steps.push({ methodName: method, args: n.args || [] });
            return;
          }
          // base case: a string-based chain like ['obj','prop','method']
          const method = ch[ch.length - 1];
          const receiverChain = ch.slice(0, Math.max(0, ch.length - 1));
          if (receiverChain.length > 0 && typeof receiverChain[0] === "string") {
            const resolved = resolveReceiverClass(receiverChain[0], emittingClass, currentMethodParams);
            if (resolved) baseClassName = resolved;
          }
          steps.push({ receiverChain, methodName: method, args: n.args || [] });
        }
        helper(node);
        return { steps, baseClassName };
      }

      const flat = flattenMemberCall(expr);
      const steps = flat.steps || [];
      const baseClassName = flat.baseClassName || null;

      // If only a single step, fall back to previous behavior (no multi-temp wrapper)
      if (steps.length <= 1) {
        // attempt to detect method params from varToClass/classRegistry
        let className = null;
        if (typeof chain[0] === "string") {
          className = resolveReceiverClass(chain[0], emittingClass, currentMethodParams);
        } else if (baseClassName) {
          className = baseClassName;
        }
        const actualMethodName = className ? getClassMethodKey(className, methodName) : methodName;
        const methodParams = className ? getMethodParams(className, methodName) : null;
        // detect static methods on the class
        const isStaticCall = className && hasMethodFlag(className, methodName, "static");
        if (actualMethodName !== methodName) {
          methodGetter.inputs[0] = actualMethodName;
        }
        let staticReceiverRef = null;
        if (isStaticCall) {
          staticReceiverRef = getClassGlobalRef(className);
        }
        if (Array.isArray(methodParams) && methodParams.length > 0) {
          const setters = [];
          let receiverRef = objReceiver;
          if (isStaticCall) {
            receiverRef = staticReceiverRef;
          } else if (!(objReceiver && objReceiver.opcode === "jwClass_self")) {
            const receiverTempName = __pw_newTemp("__m");
            const setTemp = {
              opcode: "SPtempVars_setVar",
              inputs: ["thread", receiverTempName, objReceiver],
            };
            setters.push(setTemp);
            receiverRef = { opcode: "SPtempVars_getVar", inputs: ["thread", receiverTempName] };
          }
          for (let i = 0; i < methodParams.length; i++) {
            const pname = methodParams[i];
            const argExpr = expr.args && expr.args[i] ? exprToNested(expr.args[i], inMethod, paramMap) : "";
            setters.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
          }
          const boundMethodGetter = isStaticCall
            ? getClassStaticGet(className, actualMethodName)
            : makeGet(actualMethodName, receiverRef);
          const callMethod = { opcode: "jwLambda_executeR", inputs: [boundMethodGetter, ""] };
          const ret = { opcode: "procedures_return", inputs: [callMethod] };
          const inlineChildren = [].concat(setters, [ret]);
          return { opcode: "control_inline_stack_output", inputs: [inlineChildren] };
        }
        // Lambda stored as an object property (e.g. `obj.fn(a, b)`): set the
        // indexed arg temps for every argument, then execute the lambda.
        const memberLambdaInfo = getMemberLambdaInfo(chain);
        if (memberLambdaInfo) {
          const setters = buildLambdaArgSetters(memberLambdaInfo, expr.args, inMethod, paramMap);
          const callMethod = { opcode: "jwLambda_executeR", inputs: [methodGetter, ""] };
          const ret = { opcode: "procedures_return", inputs: [callMethod] };
          const inlineChildren = [].concat(setters, [ret]);
          return { opcode: "control_inline_stack_output", inputs: [inlineChildren] };
        }
        // fallback: single-step — set thread var for positional arg then return result
        const argNested =
          expr.args && expr.args.length > 0 ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        if (argNested !== "") {
          // Prefer a tagged param name when available so calls like
          // `this.add(...)` reuse the same arg id as the method
          // declaration. Fall back to a synthetic arg temp otherwise.
          let argTempName = null;
          if (Array.isArray(methodParams) && methodParams.length > 0) argTempName = methodParams[0];
          else {
            const paramsArr = className ? getMethodParams(className, methodName) : null;
            if (Array.isArray(paramsArr) && paramsArr.length > 0) argTempName = paramsArr[0];
            else argTempName = getArgTempForCall(className, methodName);
          }
          const setters2 = [{ opcode: "SPtempVars_setVar", inputs: ["thread", argTempName, argNested] }];
          const callMethod2 = {
            opcode: "jwLambda_executeR",
            inputs: [isStaticCall ? getClassStaticGet(className, actualMethodName) : methodGetter, ""],
          };
          const ret2 = { opcode: "procedures_return", inputs: [callMethod2] };
          const inlineChildren2 = [].concat(setters2, [ret2]);
          return { opcode: "control_inline_stack_output", inputs: [inlineChildren2] };
        }
        if (isStaticCall) {
          const call = {
            opcode: "jwLambda_executeR",
            inputs: [getClassStaticGet(className, actualMethodName), ""],
          };
          const retFinal = { opcode: "procedures_return", inputs: [call] };
          return { opcode: "control_inline_stack_output", inputs: [[retFinal]] };
        }
        return { opcode: "jwLambda_executeR", inputs: [methodGetter, ""] };
      }

      // Multi-step chain: create temps for each intermediate call result
      const inlineChildren = [];
      let prevTemp = null;
      // track arg names for a lambda returned by the previous call (if known)
      let prevReturnedLambdaArgs = null;
      // remember the last seen method name so we can recover chained calls
      // where the AST emitted a `null` method slot for the subsequent call
      // (e.g., num.add(5).add(6) sometimes appears as inner/outer nodes
      // with a null method on the outer node). Use this only when the
      // previous call did not return a lambda (i.e., it's an object).
      let prevStepMethodName = null;
      for (let si = 0; si < steps.length; si++) {
        const step = steps[si];
        // Handle explicit call-steps (emitted from Call ASTs inside a chain)
        if (step.callName) {
          const cname = step.callName;
          // Handle array 'get' as a builtin that returns a function/value
          if (cname === "get") {
            arraysUsed = true;
            const arrArg = step.args && step.args[0] ? exprToNested(step.args[0], inMethod, paramMap) : "";
            const rawIdx = step.args && step.args[1] ? exprToNested(step.args[1], inMethod, paramMap) : "";
            const idxArg = adjustArrayIndex(rawIdx, inMethod, paramMap);
            const callExpr = { opcode: "jwArray_get", inputs: [{ ...arrArg, noPlaceholder: true }, idxArg] };
            const tempName = __pw_newTemp("__c");
            // Store the jwArray_get reporter into a thread temp. Do NOT
            // immediately execute it; execute only when a subsequent Call
            // step invokes the returned function.
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callExpr] });
            prevTemp = tempName;
            // If we are getting a function stored in a known var, reuse its
            // recorded lambda arg names so subsequent calls use the same
            // arg temp identifiers (avoids synthetic arg names).
            if (arrArg && typeof arrArg === "object" && arrArg.type === "Var" && varToLambda[arrArg.name]) {
              const vinfo = varToLambda[arrArg.name];
              if (Array.isArray(vinfo)) prevReturnedLambdaArgs = vinfo.slice();
              else if (vinfo && Array.isArray(vinfo.arr)) prevReturnedLambdaArgs = vinfo.arr.slice();
              else prevReturnedLambdaArgs = null;
            } else {
              prevReturnedLambdaArgs = null;
            }
            prevStepMethodName = null;
            continue;
          }

          // Generic fallback for other call names: evaluate arguments and
          // execute the returned value, storing into a temp. Special-case
          // when the call name actually refers to a variable holding a
          // lambda so we don't emit a raw opcode named after the var.
          const argsArr = (step.args || []).map((a) =>
            a === undefined ? "" : exprToNested(a, inMethod, paramMap),
          );
          if (typeof cname === "string" && varToLambda && varToLambda[cname]) {
            const vinfo = varToLambda[cname];
            const getterType = varScopeForName(cname, inMethod, paramMap, undefined);
            const lambdaGetter = { opcode: "SPtempVars_getVar", inputs: [getterType, String(cname)] };
            // If we have recorded tagged arg names, set them before executing
            if (vinfo && Array.isArray(vinfo.arr) && vinfo.arr.length > 0) {
              for (let i = 0; i < vinfo.arr.length; i++) {
                const pname = vinfo.arr[i];
                const argExpr =
                  step.args && step.args[i] ? exprToNested(step.args[i], inMethod, paramMap) : "";
                inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
              }
              const callReporter = { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
              const tempName = __pw_newTemp("__c");
              inlineChildren.push({
                opcode: "SPtempVars_setVar",
                inputs: ["thread", tempName, callReporter],
              });
              prevTemp = tempName;
              prevReturnedLambdaArgs = null;
              prevStepMethodName = null;
              continue;
            }
            // Fallback: single-positional-arg synthetic temp
            const argPos =
              step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
            if (argPos !== "") {
              const at = getArgTempForCall(null, cname);
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", at, argPos] });
            }
            const callReporter = { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
            const tempName = __pw_newTemp("__c");
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] });
            prevTemp = tempName;
            prevReturnedLambdaArgs = null;
            prevStepMethodName = null;
            continue;
          }
          const callExpr = { opcode: cname, inputs: argsArr };
          const callReporter = { opcode: "jwLambda_executeR", inputs: [callExpr, ""] };
          const tempName = __pw_newTemp("__c");
          inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] });
          prevTemp = tempName;
          prevReturnedLambdaArgs = null;
          prevStepMethodName = null;
          continue;
        }
        // determine receiverRef: for first step use receiverChain -> build nested receiver
        let receiverRef = null;
        if (si === 0) {
          const recvChain = step.receiverChain || [];
          if (recvChain.length === 0) receiverRef = objReceiver;
          else {
            // build nested receiver from recvChain
            let r;
            if (recvChain[0] === "this") {
              if (emittingClass && emittingStaticMethod && recvChain.length > 1) {
                r = getClassStaticGet(emittingClass, recvChain[1]);
                for (let k = 2; k < recvChain.length; k++) r = makeGet(recvChain[k], r);
              } else {
                r = { opcode: "jwClass_self", inputs: [], noPlaceholder: true };
                for (let k = 1; k < recvChain.length; k++) r = makeGet(recvChain[k], r);
              }
            } else {
              r = { type: "Var", name: recvChain[0] };
              for (let k = 1; k < recvChain.length; k++) r = makeGet(recvChain[k], r);
            }
            receiverRef = r;
          }
        } else {
          // receiver is previous temp
          receiverRef = { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] };
        }

        // determine method params if available: prefer baseClassName when receiver is prev
        let classNameForStep = null;
        if (si === 0) {
          if (
            Array.isArray(step.receiverChain) &&
            step.receiverChain.length > 0 &&
            typeof step.receiverChain[0] === "string"
          ) {
            classNameForStep = resolveReceiverClass(
              step.receiverChain[0],
              emittingClass,
              currentMethodParams,
            );
          }
        } else {
          classNameForStep = baseClassName;
        }
        const paramsForStep = classNameForStep ? getMethodParams(classNameForStep, step.methodName) : null;
        const returnsLambdaArgsForMethod = classNameForStep
          ? getMethodReturns(classNameForStep, step.methodName)
          : null;

        // If this step is a normal method call (methodName present)
        if (step.methodName) {
          // special-case: receiver is previous temp and the current method name
          // matches the previous method — this pattern indicates we should
          // invoke the function value stored in the previous temp rather than
          // re-looking-up the method on that temp (produces num.test()("bar ")()).
          const isReceiverPrevTemp =
            receiverRef &&
            receiverRef.opcode === "SPtempVars_getVar" &&
            Array.isArray(receiverRef.inputs) &&
            prevTemp &&
            receiverRef.inputs[1] === prevTemp;
          if (isReceiverPrevTemp && prevStepMethodName === step.methodName) {
            // If we know the returned lambda arg names, map them.
            if (Array.isArray(prevReturnedLambdaArgs) && prevReturnedLambdaArgs.length > 0) {
              for (let pi = 0; pi < prevReturnedLambdaArgs.length; pi++) {
                const pname = prevReturnedLambdaArgs[pi];
                const argExpr =
                  step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
                inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
              }
            } else {
              // fallback: use a synthetic arg temp for a single positional arg
              const argPosLocal =
                step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
              if (argPosLocal !== "") {
                const argTemp = getArgTempForCall(classNameForStep, step.methodName);
                inlineChildren.push({
                  opcode: "SPtempVars_setVar",
                  inputs: ["thread", argTemp, argPosLocal],
                });
              }
            }
            const callReporter = { opcode: "jwLambda_executeR", inputs: [receiverRef, ""] };
            const tempName = __pw_newTemp("__c");
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] });
            prevTemp = tempName;
            prevReturnedLambdaArgs = null;
            prevStepMethodName = null;
            continue;
          }

          // set thread vars for params if we know their names
          if (Array.isArray(paramsForStep) && paramsForStep.length > 0) {
            for (let pi = 0; pi < paramsForStep.length; pi++) {
              const pname = paramsForStep[pi];
              const argExpr =
                step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
            }
            // call method via jwLambda_executeR on the bound getter and store into temp
            const methodKeyForStep = getClassMethodKey(classNameForStep, step.methodName);
            const boundMethod = hasMethodFlag(classNameForStep, step.methodName, "static")
              ? getClassStaticGet(classNameForStep, methodKeyForStep)
              : makeGet(methodKeyForStep, receiverRef);
            const callReporter = { opcode: "jwLambda_executeR", inputs: [boundMethod, ""] };
            const tempName = __pw_newTemp("__c");
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] });
            prevTemp = tempName;
            // remember if this method is known to return a lambda and its arg names
            prevReturnedLambdaArgs = Array.isArray(returnsLambdaArgsForMethod)
              ? returnsLambdaArgsForMethod.slice()
              : null;
            prevStepMethodName = step.methodName;
            continue;
          }

          // fallback when param names unknown: set a synthetic thread var for the first arg
          const argPos =
            step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
          const methodKeyForStep2 = getClassMethodKey(classNameForStep, step.methodName);
          const boundMethod = hasMethodFlag(classNameForStep, step.methodName, "static")
            ? getClassStaticGet(classNameForStep, methodKeyForStep2)
            : makeGet(methodKeyForStep2, receiverRef);
          if (argPos !== "") {
            const argTemp = getArgTempForCall(classNameForStep, step.methodName);
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp, argPos] });
          }
          const callReporter = { opcode: "jwLambda_executeR", inputs: [boundMethod, ""] };
          const tempName = __pw_newTemp("__c");
          inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] });
          prevTemp = tempName;
          prevReturnedLambdaArgs = Array.isArray(returnsLambdaArgsForMethod)
            ? returnsLambdaArgsForMethod.slice()
            : null;
          prevStepMethodName = step.methodName;
          continue;
        }

        // If step.methodName is falsy, this normally represents a call on a function-valued receiver
        // (e.g., result-of-previous-call returned a lambda). However some AST shapes
        // use a `null` method slot for chained method calls (outer node). If the
        // previous method did NOT return a lambda, but we have a last seen method
        // name, assume this is a chained method call and synthesize the property
        // access on the previous temp instead of invoking the temp as a function.
        if (
          !step.methodName &&
          prevStepMethodName &&
          (!Array.isArray(prevReturnedLambdaArgs) || prevReturnedLambdaArgs.length === 0) &&
          prevTemp
        ) {
          // treat as a method call on the previous temp using the previously-seen method name
          const fakeMethod = prevStepMethodName;
          const fakeParams = classNameForStep ? getMethodParams(classNameForStep, fakeMethod) : null;
          if (Array.isArray(fakeParams) && fakeParams.length > 0) {
            for (let pi = 0; pi < fakeParams.length; pi++) {
              const pname = fakeParams[pi];
              const argExpr =
                step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
            }
            const boundMethod = makeGet(getClassMethodKey(classNameForStep, fakeMethod), {
              opcode: "SPtempVars_getVar",
              inputs: ["thread", prevTemp],
            });
            const callReporter = { opcode: "jwLambda_executeR", inputs: [boundMethod, ""] };
            const tempName = __pw_newTemp("__c");
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] });
            prevTemp = tempName;
            prevReturnedLambdaArgs = classNameForStep
              ? Array.isArray(getMethodReturns(classNameForStep, fakeMethod))
                ? getMethodReturns(classNameForStep, fakeMethod).slice()
                : null
              : null;
            prevStepMethodName = fakeMethod;
            continue;
          }
          // fallback: no named params for fakeMethod — treat like unknown-param method
          const fakeArgExpr =
            step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
          if (fakeArgExpr !== "") {
            const argTemp = getArgTempForCall(classNameForStep, fakeMethod);
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp, fakeArgExpr] });
          }
          const boundMethod2 = makeGet(getClassMethodKey(classNameForStep, fakeMethod), {
            opcode: "SPtempVars_getVar",
            inputs: ["thread", prevTemp],
          });
          const callReporter2 = { opcode: "jwLambda_executeR", inputs: [boundMethod2, ""] };
          const tempName2 = __pw_newTemp("__c");
          inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, callReporter2] });
          prevTemp = tempName2;
          prevReturnedLambdaArgs = classNameForStep
            ? Array.isArray(getMethodReturns(classNameForStep, fakeMethod))
              ? getMethodReturns(classNameForStep, fakeMethod).slice()
              : null
            : null;
          prevStepMethodName = fakeMethod;
          continue;
        }

        if (Array.isArray(prevReturnedLambdaArgs) && prevReturnedLambdaArgs.length > 0) {
          for (let pi = 0; pi < prevReturnedLambdaArgs.length; pi++) {
            const pname = prevReturnedLambdaArgs[pi];
            const argExpr = step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
          }
          const callReporter = { opcode: "jwLambda_executeR", inputs: [receiverRef, ""] };
          const tempName = __pw_newTemp("__c");
          inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] });
          prevTemp = tempName;
          // We don't currently track lambdas returned by anonymous/function-valued calls;
          // reset prevReturnedLambdaArgs unless more static info becomes available.
          prevReturnedLambdaArgs = null;
          // Once we've executed a returned-lambda, clear the prior
          // `methodName` to avoid synthesizing subsequent chained method
          // calls on the temp (prevents double-invoking methods).
          prevStepMethodName = null;
          continue;
        }

        // fallback: call the function-valued receiver — set thread var for arg then call
        const argPos2 =
          step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
        if (argPos2 !== "") {
          const argTemp2 = getArgTempForCall(null, prevStepMethodName);
          inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp2, argPos2] });
        }
        const callReporter2 = { opcode: "jwLambda_executeR", inputs: [receiverRef, ""] };
        const tempName2 = __pw_newTemp("__c");
        inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, callReporter2] });
        prevTemp = tempName2;
        prevReturnedLambdaArgs = null;
      }

      // return the last temp value
      const retNode = {
        opcode: "procedures_return",
        inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] }],
      };
      inlineChildren.push(retNode);
      return { opcode: "control_inline_stack_output", inputs: [inlineChildren] };
    }
    if (expr.type === "Call") {
      const name = expr.name;
      // If this Call targets a variable that was recorded as a lambda,
      // emit an inline wrapper that sets the tagged arg temps and
      // executes the variable-stored lambda via `jwLambda_executeR`.
      if (typeof name === "string" && varToLambda && varToLambda[name]) {
        const vinfo = varToLambda[name];
        const getterType = varScopeForName(name, inMethod, paramMap, undefined);
        const lambdaGetter = { opcode: "SPtempVars_getVar", inputs: [getterType, String(name)] };
        // If we know the lambda's tagged arg names, set them before call
        if (vinfo && Array.isArray(vinfo.arr) && vinfo.arr.length > 0) {
          const setters = buildLambdaArgSetters(vinfo, expr.args, inMethod, paramMap);
          const callReporter = { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
          const ret = { opcode: "procedures_return", inputs: [callReporter] };
          return { opcode: "control_inline_stack_output", inputs: [setters.concat([ret])] };
        }
        // Fallback: use synthetic arg temp for a single positional arg
        const argPos =
          expr.args && expr.args.length > 0 ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        if (argPos !== "") {
          const at = getArgTempForCall(null, name);
          const setters = [{ opcode: "SPtempVars_setVar", inputs: ["thread", at, argPos] }];
          const callReporter = { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
          const ret = { opcode: "procedures_return", inputs: [callReporter] };
          return { opcode: "control_inline_stack_output", inputs: [setters.concat([ret])] };
        }
        return { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
      }
      // Map convenient function names to jwArray opcodes so source can use
      // push/append/get/length/set/concat/join/sum as regular calls.
      if (name === "push" || name === "append") {
        arraysUsed = true;
        const arrArg = expr.args && expr.args[0] ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        const valArg = expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, paramMap) : "";
        return { opcode: "jwArray_append", inputs: [arrArg, valArg] };
      }
      if (name === "length") {
        arraysUsed = true;
        const arrArg = expr.args && expr.args[0] ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        return { opcode: "jwArray_length", inputs: [{ ...arrArg, noPlaceholder: true }] };
      }
      if (name === "get") {
        arraysUsed = true;
        const arrArg = expr.args && expr.args[0] ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        const rawIdxArg = expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, paramMap) : "";
        const idxArg = adjustArrayIndex(rawIdxArg, inMethod, paramMap);
        return { opcode: "jwArray_get", inputs: [{ ...arrArg, noPlaceholder: true }, idxArg] };
      }
      if (name === "set") {
        arraysUsed = true;
        const arrArg = expr.args && expr.args[0] ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        const rawIdxArg = expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, paramMap) : "";
        const idxArg = adjustArrayIndex(rawIdxArg, inMethod, paramMap);
        const valArg = expr.args && expr.args[2] ? exprToNested(expr.args[2], inMethod, paramMap) : "";
        return { opcode: "jwArray_set", inputs: [{ ...arrArg, noPlaceholder: true }, idxArg, valArg] };
      }
      if (name === "concat") {
        arraysUsed = true;
        const a1 = expr.args && expr.args[0] ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        const a2 = expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, paramMap) : "";
        return {
          opcode: "jwArray_concat",
          inputs: [
            { ...a1, noPlaceholder: true },
            { ...a2, noPlaceholder: true },
          ],
        };
      }
      if (name === "join") {
        arraysUsed = true;
        const a1 = expr.args && expr.args[0] ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        const div = expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, paramMap) : "";
        return { opcode: "jwArray_join", inputs: [{ ...a1, noPlaceholder: true }, div] };
      }
      if (name === "sum") {
        arraysUsed = true;
        const a1 = expr.args && expr.args[0] ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        return { opcode: "jwArray_sum", inputs: [{ ...a1, noPlaceholder: true }] };
      }
      if (name === "splice") {
        arraysUsed = true;
        const arrArg = expr.args && expr.args[0] ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        const rawIdxArg = expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, paramMap) : "";
        const idxArg = adjustArrayIndex(rawIdxArg, inMethod, paramMap);
        const itemsArg = expr.args && expr.args[2] ? exprToNested(expr.args[2], inMethod, paramMap) : "";
        return { opcode: "jwArray_splice", inputs: [{ ...arrArg, noPlaceholder: true }, idxArg, itemsArg] };
      }
      // Lookup block metadata to learn param ordering and shape
      const meta = blocksMeta[name] || blocksMeta[name.replace(/^operator_/, "operator_")] || null;
      const params = meta ? meta[0] : null;
      const shape = meta ? meta[1] : null;

      if (Array.isArray(params) && params.length > 0) {
        const argsArr = [];
        for (let i = 0; i < params.length; i++) {
          const a = expr.args && expr.args[i] !== undefined ? expr.args[i] : undefined;
          argsArr.push(a === undefined ? "" : exprToNested(a, inMethod, paramMap));
        }
        // append any extra positional args after declared params
        if (expr.args && expr.args.length > params.length) {
          for (let i = params.length; i < expr.args.length; i++)
            argsArr.push(exprToNested(expr.args[i], inMethod, paramMap));
        }
        // If this name actually refers to a variable holding a lambda,
        // emit an inline wrapper that sets tagged arg temps and executes
        // the variable-stored lambda instead of emitting a raw opcode.
        if (typeof name === "string" && varToLambda && varToLambda[name]) {
          const vinfo = varToLambda[name];
          const getterType = varScopeForName(name, inMethod, paramMap, undefined);
          const lambdaGetter = { opcode: "SPtempVars_getVar", inputs: [getterType, String(name)] };
          if (vinfo && Array.isArray(vinfo.arr) && vinfo.arr.length > 0) {
            const setters = [];
            for (let i = 0; i < vinfo.arr.length; i++) {
              const pname = vinfo.arr[i];
              const argExpr = expr.args && expr.args[i] ? exprToNested(expr.args[i], inMethod, paramMap) : "";
              setters.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
            }
            const callReporter = { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
            const ret = { opcode: "procedures_return", inputs: [callReporter] };
            return { opcode: "control_inline_stack_output", inputs: [setters.concat([ret])] };
          }
          const argPos =
            expr.args && expr.args.length > 0 ? exprToNested(expr.args[0], inMethod, paramMap) : "";
          if (argPos !== "") {
            const at = getArgTempForCall(null, name);
            const setters = [{ opcode: "SPtempVars_setVar", inputs: ["thread", at, argPos] }];
            const callReporter = { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
            const ret = { opcode: "procedures_return", inputs: [callReporter] };
            return { opcode: "control_inline_stack_output", inputs: [setters.concat([ret])] };
          }
          return { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
        }
        return { opcode: name, inputs: argsArr, __shape: shape };
      }

      // If this name is a parameter, assume it's a lambda if called
      if (paramMap && paramMap[name]) {
        const lambdaGetter = { opcode: "SPtempVars_getVar", inputs: ["thread", paramMap[name]] };
        const setters = [];
        for (let i = 0; i < (expr.args || []).length; i++) {
          const argExpr = expr.args[i] ? exprToNested(expr.args[i], inMethod, paramMap) : "";
          const pname = "__arg" + i;
          setters.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
        }
        const callReporter = { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
        const ret = { opcode: "procedures_return", inputs: [callReporter] };
        return { opcode: "control_inline_stack_output", inputs: [setters.concat([ret])] };
      }

      // Final fallback: if the call name corresponds to a variable-stored
      // lambda, emit an inline wrapper as above; otherwise return a raw
      // opcode block for the call.
      if (typeof name === "string" && varToLambda && varToLambda[name]) {
        const vinfo = varToLambda[name];
        const getterType = varScopeForName(name, inMethod, paramMap, undefined);
        const lambdaGetter = { opcode: "SPtempVars_getVar", inputs: [getterType, String(name)] };
        if (vinfo && Array.isArray(vinfo.arr) && vinfo.arr.length > 0) {
          const setters = [];
          for (let i = 0; i < vinfo.arr.length; i++) {
            const pname = vinfo.arr[i];
            const argExpr = expr.args && expr.args[i] ? exprToNested(expr.args[i], inMethod, paramMap) : "";
            setters.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
          }
          const callReporter = { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
          const ret = { opcode: "procedures_return", inputs: [callReporter] };
          return { opcode: "control_inline_stack_output", inputs: [setters.concat([ret])] };
        }
        const argPos =
          expr.args && expr.args.length > 0 ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        if (argPos !== "") {
          const at = getArgTempForCall(null, name);
          const setters = [{ opcode: "SPtempVars_setVar", inputs: ["thread", at, argPos] }];
          const callReporter = { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
          const ret = { opcode: "procedures_return", inputs: [callReporter] };
          return { opcode: "control_inline_stack_output", inputs: [setters.concat([ret])] };
        }
        return { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
      }

      return {
        opcode: name,
        inputs: (expr.args || []).map((e) => exprToNested(e, inMethod, paramMap)),
        __shape: shape,
      };
    }
    if (expr.type === "New") {
      // expr.callee is a Call AST for the class reference; args are constructor args
      const callee = expr.callee;
      // Determine a nested representation for the CLASS input
      let classRefNested = null;
      if (callee && callee.type === "Call") {
        // class reference is stored as a global variable named after the class
        // (SPtempVars_setVar was used earlier to assign the jwClass_class into a
        // global named after the class). Use SPtempVars_getVar to reference it
        // so converter emits a proper getVar reporter instead of a raw opcode.
        classRefNested = {
          opcode: "SPtempVars_getVar",
          inputs: ["global", String(callee.name)],
          noPlaceholder: true,
        };
      } else if (callee && callee.type === "MemberCall") {
        // member expression returning class value
        const chain = callee.chain || [];
        if (chain.length > 0)
          classRefNested = exprToNested({ type: "Var", name: chain[0] }, inMethod, paramMap);
      }
      if (!classRefNested) classRefNested = "";

      // Only create the inline constructor wrapper if the class explicitly
      // defines a `constructor` method. If no constructor exists, simply
      // emit a `jwClass_new` reporter and do not create a wrapper.
      let className = null;
      if (callee && callee.type === "Call" && typeof callee.name === "string") className = callee.name;
      const hasCtor = !!(
        className &&
        classRegistry[className] &&
        classRegistry[className].methods &&
        Object.prototype.hasOwnProperty.call(classRegistry[className].methods, "constructor")
      );
      const cargs = callee && callee.args ? callee.args : [];
      if (!hasCtor) {
        // Record that this inline `jwClass_new` usage creates an instance
        // of `className` when stored into a temp by surrounding code.
        // We don't have the temp name here (caller creates it), so return
        // the raw jwClass_new reporter as before.
        return { opcode: "jwClass_new", inputs: [classRefNested] };
      }

      // Otherwise build an inline stack wrapper that: set tempNew = new CLASS;
      // call constructor via jwClass_getProp + jwLambda_execute; return tempNew
      const tempName = __pw_newTemp("__new");
      // set the tempNew as a thread-scoped temp variable
      const setTemp = {
        opcode: "SPtempVars_setVar",
        inputs: ["thread", tempName, { opcode: "jwClass_new", inputs: [classRefNested] }],
      };
      // Record mapping temp -> class so later property accessors on this temp
      // can resolve whether a getter/setter exists for that class.
      tempToClass[tempName] = className;
      if (tempName) console.error("[emit] set tempToClass", tempName, "=>", className);
      // attempt to map constructor param names if we have class signature info
      const ctorParamSetters = [];
      //let className = null;
      if (callee && callee.type === "Call" && typeof callee.name === "string") className = callee.name;
      const ctorParams = className ? getMethodParams(className, "constructor") : null;
      if (Array.isArray(ctorParams) && ctorParams.length > 0) {
        for (let i = 0; i < ctorParams.length; i++) {
          const pname = ctorParams[i];
          const argExpr =
            callee && callee.args && callee.args[i] ? exprToNested(callee.args[i], inMethod, paramMap) : "";
          ctorParamSetters.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
        }
      }
      // build constructor getter chain (constructor property)
      // Use a thread-scoped SPtempVars_getVar for the temporary instance so
      // subsequent getters/readers inside the inline wrapper reference the
      // thread-scoped temp, not a global variable.
      let receiver = { opcode: "SPtempVars_getVar", inputs: ["thread", tempName] };
      const ctorGet = makeGet(getClassMethodKey(className, "constructor"), receiver);
      // If we didn't map constructor params, pass the first arg as fallback
      const ctorArg =
        (!Array.isArray(ctorParams) || ctorParams.length === 0) &&
          expr.callee &&
          expr.callee.args &&
          expr.callee.args.length > 0
          ? exprToNested(expr.callee.args[0], inMethod, paramMap)
          : "";
      const ctorArgSetters = [];
      if (ctorArg !== "") {
        const ctorArgTemp = getArgTempForCall(className, "constructor");
        ctorArgSetters.push({ opcode: "SPtempVars_setVar", inputs: ["thread", ctorArgTemp, ctorArg] });
      }
      const callCtor = { opcode: "jwLambda_execute", inputs: [ctorGet, ""] };
      // return the thread-scoped temp instance using SPtempVars_getVar
      const ret = {
        opcode: "procedures_return",
        inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", tempName] }],
      };
      const inlineChildren = [setTemp]
        .concat(ctorParamSetters, ctorArgSetters, [callCtor, ret])
        .filter(Boolean);
      const inlineBlock = { opcode: "control_inline_stack_output", inputs: [inlineChildren] };
      return inlineBlock;
    }
    if (expr.type === "Ternary") {
      // Represent ternary using positional args so nested objects are preserved
      return {
        opcode: "control_if_return_else_return",
        inputs: [
          exprToNested(expr.cond, inMethod, paramMap),
          exprToNested(expr.thenExpr, inMethod, paramMap),
          exprToNested(expr.elseExpr, inMethod, paramMap),
        ],
      };
    }
    if (expr.type === "Unary") {
      // Handle unary +/-. For +, just return the operand. For - with a numeric
      // literal, return a negative literal so the converter emits a single
      // numeric shadow (e.g. -9). For non-literal operands, emit a
      // subtract call with a blank first arg so the converter produces a
      // block with NUM1 blank and NUM2 referencing the operand block.
      if (expr.op === "+") return exprToNested(expr.operand, inMethod, paramMap);
      if (expr.op === "-") {
        const opd = expr.operand;
        if (opd && opd.type === "Literal" && opd.litType === "number") {
          return -Number(opd.value);
        }
        // produce args ["", operand] to make NUM1 blank and NUM2 the block
        return {
          opcode: generator.mapOpToOpcode(expr.op),
          inputs: ["", exprToNested(opd, inMethod, paramMap)],
        };
      }
      // other unary ops (!, ~)
      const op = generator.mapOpToOpcode(expr.op);
      return { opcode: op, inputs: [exprToNested(expr.operand, inMethod, paramMap)] };
    }
    if (expr.type === "Binary") {
      // handle Lua-style concat '..' as expandable join inputs (flatten chain)
      if (expr.op === "..") {
        function collectConcatOperands(node, acc) {
          if (!node) return acc;
          if (node.type === "Binary" && node.op === "..") {
            collectConcatOperands(node.left, acc);
            collectConcatOperands(node.right, acc);
          } else {
            acc.push(node);
          }
          return acc;
        }
        const operands = collectConcatOperands(expr, []);
        const nestedParts = operands.map((o) => exprToNested(o, inMethod, paramMap));
        return {
          opcode: "operator_expandablejoininputs",
          inputs: nestedParts,
          mutation: { inputcount: String(operands.length) },
        };
      }
      const op = generator.mapOpToOpcode(expr.op);
      return {
        opcode: op,
        inputs: [exprToNested(expr.left, inMethod, paramMap), exprToNested(expr.right, inMethod, paramMap)],
      };
    }
    return "";
  }

  // Flatten an array of results from stmtToNested (which may return arrays)
  // into a single flat array of block objects.
  function flattenNestedResults(arr) {
    const out = [];
    for (const v of arr || []) {
      if (Array.isArray(v)) {
        for (const x of v) if (x) out.push(x);
      } else if (v) out.push(v);
    }
    return out;
  }

  function assertReturnTerminal(arr, context) {
    if (!Array.isArray(arr)) return;
    for (let i = 0; i < arr.length; i++) {
      const e = arr[i];
      if (e && e.opcode === "procedures_return" && i !== arr.length - 1) {
        throw new Error("'return' must be the last statement in " + context);
      }
    }
  }

  function stmtToNested(stmt, inMethod = false, paramMap = null) {
    if (!stmt) return null;

    function resolveScope(name) {
      return varScopeForName(name, inMethod, paramMap, undefined);
    }

    if (stmt.type === "Print") {
      const msg = exprToNested(stmt.expr, inMethod, paramMap);
      const seconds = stmt.options && stmt.options.seconds !== undefined ? stmt.options.seconds : undefined;
      const opcode = seconds !== undefined ? "looks_sayforsecs" : "looks_say";
      const node = { opcode, inputs: [msg] };
      if (seconds !== undefined) node.inputs.push(seconds);
      return node;
    }
    if (stmt.type === "If") {
      //console.log(JSON.stringify(stmt, null, 2));
      const caseSeqs = stmt.cases.map((c) =>
        flattenNestedResults(
          c.thenBlock.body.map((s) => stmtToNested(s, inMethod, paramMap)).filter(Boolean),
        ),
      );
      const elseSeq = stmt.elseBlock
        ? flattenNestedResults(
          stmt.elseBlock.body.map((s) => stmtToNested(s, inMethod, paramMap)).filter(Boolean),
        )
        : null;
      const cases = [];
      for (let i = 0; i < stmt.cases.length; i++) {
        const c = stmt.cases[i];
        const cres = c.cond ? exprToNested(c.cond, inMethod, paramMap) : null;
        if (!cres) throw new Error("stmtToNested If: condition must be an expression");
        const condVal = cres;
        const thenBlocks = caseSeqs[i] || [];
        cases.push({
          cond: condVal,
          then: thenBlocks,
        });
      }
      const mutation = {
        branches: String(cases.length + (elseSeq ? 1 : 0)),
        "ends-in-else": String(!!elseSeq),
      };
      return {
        opcode: "control_expandableIf",
        cases,
        else: elseSeq,
        mutation,
      };
    }
    if (stmt.type === "Call") {
      const name = stmt.name;
      // If this Call targets a variable recorded as a lambda, emit an inline
      // sequence that sets the indexed arg temps (`__arg0`, `__arg1`, ...) and
      // then executes the stored lambda via `jwLambda_execute`.
      if (typeof name === "string" && varToLambda && varToLambda[name]) {
        const vinfo = varToLambda[name];
        const getterType = varScopeForName(name, inMethod, paramMap, undefined);
        const lambdaGetter = { opcode: "SPtempVars_getVar", inputs: [getterType, String(name)] };
        const setters = buildLambdaArgSetters(vinfo, stmt.args, inMethod, paramMap);
        const call = { opcode: "jwLambda_execute", inputs: [lambdaGetter, ""] };
        return [].concat(setters, [call]);
      }
      // Map common array helper calls to jwArray opcodes so they have
      // proper block metadata when emitted as top-level stack blocks.
      if (name === "push" || name === "append") {
        const arrArg = stmt.args && stmt.args[0] ? exprToNested(stmt.args[0], inMethod, paramMap) : "";
        const valArg = stmt.args && stmt.args[1] ? exprToNested(stmt.args[1], inMethod, paramMap) : "";
        // Arrays are immutable: append returns a new array. When used as a
        // statement, write the returned array back into the original variable
        // if it's a simple Var, otherwise stash into a thread temp to avoid
        // leaving a reporter block in the top-level next chain.
        if (arrArg && typeof arrArg === "object" && arrArg.type === "Var") {
          const varName = arrArg.name || "";
          const destType = resolveScope(varName);
          const getter = { opcode: "SPtempVars_getVar", inputs: [destType, varName] };
          const appendCall = { opcode: "jwArray_append", inputs: [getter, valArg] };
          return { opcode: "SPtempVars_setVar", inputs: [destType, varName, appendCall] };
        }
        if (
          arrArg &&
          typeof arrArg === "object" &&
          (arrArg.opcode === "jwClass_getProp" ||
            arrArg.opcode === "dogeiscutObject_get" ||
            arrArg.opcode === "dogeiscutObject_getPath")
        ) {
          const propName = arrArg.inputs && arrArg.inputs[0];
          const receiver = arrArg.inputs && arrArg.inputs[1];
          const appendCall = { opcode: "jwArray_append", inputs: [arrArg, valArg] };
          const setExpr = makeSet(propName, receiver, appendCall);
          if (receiver && typeof receiver === "object" && receiver.type === "Var") {
            const varName = receiver.name || "";
            const destType = resolveScope(varName);
            return { opcode: "SPtempVars_setVar", inputs: [destType, varName, setExpr] };
          }
          const tmp = __pw_newTemp("__a");
          return { opcode: "SPtempVars_setVar", inputs: ["thread", tmp, setExpr] };
        }
        // fallback: store result into a thread-temp so the top-level chain
        // points to a stack `SPtempVars_setVar` rather than a reporter.
        const tmp = __pw_newTemp("__a");
        const appendCall = { opcode: "jwArray_append", inputs: [arrArg, valArg] };
        return { opcode: "SPtempVars_setVar", inputs: ["thread", tmp, appendCall] };
      }
      if (name === "concat") {
        const a1 = stmt.args && stmt.args[0] ? exprToNested(stmt.args[0], inMethod, paramMap) : "";
        const a2 = stmt.args && stmt.args[1] ? exprToNested(stmt.args[1], inMethod, paramMap) : "";
        return { opcode: "jwArray_concat", inputs: [a1, a2] };
      }
      if (name === "join") {
        const a1 = stmt.args && stmt.args[0] ? exprToNested(stmt.args[0], inMethod, paramMap) : "";
        const div = stmt.args && stmt.args[1] ? exprToNested(stmt.args[1], inMethod, paramMap) : "";
        return { opcode: "jwArray_join", inputs: [a1, div] };
      }
      if (name === "set") {
        const arrArg = stmt.args && stmt.args[0] ? exprToNested(stmt.args[0], inMethod, paramMap) : "";
        const rawIdxArg = stmt.args && stmt.args[1] ? exprToNested(stmt.args[1], inMethod, paramMap) : "";
        const idxArg = adjustArrayIndex(rawIdxArg, inMethod, paramMap);
        const valArg = stmt.args && stmt.args[2] ? exprToNested(stmt.args[2], inMethod, paramMap) : "";
        // jwArray_set returns a new array; write it back to the variable when
        // used as a statement (same strategy as append).
        if (arrArg && typeof arrArg === "object" && arrArg.type === "Var") {
          const varName = arrArg.name || "";
          const destType = resolveScope(varName);
          const getter = { opcode: "SPtempVars_getVar", inputs: [destType, varName], noPlaceholder: true };
          const setCall = { opcode: "jwArray_set", inputs: [getter, idxArg, valArg] };
          return { opcode: "SPtempVars_setVar", inputs: [destType, varName, setCall] };
        }
        // Handle property access on class instances (e.g., `set(this._arr, ...)` or `set(out._arr, ...)`)
        if (
          arrArg &&
          typeof arrArg === "object" &&
          (arrArg.opcode === "jwClass_getProp" ||
            arrArg.opcode === "dogeiscutObject_get" ||
            arrArg.opcode === "dogeiscutObject_getPath")
        ) {
          const propName = arrArg.inputs && arrArg.inputs[0];
          const receiver = arrArg.inputs && arrArg.inputs[1];
          const setCall = { opcode: "jwArray_set", inputs: [arrArg, idxArg, valArg] };
          const setExpr = makeSet(propName, receiver, setCall);
          if (receiver && typeof receiver === "object" && receiver.type === "Var") {
            const varName = receiver.name || "";
            const destType = resolveScope(varName);
            return { opcode: "SPtempVars_setVar", inputs: [destType, varName, setExpr] };
          }
          const tmp = __pw_newTemp("__a");
          return { opcode: "SPtempVars_setVar", inputs: ["thread", tmp, setExpr] };
        }
        const tmp = __pw_newTemp("__a");
        const setCall = {
          opcode: "jwArray_set",
          inputs: [{ ...arrArg, noPlaceholder: true }, idxArg, valArg],
        };
        return { opcode: "SPtempVars_setVar", inputs: ["thread", tmp, setCall] };
      }
      if (name === "get") {
        const arrArg = stmt.args && stmt.args[0] ? exprToNested(stmt.args[0], inMethod, paramMap) : "";
        const rawIdxArg = stmt.args && stmt.args[1] ? exprToNested(stmt.args[1], inMethod, paramMap) : "";
        const idxArg = adjustArrayIndex(rawIdxArg, inMethod, paramMap);
        return { opcode: "jwArray_get", inputs: [{ ...arrArg, noPlaceholder: true }, idxArg] };
      }
      if (name === "sum") {
        const a1 = stmt.args && stmt.args[0] ? exprToNested(stmt.args[0], inMethod, paramMap) : "";
        return { opcode: "jwArray_sum", inputs: [{ ...a1, noPlaceholder: true }] };
      }
      if (name === "length") {
        const arrArg = stmt.args && stmt.args[0] ? exprToNested(stmt.args[0], inMethod, paramMap) : "";
        return { opcode: "jwArray_length", inputs: [{ ...arrArg, noPlaceholder: true }] };
      }
      return { opcode: stmt.name, inputs: (stmt.args || []).map((a) => exprToNested(a, inMethod, paramMap)) };
    }
    if (stmt.type === "MemberCall") {
      const chain = stmt.chain || [];
      if (chain.length < 2) return null;
      const methodName = chain[chain.length - 1];
      const arrayHelperMethods = new Set([
        "push",
        "append",
        "get",
        "set",
        "concat",
        "join",
        "sum",
        "length",
        "splice",
      ]);
      if (arrayHelperMethods.has(methodName)) {
        const readChain = chain.slice(0, chain.length - 1);
        const arrayExpr = buildMemberChainReceiver(readChain, inMethod, paramMap);
        if (!arrayExpr) return null;
        if (methodName === "push" || methodName === "append") {
          const valArg = stmt.args && stmt.args[0] ? exprToNested(stmt.args[0], inMethod, paramMap) : "";
          const appendCall = {
            opcode: "jwArray_append",
            inputs: [{ ...arrayExpr, noPlaceholder: true }, valArg],
          };
          if (
            readChain.length === 1 &&
            arrayExpr &&
            typeof arrayExpr === "object" &&
            arrayExpr.type === "Var"
          ) {
            const varName = arrayExpr.name || "";
            const destType = resolveScope(varName);
            const getter = { opcode: "SPtempVars_getVar", inputs: [destType, varName] };
            return {
              opcode: "SPtempVars_setVar",
              inputs: [destType, varName, { opcode: "jwArray_append", inputs: [getter, valArg] }],
            };
          }
          if (readChain.length > 1) {
            const parentReceiver = buildMemberChainReceiver(readChain.slice(0, -1), inMethod, paramMap);
            const propName = readChain[readChain.length - 1];
            if (parentReceiver) {
              const setExpr = makeSet(propName, parentReceiver, appendCall);
              if (parentReceiver && typeof parentReceiver === "object" && parentReceiver.type === "Var") {
                const varName = parentReceiver.name || "";
                const destType = resolveScope(varName);
                return { opcode: "SPtempVars_setVar", inputs: [destType, varName, setExpr] };
              }
              const tmp = __pw_newTemp("__a");
              return { opcode: "SPtempVars_setVar", inputs: ["thread", tmp, setExpr] };
            }
            const tmp = __pw_newTemp("__a");
            return { opcode: "SPtempVars_setVar", inputs: ["thread", tmp, appendCall] };
          }
          return appendCall;
        }
        if (methodName === "set") {
          const rawIdxArg = stmt.args && stmt.args[0] ? exprToNested(stmt.args[0], inMethod, paramMap) : "";
          const idxArg = adjustArrayIndex(rawIdxArg, inMethod, paramMap);
          const valArg = stmt.args && stmt.args[1] ? exprToNested(stmt.args[1], inMethod, paramMap) : "";
          const setCall = {
            opcode: "jwArray_set",
            inputs: [{ ...arrayExpr, noPlaceholder: true }, idxArg, valArg],
          };
          if (
            readChain.length === 1 &&
            arrayExpr &&
            typeof arrayExpr === "object" &&
            arrayExpr.type === "Var"
          ) {
            const varName = arrayExpr.name || "";
            const destType = resolveScope(varName);
            const getter = { opcode: "SPtempVars_getVar", inputs: [destType, varName], noPlaceholder: true };
            return {
              opcode: "SPtempVars_setVar",
              inputs: [destType, varName, { opcode: "jwArray_set", inputs: [getter, idxArg, valArg] }],
            };
          }
          if (readChain.length > 1) {
            const parentReceiver = buildMemberChainReceiver(readChain.slice(0, -1), inMethod, paramMap);
            const propName = readChain[readChain.length - 1];
            if (parentReceiver) {
              const setExpr = makeSet(propName, parentReceiver, setCall);
              if (parentReceiver && typeof parentReceiver === "object" && parentReceiver.type === "Var") {
                const varName = parentReceiver.name || "";
                const destType = resolveScope(varName);
                return { opcode: "SPtempVars_setVar", inputs: [destType, varName, setExpr] };
              }
              const tmp = __pw_newTemp("__a");
              return { opcode: "SPtempVars_setVar", inputs: ["thread", tmp, setExpr] };
            }
            const tmp = __pw_newTemp("__a");
            return { opcode: "SPtempVars_setVar", inputs: ["thread", tmp, setCall] };
          }
          return setCall;
        }
        if (methodName === "get") {
          const rawIdxArg = stmt.args && stmt.args[0] ? exprToNested(stmt.args[0], inMethod, paramMap) : "";
          const idxArg = adjustArrayIndex(rawIdxArg, inMethod, paramMap);
          return { opcode: "jwArray_get", inputs: [{ ...arrayExpr, noPlaceholder: true }, idxArg] };
        }
        if (methodName === "sum")
          return { opcode: "jwArray_sum", inputs: [{ ...arrayExpr, noPlaceholder: true }] };
        if (methodName === "length")
          return { opcode: "jwArray_length", inputs: [{ ...arrayExpr, noPlaceholder: true }] };
        if (methodName === "concat") {
          const a2 = stmt.args && stmt.args[1] ? exprToNested(stmt.args[1], inMethod, paramMap) : "";
          return {
            opcode: "jwArray_concat",
            inputs: [
              { ...arrayExpr, noPlaceholder: true },
              { ...a2, noPlaceholder: true },
            ],
          };
        }
        if (methodName === "join") {
          const div = stmt.args && stmt.args[1] ? exprToNested(stmt.args[1], inMethod, paramMap) : "";
          return { opcode: "jwArray_join", inputs: [{ ...arrayExpr, noPlaceholder: true }, div] };
        }
        if (methodName === "splice") {
          const rawIdxArg = stmt.args && stmt.args[1] ? exprToNested(stmt.args[1], inMethod, paramMap) : "";
          const idxArg = adjustArrayIndex(rawIdxArg, inMethod, paramMap);
          const itemsArg = stmt.args && stmt.args[2] ? exprToNested(stmt.args[2], inMethod, paramMap) : "";
          return {
            opcode: "jwArray_splice",
            inputs: [{ ...arrayExpr, noPlaceholder: true }, idxArg, itemsArg],
          };
        }
      }
      // Build receiver object nested (stop before final property).
      let objReceiver = null;
      const first = chain[0];
      if (typeof first === "string") {
        objReceiver =
          first === "this"
            ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true }
            : mapReceiverName(first, paramMap);
      } else if (typeof first === "object") {
        objReceiver = exprToNested(first, inMethod, paramMap);
      } else {
        objReceiver = { type: "Var", name: String(first) };
      }
      if (chain.length > 2) {
        if (isClassStaticReceiverChain(chain)) {
          objReceiver = buildClassStaticReceiver(chain);
        } else {
          for (let i = 1; i < chain.length - 1; i++) {
            const prop = chain[i];
            objReceiver = makeGet(prop, objReceiver);
          }
        }
      }
      const methodGetter = makeGet(methodName, objReceiver);

      // Class detection and method param lookup deferred until after
      // the member-call flattening so we can consider `baseClassName` when
      // the receiver is an expression rather than a simple identifier.
      // DEBUG: inspect member-call class/param resolution
      // console.error("DEBUG_MEMBERCALL_STMT", { chain, className, methodName, methodParams });

      // If this MemberCall represents a chain of calls (previous call ASTs embedded),
      // flatten it and emit a sequence of stack blocks that set temps for each
      // intermediate call result. Do not emit an inline wrapper or a return
      // value here — just emit the setters/calls directly as stack blocks.
      function flattenMemberCallStmt(node) {
        const steps = [];
        let baseClassName = null;
        function helper(n) {
          if (!n) return;
          const ch = n.chain || [];
          const first = ch[0];
          if (typeof first === "object") {
            helper(first);
            const method = ch[ch.length - 1];
            steps.push({ methodName: method, args: n.args || [] });
            return;
          }
          const method = ch[ch.length - 1];
          const receiverChain = ch.slice(0, Math.max(0, ch.length - 1));
          if (receiverChain.length > 0 && typeof receiverChain[0] === "string") {
            const resolved = resolveReceiverClass(receiverChain[0], emittingClass, currentMethodParams);
            if (resolved) baseClassName = resolved;
          }
          steps.push({ receiverChain, methodName: method, args: n.args || [] });
        }
        helper(node);
        return { steps, baseClassName };
      }

      const flat = flattenMemberCallStmt(stmt);
      const steps = flat.steps || [];
      const baseClassName = flat.baseClassName || null;

      // attempt to detect method params from varToClass/classRegistry
      // Prefer `this` resolution via emittingClass, otherwise use
      // varToClass or the flattened baseClassName when the receiver
      // is an expression rather than a plain identifier.
      let className = null;
      if (typeof chain[0] === "string") {
        className = resolveReceiverClass(chain[0], emittingClass, currentMethodParams);
      } else if (baseClassName) {
        className = baseClassName;
      }
      const actualMethodName = className ? getClassMethodKey(className, methodName) : methodName;
      if (actualMethodName !== methodName) methodGetter.inputs[0] = actualMethodName;
      const methodParams = className ? getMethodParams(className, methodName) : null;
      // detect static methods on the class and prepare a synthetic receiver
      const isStaticCall = className && hasMethodFlag(className, methodName, "static");
      let staticTempName = null;
      let staticSetTemp = null;
      let staticReceiverRef = null;
      if (isStaticCall) {
        staticTempName = __pw_newTemp("__s");
        const classRefNestedLocal = getClassGlobalRef(className);
        staticSetTemp = {
          opcode: "SPtempVars_setVar",
          inputs: ["thread", staticTempName, { opcode: "jwClass_new", inputs: [classRefNestedLocal] }],
        };
        staticReceiverRef = { opcode: "SPtempVars_getVar", inputs: ["thread", staticTempName] };
        tempToClass[staticTempName] = className;
      }

      // If we have a true chain (more than one step), emit stack-level temps
      if (steps.length > 1) {
        const inlineChildren = [];
        let prevTemp = null;
        let prevReturnedLambdaArgs = null;
        let prevStepMethodName = null;
        for (let si = 0; si < steps.length; si++) {
          const step = steps[si];
          // determine receiverRef: for first step use receiverChain -> build nested receiver
          let receiverRef = null;
          if (si === 0) {
            const recvChain = step.receiverChain || [];
            if (recvChain.length === 0) receiverRef = objReceiver;
            else {
              let r =
                recvChain[0] === "this"
                  ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true }
                  : { type: "Var", name: recvChain[0] };
              for (let k = 1; k < recvChain.length; k++) r = makeGet(recvChain[k], r);
              receiverRef = r;
            }
          } else {
            receiverRef = { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] };
          }

          // determine method params if available
          let classNameForStep = null;
          if (si === 0) {
            if (
              Array.isArray(step.receiverChain) &&
              step.receiverChain.length > 0 &&
              typeof step.receiverChain[0] === "string"
            ) {
              classNameForStep = resolveReceiverClass(
                step.receiverChain[0],
                emittingClass,
                currentMethodParams,
              );
            }
          } else {
            classNameForStep = baseClassName;
          }
          const paramsForStep = classNameForStep ? getMethodParams(classNameForStep, step.methodName) : null;
          const returnsLambdaArgsForMethod = classNameForStep
            ? getMethodReturns(classNameForStep, step.methodName)
            : null;

          if (step.methodName) {
            if (Array.isArray(paramsForStep) && paramsForStep.length > 0) {
              for (let pi = 0; pi < paramsForStep.length; pi++) {
                const pname = paramsForStep[pi];
                const argExpr =
                  step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
                inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
              }
              const boundMethod = makeGet(getClassMethodKey(classNameForStep, step.methodName), receiverRef);
              const callReporter = { opcode: "jwLambda_executeR", inputs: [boundMethod, ""] };
              const tempName = __pw_newTemp("__c");
              inlineChildren.push({
                opcode: "SPtempVars_setVar",
                inputs: ["thread", tempName, callReporter],
              });
              prevTemp = tempName;
              prevReturnedLambdaArgs = Array.isArray(returnsLambdaArgsForMethod)
                ? returnsLambdaArgsForMethod.slice()
                : null;
              prevStepMethodName = step.methodName;
              continue;
            }
            const argPos =
              step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
            const boundMethod = makeGet(getClassMethodKey(classNameForStep, step.methodName), receiverRef);
            if (argPos !== "") {
              const argTemp = getArgTempForCall(classNameForStep, step.methodName);
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp, argPos] });
            }
            const callReporter = { opcode: "jwLambda_executeR", inputs: [boundMethod, ""] };
            const tempName = __pw_newTemp("__c");
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] });
            prevTemp = tempName;
            prevReturnedLambdaArgs = Array.isArray(returnsLambdaArgsForMethod)
              ? returnsLambdaArgsForMethod.slice()
              : null;
            prevStepMethodName = step.methodName;
            continue;
          }

          // call-on-return case: receiverRef is a function-valued temp
          // Also support the AST shape where the outer call's method slot is
          // null but the chain intends to call the same method again on the
          // returned object (e.g., num.add(5).add(6)). If the previous call
          // did not return a lambda and we have a prior method name,
          // synthesize a method call on the previous temp.
          if (
            !step.methodName &&
            prevStepMethodName &&
            (!Array.isArray(prevReturnedLambdaArgs) || prevReturnedLambdaArgs.length === 0) &&
            prevTemp
          ) {
            const fakeMethod = prevStepMethodName;
            const fakeParams = classNameForStep ? getMethodParams(classNameForStep, fakeMethod) : null;
            if (Array.isArray(fakeParams) && fakeParams.length > 0) {
              for (let pi = 0; pi < fakeParams.length; pi++) {
                const pname = fakeParams[pi];
                const argExpr =
                  step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
                inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
              }
              const boundMethod = makeGet(getClassMethodKey(classNameForStep, fakeMethod), {
                opcode: "SPtempVars_getVar",
                inputs: ["thread", prevTemp],
              });
              const callReporter = { opcode: "jwLambda_executeR", inputs: [boundMethod, ""] };
              const tempName = __pw_newTemp("__c");
              inlineChildren.push({
                opcode: "SPtempVars_setVar",
                inputs: ["thread", tempName, callReporter],
              });
              prevTemp = tempName;
              prevReturnedLambdaArgs = classNameForStep
                ? Array.isArray(getMethodReturns(classNameForStep, fakeMethod))
                  ? getMethodReturns(classNameForStep, fakeMethod).slice()
                  : null
                : null;
              prevStepMethodName = fakeMethod;
              continue;
            }
            const fakeArg =
              step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
            if (fakeArg !== "") {
              const argTemp = getArgTempForCall(classNameForStep, fakeMethod);
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp, fakeArg] });
            }
            const boundMethod2 = makeGet(getClassMethodKey(classNameForStep, fakeMethod), {
              opcode: "SPtempVars_getVar",
              inputs: ["thread", prevTemp],
            });
            const callReporter2 = { opcode: "jwLambda_executeR", inputs: [boundMethod2, ""] };
            const tempName2 = __pw_newTemp("__c");
            inlineChildren.push({
              opcode: "SPtempVars_setVar",
              inputs: ["thread", tempName2, callReporter2],
            });
            prevTemp = tempName2;
            prevReturnedLambdaArgs = classNameForStep
              ? Array.isArray(getMethodReturns(classNameForStep, fakeMethod))
                ? getMethodReturns(classNameForStep, fakeMethod).slice()
                : null
              : null;
            prevStepMethodName = fakeMethod;
            continue;
          }
          if (Array.isArray(prevReturnedLambdaArgs) && prevReturnedLambdaArgs.length > 0) {
            for (let pi = 0; pi < prevReturnedLambdaArgs.length; pi++) {
              const pname = prevReturnedLambdaArgs[pi];
              const argExpr =
                step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
            }
            const callReporter = { opcode: "jwLambda_executeR", inputs: [receiverRef, ""] };
            const tempName = __pw_newTemp("__c");
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] });
            prevTemp = tempName;
            prevReturnedLambdaArgs = null;
            // Once we've executed a returned-lambda, the prior `methodName`
            // should no longer be used to synthesize subsequent chained
            // method calls on the temp — clear it to avoid reusing the
            // previous method name for later steps (fixes double-invoke).
            prevStepMethodName = null;
            continue;
          }

          // fallback
          const argPos2 =
            step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
          // If we have a previously-seen method name (chained call shape) and the
          // previous call did NOT return a lambda, prefer synthesizing a method
          // call on the previous temp (jwClass_getProp on SPtempVars_getVar(prevTemp)).
          if (
            prevStepMethodName &&
            (!Array.isArray(prevReturnedLambdaArgs) || prevReturnedLambdaArgs.length === 0) &&
            prevTemp
          ) {
            if (argPos2 !== "") {
              const argTemp2 = getArgTempForCall(classNameForStep, prevStepMethodName || null);
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp2, argPos2] });
            }
            const mappedPrevMethod = classNameForStep
              ? getClassMethodKey(classNameForStep, prevStepMethodName)
              : prevStepMethodName;
            const boundMethod2 = makeGet(mappedPrevMethod, {
              opcode: "SPtempVars_getVar",
              inputs: ["thread", prevTemp],
            });
            const callReporter2 = { opcode: "jwLambda_executeR", inputs: [boundMethod2, ""] };
            const tempName2 = __pw_newTemp("__c");
            inlineChildren.push({
              opcode: "SPtempVars_setVar",
              inputs: ["thread", tempName2, callReporter2],
            });
            prevTemp = tempName2;
            prevReturnedLambdaArgs = classNameForStep
              ? Array.isArray(getMethodReturns(classNameForStep, prevStepMethodName))
                ? getMethodReturns(classNameForStep, prevStepMethodName).slice()
                : null
              : null;
            prevStepMethodName = prevStepMethodName;
          } else {
            const methodForBound = step.methodName || prevStepMethodName;
            const boundMethod2 = makeGet(getClassMethodKey(classNameForStep, methodForBound), receiverRef);
            if (argPos2 !== "") {
              const argTemp2 = getArgTempForCall(classNameForStep, methodForBound);
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp2, argPos2] });
            }
            const callReporter2 = { opcode: "jwLambda_executeR", inputs: [boundMethod2, ""] };
            const tempName2 = __pw_newTemp("__c");
            inlineChildren.push({
              opcode: "SPtempVars_setVar",
              inputs: ["thread", tempName2, callReporter2],
            });
            prevTemp = tempName2;
          }
        }

        // Emit the sequence of stack blocks directly (no inline wrapper and no return)
        return inlineChildren;
      }

      // Non-chain or single-step fallback: existing behavior
      if (Array.isArray(methodParams) && methodParams.length > 0) {
        const setters = [];
        // Build thread-scoped setters for each declared param
        for (let i = 0; i < methodParams.length; i++) {
          const pname = methodParams[i];
          const argExpr = stmt.args && stmt.args[i] ? exprToNested(stmt.args[i], inMethod, paramMap) : "";
          setters.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
        }
        // If this is a static method, ensure we create the synthetic class
        // instance first and call the method on it.
        if (isStaticCall) setters.unshift(staticSetTemp);
        const call = {
          opcode: "jwLambda_execute",
          inputs: [isStaticCall ? makeGet(actualMethodName, staticReceiverRef) : methodGetter, ""],
        };
        return [].concat(setters, [call]);
      }

      // Lambda stored as an object property (e.g. `obj.fn(a, b)`): set the
      // indexed arg temps for every argument, then execute the lambda.
      const memberLambdaInfo = getMemberLambdaInfo(chain);
      if (memberLambdaInfo) {
        const setters = buildLambdaArgSetters(memberLambdaInfo, stmt.args, inMethod, paramMap);
        const call = { opcode: "jwLambda_execute", inputs: [methodGetter, ""] };
        return [].concat(setters, [call]);
      }

      // fallback: set a synthetic thread var for the first arg then call
      const argNested =
        stmt.args && stmt.args.length > 0 ? exprToNested(stmt.args[0], inMethod, paramMap) : "";
      if (argNested !== "") {
        // Prefer tagged param name when available so internal class
        // calls reuse the same thread-var id as the method declaration.
        let argTempName = null;
        if (Array.isArray(methodParams) && methodParams.length > 0) argTempName = methodParams[0];
        else {
          const paramsArr = className ? getMethodParams(className, methodName) : null;
          if (Array.isArray(paramsArr) && paramsArr.length > 0) argTempName = paramsArr[0];
          else argTempName = getArgTempForCall(className, methodName);
        }
        const setter = { opcode: "SPtempVars_setVar", inputs: ["thread", argTempName, argNested] };
        if (isStaticCall)
          return [].concat([
            staticSetTemp,
            setter,
            { opcode: "jwLambda_execute", inputs: [makeGet(actualMethodName, staticReceiverRef), ""] },
          ]);
        const call = { opcode: "jwLambda_execute", inputs: [methodGetter, ""] };
        return [].concat([setter], [call]);
      }
      if (isStaticCall)
        return { opcode: "jwLambda_execute", inputs: [makeGet(actualMethodName, staticReceiverRef), ""] };
      return { opcode: "jwLambda_execute", inputs: [methodGetter, ""] };
    }
    if (stmt.type === "Declare") {
      // Determine destination scope for declared variable
      const destType = varScopeForName(stmt.name, inMethod, paramMap, stmt.kind);
      if (stmt.value) {
        const vinfo = varToLambda[stmt.name];
        const mapped = vinfo && vinfo.map ? vinfo.map : paramMap;
        const valueNested = exprToNested(stmt.value, inMethod, mapped);
        return {
          opcode: "SPtempVars_setVar",
          inputs: [destType, stmt.name, valueNested],
        };
      }
      return { opcode: "SPtempVars_setVar", inputs: [destType, stmt.name, ""] };
    }
    if (stmt.type === "Return") {
      // Only allowed inside class methods or lambdas (inMethod flag)
      if (!inMethod) throw new Error("'return' used outside of a method or lambda is not allowed");
      let val = stmt.value ? exprToNested(stmt.value, inMethod, paramMap) : "";
      // If the return is a simple variable reference, emit an explicit
      // SPtempVars_getVar here using the centralized scope decision so the
      // generator doesn't have to rely on varInfo ordering.
      if (val && typeof val === "object" && val.type === "Var") {
        const vname = val.name;
        const getterType = varScopeForName(vname, inMethod, paramMap, undefined);
        val = { opcode: "SPtempVars_getVar", inputs: [getterType, String(vname)] };
      }
      // If returned value is a block-like object, reject only if its
      // block shape is a stack/branch (i.e., not a reporter). Allow
      // reporter-type blocks that may include substack inputs (e.g., lambdas).
      //console.log(val)
      if (val && typeof val === "object" && val.opcode) {
        const meta =
          blocksMeta[val.opcode] || blocksMeta[val.opcode.replace(/^operator_/, "operator_")] || null;
        const shape = meta ? meta[1] : null;
        if (shape === "stack" || shape === "branch") {
          console.error("Return value opcode:", val.opcode, "meta:", meta, "shape:", shape);
          throw new Error("'return' value cannot be a stack/branch block");
        }
      }
      return { opcode: "procedures_return", inputs: [val] };
    }
    if (stmt.type === "Assign") {
      // memberChain indicates a member assignment like `obj.prop = val` or `this.prop = val`
      if (stmt.memberChain && Array.isArray(stmt.memberChain) && stmt.memberChain.length >= 2) {
        const chain = stmt.memberChain;
        let objReceiver =
          chain[0] === "this"
            ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true }
            : { type: "Var", name: chain[0] };
        if (chain.length > 2) {
          for (let i = 1; i < chain.length - 1; i++) {
            const prop = chain[i];
            objReceiver = makeGet(prop, objReceiver);
          }
        }
        const propName = chain[chain.length - 1];
        // If RHS is a Binary with a null/undefined left (common parser shape
        // for `this.prop = this.prop + X`), synthesize the left operand as a
        // member access to the same chain so the emitted binary has a proper
        // getter for the existing property value.
        let val = null;
        if (
          stmt.value &&
          stmt.value.type === "Binary" &&
          (stmt.value.left === null || typeof stmt.value.left === "undefined")
        ) {
          let leftNested = null;
          if (chain[0] === "this") {
            leftNested = makeGet(propName, { opcode: "jwClass_self", inputs: [], noPlaceholder: true });
          } else {
            leftNested = exprToNested({ type: "Member", chain: chain.slice() }, inMethod, paramMap);
          }
          const rightNested = exprToNested(stmt.value.right, inMethod, paramMap);
          const op = generator.mapOpToOpcode(stmt.value.op);
          val = { opcode: op, inputs: [leftNested, rightNested] };
        } else {
          val = exprToNested(stmt.value, inMethod, paramMap);
        }
        // If the class defines a setter for this property, emit a call to
        // the setter method instead of a direct jwClass_setProp.
        let detectedClass = null;
        detectedClass = resolveReceiverClass(chain[0], emittingClass, currentMethodParams);
        if (detectedClass && hasMethodFlag(detectedClass, propName, "setter")) {
          // Prepare argument for setter
          const setterParams = getMethodParams(detectedClass, propName, "setter");
          const setters = [];
          if (Array.isArray(setterParams) && setterParams.length > 1) {
            // Setter params include [propertyName, actualParam, ...], so use index 1
            const pname = setterParams[1];
            setters.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, val] });
          } else {
            const at = getArgTempForCall(detectedClass, propName, "setter");
            setters.push({ opcode: "SPtempVars_setVar", inputs: ["thread", at, val] });
          }
          const setterReceiver =
            typeof chain[0] === "string" &&
              chain[0] !== "this" &&
              classRegistry[chain[0]] &&
              hasMethodFlag(detectedClass, propName, "static")
              ? getClassGlobalRef(detectedClass)
              : objReceiver;
          const setterGetter = hasMethodFlag(detectedClass, propName, "static")
            ? getClassStaticGet(detectedClass, getClassMethodKey(detectedClass, propName, "setter"))
            : makeGet(getClassMethodKey(detectedClass, propName, "setter"), setterReceiver);
          const call = { opcode: "jwLambda_execute", inputs: [setterGetter, ""] };
          return [].concat(setters, [call]);
        }
        if (chain[0] === "this" && emittingClass && emittingStaticMethod) {
          if (chain.length === 2) {
            return getClassStaticSet(emittingClass, propName, val);
          }
          let receiverRef = getClassStaticGet(emittingClass, chain[1]);
          for (let i = 2; i < chain.length - 1; i++) {
            receiverRef = makeGet(chain[i], receiverRef);
          }
          return makeSet(propName, receiverRef, val);
        }
        if (typeof chain[0] === "string" && classRegistry[chain[0]]) {
          if (chain.length === 2) {
            return getClassStaticSet(chain[0], propName, val);
          }
          let receiverRef = getClassStaticGet(chain[0], chain[1]);
          for (let i = 2; i < chain.length - 1; i++) {
            receiverRef = makeGet(chain[i], receiverRef);
          }
          return makeSet(propName, receiverRef, val);
        }
        if (chain.length === 2 && typeof chain[0] === "string" && chain[0] !== "this") {
          const destType = varScopeForName(chain[0], inMethod, paramMap, undefined);
          return {
            opcode: "SPtempVars_setVar",
            inputs: [destType, chain[0], makeSet(propName, objReceiver, val)],
          };
        }
        return makeSet(propName, objReceiver, val);
      }
      const destType = varScopeForName(stmt.name, inMethod, paramMap, stmt.kind);
      return {
        opcode: "SPtempVars_setVar",
        inputs: [
          destType,
          stmt.name || "",
          (() => {
            const vinfo = varToLambda[stmt.name];
            const mapped = vinfo && vinfo.map ? vinfo.map : paramMap;
            return exprToNested(stmt.value, inMethod, mapped);
          })(),
        ],
      };
    }
    if (stmt.type === "While") {
      const cond = stmt.cond ? exprToNested(stmt.cond, inMethod, paramMap) : false;
      const raw =
        stmt.body && stmt.body.body
          ? stmt.body.body.map((s) => stmtToNested(s, inMethod, paramMap)).filter(Boolean)
          : [];
      const children = flattenNestedResults(raw);
      assertReturnTerminal(children, "while body");
      return { opcode: "control_while", inputs: [cond, children] };
    }
    if (stmt.type === "For") {
      // init -> start, cond -> end, update -> inc
      let varName = "";
      let start = 0;
      let end = 0;
      let inc = 1;
      if (stmt.init) {
        if ((stmt.init.type === "Declare" || stmt.init.type === "Assign") && stmt.init.name) {
          varName = stmt.init.name;
          if (stmt.init.value) start = exprToNested(stmt.init.value, inMethod, paramMap);
        }
      }
      if (stmt.cond) {
        // if cond is a Binary comparing var to value, extract the RHS as end
        if (
          stmt.cond.type === "Binary" &&
          stmt.cond.left &&
          stmt.cond.left.type === "Var" &&
          stmt.cond.left.name === varName
        ) {
          end = exprToNested(stmt.cond.right, inMethod, paramMap);
        } else {
          end = exprToNested(stmt.cond, inMethod, paramMap);
        }
      }
      // Adjust end to be exclusive like JS for loops, since SPTempVars_forVar is inclusive
      if (typeof end === "number") end -= 1;
      else if (end && typeof end === "object") end = { opcode: "operator_subtract", inputs: [end, 1] };
      if (stmt.update) {
        // handle `i = i + N` style updates
        if (stmt.update.type === "Assign" && stmt.update.value && stmt.update.value.type === "Binary") {
          const bin = stmt.update.value;
          if (bin.right) inc = exprToNested(bin.right, inMethod, paramMap);
          if (bin.op === "-") inc = typeof inc === "number" ? -inc : inc;
        } else if (stmt.update.type === "Unary" && (stmt.update.op === "++" || stmt.update.op === "--")) {
          // prefix ++/-- in for-update: use numeric step when it's the loop var
          const t = stmt.update.operand;
          if (t && t.type === "Var" && t.name === varName) inc = stmt.update.op === "++" ? 1 : -1;
          else inc = exprToNested(stmt.update, inMethod, paramMap);
        } else if (stmt.update.type === "Postfix" && (stmt.update.op === "++" || stmt.update.op === "--")) {
          const t = stmt.update.operand;
          if (t && t.type === "Var" && t.name === varName) inc = stmt.update.op === "++" ? 1 : -1;
          else inc = exprToNested(stmt.update, inMethod, paramMap);
        } else {
          inc = exprToNested(stmt.update, inMethod, paramMap);
        }
      }
      // Track the loop counter so references to it inside the body resolve to
      // "thread", matching the hard-coded "thread" used for the forVar itself.
      if (varName) loopVarStack.push(varName);
      const raw =
        stmt.body && stmt.body.body
          ? stmt.body.body.map((s) => stmtToNested(s, inMethod, paramMap)).filter(Boolean)
          : [];
      if (varName) loopVarStack.pop();
      const body = flattenNestedResults(raw);
      assertReturnTerminal(body, "for body");
      return { opcode: "SPtempVars_forVar", inputs: ["thread", varName, start, end, body, inc] };
    }
    if (stmt.type === "Break") {
      return { opcode: "control_exitLoop" };
    }
    if (stmt.type === "Continue") {
      return { opcode: "control_continueLoop" };
    }
    if (stmt.type === "Class") {
      // Create a class object and assign to a temp/global variable with the class name
      // Build jwClass_class nested block with NAME and SUBSTACK setting methods
      const className = stmt.name;
      // build substack array: each method becomes a jwClass_setProp block
      const substackBlocks = [];
      const staticSubstackBlocks = [];
      // set emittingClass for the duration of emitting this class's members
      const _prevEmittingClass = emittingClass;
      emittingClass = className;
      for (const m of stmt.members || []) {
        // If the member is a normal method declaration (visitClassMember),
        // `m` will be a Method node with `name`, `params`, and `body`.
        if (m && m.type === "Method") {
          lambdasUsed = true;
          // Use pre-collected tagged param names when available so
          // method declarations and call-sites agree on the thread-var names.
          const taggedParams = getMethodParams(
            className,
            m.name,
            m.getter ? "getter" : m.setter ? "setter" : "method",
          );
          let lambdaArg = null;
          if (Array.isArray(taggedParams) && taggedParams.length > 0) lambdaArg = taggedParams.slice();
          else if (m.params && m.params.length > 0)
            lambdaArg = m.params.length === 1 ? m.params[0] : m.params.slice();
          else lambdaArg = { opcode: "jwLambda_arg", shadow: true, noPlaceholder: true };

          // Build a methodParamMap mapping original param names -> tagged names
          let methodParamMap = null;
          if (Array.isArray(taggedParams) && Array.isArray(m.params)) {
            methodParamMap = {};
            for (let i = 0; i < m.params.length; i++) {
              const orig = m.params[i];
              const tagged = taggedParams[i];
              if (orig && tagged) methodParamMap[orig] = tagged;
            }
          }
          // If this method has a recorded returned-lambda, merge its param mappings
          // into the methodParamMap so inner returned-lambda params are emitted
          // using the same tagged names inside the method body.
          const kind = m.getter ? "getter" : m.setter ? "setter" : "method";
          const retOrig = getMethodReturnOriginals(className, m.name, kind);
          const retTagged = getMethodReturns(className, m.name, kind);
          if (Array.isArray(retOrig) && Array.isArray(retTagged) && retOrig.length === retTagged.length) {
            if (!methodParamMap) methodParamMap = {};
            for (let i = 0; i < retOrig.length; i++) {
              const o = retOrig[i];
              const t = retTagged[i];
              if (o && t) methodParamMap[o] = t;
            }
          }

          let methodBody = [];
          if (m.body && Array.isArray(m.body.body)) {
            const _prevMethodKey = currentEmittingMethodKey;
            const _prevEmittingStaticMethod = emittingStaticMethod;
            const _prevMethodParams = currentMethodParams;
            emittingStaticMethod = !!m.static;
            currentEmittingMethodKey = `${className}:${m.name}`;
            currentMethodParams = Array.isArray(m.params) ? m.params.slice() : [];
            const raw = m.body.body.map((s) => stmtToNested(s, true, methodParamMap)).filter(Boolean);
            methodBody = flattenNestedResults(raw);
            assertReturnTerminal(methodBody, `method '${m.name}' body`);
            currentEmittingMethodKey = _prevMethodKey;
            emittingStaticMethod = _prevEmittingStaticMethod;
            currentMethodParams = _prevMethodParams;
          }
          let lambdaBlock = null;
          // Getters and setters are emitted as ordinary class methods;
          // property getter/setter access is compiled to method calls.
          if (m.generator) {
            // Convert any `jw_yield(...)` calls in the methodBody into
            // `jwArray_builderAppend` stack blocks so we can build an
            // array of yielded values by running the original body as a
            // substack. This preserves side-effects while collecting
            // yielded values eagerly into an array returned by the
            // generator factory lambda.
            function replaceYields(node) {
              if (Array.isArray(node)) return node.map(replaceYields);
              if (!node || typeof node !== "object") return node;
              // Detect builder-yield call shapes (opcode or name)
              const op = node.opcode || node.name;
              if (op === "jw_yield") {
                const val = Array.isArray(node.inputs) && node.inputs.length > 0 ? node.inputs[0] : "";
                return { opcode: "jwArray_builderAppend", inputs: [val] };
              }
              // Recurse into inputs arrays and children/substacks
              const out = Object.assign({}, node);
              if (Array.isArray(out.inputs)) {
                out.inputs = out.inputs.map((inp) => {
                  if (Array.isArray(inp)) return inp.map(replaceYields);
                  if (inp && typeof inp === "object") return replaceYields(inp);
                  return inp;
                });
              }
              if (Array.isArray(out.children)) out.children = out.children.map(replaceYields);
              return out;
            }

            const builderSubstack = methodBody.map(replaceYields);
            const builderBlock = {
              opcode: "jwArray_builder",
              inputs: [
                { opcode: "jwArray_builderCurrent", shadow: true, noPlaceholder: true },
                builderSubstack,
              ],
            };
            lambdaBlock = { opcode: "jwLambda_newLambdaR", inputs: [lambdaArg, builderBlock] };
          } else {
            lambdaBlock = { opcode: "jwLambda_newLambda", inputs: [lambdaArg, methodBody] };
          }
          // If method marked `static`, attach to the class object via static setter.
          const methodKey = getClassMethodKey(
            className,
            m.name,
            m.getter ? "getter" : m.setter ? "setter" : "method",
          );
          const _prevEmittingClassStaticInit = emittingClassStaticInit;
          if (m.static) emittingClassStaticInit = true;
          const setProp = m.static
            ? getClassStaticSet(className, methodKey, lambdaBlock)
            : makeSet(methodKey, { opcode: "jwClass_self", inputs: [], noPlaceholder: true }, lambdaBlock);
          emittingClassStaticInit = _prevEmittingClassStaticInit;
          if (m.static) staticSubstackBlocks.push(setProp);
          else substackBlocks.push(setProp);
          continue;
        }

        // If the member is an assignment inside the class body (e.g., `this.foo = ...;`),
        // convert it into a jwClass_setProp attaching the value to the class (SELF).
        if (m && m.type === "Assign" && Array.isArray(m.memberChain) && m.memberChain.length >= 2) {
          const chain = m.memberChain;
          const propName = chain[chain.length - 1];
          // Workaround: some parser output produces a Binary RHS with a null
          // left when the expression is of the form `this.prop = this.prop + X`.
          // In that case synthesize the left operand as a getter for the same
          // memberChain so the binary op becomes (this.prop + X).
          let val = null;
          if (
            m.value &&
            m.value.type === "Binary" &&
            (m.value.left === null || typeof m.value.left === "undefined")
          ) {
            let leftNested = null;
            const propNameLocal = propName;
            if (chain[0] === "this") {
              leftNested = makeGet(propNameLocal, {
                opcode: "jwClass_self",
                inputs: [],
                noPlaceholder: true,
              });
            } else {
              leftNested = exprToNested({ type: "Member", chain: chain.slice() }, inMethod, paramMap);
            }
            const rightNested = exprToNested(m.value.right, inMethod, paramMap);
            const op = generator.mapOpToOpcode(m.value.op);
            val = { opcode: op, inputs: [leftNested, rightNested] };
          } else {
            val = exprToNested(m.value, inMethod, paramMap);
          }
          let setProp;
          if (chain[0] === "this" && m.static) {
            const _prevEmittingClassStaticInit = emittingClassStaticInit;
            emittingClassStaticInit = true;
            if (chain.length === 2) {
              setProp = getClassStaticSet(className, propName, val);
            } else {
              let receiverRef = getClassStaticGet(className, chain[1]);
              for (let i = 2; i < chain.length - 1; i++) {
                receiverRef = makeGet(chain[i], receiverRef);
              }
              setProp = makeSet(propName, receiverRef, val);
            }
            emittingClassStaticInit = _prevEmittingClassStaticInit;
            staticSubstackBlocks.push(setProp);
          } else if (typeof chain[0] === "string" && chain[0] !== "this" && classRegistry[chain[0]]) {
            const _prevEmittingClassStaticInit = emittingClassStaticInit;
            emittingClassStaticInit = true;
            if (chain.length === 2) {
              setProp = getClassStaticSet(chain[0], propName, val);
            } else {
              let receiverRef = getClassStaticGet(chain[0], chain[1]);
              for (let i = 2; i < chain.length - 1; i++) {
                receiverRef = makeGet(chain[i], receiverRef);
              }
              setProp = makeSet(propName, receiverRef, val);
            }
            emittingClassStaticInit = _prevEmittingClassStaticInit;
            staticSubstackBlocks.push(setProp);
          } else {
            setProp = makeSet(propName, { opcode: "jwClass_self", inputs: [], noPlaceholder: true }, val);
            substackBlocks.push(setProp);
          }
          continue;
        }

        // Other member shapes can be ignored or handled in future (e.g., declarations).
      }
      // restore previous emittingClass context
      emittingClass = _prevEmittingClass;
      emittingClassStaticInit = false;

      const classBlock = {
        opcode: "jwClass_class",
        inputs: [
          className,
          { opcode: "jwClass_self", inputs: [], shadow: true, noPlaceholder: true },
          substackBlocks,
          { opcode: "jwClass_self", inputs: [], shadow: true, noPlaceholder: true },
          staticSubstackBlocks,
        ],
      };
      // assign into temp/global var using SPtempVars_setVar (simplified inputs form)
      return { opcode: "SPtempVars_setVar", inputs: ["global", className, classBlock] };
    }
    // If stmt.type is missing/undefined, skip emitting a block for it.
    if (!stmt.type) return null;
    //console.log("Unhandled stmt type:", stmt.type);
    return { opcode: stmt.type, inputs: [] };
  }

  // top-level AST -> nestedInput. Emit `On` nodes as hat blocks, and
  // emit other top-level statements directly (no fake hat wrapper).
  // If stmtToNested returns an array (sequence of blocks), expand it
  // into multiple top-level nested items so sequential statements
  // (e.g., setter blocks + a call) are emitted in order.
  nestedInput = [];
  // Determine up front whether the user already wrote their own _INTERNAL__runtime_typeof__AABBCCDDEE12123434__.
  // Whether *we* need to inject one is only known after conversion below.
  const userDefinedRuntimeTypeof = hasRuntimeTypeofDefinition(ast);

  for (const s of ast) {
    if (s && s.type === "On") {
      let opcode = s.event;
      switch (s.event) {
        case "flag": opcode = "event_whenflagclicked"; break;
        case "click": opcode = "event_whenthisspriteclicked"; break;
        default: opcode = s.event;
      }
      const rawChildren =
        s.body && s.body.body ? s.body.body.map((c) => stmtToNested(c, false)).filter(Boolean) : [];
      const children = [];
      for (const c of rawChildren) {
        if (Array.isArray(c)) children.push(...c);
        else children.push(c);
      }
      nestedInput.push({ opcode, children });
    } else {
      const node = stmtToNested(s);
      if (!node) continue;
      if (Array.isArray(node)) {
        for (const n of node) if (n) nestedInput.push(n);
      } else {
        nestedInput.push(node);
      }
    }
  }

  // Only NOW do we know whether any `typeof` fell back to the runtime helper
  // (set inside exprToNested during the loop above). Inject it post hoc.
  if (runtimeTypeofHelperUsed && !userDefinedRuntimeTypeof) {
    const helperOn = buildRuntimeTypeofHelperDecl();
    const rawChildren =
      helperOn.body && helperOn.body.body
        ? helperOn.body.body.map((c) => stmtToNested(c, false)).filter(Boolean)
        : [];
    const children = [];
    for (const c of rawChildren) {
      if (Array.isArray(c)) children.push(...c);
      else children.push(c);
    }
    nestedInput.unshift({ opcode: "event_whenflagclicked", children });
  }
}

// Now always use nested input for generation
let emitResult;
try {
  // DEBUG: dump nested representation to inspect emitted class/new/method shapes
  try {
    //require("fs").writeFileSync("/tmp/pang_nested_debug.json", JSON.stringify(nestedInput, null, 2), "utf8");
  } catch (e) { }
  //console.error("DEBUG_NESTED:\n" + JSON.stringify(nestedInput, null, 2));
  emitResult = generator.generateFromNested(nestedInput);
  try {
    //require("fs").writeFileSync("/tmp/emitResult_debug.json", JSON.stringify(emitResult, null, 2), "utf8");
  } catch (e) { }
  // quick validation: ensure emitted pseudocode blocks look reasonable
  try {
    if (emitResult && Array.isArray(emitResult.blocks)) {
      for (let i = 0; i < emitResult.blocks.length; i++) {
        const b = emitResult.blocks[i];
        if (!b || typeof b !== "object" || !b.opcode)
          console.error("BAD_PSEUDO_BLOCK", i, JSON.stringify(b, null, 2));
      }
    } else {
      console.error(
        "EMIT_RESULT_BLOCKS",
        typeof emitResult.blocks,
        JSON.stringify(emitResult.blocks, null, 2),
      );
    }
  } catch (e) {
    console.error("EmitResult validation error", e && e.message);
  }
  // dump emitResult to temp file for debugging malformed pseudocode
  try {
    fs.writeFileSync("pang_emit_debug.json", JSON.stringify(emitResult, null, 2), "utf8");
  } catch (e) {
    // ignore write errors
  }
} catch (e) {
  console.error("Emit error:", (e && e.message) || e);
  if (e && e.stack) console.error(e.stack);
  process.exit(1);
}

// If the AST/path-based detection didn't mark classes as used, also
// inspect the nested input / pseudocode for any jwClass opcodes so we
// reliably include the jwClass extension when needed (handles cases
// where input was provided as nested JSON or parser wasn't regenerated).
function nestedContainsOpcode(obj, prefix) {
  if (!obj) return false;
  if (Array.isArray(obj)) {
    for (const el of obj) if (nestedContainsOpcode(el, prefix)) return true;
    return false;
  }
  if (typeof obj === "object") {
    if (obj.opcode && typeof obj.opcode === "string" && obj.opcode.startsWith(prefix)) return true;
    if (obj.name && typeof obj.name === "string" && obj.name.startsWith(prefix)) return true;
    if (obj.children && nestedContainsOpcode(obj.children, prefix)) return true;
    if (obj.inputs && nestedContainsOpcode(obj.inputs, prefix)) return true;
    // Check properties recursively (safe guard for nested shapes)
    for (const k of Object.keys(obj)) {
      if (nestedContainsOpcode(obj[k], prefix)) return true;
    }
  }
  return false;
}

if (!usedClasses) {
  if (
    nestedContainsOpcode(nestedInput, "jwClass") ||
    (emitResult && nestedContainsOpcode(emitResult.blocks || [], "jwClass"))
  ) {
    usedClasses = true;
  }
}

// Convert pseudocode blocks into a real project.json `blocks` object
const pseudoConverter = require("./lib/pseudocodeToProject");
try {
  //require("fs").writeFileSync("/tmp/emitResult_debug.json", JSON.stringify(emitResult, null, 2), "utf8");
} catch (e) {
  // ignore debug write errors
}
const projectBlocks = pseudoConverter.convert(emitResult);
// projectBlocks is an object keyed by id — place into out.targets[1].blocks later

// Produce final project JSON, preserving exact skeleton
const out = JSON.parse(JSON.stringify(TEMPLATE));
out.targets[1].blocks = projectBlocks;
//console.log(JSON.stringify(projectBlocks, null, 2));
// Never emit native target variables; always use SPtempVars extension for variables.
out.targets[1].variables = {};
// Also remove any template stage variables so the output contains no builtin variables.
out.targets[0].variables = {};
out.targets[0].blocks = out.targets[0].blocks || {};

if (arraysUsed) {
  // Ensure arrays extension declared if emitter created arrays
  out.extensions = out.extensions || [];
  if (!out.extensions.includes("jwArray")) out.extensions.push("jwArray");
}

if (lambdasUsed) {
  // Ensure lambdas extension declared if emitter created lambdas
  out.extensions = out.extensions || [];
  if (!out.extensions.includes("jwLambda")) out.extensions.push("jwLambda");
}

if (objectsUsed) {
  // Ensure Objects extension declared if emitter created object literals
  out.extensions = out.extensions || [];
  if (!out.extensions.includes("dogeiscutObject")) out.extensions.push("dogeiscutObject");
  out.extensionURLs = out.extensionURLs || {};
  out.extensionURLs.dogeiscutObject =
    out.extensionURLs.dogeiscutObject ||
    "https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js";
}

// Ensure SPtempVars extension declared if emitter created variables (we keep variables in SPtempVars, not target.vars)
if (emitResult && emitResult.variables && Object.keys(emitResult.variables).length > 0) {
  out.extensions = out.extensions || [];
  if (!out.extensions.includes("SPtempVars")) out.extensions.push("SPtempVars");
  out.extensionURLs = out.extensionURLs || {};
  out.extensionURLs.SPtempVars =
    out.extensionURLs.SPtempVars ||
    "https://sharkpools-extensions.vercel.app/extension-code/Temporary-Variables.js";
}
// Add pmControlsExpansion extension if ask() was used
if (emitResult && emitResult.askUsed) {
  out.extensions = out.extensions || [];
  if (!out.extensions.includes("pmControlsExpansion")) out.extensions.push("pmControlsExpansion");
}

// Add pmOperatorsExpansion if strict equality '===' or other pmOperatorsExpansion ops were used
if (emitResult && emitResult.pmOperatorsExpansion_used) {
  out.extensions = out.extensions || [];
  if (!out.extensions.includes("pmOperatorsExpansion")) out.extensions.push("pmOperatorsExpansion");
}
//console.log(usedClasses);
if (usedClasses) {
  out.extensions = out.extensions || [];
  if (!out.extensions.includes("jwClass")) {
    out.extensions.push("jwClass");
    out.extensionURLs = out.extensionURLs || {};
    out.extensionURLs.jwClass =
      out.extensionURLs.jwClass || // jwClass backported from port to old compiler non core extension(unsandboxed), with some added features
      "data:text/javascript;base64,KGZ1bmN0aW9uIChTY3JhdGNoKSB7CiAgICAndXNlIHN0cmljdCc7CiAKICAgIGlmICghU2NyYXRjaC5leHRlbnNpb25zLnVuc2FuZGJveGVkKSB7CiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdqd0NsYXNzIG11c3QgYmUgbG9hZGVkIGFzIGFuIHVuc2FuZGJveGVkIFR1cmJvV2FycCBleHRlbnNpb24uJyk7CiAgICB9CiAKICAgIGNvbnN0IHZtID0gU2NyYXRjaC52bTsKICAgIGNvbnN0IHJ1bnRpbWUgPSB2bS5ydW50aW1lOwogCiAgICBjb25zdCBCbG9ja1R5cGUgPSBTY3JhdGNoLkJsb2NrVHlwZTsKICAgIGNvbnN0IEFyZ3VtZW50VHlwZSA9IFNjcmF0Y2guQXJndW1lbnRUeXBlOwogICAgY29uc3QgQmxvY2tTaGFwZSA9IFNjcmF0Y2guQmxvY2tTaGFwZSB8fCB7CiAgICAgICAgU1FVQVJFOiAnc3F1YXJlJywKICAgICAgICBUSUNLRVQ6ICd0aWNrZXQnCiAgICB9OwogCiAgICBjb25zdCBwbVN5bWJvbCA9IFNjcmF0Y2gucG1TeW1ib2wgfHwgewogICAgICAgIGVxdWFsczogU3ltYm9sLmZvcigncG0uZXF1YWxzJykKICAgIH07CiAKICAgIGNvbnN0IGVzY2FwZUhUTUwgPSB1bnNhZmUgPT4gewogICAgICAgIHJldHVybiBTdHJpbmcodW5zYWZlKQogICAgICAgICAgICAucmVwbGFjZUFsbCgnJicsICcmYW1wOycpCiAgICAgICAgICAgIC5yZXBsYWNlQWxsKCc8JywgJyZsdDsnKQogICAgICAgICAgICAucmVwbGFjZUFsbCgnPicsICcmZ3Q7JykKICAgICAgICAgICAgLnJlcGxhY2VBbGwoJyInLCAnJnF1b3Q7JykKICAgICAgICAgICAgLnJlcGxhY2VBbGwoIiciLCAnJiMwMzk7Jyk7CiAgICB9OwogCiAgICBjb25zdCBjbGFzc1N5bWJvbCA9IFN5bWJvbCgnY2xhc3MnKTsKIAogICAgbGV0IGRvZ2Vpc2N1dE9iamVjdCA9IHsKICAgICAgICBUeXBlOiBjbGFzcyB7fSwKICAgICAgICBCbG9jazoge30sCiAgICAgICAgQXJndW1lbnQ6IHt9CiAgICB9OwogCiAgICBsZXQgandQb2ludGVyID0gewogICAgICAgIFR5cGU6IGNsYXNzIHt9LAogICAgICAgIEJsb2NrOiB7fSwKICAgICAgICBBcmd1bWVudDoge30KICAgIH07CiAKICAgIGNvbnN0IHJlZnJlc2hEZXBzID0gKCkgPT4gewogICAgICAgIGlmICh2bS5kb2dlaXNjdXRPYmplY3QpIGRvZ2Vpc2N1dE9iamVjdCA9IHZtLmRvZ2Vpc2N1dE9iamVjdDsKICAgICAgICBpZiAodm0uandQb2ludGVyKSBqd1BvaW50ZXIgPSB2bS5qd1BvaW50ZXI7CiAgICB9OwogCiAgICBjbGFzcyBDbGFzc1R5cGUgewogICAgICAgIGNvbnN0cnVjdG9yKGNvbnN0cnVjdCA9IGZ1bmN0aW9uKiAoKSB7fSwgbmFtZSA9ICcnLCBleHRlbnNpb24gPSBudWxsLCBwcm9jID0gbnVsbCwgc3RhdGljQ29uc3RydWN0ID0gZnVuY3Rpb24qICgpIHt9KSB7CiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0ID0gY29uc3RydWN0OwogICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lOwogICAgICAgICAgICB0aGlzLmV4dGVuc2lvbiA9IGV4dGVuc2lvbjsKICAgICAgICAgICAgdGhpcy5wcm9jID0gcHJvYyA/PyB7fTsKICAgICAgICAgICAgdGhpcy5zdGF0aWMgPSB7fTsKICAgICAgICAgICAgdGhpcy5zdGF0aWNDb25zdHJ1Y3QgPSBzdGF0aWNDb25zdHJ1Y3Q7CiAgICAgICAgfQogCiAgICAgICAgdG9TdHJpbmcoKSB7CiAgICAgICAgICAgIHJldHVybiB0aGlzLm5hbWUubGVuZ3RoID4gMCA/IGBDbGFzczwke3RoaXMubmFtZX0+YCA6ICdDbGFzcyc7CiAgICAgICAgfQogCiAgICAgICAgandBcnJheUhhbmRsZXIoKSB7CiAgICAgICAgICAgIHJldHVybiBlc2NhcGVIVE1MKHRoaXMudG9TdHJpbmcoKSk7CiAgICAgICAgfQogCiAgICAgICAgc3RhdGljIHRvQ2xhc3ModikgewogICAgICAgICAgICBpZiAodiBpbnN0YW5jZW9mIENsYXNzVHlwZSkgcmV0dXJuIHY7CiAgICAgICAgICAgIHJldHVybiBuZXcgQ2xhc3NUeXBlKCk7CiAgICAgICAgfQogCiAgICAgICAgY3JlYXRlSW5zdGFuY2UgPSBmdW5jdGlvbiogKHRocmVhZCwgdGFyZ2V0KSB7CiAgICAgICAgICAgIHJlZnJlc2hEZXBzKCk7CiAKICAgICAgICAgICAgaWYgKHRoaXMucHJvYykgdGhyZWFkLnByb2NlZHVyZXMgPSB7IC4uLnRoaXMucHJvYywgLi4udGhyZWFkLnByb2NlZHVyZXMgfTsKCiAgICAgICAgICAgIGlmICghdGhpcy5leHRlbnNpb24pIHsKICAgICAgICAgICAgICAgIGxldCBvYmplY3QgPSBuZXcgZG9nZWlzY3V0T2JqZWN0LlR5cGUoKTsKICAgICAgICAgICAgICAgIG9iamVjdC5tYXAuc2V0KGNsYXNzU3ltYm9sLCB0aGlzKTsKICAgICAgICAgICAgICAgIGxldCBwb2ludGVyID0gandQb2ludGVyLlR5cGUuY3JlYXRlKCk7CiAgICAgICAgICAgICAgICBwb2ludGVyLnZhbHVlID0gb2JqZWN0OwogICAgICAgICAgICAgICAgeWllbGQqIHRoaXMuY29uc3RydWN0KHBvaW50ZXIsIHRocmVhZCwgdGFyZ2V0KTsKICAgICAgICAgICAgICAgIHJldHVybiBwb2ludGVyOwogICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgbGV0IHBvaW50ZXIgPSB5aWVsZCogdGhpcy5leHRlbnNpb24uY3JlYXRlSW5zdGFuY2UodGhyZWFkLCB0YXJnZXQpOwogICAgICAgICAgICAgICAgbGV0IG9iamVjdCA9IHBvaW50ZXIudmFsdWU7CiAgICAgICAgICAgICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgZG9nZWlzY3V0T2JqZWN0LlR5cGUpIG9iamVjdC5tYXAuc2V0KGNsYXNzU3ltYm9sLCB0aGlzKTsKICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLmNvbnN0cnVjdChwb2ludGVyLCB0aHJlYWQsIHRhcmdldCk7CiAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnRlcjsKICAgICAgICAgICAgfQogICAgICAgIH07CiAKICAgICAgICBleHRlbmQoZXh0ZW5zaW9uKSB7CiAgICAgICAgICAgIHJldHVybiBuZXcgQ2xhc3NUeXBlKHRoaXMuY29uc3RydWN0LCB0aGlzLm5hbWUsIGV4dGVuc2lvbiwgdGhpcy5wcm9jLCB0aGlzLnN0YXRpY0NvbnN0cnVjdCk7CiAgICAgICAgfQogCiAgICAgICAgW3BtU3ltYm9sLmVxdWFsc10ob3RoZXIpIHsKICAgICAgICAgICAgcmV0dXJuIHRoaXMgPT09IG90aGVyOwogICAgICAgIH0KICAgIH0KIAogICAgY29uc3QgandDbGFzcyA9IHsKICAgICAgICBUeXBlOiBDbGFzc1R5cGUsCiAgICAgICAgQmxvY2s6IHsKICAgICAgICAgICAgYmxvY2tUeXBlOiBCbG9ja1R5cGUuUkVQT1JURVIsCiAgICAgICAgICAgIGJsb2NrU2hhcGU6IEJsb2NrU2hhcGUuVElDS0VULAogICAgICAgICAgICBmb3JjZU91dHB1dFR5cGU6ICdqd0NsYXNzJywKICAgICAgICAgICAgZGlzYWJsZU1vbml0b3I6IHRydWUKICAgICAgICB9LAogICAgICAgIEFyZ3VtZW50OiB7CiAgICAgICAgICAgIHNoYXBlOiBCbG9ja1NoYXBlLlRJQ0tFVCwKICAgICAgICAgICAgY2hlY2s6IFsnandDbGFzcycsICdQb2ludGVyJ10KICAgICAgICB9LAogCiAgICAgICAgY2xhc3NTeW1ib2wsCiAKICAgICAgICBzZXRQcm9wKG5hbWUsIHBvaW50ZXIsIHZhbHVlKSB7CiAgICAgICAgICAgIHJlZnJlc2hEZXBzKCk7CiAgICAgICAgICAgIGlmICghKHBvaW50ZXIgaW5zdGFuY2VvZiBqd1BvaW50ZXIuVHlwZSkpIHJldHVybjsKICAgICAgICAgICAgaWYgKCEocG9pbnRlci52YWx1ZSBpbnN0YW5jZW9mIGRvZ2Vpc2N1dE9iamVjdC5UeXBlKSkgcmV0dXJuOwogICAgICAgICAgICBwb2ludGVyLnZhbHVlID0gZG9nZWlzY3V0T2JqZWN0LlR5cGUudG9PYmplY3QocG9pbnRlci52YWx1ZSk7IC8vIGNsb25lCiAgICAgICAgICAgIHBvaW50ZXIudmFsdWUubWFwLnNldChuYW1lLCB2YWx1ZSk7CiAgICAgICAgfSwKIAogICAgICAgIGdldFByb3AobmFtZSwgcG9pbnRlcikgewogICAgICAgICAgICByZWZyZXNoRGVwcygpOwogICAgICAgICAgICBpZiAoIShwb2ludGVyIGluc3RhbmNlb2YgandQb2ludGVyLlR5cGUpKSByZXR1cm4gbnVsbDsKICAgICAgICAgICAgaWYgKCEocG9pbnRlci52YWx1ZSBpbnN0YW5jZW9mIGRvZ2Vpc2N1dE9iamVjdC5UeXBlKSkgcmV0dXJuIG51bGw7CiAgICAgICAgICAgIHJldHVybiBwb2ludGVyLnZhbHVlLm1hcC5nZXQobmFtZSk7CiAgICAgICAgfSwKCiAgICAgICAgc2V0U3RhdGljKG5hbWUsIGNsYXNzVHlwZSwgdmFsdWUpIHsKICAgICAgICAgICAgcmVmcmVzaERlcHMoKTsKICAgICAgICAgICAgY2xhc3NUeXBlID0gQ2xhc3NUeXBlLnRvQ2xhc3MoY2xhc3NUeXBlKTsKICAgICAgICAgICAgaWYgKCEoY2xhc3NUeXBlIGluc3RhbmNlb2YgQ2xhc3NUeXBlKSkgcmV0dXJuOwogICAgICAgICAgICBjbGFzc1R5cGUuc3RhdGljW25hbWVdID0gdmFsdWU7CiAgICAgICAgfSwKCiAgICAgICAgZ2V0U3RhdGljKG5hbWUsIGNsYXNzVHlwZSkgewogICAgICAgICAgICByZWZyZXNoRGVwcygpOwogICAgICAgICAgICBjbGFzc1R5cGUgPSBDbGFzc1R5cGUudG9DbGFzcyhjbGFzc1R5cGUpOwogICAgICAgICAgICBpZiAoIShjbGFzc1R5cGUgaW5zdGFuY2VvZiBDbGFzc1R5cGUpKSByZXR1cm4gbnVsbDsKICAgICAgICAgICAgcmV0dXJuIGNsYXNzVHlwZS5zdGF0aWNbbmFtZV07CiAgICAgICAgfSwKIAogICAgICAgIGluc3RhbmNlT2YocG9pbnRlciwgb3RoZXJDbGFzcykgewogICAgICAgICAgICByZWZyZXNoRGVwcygpOwogICAgICAgICAgICBsZXQgX19jbGFzc19fID0gandDbGFzcy5nZXRQcm9wKGNsYXNzU3ltYm9sLCBwb2ludGVyKTsKICAgICAgICAgICAgd2hpbGUgKF9fY2xhc3NfXykgewogICAgICAgICAgICAgICAgaWYgKF9fY2xhc3NfXyA9PT0gb3RoZXJDbGFzcykgcmV0dXJuIHRydWU7CiAgICAgICAgICAgICAgICBfX2NsYXNzX18gPSBfX2NsYXNzX18uZXh0ZW5zaW9uOwogICAgICAgICAgICB9CiAgICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgICB9CiAgICB9OwogCiAgICBjbGFzcyBFeHRlbnNpb24gewogICAgICAgIGNvbnN0cnVjdG9yKCkgewogICAgICAgICAgICByZWZyZXNoRGVwcygpOwogCiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgICBpZiAocnVudGltZS5leHRlbnNpb25NYW5hZ2VyLmxvYWRFeHRlbnNpb25VUkwpIHsKICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2FkZWQgPSBydW50aW1lLmV4dGVuc2lvbk1hbmFnZXIubG9hZEV4dGVuc2lvblVSTCgKICAgICAgICAgICAgICAgICAgICAgICAgJ2h0dHBzOi8vZXh0ZW5zaW9ucy5wZW5ndWlubW9kLmNvbS9leHRlbnNpb25zL0RvZ2Vpc0N1dC9kb2dlaXNjdXRPYmplY3QuanMnCiAgICAgICAgICAgICAgICAgICAgKTsKICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVkICYmIHR5cGVvZiBsb2FkZWQudGhlbiA9PT0gJ2Z1bmN0aW9uJykgewogICAgICAgICAgICAgICAgICAgICAgICBsb2FkZWQudGhlbihyZWZyZXNoRGVwcykuY2F0Y2goKCkgPT4ge30pOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfSBjYXRjaCAoZSkge30KIAogICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgaWYgKHJ1bnRpbWUuZXh0ZW5zaW9uTWFuYWdlci5sb2FkRXh0ZW5zaW9uSWRTeW5jKSB7CiAgICAgICAgICAgICAgICAgICAgcnVudGltZS5leHRlbnNpb25NYW5hZ2VyLmxvYWRFeHRlbnNpb25JZFN5bmMoJ2p3UG9pbnRlcicpO3J1bnRpbWUuZXh0ZW5zaW9uTWFuYWdlci5sb2FkRXh0ZW5zaW9uSWRTeW5jKCdqd0xhbWJkYScpOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9IGNhdGNoIChlKSB7fQogCiAgICAgICAgICAgIHJlZnJlc2hEZXBzKCk7CiAKICAgICAgICAgICAgdm0uandDbGFzcyA9IGp3Q2xhc3M7CiAKICAgICAgICAgICAgcnVudGltZS5yZWdpc3RlclNlcmlhbGl6ZXIoCiAgICAgICAgICAgICAgICAnandDbGFzcycsCiAgICAgICAgICAgICAgICB2ID0+IHYubmFtZSwKICAgICAgICAgICAgICAgIHYgPT4gbmV3IGp3Q2xhc3MuVHlwZShmdW5jdGlvbiogKCkge30sIHYubmFtZSkKICAgICAgICAgICAgKTsKIAogICAgICAgICAgICBpZiAocnVudGltZS5yZWdpc3RlckNvbXBpbGVkRXh0ZW5zaW9uQmxvY2tzKSB7CiAgICAgICAgICAgICAgICBydW50aW1lLnJlZ2lzdGVyQ29tcGlsZWRFeHRlbnNpb25CbG9ja3MoJ2p3Q2xhc3MnLCB0aGlzLmdldENvbXBpbGVJbmZvKCkpOwogICAgICAgICAgICB9CiAgICAgICAgfQogCiAgICAgICAgZ2V0SW5mbygpIHsKICAgICAgICAgICAgcmVmcmVzaERlcHMoKTsKIAogICAgICAgICAgICByZXR1cm4gewogICAgICAgICAgICAgICAgaWQ6ICdqd0NsYXNzJywKICAgICAgICAgICAgICAgIG5hbWU6ICdDbGFzc2VzJywKICAgICAgICAgICAgICAgIGNvbG9yMTogJyM0YmJmNTYnLAogICAgICAgICAgICAgICAgbWVudUljb25VUkk6ICdkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSFpwWlhkQ2IzZzlJakFnTUNBeU1DQXlNQ0krQ2lBZ1BHVnNiR2x3YzJVZ2MzUjViR1U5SW5OMGNtOXJaVG9nY21kaUtEWXdMQ0F4TlRNc0lEWTVLVHNnWm1sc2JEb2djbWRpS0RjMUxDQXhPVEVzSURnMktUc2lJR040UFNJeE1DSWdZM2s5SWpFd0lpQnllRDBpT1M0MUlpQnllVDBpT1M0MUlqNDhMMlZzYkdsd2MyVStDaUFnUEdjK0NpQWdJQ0E4Y0dGMGFDQmtQU0pOSURZdU9UYzRJRFV1TlRFMklFTWdOQzQzTXpZZ09DNDFNRFVnTkM0M016WWdNVEV1TkRrMElEWXVPVGM0SURFMExqUTROQ0lnYzNSeWIydGxQU0lqWm1abUlpQm1hV3hzUFNKdWIyNWxJaUJ6ZEhsc1pUMGljM1J5YjJ0bExXeHBibVZxYjJsdU9pQnliM1Z1WkRzZ2MzUnliMnRsTFd4cGJtVmpZWEE2SUhKdmRXNWtPeUJ6ZEhKdmEyVXRkMmxrZEdnNklESTdJajQ4TDNCaGRHZytDaUFnSUNBOGNHRjBhQ0JrUFNKTklERTBMamN3TXlBeE5DNDBPRFFnUXlBeE1pNDBOakVnTVRFdU5EazFJREV5TGpRMk1TQTRMalV3TmlBeE5DNDNNRE1nTlM0MU1UWWlJSE4wY205clpUMGlJMlptWmlJZ1ptbHNiRDBpYm05dVpTSWdjM1I1YkdVOUluTjBjbTlyWlMxc2FXNWxhbTlwYmpvZ2NtOTFibVE3SUhOMGNtOXJaUzFzYVc1bFkyRndPaUJ5YjNWdVpEc2djM1J5YjJ0bExYZHBaSFJvT2lBeU95QjBjbUZ1YzJadmNtMHRZbTk0T2lCbWFXeHNMV0p2ZURzZ2RISmhibk5tYjNKdExXOXlhV2RwYmpvZ05UQWxJRFV3SlRzaUlIUnlZVzV6Wm05eWJUMGliV0YwY21sNEtDMHhMQ0F3TENBd0xDQXRNU3dnTFRBdU1EQXdNREF5TENBd0tTSStQQzl3WVhSb1Bnb2dJRHd2Wno0S1BDOXpkbWMrJywKICAgICAgICAgICAgICAgIGJsb2NrczogWwogICAgICAgICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICAgICAgICAgb3Bjb2RlOiAnY2xhc3MnLAogICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBbJ2NsYXNzIFtOQU1FXSBbU0VMRl0nLCAnc3RhdGljIGluaXQgW1NFTEYyXSddLAogICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5BTUU6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBcmd1bWVudFR5cGUuU1RSSU5HLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJycKICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTRUxGOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbEluOiAnc2VsZicKICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTRUxGMjogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxJbjogJ3NlbGYnCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgICAgIGJyYW5jaGVzOiBbe30sIHt9XSwKICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25tZW50czogWwogICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTY3JhdGNoLkFyZ3VtZW50QWxpZ25tZW50LkxlZnQKICAgICAgICAgICAgICAgICAgICAgICAgXSwKICAgICAgICAgICAgICAgICAgICAgICAgLi4uandDbGFzcy5CbG9jawogICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgewogICAgICAgICAgICAgICAgICAgICAgICBvcGNvZGU6ICdzZWxmJywKICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ3NlbGYnLAogICAgICAgICAgICAgICAgICAgICAgICBoaWRlRnJvbVBhbGV0dGU6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAgIGNhbkRyYWdEdXBsaWNhdGU6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmp3UG9pbnRlci5CbG9jawogICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgewogICAgICAgICAgICAgICAgICAgICAgICBvcGNvZGU6ICdleHRlbmQnLAogICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnW0NMQVNTXSBleHRlbmRzIFtFWFRFTlNJT05dJywKICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDTEFTUzogandDbGFzcy5Bcmd1bWVudCwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVYVEVOU0lPTjogandDbGFzcy5Bcmd1bWVudAogICAgICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgICAgICAuLi5qd0NsYXNzLkJsb2NrCiAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAnLS0tJywKICAgICAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgICAgIG9wY29kZTogJ3NldFByb3AnLAogICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnc2V0IFtOQU1FXSBvbiBbUE9JTlRFUl0gdG8gW1ZBTFVFXScsCiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrVHlwZTogQmxvY2tUeXBlLkNPTU1BTkQsCiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50czogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgTkFNRTogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFyZ3VtZW50VHlwZS5TVFJJTkcsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZm9vJwogICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBPSU5URVI6IGp3UG9pbnRlci5Bcmd1bWVudCwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZBTFVFOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogQXJndW1lbnRUeXBlLlNUUklORywKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdiYXInCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICAgICAgICAgb3Bjb2RlOiAnZ2V0UHJvcCcsCiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdnZXQgW05BTUVdIG9uIFtQT0lOVEVSXScsCiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrVHlwZTogQmxvY2tUeXBlLlJFUE9SVEVSLAogICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5BTUU6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBcmd1bWVudFR5cGUuU1RSSU5HLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2ZvbycKICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQT0lOVEVSOiBqd1BvaW50ZXIuQXJndW1lbnQKICAgICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAgICAgYWxsb3dEcm9wQW55d2hlcmU6IHRydWUKICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICAgICAgICAgb3Bjb2RlOiAnc2V0U3RhdGljJywKICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ3NldCBzdGF0aWMgW05BTUVdIG9uIFtDTEFTU10gdG8gW1ZBTFVFXScsCiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrVHlwZTogQmxvY2tUeXBlLkNPTU1BTkQsCiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50czogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgTkFNRTogeyB0eXBlOiBBcmd1bWVudFR5cGUuU1RSSU5HLCBkZWZhdWx0VmFsdWU6ICdmb28nIH0sCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDTEFTUzogandDbGFzcy5Bcmd1bWVudCwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZBTFVFOiB7IHR5cGU6IEFyZ3VtZW50VHlwZS5TVFJJTkcsIGRlZmF1bHRWYWx1ZTogJ2JhcicgfQogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgICAgIG9wY29kZTogJ2dldFN0YXRpYycsCiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdnZXQgc3RhdGljIFtOQU1FXSBvbiBbQ0xBU1NdJywKICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tUeXBlOiBCbG9ja1R5cGUuUkVQT1JURVIsCiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50czogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgTkFNRTogeyB0eXBlOiBBcmd1bWVudFR5cGUuU1RSSU5HLCBkZWZhdWx0VmFsdWU6ICdmb28nIH0sCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDTEFTUzogandDbGFzcy5Bcmd1bWVudAogICAgICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgICAgICBhbGxvd0Ryb3BBbnl3aGVyZTogdHJ1ZQogICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgewogICAgICAgICAgICAgICAgICAgICAgICBvcGNvZGU6ICdnZXRDbGFzcycsCiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdnZXQgY2xhc3Mgb2YgW1BPSU5URVJdJywKICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQT0lOVEVSOiBqd1BvaW50ZXIuQXJndW1lbnQKICAgICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAgICAgLi4uandDbGFzcy5CbG9jawogICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgJy0tLScsCiAgICAgICAgICAgICAgICAgICAgewogICAgICAgICAgICAgICAgICAgICAgICBvcGNvZGU6ICduZXcnLAogICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnbmV3IFtDTEFTU10nLAogICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIENMQVNTOiBqd0NsYXNzLkFyZ3VtZW50CiAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmp3UG9pbnRlci5CbG9jawogICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgewogICAgICAgICAgICAgICAgICAgICAgICBvcGNvZGU6ICdnZXROYW1lJywKICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ25hbWUgb2YgW0NMQVNTXScsCiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrVHlwZTogQmxvY2tUeXBlLlJFUE9SVEVSLAogICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIENMQVNTOiBqd0NsYXNzLkFyZ3VtZW50CiAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgICctLS0nLAogICAgICAgICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICAgICAgICAgb3Bjb2RlOiAnaW5zdGFuY2VvZicsCiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdpcyBbUE9JTlRFUl0gaW5zdGFuY2Ugb2YgW0NMQVNTXT8nLAogICAgICAgICAgICAgICAgICAgICAgICBibG9ja1R5cGU6IEJsb2NrVHlwZS5CT09MRUFOLAogICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBPSU5URVI6IGp3UG9pbnRlci5Bcmd1bWVudCwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIENMQVNTOiBqd0NsYXNzLkFyZ3VtZW50CiAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICBdCiAgICAgICAgICAgIH07CiAgICAgICAgfQogCiAgICAgICAgZ2V0Q29tcGlsZUluZm8oKSB7CiAgICAgICAgICAgIHJldHVybiB7CiAgICAgICAgICAgICAgICBpcjogewogICAgICAgICAgICAgICAgICAgIGNsYXNzOiAoZ2VuZXJhdG9yLCBibG9jaykgPT4gewogICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0b3Iuc2NyaXB0LnlpZWxkcyA9IHRydWU7CiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnaW5wdXQnLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZ2VuZXJhdG9yLmRlc2NlbmRJbnB1dE9mQmxvY2soYmxvY2ssICdOQU1FJyksCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzdGFjazogZ2VuZXJhdG9yLmRlc2NlbmRTdWJzdGFjayhibG9jaywgJ1NVQlNUQUNLJyksCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzdGFjazI6IGdlbmVyYXRvci5kZXNjZW5kU3Vic3RhY2soYmxvY2ssICdTVUJTVEFDSzInKQogICAgICAgICAgICAgICAgICAgICAgICB9OwogICAgICAgICAgICAgICAgICAgIH0sCiAKICAgICAgICAgICAgICAgICAgICBzZWxmOiAoKSA9PiAoewogICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnaW5wdXQnCiAgICAgICAgICAgICAgICAgICAgfSksCiAKICAgICAgICAgICAgICAgICAgICBleHRlbmQ6IChnZW5lcmF0b3IsIGJsb2NrKSA9PiAoewogICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnaW5wdXQnLAogICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogZ2VuZXJhdG9yLmRlc2NlbmRJbnB1dE9mQmxvY2soYmxvY2ssICdDTEFTUycpLAogICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb246IGdlbmVyYXRvci5kZXNjZW5kSW5wdXRPZkJsb2NrKGJsb2NrLCAnRVhURU5TSU9OJykKICAgICAgICAgICAgICAgICAgICB9KSwKIAogICAgICAgICAgICAgICAgICAgIHNldFByb3A6IChnZW5lcmF0b3IsIGJsb2NrKSA9PiAoewogICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnc3RhY2snLAogICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ05BTUUnKSwKICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlcjogZ2VuZXJhdG9yLmRlc2NlbmRJbnB1dE9mQmxvY2soYmxvY2ssICdQT0lOVEVSJyksCiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ1ZBTFVFJykKICAgICAgICAgICAgICAgICAgICB9KSwKCiAgICAgICAgICAgICAgICAgICAgc2V0U3RhdGljOiAoZ2VuZXJhdG9yLCBibG9jaykgPT4gKHsKICAgICAgICAgICAgICAgICAgICAgICAga2luZDogJ3N0YWNrJywKICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZ2VuZXJhdG9yLmRlc2NlbmRJbnB1dE9mQmxvY2soYmxvY2ssICdOQU1FJyksCiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ0NMQVNTJyksCiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ1ZBTFVFJykKICAgICAgICAgICAgICAgICAgICB9KSwKIAogICAgICAgICAgICAgICAgICAgIGdldFByb3A6IChnZW5lcmF0b3IsIGJsb2NrKSA9PiAoewogICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnaW5wdXQnLAogICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ05BTUUnKSwKICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlcjogZ2VuZXJhdG9yLmRlc2NlbmRJbnB1dE9mQmxvY2soYmxvY2ssICdQT0lOVEVSJykKICAgICAgICAgICAgICAgICAgICB9KSwKCiAgICAgICAgICAgICAgICAgICAgZ2V0U3RhdGljOiAoZ2VuZXJhdG9yLCBibG9jaykgPT4gKHsKICAgICAgICAgICAgICAgICAgICAgICAga2luZDogJ2lucHV0JywKICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZ2VuZXJhdG9yLmRlc2NlbmRJbnB1dE9mQmxvY2soYmxvY2ssICdOQU1FJyksCiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ0NMQVNTJykKICAgICAgICAgICAgICAgICAgICB9KSwKIAogICAgICAgICAgICAgICAgICAgIGdldENsYXNzOiAoZ2VuZXJhdG9yLCBibG9jaykgPT4gKHsKICAgICAgICAgICAgICAgICAgICAgICAga2luZDogJ2lucHV0JywKICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlcjogZ2VuZXJhdG9yLmRlc2NlbmRJbnB1dE9mQmxvY2soYmxvY2ssICdQT0lOVEVSJykKICAgICAgICAgICAgICAgICAgICB9KSwKIAogICAgICAgICAgICAgICAgICAgIG5ldzogKGdlbmVyYXRvciwgYmxvY2spID0+IHsKICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdG9yLnNjcmlwdC55aWVsZHMgPSB0cnVlOwogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gewogICAgICAgICAgICAgICAgICAgICAgICAgICAga2luZDogJ2lucHV0JywKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ0NMQVNTJykKICAgICAgICAgICAgICAgICAgICAgICAgfTsKICAgICAgICAgICAgICAgICAgICB9LAogCiAgICAgICAgICAgICAgICAgICAgZ2V0TmFtZTogKGdlbmVyYXRvciwgYmxvY2spID0+ICh7CiAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6ICdpbnB1dCcsCiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ0NMQVNTJykKICAgICAgICAgICAgICAgICAgICB9KSwKIAogICAgICAgICAgICAgICAgICAgIGluc3RhbmNlb2Y6IChnZW5lcmF0b3IsIGJsb2NrKSA9PiAoewogICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnaW5wdXQnLAogICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVyOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ1BPSU5URVInKSwKICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IGdlbmVyYXRvci5kZXNjZW5kSW5wdXRPZkJsb2NrKGJsb2NrLCAnQ0xBU1MnKQogICAgICAgICAgICAgICAgICAgIH0pCiAgICAgICAgICAgICAgICB9LAogCiAgICAgICAgICAgICAgICBqczogewogICAgICAgICAgICAgICAgICAgIGNsYXNzOiAobm9kZSwgY29tcGlsZXIsIGltcG9ydHMpID0+IHsKICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IGNvbXBpbGVyLnNvdXJjZTsKICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIGNsYXNzLCB0aGVuIHJ1biBzdGF0aWNDb25zdHJ1Y3QgaW1tZWRpYXRlbHkKICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZXIuc291cmNlID0gJyhmdW5jdGlvbigpIHtcbic7CiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVyLnNvdXJjZSArPSAnY29uc3QgX2NscyA9IG5ldyB2bS5qd0NsYXNzLlR5cGUoZnVuY3Rpb24qKF9qd0NsYXNzU2VsZiwgdGhyZWFkLCB0YXJnZXQpIHtcbic7CiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVyLmRlc2NlbmRTdGFjayhub2RlLnN1YnN0YWNrLCBuZXcgaW1wb3J0cy5GcmFtZShmYWxzZSwgdW5kZWZpbmVkLCB0cnVlKSk7CiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVyLnNvdXJjZSArPSBgfSwgJHtjb21waWxlci5kZXNjZW5kSW5wdXQobm9kZS5uYW1lKS5hc1Vua25vd24oKX0sIG51bGwsIHRocmVhZC5wcm9jZWR1cmVzLCBmdW5jdGlvbiooX2p3Q2xhc3NTZWxmLCB0aHJlYWQsIHRhcmdldCkge1xuYDsKICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZXIuZGVzY2VuZFN0YWNrKG5vZGUuc3Vic3RhY2syLCBuZXcgaW1wb3J0cy5GcmFtZShmYWxzZSwgdW5kZWZpbmVkLCB0cnVlKSk7CiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVyLnNvdXJjZSArPSAnfSk7XG4nOwogICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlci5zb3VyY2UgKz0gJ3RyeSB7IGNvbnN0IF9nID0gX2Nscy5zdGF0aWNDb25zdHJ1Y3QgJiYgX2Nscy5zdGF0aWNDb25zdHJ1Y3QoX2NscywgdGhyZWFkLCB0YXJnZXQpOyBpZiAoX2cgJiYgdHlwZW9mIF9nLm5leHQgPT09ICJmdW5jdGlvbiIpIHsgbGV0IF9yID0gX2cubmV4dCgpOyB3aGlsZSAoIV9yLmRvbmUpIF9yID0gX2cubmV4dCgpOyB9IH0gY2F0Y2ggKGUpIHt9XG4nOwogICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlci5zb3VyY2UgKz0gJ3JldHVybiBfY2xzO1xufSkoKTsnOwogICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXR1cm5zID0gY29tcGlsZXIuc291cmNlOwogICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlci5zb3VyY2UgPSB0ZW1wOwogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGltcG9ydHMuVHlwZWRJbnB1dChyZXR1cm5zLCBpbXBvcnRzLlRZUEVfVU5LTk9XTik7CiAgICAgICAgICAgICAgICAgICAgfSwKIAogICAgICAgICAgICAgICAgICAgIHNlbGY6IChub2RlLCBjb21waWxlciwgaW1wb3J0cykgPT4gewogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGltcG9ydHMuVHlwZWRJbnB1dCgKICAgICAgICAgICAgICAgICAgICAgICAgICAgICcodHlwZW9mIF9qd0NsYXNzU2VsZiAhPT0gInVuZGVmaW5lZCIgPyBfandDbGFzc1NlbGYgOiBuZXcgdm0uandQb2ludGVyLlR5cGUoMCkpJywKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydHMuVFlQRV9VTktOT1dOCiAgICAgICAgICAgICAgICAgICAgICAgICk7CiAgICAgICAgICAgICAgICAgICAgfSwKIAogICAgICAgICAgICAgICAgICAgIGV4dGVuZDogKG5vZGUsIGNvbXBpbGVyLCBpbXBvcnRzKSA9PiB7CiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaW1wb3J0cy5UeXBlZElucHV0KAogICAgICAgICAgICAgICAgICAgICAgICAgICAgYHZtLmp3Q2xhc3MuVHlwZS50b0NsYXNzKCR7Y29tcGlsZXIuZGVzY2VuZElucHV0KG5vZGUuY2xhc3MpLmFzVW5rbm93bigpfSkuZXh0ZW5kKCR7Y29tcGlsZXIuZGVzY2VuZElucHV0KG5vZGUuZXh0ZW5zaW9uKS5hc1Vua25vd24oKX0pYCwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydHMuVFlQRV9VTktOT1dOCiAgICAgICAgICAgICAgICAgICAgICAgICk7CiAgICAgICAgICAgICAgICAgICAgfSwKIAogICAgICAgICAgICAgICAgICAgIHNldFByb3A6IChub2RlLCBjb21waWxlciwgaW1wb3J0cykgPT4gewogICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlci5zb3VyY2UgKz0gYHZtLmp3Q2xhc3Muc2V0UHJvcCgke2NvbXBpbGVyLmRlc2NlbmRJbnB1dChub2RlLm5hbWUpLmFzVW5rbm93bigpfSwgJHtjb21waWxlci5kZXNjZW5kSW5wdXQobm9kZS5wb2ludGVyKS5hc1Vua25vd24oKX0sICR7Y29tcGlsZXIuZGVzY2VuZElucHV0KG5vZGUudmFsdWUpLmFzVW5rbm93bigpfSk7XG5gOwogICAgICAgICAgICAgICAgICAgIH0sCgogICAgICAgICAgICAgICAgICAgIHNldFN0YXRpYzogKG5vZGUsIGNvbXBpbGVyLCBpbXBvcnRzKSA9PiB7CiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVyLnNvdXJjZSArPSBgdm0uandDbGFzcy5zZXRTdGF0aWMoJHtjb21waWxlci5kZXNjZW5kSW5wdXQobm9kZS5uYW1lKS5hc1Vua25vd24oKX0sICR7Y29tcGlsZXIuZGVzY2VuZElucHV0KG5vZGUuY2xhc3MpLmFzVW5rbm93bigpfSwgJHtjb21waWxlci5kZXNjZW5kSW5wdXQobm9kZS52YWx1ZSkuYXNVbmtub3duKCl9KTtcbmA7CiAgICAgICAgICAgICAgICAgICAgfSwKIAogICAgICAgICAgICAgICAgICAgIGdldFByb3A6IChub2RlLCBjb21waWxlciwgaW1wb3J0cykgPT4gewogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGltcG9ydHMuVHlwZWRJbnB1dCgKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB2bS5qd0NsYXNzLmdldFByb3AoJHtjb21waWxlci5kZXNjZW5kSW5wdXQobm9kZS5uYW1lKS5hc1Vua25vd24oKX0sICR7Y29tcGlsZXIuZGVzY2VuZElucHV0KG5vZGUucG9pbnRlcikuYXNVbmtub3duKCl9KWAsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRzLlRZUEVfVU5LTk9XTgogICAgICAgICAgICAgICAgICAgICAgICApOwogICAgICAgICAgICAgICAgICAgIH0sCgogICAgICAgICAgICAgICAgICAgIGdldFN0YXRpYzogKG5vZGUsIGNvbXBpbGVyLCBpbXBvcnRzKSA9PiB7CiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaW1wb3J0cy5UeXBlZElucHV0KAogICAgICAgICAgICAgICAgICAgICAgICAgICAgYHZtLmp3Q2xhc3MuZ2V0U3RhdGljKCR7Y29tcGlsZXIuZGVzY2VuZElucHV0KG5vZGUubmFtZSkuYXNVbmtub3duKCl9LCAke2NvbXBpbGVyLmRlc2NlbmRJbnB1dChub2RlLmNsYXNzKS5hc1Vua25vd24oKX0pYCwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydHMuVFlQRV9VTktOT1dOCiAgICAgICAgICAgICAgICAgICAgICAgICk7CiAgICAgICAgICAgICAgICAgICAgfSwKIAogICAgICAgICAgICAgICAgICAgIGdldENsYXNzOiAobm9kZSwgY29tcGlsZXIsIGltcG9ydHMpID0+IHsKICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpbXBvcnRzLlR5cGVkSW5wdXQoCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdm0uandDbGFzcy5nZXRQcm9wKHZtLmp3Q2xhc3MuY2xhc3NTeW1ib2wsICR7Y29tcGlsZXIuZGVzY2VuZElucHV0KG5vZGUucG9pbnRlcikuYXNVbmtub3duKCl9KWAsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRzLlRZUEVfVU5LTk9XTgogICAgICAgICAgICAgICAgICAgICAgICApOwogICAgICAgICAgICAgICAgICAgIH0sCiAKICAgICAgICAgICAgICAgICAgICBuZXc6IChub2RlLCBjb21waWxlciwgaW1wb3J0cykgPT4gewogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGltcG9ydHMuVHlwZWRJbnB1dCgKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAoeWllbGQqIHZtLmp3Q2xhc3MuVHlwZS50b0NsYXNzKCR7Y29tcGlsZXIuZGVzY2VuZElucHV0KG5vZGUuY2xhc3MpLmFzVW5rbm93bigpfSkuY3JlYXRlSW5zdGFuY2UodGhyZWFkLCB0YXJnZXQpKWAsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRzLlRZUEVfVU5LTk9XTgogICAgICAgICAgICAgICAgICAgICAgICApOwogICAgICAgICAgICAgICAgICAgIH0sCiAKICAgICAgICAgICAgICAgICAgICBnZXROYW1lOiAobm9kZSwgY29tcGlsZXIsIGltcG9ydHMpID0+IHsKICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpbXBvcnRzLlR5cGVkSW5wdXQoCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdm0uandDbGFzcy5UeXBlLnRvQ2xhc3MoJHtjb21waWxlci5kZXNjZW5kSW5wdXQobm9kZS5jbGFzcykuYXNVbmtub3duKCl9KS5uYW1lYCwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydHMuVFlQRV9TVFJJTkcKICAgICAgICAgICAgICAgICAgICAgICAgKTsKICAgICAgICAgICAgICAgICAgICB9LAogCiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VvZjogKG5vZGUsIGNvbXBpbGVyLCBpbXBvcnRzKSA9PiB7CiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaW1wb3J0cy5UeXBlZElucHV0KAogICAgICAgICAgICAgICAgICAgICAgICAgICAgYHZtLmp3Q2xhc3MuaW5zdGFuY2VPZigke2NvbXBpbGVyLmRlc2NlbmRJbnB1dChub2RlLnBvaW50ZXIpLmFzVW5rbm93bigpfSwgdm0uandDbGFzcy5UeXBlLnRvQ2xhc3MoJHtjb21waWxlci5kZXNjZW5kSW5wdXQobm9kZS5jbGFzcykuYXNVbmtub3duKCl9KSlgLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0cy5UWVBFX0JPT0xFQU4KICAgICAgICAgICAgICAgICAgICAgICAgKTsKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH07CiAgICAgICAgfQogCiAgICAgICAgY2xhc3MoeyBOQU1FLCBTRUxGIH0sIHV0aWwpIHsKICAgICAgICAgICAgcmVmcmVzaERlcHMoKTsKICAgICAgICAgICAgLy8gVHJ5IHRvIGNhcHR1cmUgcnVudGltZSBzdWJzdGFja3MgaWYgcHJvdmlkZWQgb24gdXRpbCAoYmVzdC1lZmZvcnQpCiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlQ29uc3RydWN0ID0gZnVuY3Rpb24qIChfandDbGFzc1NlbGYsIHRocmVhZCwgdGFyZ2V0KSB7CiAgICAgICAgICAgICAgICBpZiAodXRpbCAmJiB0eXBlb2YgdXRpbC5zdWJzdGFjayA9PT0gJ2Z1bmN0aW9uJykgewogICAgICAgICAgICAgICAgICAgIHlpZWxkKiB1dGlsLnN1YnN0YWNrKHRocmVhZCwgdGFyZ2V0KTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfTsKICAgICAgICAgICAgY29uc3Qgc3RhdGljQ29uc3RydWN0ID0gZnVuY3Rpb24qIChfandDbGFzc1NlbGYsIHRocmVhZCwgdGFyZ2V0KSB7CiAgICAgICAgICAgICAgICBpZiAodXRpbCAmJiB0eXBlb2YgdXRpbC5zdWJzdGFjazIgPT09ICdmdW5jdGlvbicpIHsKICAgICAgICAgICAgICAgICAgICB5aWVsZCogdXRpbC5zdWJzdGFjazIodGhyZWFkLCB0YXJnZXQpOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9OwogICAgICAgICAgICBjb25zdCBjbHMgPSBuZXcgandDbGFzcy5UeXBlKGluc3RhbmNlQ29uc3RydWN0LCBOQU1FLCBudWxsLCB1dGlsLnRocmVhZD8ucHJvY2VkdXJlcywgc3RhdGljQ29uc3RydWN0KTsKICAgICAgICAgICAgLy8gUnVuIHN0YXRpYyBpbml0aWFsaXplciBub3cgKHdoZW4gdGhlIGNsYXNzIGJsb2NrIGlzIGV4ZWN1dGVkKSwgYmVzdC1lZmZvcnQuCiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgICBpZiAodXRpbCAmJiB0eXBlb2YgdXRpbC5zdWJzdGFjazIgPT09ICdmdW5jdGlvbicpIHsKICAgICAgICAgICAgICAgICAgICAvLyBJZiBydW50aW1lIHByb3ZpZGVkIGEgc3Vic3RhY2sgcnVubmVyLCB1c2UgaXQgc28geWllbGRzIGludGVncmF0ZSB3aXRoIHRoZSB0aHJlYWQKICAgICAgICAgICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgICAgICAgICB1dGlsLnN1YnN0YWNrMih1dGlsLnRocmVhZCwgdXRpbC50YXJnZXQpOwogICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsKICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFsbCBiYWNrIHRvIGRpcmVjdCBzdGF0aWNDb25zdHJ1Y3QKICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2VuID0gY2xzLnN0YXRpY0NvbnN0cnVjdCAmJiBjbHMuc3RhdGljQ29uc3RydWN0KGNscywgdXRpbD8udGhyZWFkLCB1dGlsPy50YXJnZXQpOwogICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2VuICYmIHR5cGVvZiBnZW4ubmV4dCA9PT0gJ2Z1bmN0aW9uJykgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSBnZW4ubmV4dCgpOwogICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCFyLmRvbmUpIHIgPSBnZW4ubmV4dCgpOwogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgICAgICBjb25zdCBnZW4gPSBjbHMuc3RhdGljQ29uc3RydWN0ICYmIGNscy5zdGF0aWNDb25zdHJ1Y3QoY2xzLCB1dGlsPy50aHJlYWQsIHV0aWw/LnRhcmdldCk7CiAgICAgICAgICAgICAgICAgICAgaWYgKGdlbiAmJiB0eXBlb2YgZ2VuLm5leHQgPT09ICdmdW5jdGlvbicpIHsKICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSBnZW4ubmV4dCgpOwogICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIXIuZG9uZSkgciA9IGdlbi5uZXh0KCk7CiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9IGNhdGNoIChlKSB7fQogICAgICAgICAgICByZXR1cm4gY2xzOwogICAgICAgIH0KIAogICAgICAgIHNlbGYoKSB7CiAgICAgICAgICAgIHJlZnJlc2hEZXBzKCk7CiAgICAgICAgICAgIHJldHVybiBuZXcgandQb2ludGVyLlR5cGUoMCk7CiAgICAgICAgfQogCiAgICAgICAgZXh0ZW5kKHsgQ0xBU1MsIEVYVEVOU0lPTiB9KSB7CiAgICAgICAgICAgIHJlZnJlc2hEZXBzKCk7CiAgICAgICAgICAgIENMQVNTID0gandDbGFzcy5UeXBlLnRvQ2xhc3MoQ0xBU1MpOwogICAgICAgICAgICBFWFRFTlNJT04gPSBqd0NsYXNzLlR5cGUudG9DbGFzcyhFWFRFTlNJT04pOwogICAgICAgICAgICByZXR1cm4gQ0xBU1MuZXh0ZW5kKEVYVEVOU0lPTik7CiAgICAgICAgfQogCiAgICAgICAgc2V0UHJvcCh7IE5BTUUsIFBPSU5URVIsIFZBTFVFIH0pIHsKICAgICAgICAgICAgcmVmcmVzaERlcHMoKTsKICAgICAgICAgICAgandDbGFzcy5zZXRQcm9wKE5BTUUsIFBPSU5URVIsIFZBTFVFKTsKICAgICAgICB9CgogICAgICAgIHNldFN0YXRpYyh7IE5BTUUsIENMQVNTLCBWQUxVRSB9KSB7CiAgICAgICAgICAgIHJlZnJlc2hEZXBzKCk7CiAgICAgICAgICAgIGp3Q2xhc3Muc2V0U3RhdGljKE5BTUUsIENMQVNTLCBWQUxVRSk7CiAgICAgICAgfQogCiAgICAgICAgZ2V0UHJvcCh7IE5BTUUsIFBPSU5URVIgfSkgewogICAgICAgICAgICByZWZyZXNoRGVwcygpOwogICAgICAgICAgICByZXR1cm4gandDbGFzcy5nZXRQcm9wKE5BTUUsIFBPSU5URVIpOwogICAgICAgIH0KCiAgICAgICAgZ2V0U3RhdGljKHsgTkFNRSwgQ0xBU1MgfSkgewogICAgICAgICAgICByZWZyZXNoRGVwcygpOwogICAgICAgICAgICByZXR1cm4gandDbGFzcy5nZXRTdGF0aWMoTkFNRSwgQ0xBU1MpOwogICAgICAgIH0KIAogICAgICAgIGdldENsYXNzKHsgUE9JTlRFUiB9KSB7CiAgICAgICAgICAgIHJlZnJlc2hEZXBzKCk7CiAgICAgICAgICAgIHJldHVybiBqd0NsYXNzLmdldFByb3AoY2xhc3NTeW1ib2wsIFBPSU5URVIpOwogICAgICAgIH0KIAogICAgICAgIG5ldyh7IENMQVNTIH0sIHV0aWwpIHsKICAgICAgICAgICAgcmVmcmVzaERlcHMoKTsKICAgICAgICAgICAgQ0xBU1MgPSBqd0NsYXNzLlR5cGUudG9DbGFzcyhDTEFTUyk7CiAgICAgICAgICAgIHJldHVybiBDTEFTUy5jcmVhdGVJbnN0YW5jZSh1dGlsLnRocmVhZCwgdXRpbC50YXJnZXQpOwogICAgICAgIH0KIAogICAgICAgIGdldE5hbWUoeyBDTEFTUyB9KSB7CiAgICAgICAgICAgIHJlZnJlc2hEZXBzKCk7CiAgICAgICAgICAgIENMQVNTID0gandDbGFzcy5UeXBlLnRvQ2xhc3MoQ0xBU1MpOwogICAgICAgICAgICByZXR1cm4gQ0xBU1MubmFtZTsKICAgICAgICB9CiAKICAgICAgICBpbnN0YW5jZW9mKHsgUE9JTlRFUiwgQ0xBU1MgfSkgewogICAgICAgICAgICByZWZyZXNoRGVwcygpOwogICAgICAgICAgICByZXR1cm4gandDbGFzcy5pbnN0YW5jZU9mKFBPSU5URVIsIGp3Q2xhc3MuVHlwZS50b0NsYXNzKENMQVNTKSk7CiAgICAgICAgfQogICAgfQogCiAgICBTY3JhdGNoLmV4dGVuc2lvbnMucmVnaXN0ZXIobmV3IEV4dGVuc2lvbigpKTsKfSkoU2NyYXRjaCk7";
  }
}

// Write to file or package as .pmp (zip)
if (String(outJSONLocation).toLowerCase().endsWith(".pmp")) {
  const pmpPath = outJSONLocation;
  const assetsDir = path.join(__dirname, "startingAssets");

  // create output stream for zip
  const output = fs.createWriteStream(pmpPath);
  const archive = ensureArchiver()("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`✅ ${path.basename(pmpPath)} written (${archive.pointer()} bytes)`);
    //console.log(Object.keys(emitResult.blocks).length, 'blocks included in project.json.');
  });

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") console.warn(err.message);
    else throw err;
  });
  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);

  // Add project.json from memory
  archive.append(JSON.stringify(out, null, 2), { name: "project.json" });

  // Add startingAssets directory contents (preserve relative paths)
  if (fs.existsSync(assetsDir)) {
    (function addFilesRecursive(dir, relPath) {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const it of items) {
        const full = path.join(dir, it.name);
        const nameInArchive = path.posix.join(relPath, it.name);
        if (it.isDirectory()) addFilesRecursive(full, nameInArchive);
        else if (it.isFile()) archive.file(full, { name: nameInArchive });
      }
    })(assetsDir, "");
  } else {
    console.warn(
      `⚠️ startingAssets directory not found at ${assetsDir} — .pmp will only contain project.json`,
    );
  }

  // Also write companion project.json next to the .pmp so file on disk
  // matches the packaged project (helpful for inspection/debugging).
  const companionJson = path.join(path.dirname(pmpPath), "project.json");
  fs.writeFileSync(companionJson, JSON.stringify(out, null, 2), "utf8");
  console.log(`✅ ${path.basename(companionJson)} written next to ${path.basename(pmpPath)}`);

  archive.finalize();
} else {
  fs.writeFileSync(outJSONLocation, JSON.stringify(out, null, 2), "utf8");
  let bytes = new Blob([JSON.stringify(out, null, 2)]).size;
  console.log(
    `✅ ${outJSONLocation.split(path.sep).pop()} written with ${bytes} bytes`,
  );
}
