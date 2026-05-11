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
  const name = `__${genRandomUid()}_${clean}${__pw_temp_counter}`;
  try {
    // record a placeholder origin for this temp in the global map so
    // local origin-resolution helpers can consult it as a fallback.
    if (typeof globalTempOriginMap === "undefined") globalTempOriginMap = Object.create(null);
    globalTempOriginMap[name] = globalTempOriginMap[name] || null;
  } catch (e) {}
  return name;
}

// If a scopeKey is provided, reuse a UID for that key so the generated
// arg name is stable across uses; otherwise produce a fresh synthetic name.
function __pw_newArgTemp(base = "value", scopeKey = null) {
  __pw_arg_counter += 1;
  const clean = String(base).replace(/^_+/, "");
  if (scopeKey) return getTaggedArgName(scopeKey, clean);
  return `__${genRandomUid()}_${clean}${__pw_arg_counter}`;
}

// Build a simple AST visitor by extending the generated visitor
class AstBuilder extends PangVisitor {
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
      return null;
    }
    if (ctx.ifStmt && ctx.ifStmt()) return this.visit(ctx.ifStmt());
    if (ctx.forStmt && ctx.forStmt()) return this.visit(ctx.forStmt());
    if (ctx.whileStmt && ctx.whileStmt()) return this.visit(ctx.whileStmt());
    return null;
  }

  visitOnCall(ctx) {
    // onCall: 'on' '(' STRING ',' inlineBlock ')'
    const str = ctx.STRING().getText();
    let event;
    try {
      event = JSON.parse(str);
    } catch (e) {
      event = str.replace(/^\"|\"$/g, "");
    }
    // Accept either an inlineBlock() or a normal block() to be flexible with
    // different parser/grammar shapes.
    let body = null;
    const ibCtx = ctx.inlineBlock && typeof ctx.inlineBlock === "function" ? ctx.inlineBlock() : null;
    const bCtx = ctx.block && typeof ctx.block === "function" ? ctx.block() : null;
    if (ibCtx) body = this.visit(ibCtx);
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
            } catch (e) {}
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

  visitArrowFunction(ctx) {
    // arrowFunction : '(' (IDENT (',' IDENT)*)? ')' '=>' (block | inlineBlock)
    //               | IDENT '=>' (block | inlineBlock)
    const params = [];
    try {
      if (ctx.IDENT && typeof ctx.IDENT === "function") {
        const idNodes = ctx.IDENT();
        if (Array.isArray(idNodes)) {
          for (let i = 0; i < idNodes.length; i++) params.push(idNodes[i].getText());
        } else if (idNodes) params.push(idNodes.getText());
      }
    } catch (e) {}
    const body = ctx.block
      ? this.visit(ctx.block())
      : ctx.inlineBlock
        ? this.visit(ctx.inlineBlock())
        : { type: "Block", body: [] };
    return { type: "Lambda", params, body };
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
      }
    }
    return { type: "Class", name, extends: ext, members };
  }

  visitClassMember(ctx) {
    // IDENT '(' (IDENT (',' IDENT)*)? ')' block
    const name = ctx.IDENT && ctx.IDENT(0) ? ctx.IDENT(0).getText() : "";
    const params = [];
    // IDENT tokens may include method name at index 0 and params afterwards
    if (ctx.IDENT && typeof ctx.IDENT === "function") {
      const idNodes = ctx.IDENT();
      if (Array.isArray(idNodes)) {
        for (let i = 1; i < idNodes.length; i++) params.push(idNodes[i].getText());
      }
    }
    const body = ctx.block ? this.visit(ctx.block()) : { type: "Block", body: [] };
    return { type: "Method", name, params, body };
  }

  visitVarDecl(ctx) {
    // ('let' | 'const') IDENT ('=' expr)?
    const kind = ctx.getChild(0).getText();
    const name = ctx.IDENT().getText();
    let value = null;
    if (ctx.expr && ctx.expr()) value = this.visit(ctx.expr());
    return { type: "Declare", kind, name, value };
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
    } catch (e) {}

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
    } catch (e) {}

    // Final fallback: IDENT or THIS token (single-name assignment)
    const name = ctx.IDENT ? ctx.IDENT().getText() : ctx.THIS ? ctx.THIS().getText() : "";
    return { type: "Assign", name, value };
  }

  visitIfStmt(ctx) {
    // Collect all expr() and block() occurrences. With the new grammar:
    // expr() returns an array of condition expressions (first is the main if, rest are else-if conditions)
    // block() returns corresponding blocks: the first N are the then-blocks for each condition; an extra final block (if present) is the final else.
    const exprs = ctx.expr ? (Array.isArray(ctx.expr()) ? ctx.expr() : [ctx.expr()]) : [];
    const blocksCtx = ctx.block ? (Array.isArray(ctx.block()) ? ctx.block() : [ctx.block()]) : [];
    const cases = [];
    for (let i = 0; i < exprs.length; i++) {
      const cond = this.visit(exprs[i]);
      const thenB = blocksCtx[i] ? this.visit(blocksCtx[i]) : { type: "Block", body: [] };
      cases.push({ cond, thenBlock: thenB });
    }
    let elseBlock = null;
    if (blocksCtx.length > exprs.length) {
      elseBlock = this.visit(blocksCtx[blocksCtx.length - 1]);
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
    } catch (e) {}

    // update part: assignStmt | functionCall | expr
    let update = null;
    if (ctx.assignStmt && ctx.assignStmt().length) {
      // assignStmt might appear as array or single
      const asn = Array.isArray(ctx.assignStmt())
        ? ctx.assignStmt()[ctx.assignStmt().length - 1]
        : ctx.assignStmt();
      update = this.visit(asn);
    } else if (ctx.functionCall && ctx.functionCall().length) {
      const fc = Array.isArray(ctx.functionCall())
        ? ctx.functionCall()[ctx.functionCall().length - 1]
        : ctx.functionCall();
      update = this.visit(fc);
    } else {
      try {
        const exprs = ctx.expr ? ctx.expr() : null;
        // if multiple expr() were provided, the second expr (index 1) is the update
        if (exprs) {
          if (Array.isArray(exprs) && exprs.length > 1) update = this.visit(exprs[1]);
          else if (!Array.isArray(exprs) && exprs) update = this.visit(exprs);
        }
      } catch (e) {}
    }

    const body = ctx.block ? this.visit(ctx.block()) : { type: "Block", body: [] };
    return { type: "For", init, cond, update, body };
  }

  visitBreakStmt(ctx) {
    return { type: "Break" };
  }

  visitWhileStmt(ctx) {
    // while '(' expr ')' block
    const condCtx = ctx.expr ? ctx.expr() : null;
    const cond = condCtx ? this.visit(condCtx) : null;
    const body = ctx.block ? this.visit(ctx.block()) : { type: "Block", body: [] };
    return { type: "While", cond, body };
  }

  visitExpr(ctx) {
    // Prefer explicit unary handling for leading unary operators
    if (ctx.children && ctx.children[0] && ctx.children[0].getText) {
      const firstTok = ctx.children[0].getText();
      if (firstTok === "new") {
        // new <functionCall>
        if (ctx.functionCall && ctx.functionCall())
          return { type: "New", callee: this.visit(ctx.functionCall()) };
      }
      if (firstTok === "!" || firstTok === "~" || firstTok === "+" || firstTok === "-") {
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
  visitPrimary(ctx) {
    if (ctx.NUMBER()) return { type: "Literal", litType: "number", value: Number(ctx.NUMBER().getText()) };
    if (ctx.STRING()) {
      const s = ctx.STRING().getText();
      try {
        return { type: "Literal", litType: "string", value: JSON.parse(s) };
      } catch (e) {
        return { type: "Literal", litType: "string", value: s.replace(/^\"|\"$/g, "") };
      }
    }
    if (ctx.getText() === "true" || ctx.getText() === "false")
      return { type: "Literal", litType: "boolean", value: ctx.getText() === "true" };
    if (ctx.getText && ctx.getText() === "this") return { type: "This" };
    if (ctx.printCall()) return this.visit(ctx.printCall());
    if (ctx.inlineBlock && ctx.inlineBlock()) {
      const body = this.visit(ctx.inlineBlock());
      return { type: "Lambda", params: [], body };
    }
    if (ctx.arrowFunction && ctx.arrowFunction()) return this.visit(ctx.arrowFunction());
    if (ctx.arrayLiteral && ctx.arrayLiteral()) return this.visit(ctx.arrayLiteral());
    if (ctx.functionCall && ctx.functionCall()) return this.visit(ctx.functionCall());
    // allow member expressions (e.g., this.x or obj.prop) as primary expressions
    if (ctx.memberExpr && ctx.memberExpr()) {
      const chain = this.visit(ctx.memberExpr());
      if (Array.isArray(chain) && chain.length === 1) return { type: "Var", name: chain[0] };
      return { type: "Member", chain };
    }
    // parenthesized expression: primary may be '(' expr ')'
    if (ctx.expr && ctx.expr()) {
      // expr() may be array-like depending on ANTLR generation; handle both
      const e = Array.isArray(ctx.expr()) ? ctx.expr(0) : ctx.expr();
      if (e) return this.visit(e);
    }
    if (ctx.IDENT && ctx.IDENT()) return { type: "Var", name: ctx.IDENT().getText() };
    return null;
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
    ast = parseWithAntlr(cleaned);
    //console.log('AST built (ANTLR)');
    //console.error("DEBUG_AST:\n" + JSON.stringify(ast, null, 2));
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
        if (s.type === "Break") {
          if (i < stmts.length - 1) throw new Error("Cannot have code after 'break' in the same block");
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
  // Collect class definitions (name -> method param lists) so constructor
  // argument mapping can be emitted later during nested conversion.
  const classRegistry = {};
  // Map of variables assigned lambda values -> param name lists
  const varToLambda = {};
  function collectClasses(root) {
    function walk(node) {
      if (!node) return;
      if (Array.isArray(node)) {
        for (const n of node) walk(n);
        return;
      }
      if (node.type === "Class") {
        const name = node.name;
        classRegistry[name] = { methods: {}, methodReturns: {}, methodReturnOriginals: {} };
        // Mark that classes are present/used as soon as we discover one.
        usedClasses = true;
        for (const m of node.members || []) {
          // generate tagged param names for this method so call-sites
          // and the method body use the same synthetic thread-var names.
          const origParams = Array.isArray(m.params) ? m.params.slice() : m.params ? [m.params] : [];
          // Use a per-method scope key so all occurrences of the same method
          // parameter share the same uid-prefixed name.
          const tagged = origParams.map((p, i) =>
            p ? __pw_newArgTemp(p, `class:${name}:${m.name}:param:${i}:${p}`) : p,
          );
          classRegistry[name].methods[m.name] = tagged;
          // Detect if this method returns a lambda at the top level of its body.
          // Prefer discovering the first inner returned lambda that actually
          // declares parameters (e.g., method returns a lambda which returns
          // another lambda that declares args). This lets call-sites set the
          // correct thread-var names for those params.
          let retLambdaParams = null;
          function detectLambdaNodeInStmt(st) {
            if (!st) return null;
            // pattern: [null, expr]
            if (Array.isArray(st) && st.length > 1) {
              const expr = st[1];
              if (expr && expr.type === "Lambda") return expr;
            }
            // explicit return: Return { value: { type: 'Lambda' } }
            if (st && st.type === "Return" && st.value && st.value.type === "Lambda") {
              return st.value;
            }
            // nested forms: Return with array value [null, Lambda]
            if (st && st.type === "Return" && Array.isArray(st.value) && st.value.length > 1) {
              const expr = st.value[1];
              if (expr && expr.type === "Lambda") return expr;
            }
            return null;
          }

          function findFirstInnerLambdaWithParams(lambdaNode) {
            if (!lambdaNode) return null;
            // If this lambda itself has params, prefer those.
            if (Array.isArray(lambdaNode.params) && lambdaNode.params.length > 0) return lambdaNode.params.slice();
            // Otherwise descend into returned-lambda chain to find the first inner
            // lambda that declares params.
            let cur = lambdaNode;
            while (cur && cur.body && Array.isArray(cur.body.body)) {
              let next = null;
              for (const st of cur.body.body) {
                if (!st) continue;
                if (Array.isArray(st) && st.length > 1 && st[1] && st[1].type === "Lambda") {
                  next = st[1];
                  break;
                }
                if (st.type === "Return") {
                  if (st.value && st.value.type === "Lambda") {
                    next = st.value;
                    break;
                  }
                  if (Array.isArray(st.value) && st.value.length > 1 && st.value[1] && st.value[1].type === "Lambda") {
                    next = st.value[1];
                    break;
                  }
                }
              }
              if (!next) break;
              if (Array.isArray(next.params) && next.params.length > 0) return next.params.slice();
              cur = next;
            }
            // No inner lambda with params found; return the immediate lambda's params (may be []/null)
            return Array.isArray(lambdaNode.params) ? lambdaNode.params.slice() : lambdaNode.params ? [lambdaNode.params] : [];
          }

          if (m && m.body && Array.isArray(m.body.body)) {
            for (const st of m.body.body) {
              const node = detectLambdaNodeInStmt(st);
              if (node != null) {
                const found = findFirstInnerLambdaWithParams(node);
                if (found != null) retLambdaParams = found.slice();
                else retLambdaParams = [];
                break;
              }
            }
          }
          // Map returned-lambda param names to tagged names as well and store originals
          if (Array.isArray(retLambdaParams) && retLambdaParams.length > 0) {
            classRegistry[name].methodReturnOriginals[m.name] = retLambdaParams.slice();
            classRegistry[name].methodReturns[m.name] = retLambdaParams.map((p, i) =>
              p ? __pw_newArgTemp(p, `class:${name}:${m.name}:return:param:${i}:${p}`) : p,
            );
          } else {
            classRegistry[name].methodReturns[m.name] = retLambdaParams;
            classRegistry[name].methodReturnOriginals[m.name] = retLambdaParams;
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
    // debug: print classRegistry for inspection when running locally
    try {
      // only print small summary
      const cr = {};
      for (const k of Object.keys(classRegistry || {})) {
        cr[k] = { methods: Object.keys(classRegistry[k].methods || {}), methodReturns: classRegistry[k].methodReturns };
      }
    } catch (e) {}
  // Map local variables that are assigned `new ClassName(...)` so we can
  // later identify the class of a receiver variable when emitting method calls.
  const varToClass = {};
  function collectVarAssignments(root) {
    function walk(node) {
      if (!node) return;
      if (Array.isArray(node)) {
        for (const n of node) walk(n);
        return;
      }
      if (node.type === "Declare" && node.value && node.value.type === "New") {
        const callee = node.value.callee;
        if (callee && callee.type === "Call" && typeof callee.name === "string") {
          varToClass[node.name] = callee.name;
        }
      }
      // Track variables initialized to lambda expressions or to arrays
      // whose first element is a lambda. Store a structured record so
      // callers can obtain original param order, tagged names, and a map.
      function makeLambdaMeta(origParams, name, hint) {
        if (!origParams) return { orig: [], tagged: [], map: {} };
        const orig = Array.isArray(origParams) ? origParams.slice() : [origParams];
        const tagged = [];
        const map = {};
        for (let i = 0; i < orig.length; i++) {
          const p = orig[i];
          const tag = p ? __pw_newArgTemp(p, `var:${name}:${hint}:param:${i}:${p}`) : p;
          tagged.push(tag);
          if (p) map[p] = tag;
        }
        return { orig, tagged, map };
      }
      if (node.type === "Declare" && node.value && node.value.type === "Lambda") {
        varToLambda[node.name] = makeLambdaMeta(node.value.params, node.name, "param");
      }
      if (node.type === "Assign" && node.value && node.value.type === "Lambda") {
        varToLambda[node.name] = makeLambdaMeta(node.value.params, node.name, "param");
      }
      if (node.type === "Declare" && node.value && node.value.type === "Array") {
        const els = node.value.elements || [];
        if (els.length > 0 && els[0] && els[0].type === "Lambda") {
          varToLambda[node.name] = makeLambdaMeta(els[0].params, node.name, "element");
        }
      }
      if (node.type === "Assign" && node.value && node.value.type === "Array") {
        const els = node.value.elements || [];
        if (els.length > 0 && els[0] && els[0].type === "Lambda") {
          varToLambda[node.name] = makeLambdaMeta(els[0].params, node.name, "element");
        }
      }
      if (node.type === "Assign" && node.value && node.value.type === "New") {
        const callee = node.value.callee;
        if (callee && callee.type === "Call" && typeof callee.name === "string") {
          varToClass[node.name] = callee.name;
        }
      }
      
      if (node.type === "Block" && Array.isArray(node.body)) return walk(node.body);
      if (node.type === "On" && node.body && Array.isArray(node.body.body)) return walk(node.body.body);
      if (node.body && Array.isArray(node.body)) return walk(node.body);
    }
    walk(root);
  }
  collectVarAssignments(ast);

  // When emitting class method bodies we set this to the current class
  // name so `this` receiver lookups can be resolved to the proper
  // `classRegistry` entry (ensures `this.add(...)` uses the same
  // tagged param names as external calls like `num.add(...)`).
  let emittingClass = null;

  // Adjust array index for one-indexed arrays:
  // - If index is a numeric literal, add 1 at compile time.
  // - If index is a numeric string, convert and add 1.
  // - Otherwise (expression/variable), emit an `operator_add` reporter to add 1 at runtime.
  function adjustArrayIndex(idxNested) {
    if (idxNested === "" || idxNested === undefined || idxNested === null) return idxNested;
    if (typeof idxNested === "number") return idxNested + 1;
    if (typeof idxNested === "string" && /^-?\d+(?:\.\d+)?$/.test(idxNested)) return Number(idxNested) + 1;
    return { opcode: "operator_add", inputs: [idxNested, 1] };
  }

  

  // Prefer storing the raw getter or temp-ref when possible instead of
  // pre-executing with `jwLambda_executeR`. This avoids producing
  // the two-step pattern (pre-execute then re-execute) at emit time.
  function makeSetForCallReporter(scope, tempName, callReporter) {
    if (!callReporter || callReporter.opcode !== "jwLambda_executeR" || !Array.isArray(callReporter.inputs))
      return { opcode: "SPtempVars_setVar", inputs: [scope, tempName, callReporter] };
    const target = callReporter.inputs[0];
    if (target && target.opcode === "jwClass_getProp" && Array.isArray(target.inputs)) {
      const sn = { opcode: "SPtempVars_setVar", inputs: [scope, tempName, target] };
      sn.__origin = { type: "boundGetProp", method: target.inputs[0], receiver: target.inputs[1] };
      return sn;
    }
    if (target && target.opcode === "SPtempVars_getVar" && Array.isArray(target.inputs)) {
      const sn = { opcode: "SPtempVars_setVar", inputs: [scope, tempName, target] };
      sn.__origin = { type: "boundTempRef", referenced: target.inputs[1] };
      return sn;
    }
    // Handle array-get targets (emit raw array-get instead of pre-executing)
    if (target && target.opcode === "jwArray_get" && Array.isArray(target.inputs)) {
      const sn = { opcode: "SPtempVars_setVar", inputs: [scope, tempName, target] };
      sn.__origin = { type: "boundArrayGet", arr: target.inputs[0], index: target.inputs[1] };
      return sn;
    }
    // Handle inline-stack reporters as direct values (avoid pre-execution)
    if (target && target.opcode === "control_inline_stack_output" && Array.isArray(target.inputs)) {
      const sn = { opcode: "SPtempVars_setVar", inputs: [scope, tempName, target] };
      sn.__origin = { type: "boundInline" };
      return sn;
    }
    try {
      console.error("DEBUG makeSetForCallReporter: fallback storing callReporter for", tempName, JSON.stringify(callReporter && callReporter.inputs && callReporter.inputs[0] ? callReporter.inputs[0] : callReporter));
    } catch (e) {}
    return { opcode: "SPtempVars_setVar", inputs: [scope, tempName, callReporter] };
  }

  // Normalize inline child sets that accidentally store a jwLambda_executeR
  // directly. This transforms them (when possible) into storing the raw
  // getter or temp-ref using makeSetForCallReporter so we don't emit
  // pre-executed call results and later re-execute them.
  function normalizeInlineSetCallReporters(inlineChildren) {
    if (!Array.isArray(inlineChildren)) return;
    // First pass: record indices of direct execute stores (potential pre-execs)
    const execStores = Object.create(null); // tempName -> index
    for (let i = 0; i < inlineChildren.length; i++) {
      const node = inlineChildren[i];
      if (!node || node.opcode !== "SPtempVars_setVar" || !Array.isArray(node.inputs)) continue;
      const val = node.inputs[2];
      if (!val || val.opcode !== "jwLambda_executeR" || !Array.isArray(val.inputs)) continue;
      execStores[node.inputs[1]] = i;
    }
    // Second pass: find re-exec patterns that reference an earlier temp and
    // only normalize the _earlier_ store. This avoids stripping execute
    // reporters that are meant to run now while fixing the pre-exec case.
    for (let j = 0; j < inlineChildren.length; j++) {
      const node = inlineChildren[j];
      if (!node || !Array.isArray(node.inputs)) continue;
      const val = node.inputs[2];
      if (!val || val.opcode !== "jwLambda_executeR" || !Array.isArray(val.inputs)) continue;
      const arg0 = val.inputs[0];
      if (arg0 && arg0.opcode === "SPtempVars_getVar" && Array.isArray(arg0.inputs)) {
        const referenced = arg0.inputs[1];
        const earlierIdx = execStores[referenced];
        if (earlierIdx !== undefined && earlierIdx < j) {
          const preNode = inlineChildren[earlierIdx];
          const scope = preNode.inputs[0] || "thread";
          const tempName = preNode.inputs[1];
          try {
            inlineChildren[earlierIdx] = makeSetForCallReporter(scope, tempName, preNode.inputs[2]);
          } catch (e) {}
        }
      }
    }
  }

  // Flatten nested control_inline_stack_output wrappers into a single
  // inline-child sequence. When an outer SPtempVars_setVar stores a
  // control_inline_stack_output, splice that inner sequence into the
  // parent and replace inner `procedures_return` nodes with a
  // `SPtempVars_setVar` that writes into the outer temp. This produces
  // one big wrapper that continuously writes to temps rather than
  // nesting sub-wrappers with early returns.
  function flattenInlineWrappers(inlineChildren, wrapperTemp) {
    if (!Array.isArray(inlineChildren)) return inlineChildren;
    // Choose wrapper temp: prefer the first temp assigned in the sequence
    let chosenWrapper = wrapperTemp;
    if (!chosenWrapper) {
      for (const n of inlineChildren) {
        if (n && n.opcode === "SPtempVars_setVar" && Array.isArray(n.inputs) && typeof n.inputs[1] === "string") {
          chosenWrapper = n.inputs[1];
          break;
        }
      }
    }
    if (!chosenWrapper) {
      chosenWrapper = __pw_newTemp("__c");
      try {
        if (typeof globalTempOriginMap !== "undefined") globalTempOriginMap[chosenWrapper] = globalTempOriginMap[chosenWrapper] || null;
      } catch (e) {}
    }

    const out = [];
    // Pre-scan inlineChildren to detect trivial temp-copy assignments
    // that simply copy a named variable into a temp but are only used
    // once (or not at all). We'll remove those sets and replace uses
    // of the temp with a direct `SPtempVars_getVar` of the original
    // variable to avoid emitting needless `set` blocks.
    const lastSetIndex = {};
    const usageIndices = {};
    function collectGetVarUsages(node, idx) {
      if (!node || typeof node !== "object") return;
      if (node.opcode === "SPtempVars_getVar" && Array.isArray(node.inputs)) {
        const tn = node.inputs[1];
        usageIndices[tn] = usageIndices[tn] || [];
        usageIndices[tn].push(idx);
        return;
      }
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (Array.isArray(v)) for (const el of v) collectGetVarUsages(el, idx);
        else if (typeof v === "object" && v !== null) collectGetVarUsages(v, idx);
      }
    }
    for (let i = 0; i < inlineChildren.length; i++) {
      const n = inlineChildren[i];
      if (!n) continue;
      if (n.opcode === "SPtempVars_setVar" && Array.isArray(n.inputs)) {
        const tn = n.inputs[1];
        lastSetIndex[tn] = i;
      }
      collectGetVarUsages(n, i);
    }
    const candidateRemap = {}; // temp -> { replacement, origin }
    const removableSetIndices = new Set();
    for (let i = 0; i < inlineChildren.length; i++) {
      const n = inlineChildren[i];
      if (!n || n.opcode !== "SPtempVars_setVar" || !Array.isArray(n.inputs)) continue;
      const tempName = n.inputs[1];
      const val = n.inputs[2];
      // consider simple var-copy: either a direct Var node or a SPtempVars_getVar
      if (val && typeof val === "object" && (val.type === "Var" || (val.opcode === "SPtempVars_getVar" && Array.isArray(val.inputs)))) {
        // only consider removable if this is the last assignment to the temp
        if (lastSetIndex[tempName] !== i) continue;
        let varName = null;
        let destType = "global";
        if (val.type === "Var") {
          varName = val.name;
          destType = typeof varName === "string" && varName.startsWith("__") ? "thread" : "global";
        } else if (val.opcode === "SPtempVars_getVar") {
          destType = val.inputs[0] || "global";
          varName = val.inputs[1];
        }
        if (typeof varName === "string" && varName.length > 0) {
          candidateRemap[tempName] = { replacement: { opcode: "SPtempVars_getVar", inputs: [destType, varName] }, origin: n.__origin };
          removableSetIndices.add(i);
        }
      }
    }

    // Helper: recursively replace SPtempVars_getVar references to remapped temps
    function replaceRemapped(node) {
      if (node === undefined || node === null) return node;
      if (Array.isArray(node)) return node.map(replaceRemapped);
      if (typeof node !== "object") return node;
      if (node.opcode === "SPtempVars_getVar" && Array.isArray(node.inputs)) {
        const tn = node.inputs[1];
        if (candidateRemap[tn]) {
          const rep = candidateRemap[tn].replacement;
          // attach origin metadata to the replacement if available
          if (candidateRemap[tn].origin) rep.__origin = candidateRemap[tn].origin;
          return rep;
        }
        return { opcode: "SPtempVars_getVar", inputs: [node.inputs[0], tn] };
      }
      const outNode = {};
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (Array.isArray(v)) outNode[k] = v.map(replaceRemapped);
        else if (typeof v === "object" && v !== null) outNode[k] = replaceRemapped(v);
        else outNode[k] = v;
      }
      return outNode;
    }

    // small helper for stable fingerprinting after replacement
    function safeFingerprint(obj) {
      try {
        return JSON.stringify(obj === undefined ? null : obj);
      } catch (e) {
        return String(obj);
      }
    }

    let lastWrapperFingerprint = null;
    function pushWrapperIfChanged(scope, expr, origin) {
      const replaced = replaceRemapped(expr);
      const fp = safeFingerprint(replaced);
      if (fp === lastWrapperFingerprint) return;
      lastWrapperFingerprint = fp;
      const setNode = { opcode: "SPtempVars_setVar", inputs: [scope || "thread", chosenWrapper, replaced] };
      if (origin) setNode.__origin = origin;
      out.push(setNode);
    }

    // Only update wrapper on explicit `procedures_return` or when a node
    // assigns directly to the chosen wrapper. This avoids redundant
    // intermediary writes for simple temp shuffling.
    for (let i = 0; i < inlineChildren.length; i++) {
      const node = inlineChildren[i];
      if (!node) continue;

      // Skip trivial removable sets that only copy a named var into a temp
      if (removableSetIndices.has(i)) {
        // we intentionally drop this set; its uses will be replaced
        continue;
      }

      // Splice inner inline-set wrapper sequences
      if (node.opcode === "SPtempVars_setVar" && Array.isArray(node.inputs)) {
        const scope = node.inputs[0] || "thread";
        const tempName = node.inputs[1];
        const val = node.inputs[2];
        if (val && val.opcode === "control_inline_stack_output" && Array.isArray(val.inputs) && Array.isArray(val.inputs[0])) {
          const inner = val.inputs[0];
          const flatInner = flattenInlineWrappers(inner, chosenWrapper);
          for (const inNode of flatInner) {
            if (!inNode) continue;
            if (inNode.opcode === "procedures_return") {
              const retVal = Array.isArray(inNode.inputs) ? inNode.inputs[0] : undefined;
              // Preserve original temp assignment only if not removable; otherwise skip
              if (!removableSetIndices.has(i)) {
                const setNode = { opcode: "SPtempVars_setVar", inputs: [scope, tempName, replaceRemapped(retVal)] };
                if (node.__origin) setNode.__origin = node.__origin;
                out.push(setNode);
              }
              // Update wrapper once to reference this temp's value but replace remapped temps
              const refExpr = replaceRemapped({ opcode: "SPtempVars_getVar", inputs: ["thread", tempName] });
              const origin = (retVal && retVal.__origin) || node.__origin || undefined;
              pushWrapperIfChanged(scope, refExpr, origin);
            } else {
              out.push(replaceRemapped(inNode));
            }
          }
          continue;
        }
      }

      // Inline bare inline wrappers
      if (node.opcode === "control_inline_stack_output" && Array.isArray(node.inputs) && Array.isArray(node.inputs[0])) {
        const flatInner = flattenInlineWrappers(node.inputs[0], chosenWrapper);
        for (const inNode of flatInner) if (inNode) out.push(replaceRemapped(inNode));
        continue;
      }

      // Convert returns into writing the wrapper only once per return
      if (node.opcode === "procedures_return") {
        const retVal = Array.isArray(node.inputs) ? node.inputs[0] : undefined;
        const origin = (retVal && retVal.__origin) || undefined;
        pushWrapperIfChanged("thread", replaceRemapped(retVal), origin);
        continue;
      }

      // Default: keep node. Only if this node sets the chosen wrapper do
      // we record that assignment (to avoid duplicating trivial moves).
      // Apply remapping to any nested getter references within the node
      // so copies of global getters are replaced with the original getter
      // and not left as intermediate thread-temp copies.
      out.push(replaceRemapped(node));
      if (node.opcode === "SPtempVars_setVar" && Array.isArray(node.inputs)) {
        const scope = node.inputs[0] || "thread";
        const tempName = node.inputs[1];
        const expr = node.inputs[2];
        if (tempName === chosenWrapper) {
          // explicit write to wrapper - keep as-is
        }
      }
    }

    // Final pass: canonicalize simple temp-copy chains in `out` so that
    // thread temps that merely mirror a global var/getter are replaced
    // by the original global getter. This collapse resolves chains like:
    //   set t1 = SPtempVars_getVar global arr
    //   set t2 = SPtempVars_getVar thread t1
    //   return t2
    // into a direct return of SPtempVars_getVar global arr.
    try {
      const defs = {}; // temp -> { idx, rhs, origin }
      for (let i = 0; i < out.length; i++) {
        const n = out[i];
        if (!n || typeof n !== "object") continue;
        if (n.opcode === "SPtempVars_setVar" && Array.isArray(n.inputs)) {
          const tn = n.inputs[1];
          defs[tn] = { idx: i, rhs: n.inputs[2], origin: n.__origin };
        }
      }
      const memo = {};
      function resolveToGlobal(temp, seen = new Set()) {
        if (memo.hasOwnProperty(temp)) return memo[temp];
        if (seen.has(temp)) return (memo[temp] = null);
        seen.add(temp);
        const def = defs[temp];
        if (!def) return (memo[temp] = null);
        const rhs = def.rhs;
        if (!rhs) return (memo[temp] = null);
        if (rhs.type === "Var") {
          const vn = rhs.name;
          const destType = typeof vn === "string" && vn.startsWith("__") ? "thread" : "global";
          const res = { opcode: "SPtempVars_getVar", inputs: [destType, vn], __origin: def.origin || rhs.__origin || null };
          return (memo[temp] = res);
        }
        if (rhs.opcode === "SPtempVars_getVar" && Array.isArray(rhs.inputs)) {
          const scope = rhs.inputs[0] || "global";
          const name = rhs.inputs[1];
          if (scope === "global") {
            const res = { opcode: "SPtempVars_getVar", inputs: [scope, name], __origin: def.origin || rhs.__origin || null };
            return (memo[temp] = res);
          }
          if (scope === "thread") {
            const inner = name;
            const innerRes = resolveToGlobal(inner, seen);
            if (innerRes) return (memo[temp] = innerRes);
            return (memo[temp] = null);
          }
        }
        return (memo[temp] = null);
      }
      const canonical = {};
      for (const t of Object.keys(defs)) {
        const c = resolveToGlobal(t);
        if (c) canonical[t] = c;
      }
      if (Object.keys(canonical).length > 0) {
        function replaceCanon(node) {
          if (node === undefined || node === null) return node;
          if (Array.isArray(node)) return node.map(replaceCanon);
          if (typeof node !== "object") return node;
          if (node.opcode === "SPtempVars_getVar" && Array.isArray(node.inputs)) {
            const tn = node.inputs[1];
            if (canonical[tn]) return canonical[tn];
            return { opcode: "SPtempVars_getVar", inputs: [node.inputs[0], tn] };
          }
          const nn = {};
          for (const k of Object.keys(node)) {
            const v = node[k];
            if (Array.isArray(v)) nn[k] = v.map(replaceCanon);
            else if (typeof v === "object" && v !== null) nn[k] = replaceCanon(v);
            else nn[k] = v;
          }
          if (node.opcode) nn.opcode = node.opcode;
          return nn;
        }
        const newOut = [];
        for (let i = 0; i < out.length; i++) {
          const n = out[i];
          if (n && n.opcode === "SPtempVars_setVar" && Array.isArray(n.inputs)) {
            const tn = n.inputs[1];
            if (canonical[tn]) continue;
          }
          newOut.push(replaceCanon(n));
        }
        out.length = 0;
        for (const x of newOut) out.push(x);
      }
    } catch (e) {}

    // Prefer returning the last *computed* temp (the most recent temp that
    // was assigned from an execution/getter) rather than accidentally
    // returning a trivial copy temp that may reference a global var like
    // `arr`. Scan backwards for the last SPtempVars_setVar whose RHS is
    // a function/array/class getter or an exec reporter; use that temp for
    // the final return. Fall back to the chosenWrapper when none found.
    try {
      let lastComputedTemp = null;
      const interestingOps = new Set([
        "jwLambda_executeR",
        "jwLambda_execute",
        "jwArray_get",
        "jwClass_getProp",
        "jwArray_append",
        "jwArray_set",
        "jwClass_new",
      ]);
      for (let i = out.length - 1; i >= 0; i--) {
        const n = out[i];
        if (!n || n.opcode !== "SPtempVars_setVar" || !Array.isArray(n.inputs)) continue;
        const rhs = n.inputs[2];
        const origin = n.__origin || (rhs && rhs.__origin) || null;
        if (
          (rhs && typeof rhs === "object" && rhs.opcode && interestingOps.has(rhs.opcode)) ||
          (origin && (origin.type === "execTempCall" || origin.type === "execGetProp" || origin.type === "boundArrayGet" || origin.type === "boundGetProp" || origin.type === "boundTempRef"))
        ) {
          lastComputedTemp = n.inputs[1];
          break;
        }
      }
      // Remove any existing procedures_return nodes — we'll append a single final return
      for (let i = out.length - 1; i >= 0; i--) {
        if (out[i] && out[i].opcode === "procedures_return") out.splice(i, 1);
      }
      const returnTemp = lastComputedTemp || chosenWrapper;
      // Attempt to canonicalize the return expression: if `returnTemp` was
      // merely a thread-temp copy of a global getter/Var, return the
      // original global getter instead of the thread temp.
      function resolveReturnExpr(tempName) {
        if (!tempName) return null;
        // Find the set node that defines this temp
        for (let i = out.length - 1; i >= 0; i--) {
          const n = out[i];
          if (!n || n.opcode !== "SPtempVars_setVar" || !Array.isArray(n.inputs)) continue;
          if (n.inputs[1] === tempName) {
            let rhs = n.inputs[2];
            // unwind thread-temp chains: SPtempVars_getVar -> find its definition
            let safety = 0;
            while (rhs && rhs.opcode === "SPtempVars_getVar" && Array.isArray(rhs.inputs) && rhs.inputs[0] === "thread" && safety < 20) {
              const innerTemp = rhs.inputs[1];
              // find the set that created innerTemp
              const def = out.find((m) => m && m.opcode === "SPtempVars_setVar" && Array.isArray(m.inputs) && m.inputs[1] === innerTemp);
              if (!def) break;
              rhs = def.inputs[2];
              safety++;
            }
            if (!rhs) return null;
            // If rhs is a simple Var node, convert to SPtempVars_getVar
            if (rhs.type === "Var") {
              const vn = rhs.name;
              const destType = typeof vn === "string" && vn.startsWith("__") ? "thread" : "global";
              return { opcode: "SPtempVars_getVar", inputs: [destType, vn] };
            }
            // If rhs is an SPtempVars_getVar of a global, return it directly
            if (rhs.opcode === "SPtempVars_getVar" && Array.isArray(rhs.inputs) && rhs.inputs[0] === "global") {
              return { opcode: "SPtempVars_getVar", inputs: [rhs.inputs[0], rhs.inputs[1]] };
            }
            // Otherwise fall back to returning the thread temp
            break;
          }
        }
        return null;
      }

      const canonical = resolveReturnExpr(returnTemp);
      if (canonical) out.push({ opcode: "procedures_return", inputs: [canonical] });
      else out.push({ opcode: "procedures_return", inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", returnTemp] }] });
    } catch (e) {
      const hasReturn = out.some((n) => n && n.opcode === "procedures_return");
      if (!hasReturn) out.push({ opcode: "procedures_return", inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", chosenWrapper] }] });
    }
    return out;
  }

  // Helper to create an inline block while ensuring any accidental
  // direct-store executeR nodes are normalized. Centralizing inline
  // block creation here guarantees normalization is always applied
  // at emit time (avoids post-emit rewrites).
  function createInlineBlock(inlineChildren) {
    if (!Array.isArray(inlineChildren)) return { opcode: "control_inline_stack_output", inputs: [inlineChildren] };
    normalizeInlineSetCallReporters(inlineChildren);
    const flat = flattenInlineWrappers(inlineChildren);
    return { opcode: "control_inline_stack_output", inputs: [flat] };
  }

  // Recursively normalize any SPtempVars_setVar nodes across the entire
  // nested tree that store a jwLambda_executeR reporter. This ensures
  // all such stores are routed through makeSetForCallReporter so they
  // become origin-tagged getters/temp-refs instead of pre-executed
  // jwLambda_executeR reporters (eliminates double-exec emission).
  function normalizeAllSetCallReporters(node) {
    if (!node) return;
    if (Array.isArray(node)) {
      // Treat this array as a potential inline-child sequence and only
      // perform the targeted normalization there. Then recurse into each
      // item so nested arrays/objects are handled.
      try {
        normalizeInlineSetCallReporters(node);
      } catch (e) {}
      for (let i = 0; i < node.length; i++) normalizeAllSetCallReporters(node[i]);
      return;
    }
    if (typeof node === "object" && node !== null) {
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (Array.isArray(v) || (typeof v === "object" && v !== null)) normalizeAllSetCallReporters(v);
      }
    }
  }

  // Convert AST to nested JSON form (canonical representation generator expects)
  function exprToNested(expr, inMethod = false, paramMap = null) {
    let prevTempOrigin = null;
    const tempOriginMap = {};
    if (!expr) return "";
    // Lambda expressions (arrow functions) -> emit jwLambda_newLambda nested block
    if (expr.type === "Lambda") {
      lambdasUsed = true;
      const origParams = Array.isArray(expr.params) ? expr.params.slice() : expr.params ? [expr.params] : [];
      // reuse provided paramMap (from class/var precollection) but ensure
      // every declared param has a tagged name. Missing entries are
      // synthesized so nested lambdas never reference plain global vars.
      const localParamMap = {};
      if (paramMap && typeof paramMap === "object") {
        for (const k of Object.keys(paramMap)) localParamMap[k] = paramMap[k];
      }
      for (const p of origParams) {
        if (!p) continue;
        if (!Object.prototype.hasOwnProperty.call(localParamMap, p) || localParamMap[p] === undefined) {
          localParamMap[p] = __pw_newArgTemp(p);
        }
      }
      let lambdaArg;
      if (!origParams || origParams.length === 0)
        lambdaArg = { opcode: "jwLambda_arg", shadow: true, noPlaceholder: true };
      else if (origParams.length === 1) lambdaArg = localParamMap[origParams[0]];
      else lambdaArg = origParams.map((p) => localParamMap[p]);
      let lambdaBody = [];
      if (expr.body && Array.isArray(expr.body.body)) {
        const raw = expr.body.body.map((s) => stmtToNested(s, true, localParamMap)).filter(Boolean);
        lambdaBody = flattenNestedResults(raw);
        assertReturnTerminal(lambdaBody, "lambda body");
      }
      return { opcode: "jwLambda_newLambda", inputs: [lambdaArg, lambdaBody] };
    }
    if (expr.type === "Literal") return expr.value;
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
        return { type: "Var", name: paramMap[expr.name] };
      return { type: "Var", name: expr.name };
    }
    if (expr.type === "This") return { opcode: "jwClass_self", inputs: [] };
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
                // compose jwClass_getProp chain for all remaining props
                let propGet = null;
                for (let pi = 0; pi < props.length; pi++) {
                  const pname = props[pi];
                  if (pi === 0) propGet = { opcode: "jwClass_getProp", inputs: [pname, receiverRef] };
                  else propGet = { opcode: "jwClass_getProp", inputs: [pname, propGet] };
                }
                // replace the procedures_return value with property getter
                inlineChildren[i] = { opcode: "procedures_return", inputs: [propGet] };
                normalizeInlineSetCallReporters(inlineChildren);
                return createInlineBlock(inlineChildren);
              }
              // If return value is not a temp getter, fallback to wrapping the return value
              // with property getters by producing a new procedures_return that
              // applies jwClass_getProp to the result expression.
              let receiverRefAlt = node.inputs && node.inputs[0] ? node.inputs[0] : null;
              let propGetAlt = null;
              for (let pi = 0; pi < props.length; pi++) {
                const pname = props[pi];
                if (pi === 0) propGetAlt = { opcode: "jwClass_getProp", inputs: [pname, receiverRefAlt] };
                else propGetAlt = { opcode: "jwClass_getProp", inputs: [pname, propGetAlt] };
              }
              inlineChildren[i] = { opcode: "procedures_return", inputs: [propGetAlt] };
              normalizeInlineSetCallReporters(inlineChildren);
              return createInlineBlock(inlineChildren);
            }
          }
        }

        // Otherwise, recvNested is a reporter or nested value; just chain property gets
        let receiverRef = recvNested;
        for (let i = 0; i < props.length; i++) {
          const prop = props[i];
          receiverRef = { opcode: "jwClass_getProp", inputs: [prop, receiverRef] };
        }
        return receiverRef;
      }
      // Build nested receiver (object) stopping before the final property
      let objReceiver =
        typeof chain[0] === "string" && chain[0] === "this"
          ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true }
          : { type: "Var", name: chain[0] };
      if (chain.length > 2) {
        for (let i = 1; i < chain.length; i++) {
          const prop = chain[i];
          objReceiver = { opcode: "jwClass_getProp", inputs: [prop, objReceiver] };
        }
        return objReceiver;
      }
      if (chain.length === 2) {
        const propName = chain[1];
        return { opcode: "jwClass_getProp", inputs: [propName, objReceiver] };
      }
      return objReceiver;
    }
    if (expr.type === "MemberCall") {
      const chain = expr.chain || [];
      if (chain.length < 2) return "";
      // Receiver may be a simple name or an expression (from a previous call).
      let objReceiver = null;
      const first = chain[0];
      if (typeof first === "string") {
        objReceiver =
          first === "this"
            ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true }
            : { type: "Var", name: first };
      } else if (typeof first === "object") {
        objReceiver = exprToNested(first, inMethod, paramMap);
      } else {
        objReceiver = { type: "Var", name: String(first) };
      }
      // Build getters for any intermediate property names
      if (chain.length > 2) {
        for (let i = 1; i < chain.length - 1; i++) {
          const prop = chain[i];
          if (typeof prop === "string")
            objReceiver = { opcode: "jwClass_getProp", inputs: [prop, objReceiver] };
          else objReceiver = { opcode: "jwClass_getProp", inputs: [prop, objReceiver] };
        }
      }
      const methodName = chain[chain.length - 1];
      const methodGetter = { opcode: "jwClass_getProp", inputs: [methodName, objReceiver] };

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
            if (receiverChain[0] === "this" && emittingClass) baseClassName = emittingClass;
            else if (varToClass[receiverChain[0]]) baseClassName = varToClass[receiverChain[0]];
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
          if (chain[0] === "this" && emittingClass) className = emittingClass;
          else if (varToClass[chain[0]]) className = varToClass[chain[0]];
        } else if (baseClassName) {
          className = baseClassName;
        }
        const methodParams =
          className &&
          classRegistry[className] &&
          classRegistry[className].methods &&
          classRegistry[className].methods[methodName]
            ? classRegistry[className].methods[methodName]
            : null;
        const returnsLambdaForMethod =
          className &&
          classRegistry[className] &&
          classRegistry[className].methodReturns &&
          classRegistry[className].methodReturns[methodName]
            ? classRegistry[className].methodReturns[methodName]
            : null;
        if (Array.isArray(methodParams) && methodParams.length > 0) {
          const setters = [];
          let receiverTempName = null;
          let receiverRef = objReceiver;
          const needTempForReceiver = !(objReceiver && objReceiver.opcode === "jwClass_self");
          if (needTempForReceiver) {
            receiverTempName = __pw_newTemp("__m");
            if (typeof tempOriginMap !== "undefined") tempOriginMap[receiverTempName] = tempOriginMap[receiverTempName] || null;
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
          const boundMethodGetter = { opcode: "jwClass_getProp", inputs: [methodName, receiverRef] };
          const callMethod = { opcode: "jwLambda_executeR", inputs: [boundMethodGetter, ""] };
          const ret = { opcode: "procedures_return", inputs: [Array.isArray(returnsLambdaForMethod) && returnsLambdaForMethod.length > 0 ? boundMethodGetter : callMethod] };
          const inlineChildren = [].concat(setters, [ret]);
          normalizeInlineSetCallReporters(inlineChildren);
          return createInlineBlock(inlineChildren);
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
          else if (
            className &&
            classRegistry[className] &&
            classRegistry[className].methods &&
            Array.isArray(classRegistry[className].methods[methodName]) &&
            classRegistry[className].methods[methodName].length > 0
          )
            argTempName = classRegistry[className].methods[methodName][0];
          else argTempName = __pw_newArgTemp("value");
          const setters2 = [{ opcode: "SPtempVars_setVar", inputs: ["thread", argTempName, argNested] }];
          const callMethod2 = { opcode: "jwLambda_executeR", inputs: [methodGetter, ""] };
          const ret2 = { opcode: "procedures_return", inputs: [Array.isArray(returnsLambdaForMethod) && returnsLambdaForMethod.length > 0 ? methodGetter : callMethod2] };
          const inlineChildren2 = [].concat(setters2, [ret2]);
          normalizeInlineSetCallReporters(inlineChildren2);
          return { opcode: "control_inline_stack_output", inputs: [inlineChildren2] };
        }
        return Array.isArray(returnsLambdaForMethod) && returnsLambdaForMethod.length > 0 ? methodGetter : { opcode: "jwLambda_executeR", inputs: [methodGetter, ""] };
      }

      // Multi-step chain: create temps for each intermediate call result
      const inlineChildren = [];
      let prevTemp = null;
      // track arg names for a lambda returned by the previous call (if known)
      let prevReturnedLambdaArgs = null;
      // remember the last seen method name for fallback chained calls
      let prevStepMethodName = null;
      // Track the origin of the previous temp so we can avoid re-looking-up
      // properties on a value that was itself produced by executing a
      // previously-bound method (this is the root cause of double-exec).
      const resolveOriginForTemp = (temp) => {
          let origin = tempOriginMap && temp ? tempOriginMap[temp] : null;
          if ((!origin || origin === null) && typeof globalTempOriginMap !== "undefined") origin = globalTempOriginMap[temp] || null;
          let safety = 0;
          while (
            origin &&
            origin.type === "execTempCall" &&
            origin.referenced &&
            ((tempOriginMap && tempOriginMap[origin.referenced]) || (typeof globalTempOriginMap !== "undefined" && globalTempOriginMap[origin.referenced])) &&
            safety < 20
          ) {
            origin = (tempOriginMap && tempOriginMap[origin.referenced]) || (typeof globalTempOriginMap !== "undefined" && globalTempOriginMap[origin.referenced]);
            safety++;
          }
          return origin || null;
      };
      for (let si = 0; si < steps.length; si++) {
        const step = steps[si];
        // determine receiverRef: for first step use receiverChain -> build nested receiver
        let receiverRef = null;
        if (si === 0) {
          const recvChain = step.receiverChain || [];
          if (recvChain.length === 0) receiverRef = objReceiver;
          else {
            // build nested receiver from recvChain
            let r =
              recvChain[0] === "this"
                ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true }
                : { type: "Var", name: recvChain[0] };
            for (let k = 1; k < recvChain.length; k++)
              r = { opcode: "jwClass_getProp", inputs: [recvChain[k], r] };
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
            if (step.receiverChain[0] === "this" && emittingClass) classNameForStep = emittingClass;
            else if (varToClass[step.receiverChain[0]]) classNameForStep = varToClass[step.receiverChain[0]];
          }
        } else {
          classNameForStep = baseClassName;
        }
        const paramsForStep =
          classNameForStep &&
          classRegistry[classNameForStep] &&
          classRegistry[classNameForStep].methods &&
          classRegistry[classNameForStep].methods[step.methodName]
            ? classRegistry[classNameForStep].methods[step.methodName]
            : null;
        const returnsLambdaArgsForMethod =
          classNameForStep && classRegistry[classNameForStep] && classRegistry[classNameForStep].methodReturns
            ? classRegistry[classNameForStep].methodReturns[step.methodName]
            : null;

        // If the previous step returned a lambda, this step is most
        // commonly a call of that returned lambda rather than a fresh
        // method lookup on the returned object. Prefer treating it as
        // a lambda invocation using the tagged arg names we collected
        // earlier, which avoids re-looking-up the same property and
        // executing functions multiple times.
        if (si > 0 && prevTemp && Array.isArray(prevReturnedLambdaArgs) && prevReturnedLambdaArgs.length > 0) {
          for (let pi = 0; pi < prevReturnedLambdaArgs.length; pi++) {
            const pname = prevReturnedLambdaArgs[pi];
            const argExpr = step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
          }
          const oldPrev = prevTemp;
          const callReporter = { opcode: "jwLambda_executeR", inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", oldPrev] }, ""] };
          const tempName = __pw_newTemp("__c");
          if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName] = tempOriginMap[tempName] || null;
          let setNode;
          if (callReporter && callReporter.opcode === "jwLambda_executeR") {
            setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] };
          } else {
            setNode = makeSetForCallReporter("thread", tempName, callReporter);
          }
          if (!setNode.__origin) setNode.__origin = { type: "execTempCall", referenced: oldPrev };
          inlineChildren.push(setNode);
          prevTemp = tempName;
          prevTempOrigin = setNode.__origin || null;
          tempOriginMap[prevTemp] = prevTempOrigin;
          prevReturnedLambdaArgs = null;
          prevStepMethodName = null;
          continue;
        }

        // If this step is a normal method call (methodName present)
        if (step.methodName) {
          // set thread vars for params if we know their names
          if (Array.isArray(paramsForStep) && paramsForStep.length > 0) {
            for (let pi = 0; pi < paramsForStep.length; pi++) {
              const pname = paramsForStep[pi];
              const argExpr =
                step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
            }
            // Prefer executing a stored function value when the receiverRef
            // refers to the previous temp which itself was produced by
            // executing the same method getter. This avoids re-looking-up
            // the property and executing it twice.
            let executeTarget = { opcode: "jwClass_getProp", inputs: [step.methodName, receiverRef] };
            if (
              receiverRef &&
              receiverRef.opcode === "SPtempVars_getVar" &&
              Array.isArray(receiverRef.inputs) &&
              prevTemp &&
              receiverRef.inputs[1] === prevTemp
            ) {
              const resolved = resolveOriginForTemp(prevTemp) || prevTempOrigin;
              try {
                console.error("DEBUG methodName check:", step.methodName, prevTemp, JSON.stringify(resolved), JSON.stringify(prevTempOrigin));
              } catch (e) {}
              if (resolved && (resolved.type === "execGetProp" || resolved.type === "boundGetProp") && resolved.method === step.methodName) {
                executeTarget = { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] };
              } else {
                try {
                  console.error("DEBUG methodName no-collapse:", step.methodName, prevTemp, JSON.stringify(resolved), JSON.stringify(prevTempOrigin));
                } catch (e) {}
              }
            }
            const tempName = __pw_newTemp("__c");
            if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName] = tempOriginMap[tempName] || null;
            let setNode;
            if (executeTarget && executeTarget.opcode === "jwClass_getProp") {
              // In a multi-step chain, store the raw getter to avoid pre-executing it
              setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, executeTarget] };
              if (Array.isArray(executeTarget.inputs)) setNode.__origin = { type: "boundGetProp", method: executeTarget.inputs[0], receiver: executeTarget.inputs[1] };
            } else if (executeTarget && executeTarget.opcode === "SPtempVars_getVar") {
              // Store the temp-ref (function value) instead of pre-executing it
              setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, executeTarget] };
              setNode.__origin = { type: "boundTempRef", referenced: executeTarget.inputs[1] };
            } else {
              const callReporter = { opcode: "jwLambda_executeR", inputs: [executeTarget, ""] };
              if (callReporter && callReporter.opcode === "jwLambda_executeR") {
                setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] };
              } else {
                setNode = makeSetForCallReporter("thread", tempName, callReporter);
              }
            }
              inlineChildren.push(setNode);
              prevTemp = tempName;
              prevTempOrigin = setNode.__origin || null;
              tempOriginMap[prevTemp] = prevTempOrigin;
              // remember if this method is known to return a lambda and its arg names
              prevReturnedLambdaArgs = Array.isArray(returnsLambdaArgsForMethod) ? returnsLambdaArgsForMethod.slice() : null;
              prevStepMethodName = step.methodName;
              continue;
          }

          // fallback when param names unknown: set a synthetic thread var for the first arg
          const argPos =
            step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
          // handle unknown-param method call; if the receiver is the previous temp
          // and that temp originated from executing the same method getter,
          // prefer executing the stored function value directly.
          let executeTarget2 = { opcode: "jwClass_getProp", inputs: [step.methodName, receiverRef] };
          if (
            receiverRef &&
            receiverRef.opcode === "SPtempVars_getVar" &&
            Array.isArray(receiverRef.inputs) &&
            prevTemp &&
            receiverRef.inputs[1] === prevTemp
          ) {
            const resolved2 = resolveOriginForTemp(prevTemp) || prevTempOrigin;
            try {
              console.error("DEBUG unknown-param check:", step.methodName, prevTemp, JSON.stringify(resolved2), JSON.stringify(prevTempOrigin));
            } catch (e) {}
            if (resolved2 && (resolved2.type === "execGetProp" || resolved2.type === "boundGetProp") && resolved2.method === step.methodName) executeTarget2 = { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] };
            else {
              try {
                console.error("DEBUG unknown-param no-collapse:", step.methodName, prevTemp, JSON.stringify(resolved2), JSON.stringify(prevTempOrigin));
              } catch (e) {}
            }
          }
          if (argPos !== "") {
            const argTemp = __pw_newArgTemp("value");
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp, argPos] });
          }
          const tempName = __pw_newTemp("__c");
          if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName] = tempOriginMap[tempName] || null;
          let setNode2;
          if (executeTarget2 && executeTarget2.opcode === "jwClass_getProp") {
            setNode2 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, executeTarget2] };
            if (Array.isArray(executeTarget2.inputs)) setNode2.__origin = { type: "boundGetProp", method: executeTarget2.inputs[0], receiver: executeTarget2.inputs[1] };
          } else if (executeTarget2 && executeTarget2.opcode === "SPtempVars_getVar") {
            // Store the temp-ref (function value) instead of pre-executing it
            setNode2 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, executeTarget2] };
            setNode2.__origin = { type: "boundTempRef", referenced: executeTarget2.inputs[1] };
          } else {
            const callReporter = { opcode: "jwLambda_executeR", inputs: [executeTarget2, ""] };
            if (callReporter && callReporter.opcode === "jwLambda_executeR") {
              setNode2 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] };
            } else {
              setNode2 = makeSetForCallReporter("thread", tempName, callReporter);
            }
          }
          inlineChildren.push(setNode2);
          prevTemp = tempName;
          prevTempOrigin = setNode2.__origin || null;
          tempOriginMap[prevTemp] = prevTempOrigin;
          prevReturnedLambdaArgs = Array.isArray(returnsLambdaArgsForMethod) ? returnsLambdaArgsForMethod.slice() : null;
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
          (prevReturnedLambdaArgs == null) &&
          prevTemp
        ) {
          // treat as a method call on the previous temp using the previously-seen method name
          const fakeMethod = prevStepMethodName;
          const fakeParams =
            classNameForStep &&
            classRegistry[classNameForStep] &&
            classRegistry[classNameForStep].methods &&
            classRegistry[classNameForStep].methods[fakeMethod]
              ? classRegistry[classNameForStep].methods[fakeMethod]
              : null;
          if (Array.isArray(fakeParams) && fakeParams.length > 0) {
            for (let pi = 0; pi < fakeParams.length; pi++) {
              const pname = fakeParams[pi];
              const argExpr =
                step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
            }
            // If the previous temp was produced by executing the same method getter,
            // call the stored function directly instead of re-looking-up the method.
            let executeTargetFake = { opcode: "jwClass_getProp", inputs: [fakeMethod, { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] }] };
            const resolvedFake = resolveOriginForTemp(prevTemp) || prevTempOrigin;
            if (resolvedFake && (resolvedFake.type === "execGetProp" || resolvedFake.type === "boundGetProp") && resolvedFake.method === fakeMethod) {
              executeTargetFake = { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] };
            }
            const tempName = __pw_newTemp("__c");
            if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName] = tempOriginMap[tempName] || null;
            let setNode;
            const fakeReturns =
              classNameForStep &&
              classRegistry[classNameForStep] &&
              classRegistry[classNameForStep].methodReturns &&
              classRegistry[classNameForStep].methodReturns[fakeMethod]
                ? Array.isArray(classRegistry[classNameForStep].methodReturns[fakeMethod])
                  ? classRegistry[classNameForStep].methodReturns[fakeMethod].slice()
                  : null
                : null;
            if (Array.isArray(fakeReturns) && fakeReturns.length > 0) {
              setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, executeTargetFake] };
              if (executeTargetFake && executeTargetFake.opcode === "jwClass_getProp") setNode.__origin = { type: "boundGetProp", method: executeTargetFake.inputs[0], receiver: executeTargetFake.inputs[1] };
              else if (executeTargetFake && executeTargetFake.opcode === "SPtempVars_getVar") setNode.__origin = { type: "boundTempRef", referenced: executeTargetFake.inputs[1] };
            } else {
              // If executeTargetFake is itself a getter or temp-ref, store the raw
              // getter/value into the temp and tag its origin so subsequent
              // `jwLambda_executeR(SPtempVars_getVar(...))` calls will operate on
              // the function value directly instead of re-executing a pre-run
              // result.
              if (executeTargetFake && executeTargetFake.opcode === "jwClass_getProp") {
                setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, executeTargetFake] };
                setNode.__origin = { type: "boundGetProp", method: executeTargetFake.inputs[0], receiver: executeTargetFake.inputs[1] };
              } else if (executeTargetFake && executeTargetFake.opcode === "SPtempVars_getVar") {
                setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, executeTargetFake] };
                setNode.__origin = { type: "boundTempRef", referenced: executeTargetFake.inputs[1] };
              } else {
                const callReporter = { opcode: "jwLambda_executeR", inputs: [executeTargetFake, ""] };
                if (callReporter && callReporter.opcode === "jwLambda_executeR") {
                  setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] };
                } else {
                  setNode = makeSetForCallReporter("thread", tempName, callReporter);
                }
                if (!setNode.__origin) {
                  if (executeTargetFake && executeTargetFake.opcode === "jwClass_getProp") setNode.__origin = { type: "execGetProp", method: executeTargetFake.inputs[0], receiver: executeTargetFake.inputs[1] };
                  else if (executeTargetFake && executeTargetFake.opcode === "SPtempVars_getVar") setNode.__origin = { type: "execTempCall", referenced: executeTargetFake.inputs[1] };
                }
              }
            }
            inlineChildren.push(setNode);
            prevTemp = tempName;
            prevTempOrigin = setNode.__origin || null;
            tempOriginMap[prevTemp] = prevTempOrigin;
            prevReturnedLambdaArgs = fakeReturns;
            prevStepMethodName = fakeMethod;
            continue;
          }
          // fallback: no named params for fakeMethod — treat like unknown-param method
          const fakeArgExpr =
            step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
          if (fakeArgExpr !== "") {
            const argTemp = __pw_newArgTemp("value");
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp, fakeArgExpr] });
          }
          let executeTargetFake2 = { opcode: "jwClass_getProp", inputs: [fakeMethod, { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] }] };
          const resolvedFake2 = resolveOriginForTemp(prevTemp) || prevTempOrigin;
          if (resolvedFake2 && (resolvedFake2.type === "execGetProp" || resolvedFake2.type === "boundGetProp") && resolvedFake2.method === fakeMethod) executeTargetFake2 = { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] };
          else {
            try {
              console.error("DEBUG resolveFake2:", fakeMethod, prevTemp, JSON.stringify(resolvedFake2), JSON.stringify(prevTempOrigin));
            } catch (e) {}
          }
          const tempName2 = __pw_newTemp("__c");
          if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName2] = tempOriginMap[tempName2] || null;
          let setNode3;
          const fakeReturns2 =
            classNameForStep &&
            classRegistry[classNameForStep] &&
            classRegistry[classNameForStep].methodReturns &&
            classRegistry[classNameForStep].methodReturns[fakeMethod]
              ? Array.isArray(classRegistry[classNameForStep].methodReturns[fakeMethod])
                ? classRegistry[classNameForStep].methodReturns[fakeMethod].slice()
                : null
              : null;
          if (Array.isArray(fakeReturns2) && fakeReturns2.length > 0) {
            setNode3 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, executeTargetFake2] };
            if (executeTargetFake2 && executeTargetFake2.opcode === "jwClass_getProp") setNode3.__origin = { type: "boundGetProp", method: executeTargetFake2.inputs[0], receiver: executeTargetFake2.inputs[1] };
            else if (executeTargetFake2 && executeTargetFake2.opcode === "SPtempVars_getVar") setNode3.__origin = { type: "boundTempRef", referenced: executeTargetFake2.inputs[1] };
          } else {
            if (executeTargetFake2 && executeTargetFake2.opcode === "jwClass_getProp") {
              setNode3 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, executeTargetFake2] };
              setNode3.__origin = { type: "boundGetProp", method: executeTargetFake2.inputs[0], receiver: executeTargetFake2.inputs[1] };
            } else if (executeTargetFake2 && executeTargetFake2.opcode === "SPtempVars_getVar") {
              setNode3 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, executeTargetFake2] };
              setNode3.__origin = { type: "boundTempRef", referenced: executeTargetFake2.inputs[1] };
            } else {
              const callReporter2 = { opcode: "jwLambda_executeR", inputs: [executeTargetFake2, ""] };
              if (callReporter2 && callReporter2.opcode === "jwLambda_executeR") {
                setNode3 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, callReporter2] };
              } else {
                setNode3 = makeSetForCallReporter("thread", tempName2, callReporter2);
              }
              if (!setNode3.__origin) {
                if (executeTargetFake2 && executeTargetFake2.opcode === "jwClass_getProp") setNode3.__origin = { type: "execGetProp", method: executeTargetFake2.inputs[0], receiver: executeTargetFake2.inputs[1] };
                else if (executeTargetFake2 && executeTargetFake2.opcode === "SPtempVars_getVar") setNode3.__origin = { type: "execTempCall", referenced: executeTargetFake2.inputs[1] };
              }
            }
          }
          inlineChildren.push(setNode3);
          prevTemp = tempName2;
          prevTempOrigin = setNode3.__origin || null;
          tempOriginMap[prevTemp] = prevTempOrigin;
          prevReturnedLambdaArgs = fakeReturns2;
          prevStepMethodName = fakeMethod;
          continue;
        }

        if (Array.isArray(prevReturnedLambdaArgs) && prevReturnedLambdaArgs.length > 0) {
          for (let pi = 0; pi < prevReturnedLambdaArgs.length; pi++) {
            const pname = prevReturnedLambdaArgs[pi];
            const argExpr = step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
          }
          const tempName = __pw_newTemp("__c");
          if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName] = tempOriginMap[tempName] || null;
          let setNode;
          if (receiverRef && receiverRef.opcode === "jwClass_getProp") {
            // store the getter instead of pre-executing
            setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, receiverRef] };
            if (Array.isArray(receiverRef.inputs)) setNode.__origin = { type: "boundGetProp", method: receiverRef.inputs[0], receiver: receiverRef.inputs[1] };
          } else if (receiverRef && receiverRef.opcode === "SPtempVars_getVar") {
            setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, receiverRef] };
            if (Array.isArray(receiverRef.inputs)) setNode.__origin = { type: "boundTempRef", referenced: receiverRef.inputs[1] };
          } else {
            const callReporter = { opcode: "jwLambda_executeR", inputs: [receiverRef, ""] };
            if (callReporter && callReporter.opcode === "jwLambda_executeR") {
              setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] };
            } else {
              setNode = makeSetForCallReporter("thread", tempName, callReporter);
            }
            if (!setNode.__origin) {
              if (receiverRef && receiverRef.opcode === "SPtempVars_getVar" && Array.isArray(receiverRef.inputs)) {
                setNode.__origin = { type: "execTempCall", referenced: receiverRef.inputs[1] };
              } else if (receiverRef && receiverRef.opcode === "jwClass_getProp" && Array.isArray(receiverRef.inputs)) {
                setNode.__origin = { type: "execGetProp", method: receiverRef.inputs[0], receiver: receiverRef.inputs[1] };
              }
            }
          }
          inlineChildren.push(setNode);
          prevTemp = tempName;
          prevTempOrigin = setNode.__origin || null;
          tempOriginMap[prevTemp] = prevTempOrigin;
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
          const argTemp2 = __pw_newArgTemp("value");
          inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp2, argPos2] });
        }
        const callReporter2 = { opcode: "jwLambda_executeR", inputs: [receiverRef, ""] };
        const tempName2 = __pw_newTemp("__c");
        if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName2] = tempOriginMap[tempName2] || null;
        let setNode4;
        if (callReporter2 && callReporter2.opcode === "jwLambda_executeR") {
          setNode4 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, callReporter2] };
        } else {
          setNode4 = makeSetForCallReporter("thread", tempName2, callReporter2);
        }
        if (!setNode4.__origin) {
          if (receiverRef && receiverRef.opcode === "SPtempVars_getVar" && Array.isArray(receiverRef.inputs)) setNode4.__origin = { type: "execTempCall", referenced: receiverRef.inputs[1] };
          else if (receiverRef && receiverRef.opcode === "jwClass_getProp" && Array.isArray(receiverRef.inputs)) setNode4.__origin = { type: "execGetProp", method: receiverRef.inputs[0], receiver: receiverRef.inputs[1] };
        }
        inlineChildren.push(setNode4);
        prevTemp = tempName2;
        prevReturnedLambdaArgs = null;
        prevStepMethodName = null;
      }

      // return the last temp value
      const retNode = {
        opcode: "procedures_return",
        inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] }],
      };
      inlineChildren.push(retNode);
      // Use centralized inline block creator so normalization is always applied
      return createInlineBlock(inlineChildren);
    }
    if (expr.type === "Call") {
      // Flatten nested call-chains like `get(arr,0)(5)()()` or `foo()(a)()`
      // into an inline-stack sequence that evaluates the base call into a
      // temp and then executes successive `jwLambda_executeR` steps on that
      // temp, reusing pre-collected tagged arg names when available.
      if (expr.callee && (expr.callee.type === "Call" || expr.callee.type === "MemberCall")) {
        // collect chain from outer -> inner, then reverse to base-first
        const chain = [];
        let cur = expr;
        while (cur && cur.type === "Call") {
          chain.push(cur);
          if (cur.callee && (cur.callee.type === "Call" || cur.callee.type === "MemberCall")) cur = cur.callee;
          else break;
        }
        chain.reverse();

        const inlineChildren = [];
        const tempOriginMap = {};
        // Evaluate base call into a temp (this yields the function value)
        const baseCall = chain[0];
        const baseNested = exprToNested(baseCall, inMethod, paramMap);
        const temp0 = __pw_newTemp("__c");
        if (typeof tempOriginMap !== "undefined") tempOriginMap[temp0] = tempOriginMap[temp0] || null;
        // Create base setter; if baseNested is an executed reporter, prefer
        // emitting the raw getter/temp-ref at emit-time to avoid pre-execution.
        let setBase;
        if (baseNested && baseNested.opcode === "jwLambda_executeR" && Array.isArray(baseNested.inputs)) {
          setBase = makeSetForCallReporter("thread", temp0, baseNested);
          if (!setBase.__origin) {
            const target = baseNested.inputs && baseNested.inputs[0];
            if (target && target.opcode === "jwClass_getProp" && Array.isArray(target.inputs)) {
              setBase = { opcode: "SPtempVars_setVar", inputs: ["thread", temp0, target] };
              setBase.__origin = { type: "boundGetProp", method: target.inputs[0], receiver: target.inputs[1] };
            } else if (target && target.opcode === "SPtempVars_getVar" && Array.isArray(target.inputs)) {
              setBase = { opcode: "SPtempVars_setVar", inputs: ["thread", temp0, target] };
              setBase.__origin = { type: "boundTempRef", referenced: target.inputs[1] };
            }
          }
        } else {
          setBase = { opcode: "SPtempVars_setVar", inputs: ["thread", temp0, baseNested] };
        }
        inlineChildren.push(setBase);
        let prevTemp = temp0;
        let prevTempOrigin = setBase.__origin || null;
        tempOriginMap[prevTemp] = prevTempOrigin;

        // If the base call came from an array variable (get(arr, idx)), or
        // otherwise returned a lambda from a known variable, prefer using
        // the pre-collected tagged param names so callers set the same
        // thread-var arg names instead of synthetic temps.
        let prevReturnedLambdaArgs = null;
        try {
          function findFirstVarName(node) {
            if (!node) return null;
            if (node.type === "Var") return node.name;
            if (Array.isArray(node.args) && node.args.length > 0) {
              for (const a of node.args) {
                const found = findFirstVarName(a);
                if (found) return found;
              }
            }
            if (node.callee) return findFirstVarName(node.callee);
            return null;
          }
          let maybeName = null;
          if (baseCall && baseCall.args && baseCall.args[0] && baseCall.args[0].type === "Var") maybeName = baseCall.args[0].name;
          if (!maybeName && baseCall && baseCall.callee && baseCall.callee.type === "Var") maybeName = baseCall.callee.name;
          if (!maybeName) maybeName = findFirstVarName(baseCall);
          if (maybeName && varToLambda[maybeName] && Array.isArray(varToLambda[maybeName].tagged)) prevReturnedLambdaArgs = varToLambda[maybeName].tagged.slice();
        } catch (e) {}

        // If we still don't have tagged names, attempt to extract them
        // from the nested base value emitted by `exprToNested`. This
        // handles cases where the base is an inline `jwArray_builder` or
        // a directly emitted `jwLambda_newLambda` so we can reuse the
        // lambda's tagged arg names instead of generating synthetic temps.
        if (!prevReturnedLambdaArgs) {
          try {
            function extractParamTags(n) {
              if (!n || typeof n !== "object") return null;
              if (n.opcode === "jwLambda_newLambda" && Array.isArray(n.inputs)) {
                const argSpec = n.inputs[0];
                if (typeof argSpec === "string") return [argSpec];
                if (Array.isArray(argSpec)) return argSpec.slice();
                return null;
              }
              if (n.opcode === "jwArray_builder" && Array.isArray(n.inputs)) {
                const sub = n.inputs[1];
                if (Array.isArray(sub)) {
                  for (const el of sub) {
                    if (el && el.opcode === "jwArray_builderAppend" && Array.isArray(el.inputs)) {
                      const lambda = el.inputs[0];
                      const found = extractParamTags(lambda);
                      if (found) return found;
                    }
                  }
                }
              }
              if (n.opcode === "control_inline_stack_output" && Array.isArray(n.inputs) && Array.isArray(n.inputs[0])) {
                const inner = n.inputs[0];
                for (let i = inner.length - 1; i >= 0; i--) {
                  const nd = inner[i];
                  if (nd && nd.opcode === "procedures_return") {
                    const rv = nd.inputs && nd.inputs[0];
                    const found = extractParamTags(rv);
                    if (found) return found;
                  }
                }
              }
              if (n.opcode === "jwArray_get" && Array.isArray(n.inputs)) {
                return extractParamTags(n.inputs[0]);
              }
              if (n.type === "Var" && n.name && varToLambda && varToLambda[n.name] && Array.isArray(varToLambda[n.name].tagged)) {
                return varToLambda[n.name].tagged.slice();
              }
              return null;
            }
            const tags = extractParamTags(baseNested);
            if (Array.isArray(tags) && tags.length > 0) prevReturnedLambdaArgs = tags.slice();
          } catch (e) {}
        }

        // Execute subsequent calls in the chain
        for (let ci = 1; ci < chain.length; ci++) {
          const step = chain[ci];
          // set named thread args if we have tagged names
          if (Array.isArray(prevReturnedLambdaArgs) && prevReturnedLambdaArgs.length > 0) {
            for (let pi = 0; pi < prevReturnedLambdaArgs.length; pi++) {
              const pname = prevReturnedLambdaArgs[pi];
              const argExpr = step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
            }
          } else {
            // fallback: set a synthetic arg temp for the first positional arg
            const argPos = step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
            if (argPos !== "") {
              const argTemp = __pw_newArgTemp("value");
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp, argPos] });
            }
          }
          const callReporter = { opcode: "jwLambda_executeR", inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] }, ""] };
            const prevRef = prevTemp;
            const tmp = __pw_newTemp("__c");
            if (typeof tempOriginMap !== "undefined") tempOriginMap[tmp] = tempOriginMap[tmp] || null;
            let setCall;
            if (callReporter && callReporter.opcode === "jwLambda_executeR") {
              setCall = { opcode: "SPtempVars_setVar", inputs: ["thread", tmp, callReporter] };
            } else {
              setCall = makeSetForCallReporter("thread", tmp, callReporter);
            }
            if (!setCall.__origin) setCall.__origin = { type: "execTempCall", referenced: prevRef };
            inlineChildren.push(setCall);
            prevTemp = tmp;
            // the new temp is the result of executing the previous temp
            prevTempOrigin = setCall.__origin || null;
            tempOriginMap[prevTemp] = prevTempOrigin;
          // after an invocation we don't have reliable info about the next
          // returned-lambda params (unless further metadata is available),
          // so clear prevReturnedLambdaArgs to use fallbacks.
          prevReturnedLambdaArgs = null;
        }

        // return last temp value
        inlineChildren.push({ opcode: "procedures_return", inputs: [{ opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] }] });
          try {
            console.error("DEBUG flattenMemberCall tempOriginMap:", JSON.stringify(tempOriginMap));
            console.error("DEBUG flattenMemberCall inlineChildren:", JSON.stringify(inlineChildren.map(c=>({opcode:c.opcode, inputs:c.inputs?c.inputs.slice(0,2):c.inputs})).slice(0,50)));
          } catch (e) {}
        return createInlineBlock(inlineChildren);
      }
      const name = expr.name;
      // Map convenient function names to jwArray opcodes so source can use
      // push/append/get/length/set/concat/join/sum as regular calls.
      if (name === "push" || name === "append") {
        arraysUsed = true;
        const arrNode = expr.args && expr.args[0] ? expr.args[0] : null;
        const arrArg = arrNode ? exprToNested(arrNode, inMethod, paramMap) : "";
        // If pushing into a named array variable for which we pre-collected
        // lambda param metadata, pass that param map when emitting the
        // pushed value so the lambda uses the same tagged arg names.
        let valParamMap = paramMap;
        try {
          if (arrNode && arrNode.type === "Var" && varToLambda[arrNode.name]) valParamMap = varToLambda[arrNode.name].map;
        } catch (e) {}
        const valArg = expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, valParamMap) : "";
        return { opcode: "jwArray_append", inputs: [arrArg, valArg] };
      }
      if (name === "length") {
        arraysUsed = true;
        const arrArg = expr.args && expr.args[0] ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        return { opcode: "jwArray_length", inputs: [{ ...arrArg, noPlaceholder: true }] };
      }
      if (name === "get") {
        arraysUsed = true;
        const arrNode = expr.args && expr.args[0] ? expr.args[0] : null;
        const arrArg = arrNode ? exprToNested(arrNode, inMethod, paramMap) : "";
        const rawIdxArg = expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, paramMap) : "";
        const idxArg = adjustArrayIndex(rawIdxArg);
        // If the array expression emitted an inline wrapper, splice the
        // jwArray_get into its final procedures_return so we avoid
        // producing an extra outer wrapper and redundant temps.
        if (
          arrArg &&
          arrArg.opcode === "control_inline_stack_output" &&
          Array.isArray(arrArg.inputs) &&
          Array.isArray(arrArg.inputs[0])
        ) {
          const inlineChildren = arrArg.inputs[0];
          for (let i = inlineChildren.length - 1; i >= 0; i--) {
            const node = inlineChildren[i];
            if (node && node.opcode === "procedures_return") {
              const retVal = node.inputs && node.inputs[0];
              const newReturn = { opcode: "jwArray_get", inputs: [retVal, idxArg] };
              inlineChildren[i] = { opcode: "procedures_return", inputs: [newReturn] };
              return createInlineBlock(inlineChildren);
            }
          }
        }
        return { opcode: "jwArray_get", inputs: [{ ...arrArg, noPlaceholder: true }, idxArg] };
      }
      if (name === "set") {
        arraysUsed = true;
        const arrNode = expr.args && expr.args[0] ? expr.args[0] : null;
        const arrArg = arrNode ? exprToNested(arrNode, inMethod, paramMap) : "";
        const rawIdxArg = expr.args && expr.args[1] ? exprToNested(expr.args[1], inMethod, paramMap) : "";
        const idxArg = adjustArrayIndex(rawIdxArg);
        let valParamMap = paramMap;
        try {
          if (arrNode && arrNode.type === "Var" && varToLambda[arrNode.name]) valParamMap = varToLambda[arrNode.name].map;
        } catch (e) {}
        const valArg = expr.args && expr.args[2] ? exprToNested(expr.args[2], inMethod, valParamMap) : "";
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
        return { opcode: name, inputs: argsArr, __shape: shape };
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
        return { opcode: "jwClass_new", inputs: [classRefNested] };
      }

      // Otherwise build an inline stack wrapper that: set tempNew = new CLASS;
      // call constructor via jwClass_getProp + jwLambda_execute; return tempNew
      const tempName = __pw_newTemp("__new");
      if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName] = tempOriginMap[tempName] || null;
      // set the tempNew as a thread-scoped temp variable
      const setTemp = {
        opcode: "SPtempVars_setVar",
        inputs: ["thread", tempName, { opcode: "jwClass_new", inputs: [classRefNested] }],
      };
      // attempt to map constructor param names if we have class signature info
      const ctorParamSetters = [];
      //let className = null;
      if (callee && callee.type === "Call" && typeof callee.name === "string") className = callee.name;
      const ctorParams =
        className &&
        classRegistry[className] &&
        classRegistry[className].methods &&
        classRegistry[className].methods["constructor"]
          ? classRegistry[className].methods["constructor"]
          : null;
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
      const ctorGet = { opcode: "jwClass_getProp", inputs: ["constructor", receiver] };
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
        const ctorArgTemp = __pw_newArgTemp("value");
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
      return createInlineBlock(inlineChildren);
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
    if (stmt.type === "Print") {
      const msg = exprToNested(stmt.expr, inMethod, paramMap);
      const seconds = stmt.options && stmt.options.seconds !== undefined ? stmt.options.seconds : undefined;
      const opcode = seconds !== undefined ? "looks_sayforsecs" : "looks_say";
      const node = { opcode, inputs: [msg] };
      if (seconds !== undefined) node.inputs.push(seconds);
      return node;
    }
    if (stmt.type === "If") {
      const node = { opcode: "if", cases: [] };
      for (const c of stmt.cases) {
        const thenRaw =
          c.thenBlock && c.thenBlock.body
            ? c.thenBlock.body.map((s) => stmtToNested(s, inMethod, paramMap)).filter(Boolean)
            : [];
        const thenArr = flattenNestedResults(thenRaw);
        assertReturnTerminal(thenArr, "if-then branch");
        node.cases.push({ cond: exprToNested(c.cond, inMethod, paramMap), then: thenArr });
      }
      if (stmt.elseBlock) {
        const elseRaw =
          stmt.elseBlock && stmt.elseBlock.body
            ? stmt.elseBlock.body.map((s) => stmtToNested(s, inMethod, paramMap)).filter(Boolean)
            : [];
        const elseArr = flattenNestedResults(elseRaw);
        assertReturnTerminal(elseArr, "if-else branch");
        node.else = elseArr;
      }
      return node;
    }
    if (stmt.type === "Call") {
      const name = stmt.name;
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
          const destType = typeof varName === "string" && varName.startsWith("__") ? "thread" : "global";
          const getter = { opcode: "SPtempVars_getVar", inputs: [destType, varName] };
          const appendCall = { opcode: "jwArray_append", inputs: [getter, valArg] };
          return { opcode: "SPtempVars_setVar", inputs: [destType, varName, appendCall] };
        }
        // fallback: store result into a thread-temp so the top-level chain
        // points to a stack `SPtempVars_setVar` rather than a reporter.
        const tmp = __pw_newTemp("__a");
        if (typeof tempOriginMap !== "undefined") tempOriginMap[tmp] = tempOriginMap[tmp] || null;
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
        const idxArg = adjustArrayIndex(rawIdxArg);
        const valArg = stmt.args && stmt.args[2] ? exprToNested(stmt.args[2], inMethod, paramMap) : "";
        // jwArray_set returns a new array; write it back to the variable when
        // used as a statement (same strategy as append).
        if (arrArg && typeof arrArg === "object" && arrArg.type === "Var") {
          const varName = arrArg.name || "";
          const destType = typeof varName === "string" && varName.startsWith("__") ? "thread" : "global";
          const getter = { opcode: "SPtempVars_getVar", inputs: [destType, varName], noPlaceholder: true };
          const setCall = { opcode: "jwArray_set", inputs: [getter, idxArg, valArg] };
          return { opcode: "SPtempVars_setVar", inputs: [destType, varName, setCall] };
        }
        const tmp = __pw_newTemp("__a");
        if (typeof tempOriginMap !== "undefined") tempOriginMap[tmp] = tempOriginMap[tmp] || null;
        const setCall = {
          opcode: "jwArray_set",
          inputs: [{ ...arrArg, noPlaceholder: true }, idxArg, valArg],
        };
        return { opcode: "SPtempVars_setVar", inputs: ["thread", tmp, setCall] };
      }
      if (name === "get") {
        const arrArg = stmt.args && stmt.args[0] ? exprToNested(stmt.args[0], inMethod, paramMap) : "";
        const rawIdxArg = stmt.args && stmt.args[1] ? exprToNested(stmt.args[1], inMethod, paramMap) : "";
        const idxArg = adjustArrayIndex(rawIdxArg);
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
      // Build receiver object nested (stop before final property).
      let objReceiver = null;
      const first = chain[0];
      if (typeof first === "string") {
        objReceiver =
          first === "this"
            ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true }
            : { type: "Var", name: first };
      } else if (typeof first === "object") {
        objReceiver = exprToNested(first, inMethod, paramMap);
      } else {
        objReceiver = { type: "Var", name: String(first) };
      }
      if (chain.length > 2) {
        for (let i = 1; i < chain.length - 1; i++) {
          const prop = chain[i];
          if (typeof prop === "string")
            objReceiver = { opcode: "jwClass_getProp", inputs: [prop, objReceiver] };
          else objReceiver = { opcode: "jwClass_getProp", inputs: [prop, objReceiver] };
        }
      }
      const methodName = chain[chain.length - 1];
      const methodGetter = { opcode: "jwClass_getProp", inputs: [methodName, objReceiver] };

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
            if (receiverChain[0] === "this" && emittingClass) baseClassName = emittingClass;
            else if (varToClass[receiverChain[0]]) baseClassName = varToClass[receiverChain[0]];
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
        if (chain[0] === "this" && emittingClass) className = emittingClass;
        else if (varToClass[chain[0]]) className = varToClass[chain[0]];
      } else if (baseClassName) {
        className = baseClassName;
      }
      const methodParams =
        className &&
        classRegistry[className] &&
        classRegistry[className].methods &&
        classRegistry[className].methods[methodName]
          ? classRegistry[className].methods[methodName]
          : null;

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
              for (let k = 1; k < recvChain.length; k++)
                r = { opcode: "jwClass_getProp", inputs: [recvChain[k], r] };
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
              typeof step.receiverChain[0] === "string" &&
              varToClass[step.receiverChain[0]]
            )
              classNameForStep = varToClass[step.receiverChain[0]];
          } else {
            classNameForStep = baseClassName;
          }
          const paramsForStep =
            classNameForStep &&
            classRegistry[classNameForStep] &&
            classRegistry[classNameForStep].methods &&
            classRegistry[classNameForStep].methods[step.methodName]
              ? classRegistry[classNameForStep].methods[step.methodName]
              : null;
          const returnsLambdaArgsForMethod =
            classNameForStep &&
            classRegistry[classNameForStep] &&
            classRegistry[classNameForStep].methodReturns
              ? classRegistry[classNameForStep].methodReturns[step.methodName]
              : null;

          if (step.methodName) {
            if (Array.isArray(paramsForStep) && paramsForStep.length > 0) {
              for (let pi = 0; pi < paramsForStep.length; pi++) {
                const pname = paramsForStep[pi];
                const argExpr =
                  step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
                inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
              }
              const boundMethod = { opcode: "jwClass_getProp", inputs: [step.methodName, receiverRef] };
              const tempName = __pw_newTemp("__c");
              if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName] = tempOriginMap[tempName] || null;
              // store the getter in multi-step chains (avoid pre-executing)
              const setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, boundMethod] };
              setNode.__origin = { type: "boundGetProp", method: step.methodName, receiver: receiverRef };
              inlineChildren.push(setNode);
              prevTemp = tempName;
              prevReturnedLambdaArgs = Array.isArray(returnsLambdaArgsForMethod)
                ? returnsLambdaArgsForMethod.slice()
                : null;
              prevStepMethodName = step.methodName;
              continue;
            }
            const argPos =
              step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
            const boundMethod = { opcode: "jwClass_getProp", inputs: [step.methodName, receiverRef] };
            if (argPos !== "") {
              const argTemp = __pw_newArgTemp("value");
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp, argPos] });
            }
            const tempName = __pw_newTemp("__c");
            if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName] = tempOriginMap[tempName] || null;
            const setNode2 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, boundMethod] };
            setNode2.__origin = { type: "boundGetProp", method: step.methodName, receiver: receiverRef };
            inlineChildren.push(setNode2);
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
            const fakeParams =
              classNameForStep &&
              classRegistry[classNameForStep] &&
              classRegistry[classNameForStep].methods &&
              classRegistry[classNameForStep].methods[fakeMethod]
                ? classRegistry[classNameForStep].methods[fakeMethod]
                : null;
            if (Array.isArray(fakeParams) && fakeParams.length > 0) {
              for (let pi = 0; pi < fakeParams.length; pi++) {
                const pname = fakeParams[pi];
                const argExpr =
                  step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
                inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
              }
              const boundMethod = {
                opcode: "jwClass_getProp",
                inputs: [fakeMethod, { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] }],
              };
              const tempName = __pw_newTemp("__c");
              if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName] = tempOriginMap[tempName] || null;
              // store the getter in multi-step chains (avoid pre-executing)
              const setNode_fake = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, boundMethod] };
              if (boundMethod && boundMethod.opcode === "jwClass_getProp" && Array.isArray(boundMethod.inputs)) setNode_fake.__origin = { type: "boundGetProp", method: boundMethod.inputs[0], receiver: boundMethod.inputs[1] };
              else if (boundMethod && boundMethod.opcode === "SPtempVars_getVar" && Array.isArray(boundMethod.inputs)) setNode_fake.__origin = { type: "boundTempRef", referenced: boundMethod.inputs[1] };
              inlineChildren.push(setNode_fake);
              prevTemp = tempName;
              prevReturnedLambdaArgs = null;
              prevStepMethodName = fakeMethod;
              continue;
            }
            const fakeArg =
              step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
            if (fakeArg !== "") {
              const argTemp = __pw_newArgTemp("value");
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp, fakeArg] });
            }
            const boundMethod2 = {
              opcode: "jwClass_getProp",
              inputs: [fakeMethod, { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] }],
            };
            const tempName2 = __pw_newTemp("__c");
            if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName2] = tempOriginMap[tempName2] || null;
            const setNode_fake2 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, boundMethod2] };
            if (boundMethod2 && boundMethod2.opcode === "jwClass_getProp" && Array.isArray(boundMethod2.inputs)) setNode_fake2.__origin = { type: "boundGetProp", method: boundMethod2.inputs[0], receiver: boundMethod2.inputs[1] };
            else if (boundMethod2 && boundMethod2.opcode === "SPtempVars_getVar" && Array.isArray(boundMethod2.inputs)) setNode_fake2.__origin = { type: "boundTempRef", referenced: boundMethod2.inputs[1] };
            inlineChildren.push(setNode_fake2);
            prevTemp = tempName2;
            prevReturnedLambdaArgs =
              classNameForStep &&
              classRegistry[classNameForStep] &&
              classRegistry[classNameForStep].methodReturns &&
              classRegistry[classNameForStep].methodReturns[fakeMethod]
                ? Array.isArray(classRegistry[classNameForStep].methodReturns[fakeMethod])
                  ? classRegistry[classNameForStep].methodReturns[fakeMethod].slice()
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
            if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName] = tempOriginMap[tempName] || null;
            let setNode;
            if (callReporter && callReporter.opcode === "jwLambda_executeR") {
              setNode = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] };
            } else {
              setNode = makeSetForCallReporter("thread", tempName, callReporter);
            }
            if (!setNode.__origin) {
              if (receiverRef && receiverRef.opcode === "SPtempVars_getVar" && Array.isArray(receiverRef.inputs)) setNode.__origin = { type: "execTempCall", referenced: receiverRef.inputs[1] };
              else if (receiverRef && receiverRef.opcode === "jwClass_getProp" && Array.isArray(receiverRef.inputs)) setNode.__origin = { type: "execGetProp", method: receiverRef.inputs[0], receiver: receiverRef.inputs[1] };
            }
            inlineChildren.push(setNode);
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
              const argTemp2 = __pw_newArgTemp("value");
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp2, argPos2] });
            }
            const boundMethod2 = {
              opcode: "jwClass_getProp",
              inputs: [prevStepMethodName, { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] }],
            };
            const tempName2 = __pw_newTemp("__c");
            if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName2] = tempOriginMap[tempName2] || null;
            let setNode_fake3;
            if (boundMethod2 && boundMethod2.opcode === "jwClass_getProp") {
              setNode_fake3 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, boundMethod2] };
              if (Array.isArray(boundMethod2.inputs)) setNode_fake3.__origin = { type: "boundGetProp", method: boundMethod2.inputs[0], receiver: boundMethod2.inputs[1] };
            } else if (boundMethod2 && boundMethod2.opcode === "SPtempVars_getVar") {
              setNode_fake3 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, boundMethod2] };
              if (Array.isArray(boundMethod2.inputs)) setNode_fake3.__origin = { type: "boundTempRef", referenced: boundMethod2.inputs[1] };
            } else {
              const callReporter2 = { opcode: "jwLambda_executeR", inputs: [boundMethod2, ""] };
              if (callReporter2 && callReporter2.opcode === "jwLambda_executeR") {
                setNode_fake3 = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, callReporter2] };
              } else {
                setNode_fake3 = makeSetForCallReporter("thread", tempName2, callReporter2);
              }
              if (!setNode_fake3.__origin) {
                if (boundMethod2 && boundMethod2.opcode === "jwClass_getProp") setNode_fake3.__origin = { type: "execGetProp", method: boundMethod2.inputs[0], receiver: boundMethod2.inputs[1] };
                else if (boundMethod2 && boundMethod2.opcode === "SPtempVars_getVar") setNode_fake3.__origin = { type: "execTempCall", referenced: boundMethod2.inputs[1] };
              }
            }
            inlineChildren.push(setNode_fake3);
            prevTemp = tempName2;
            prevReturnedLambdaArgs =
              classNameForStep &&
              classRegistry[classNameForStep] &&
              classRegistry[classNameForStep].methodReturns &&
              classRegistry[classNameForStep].methodReturns[prevStepMethodName]
                ? Array.isArray(classRegistry[classNameForStep].methodReturns[prevStepMethodName])
                  ? classRegistry[classNameForStep].methodReturns[prevStepMethodName].slice()
                  : null
                : null;
            prevStepMethodName = prevStepMethodName;
          } else {
            const methodForBound = step.methodName || prevStepMethodName;
            const boundMethod2 = { opcode: "jwClass_getProp", inputs: [methodForBound, receiverRef] };
            if (argPos2 !== "") {
              const argTemp2 = __pw_newArgTemp("value");
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp2, argPos2] });
            }
            const tempName2 = __pw_newTemp("__c");
            if (typeof tempOriginMap !== "undefined") tempOriginMap[tempName2] = tempOriginMap[tempName2] || null;
            let setNode_inline;
            if (boundMethod2 && boundMethod2.opcode === "jwClass_getProp") {
              setNode_inline = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, boundMethod2] };
              if (Array.isArray(boundMethod2.inputs)) setNode_inline.__origin = { type: "boundGetProp", method: boundMethod2.inputs[0], receiver: boundMethod2.inputs[1] };
            } else if (boundMethod2 && boundMethod2.opcode === "SPtempVars_getVar") {
              setNode_inline = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, boundMethod2] };
              if (Array.isArray(boundMethod2.inputs)) setNode_inline.__origin = { type: "boundTempRef", referenced: boundMethod2.inputs[1] };
            } else {
              const callReporter2 = { opcode: "jwLambda_executeR", inputs: [boundMethod2, ""] };
              if (callReporter2 && callReporter2.opcode === "jwLambda_executeR") {
                setNode_inline = { opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, callReporter2] };
              } else {
                setNode_inline = makeSetForCallReporter("thread", tempName2, callReporter2);
              }
              if (!setNode_inline.__origin) {
                if (boundMethod2 && boundMethod2.opcode === "jwClass_getProp" && Array.isArray(boundMethod2.inputs)) setNode_inline.__origin = { type: "execGetProp", method: boundMethod2.inputs[0], receiver: boundMethod2.inputs[1] };
                else if (boundMethod2 && boundMethod2.opcode === "SPtempVars_getVar" && Array.isArray(boundMethod2.inputs)) setNode_inline.__origin = { type: "execTempCall", referenced: boundMethod2.inputs[1] };
              }
            }
            inlineChildren.push(setNode_inline);
            prevTemp = tempName2;
          }
        }

        // Emit the sequence of stack blocks directly (no inline wrapper and no return)
        // Emit-time handling and origin annotations prevent double-exec patterns.
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
        // Call the method (no inline wrapper) — emit setters then the call
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
        else if (
          className &&
          classRegistry[className] &&
          classRegistry[className].methods &&
          Array.isArray(classRegistry[className].methods[methodName]) &&
          classRegistry[className].methods[methodName].length > 0
        )
          argTempName = classRegistry[className].methods[methodName][0];
        else argTempName = __pw_newArgTemp("value");
        const setter = { opcode: "SPtempVars_setVar", inputs: ["thread", argTempName, argNested] };
        const call = { opcode: "jwLambda_execute", inputs: [methodGetter, ""] };
        return [].concat([setter], [call]);
      }
      return { opcode: "jwLambda_execute", inputs: [methodGetter, ""] };
    }
    if (stmt.type === "Declare") {
      const scope =
        inMethod && (stmt.kind === "let" || stmt.kind === "const")
          ? "thread"
          : stmt.kind === "thread"
            ? "thread"
            : "global";
      if (stmt.value) {
        // If the declared value is an array literal whose element is a lambda,
        // and we discovered a param map for that variable during precollection,
        // pass the map into exprToNested so the inner lambda uses the same
        // tagged thread-var names.
        let useParamMap = paramMap;
        if (stmt.value && stmt.value.type === "Array" && varToLambda[stmt.name]) useParamMap = varToLambda[stmt.name].map;
        return {
          opcode: "SPtempVars_setVar",
          inputs: [scope, stmt.name, exprToNested(stmt.value, inMethod, useParamMap)],
        };
      }
      return { opcode: "SPtempVars_setVar", inputs: [scope, stmt.name, ""] };
    }
    if (stmt.type === "Return") {
      // Only allowed inside class methods or lambdas (inMethod flag)
      if (!inMethod) throw new Error("'return' used outside of a method or lambda is not allowed");
      const val = stmt.value ? exprToNested(stmt.value, inMethod, paramMap) : "";
      // If returned value is a block-like object, reject only if its
      // block shape is a stack/branch (i.e., not a reporter). Allow
      // reporter-type blocks that may include substack inputs (e.g., lambdas).
      //console.log(val)
      if (val && typeof val === "object" && val.opcode) {
        const meta =
          blocksMeta[val.opcode] || blocksMeta[val.opcode.replace(/^operator_/, "operator_")] || null;
        const shape = meta ? meta[1] : null;
        if (shape === "stack" || shape === "branch")
          throw new Error("'return' value cannot be a stack/branch block");
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
            objReceiver = { opcode: "jwClass_getProp", inputs: [prop, objReceiver] };
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
            leftNested = {
              opcode: "jwClass_getProp",
              inputs: [propName, { opcode: "jwClass_self", inputs: [], noPlaceholder: true }],
            };
          } else {
            leftNested = exprToNested({ type: "Member", chain: chain.slice() }, inMethod, paramMap);
          }
          const rightNested = exprToNested(stmt.value.right, inMethod, paramMap);
          const op = generator.mapOpToOpcode(stmt.value.op);
          val = { opcode: op, inputs: [leftNested, rightNested] };
        } else {
          val = exprToNested(stmt.value, inMethod, paramMap);
        }
        return { opcode: "jwClass_setProp", inputs: [propName, objReceiver, val] };
      }
      // simple variable assignment: if assigning an array literal containing
      // a lambda and we pre-collected a param map for this var, pass it
      // through to exprToNested so inner lambdas reuse tagged names.
      if (!stmt.memberChain) {
        const scope = inMethod && (stmt.kind === "let" || stmt.kind === "const") ? "thread" : "global";
        let val = stmt.value ? stmt.value : null;
        if (val && val.type === "Array" && varToLambda[stmt.name]) {
          return { opcode: "SPtempVars_setVar", inputs: [scope, stmt.name, exprToNested(val, inMethod, varToLambda[stmt.name].map)] };
        }
        if (val) return { opcode: "SPtempVars_setVar", inputs: [scope, stmt.name, exprToNested(val, inMethod, paramMap)] };
        return { opcode: "SPtempVars_setVar", inputs: [scope, stmt.name, ""] };
      }
      return {
        opcode: "SPtempVars_setVar",
        inputs: [
          stmt.kind === "thread" ? "thread" : "global",
          stmt.name || "",
          exprToNested(stmt.value, inMethod, paramMap),
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
      if (stmt.update) {
        if (stmt.update.type === "Assign" && stmt.update.value && stmt.update.value.type === "Binary") {
          const bin = stmt.update.value;
          if (bin.right) inc = exprToNested(bin.right, inMethod, paramMap);
          if (bin.op === "-") inc = typeof inc === "number" ? -inc : inc;
        } else {
          inc = exprToNested(stmt.update, inMethod, paramMap);
        }
      }
      const raw =
        stmt.body && stmt.body.body
          ? stmt.body.body.map((s) => stmtToNested(s, inMethod, paramMap)).filter(Boolean)
          : [];
      const body = flattenNestedResults(raw);
      assertReturnTerminal(body, "for body");
      return { opcode: "SPtempVars_forVar", inputs: ["thread", varName, start, end, body, inc] };
    }
    if (stmt.type === "Break") {
      return { opcode: "control_exitLoop" };
    }
    if (stmt.type === "Class") {
      // Create a class object and assign to a temp/global variable with the class name
      // Build jwClass_class nested block with NAME and SUBSTACK setting methods
      const className = stmt.name;
      // build substack array: each method becomes a jwClass_setProp block
      const substackBlocks = [];
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
          const taggedParams =
            classRegistry[className] &&
            classRegistry[className].methods &&
            classRegistry[className].methods[m.name]
              ? classRegistry[className].methods[m.name]
              : null;
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
          const retOrig =
            classRegistry[className] &&
            classRegistry[className].methodReturnOriginals &&
            classRegistry[className].methodReturnOriginals[m.name]
              ? classRegistry[className].methodReturnOriginals[m.name]
              : null;
          const retTagged =
            classRegistry[className] &&
            classRegistry[className].methodReturns &&
            classRegistry[className].methodReturns[m.name]
              ? classRegistry[className].methodReturns[m.name]
              : null;
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
            const raw = m.body.body.map((s) => stmtToNested(s, true, methodParamMap)).filter(Boolean);
            methodBody = flattenNestedResults(raw);
            assertReturnTerminal(methodBody, `method '${m.name}' body`);
          }
          const lambdaBlock = { opcode: "jwLambda_newLambda", inputs: [lambdaArg, methodBody] };
          const setProp = {
            opcode: "jwClass_setProp",
            inputs: [m.name, { opcode: "jwClass_self", inputs: [], noPlaceholder: true }, lambdaBlock],
          };
          substackBlocks.push(setProp);
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
              leftNested = {
                opcode: "jwClass_getProp",
                inputs: [propNameLocal, { opcode: "jwClass_self", inputs: [], noPlaceholder: true }],
              };
            } else {
              leftNested = exprToNested({ type: "Member", chain: chain.slice() }, inMethod, paramMap);
            }
            const rightNested = exprToNested(m.value.right, inMethod, paramMap);
            const op = generator.mapOpToOpcode(m.value.op);
            val = { opcode: op, inputs: [leftNested, rightNested] };
          } else {
            val = exprToNested(m.value, inMethod, paramMap);
          }
          const setProp = {
            opcode: "jwClass_setProp",
            inputs: [propName, { opcode: "jwClass_self", inputs: [], noPlaceholder: true }, val],
          };
          substackBlocks.push(setProp);
          continue;
        }

        // Other member shapes can be ignored or handled in future (e.g., declarations).
      }
      // restore previous emittingClass context
      emittingClass = _prevEmittingClass;

      const classBlock = {
        opcode: "jwClass_class",
        inputs: [
          className,
          { opcode: "jwClass_self", inputs: [], shadow: true, noPlaceholder: true },
          substackBlocks,
        ],
      };
      // assign into temp/global var using SPtempVars_setVar (simplified inputs form)
      return { opcode: "SPtempVars_setVar", inputs: ["global", className, classBlock] };
    }
    // If stmt.type is missing/undefined, skip emitting a block for it.
    if (!stmt.type) return null;
    return { opcode: stmt.type, inputs: [] };
  }

  // top-level AST -> nestedInput. Emit `On` nodes as hat blocks, and
  // emit other top-level statements directly (no fake hat wrapper).
  // If stmtToNested returns an array (sequence of blocks), expand it
  // into multiple top-level nested items so sequential statements
  // (e.g., setter blocks + a call) are emitted in order.
  nestedInput = [];
  for (const s of ast) {
    if (s && s.type === "On") {
      let opcode = s.event;
      switch (s.event) {
        case "flag":
          opcode = "event_whenflagclicked";
          break;
        case "click":
          opcode = "event_whenthisspriteclicked";
          break;
        default:
          opcode = s.event;
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
}

  // Ensure any remaining inline wrappers get the collapse pass and
  // annotate setVar origins across the entire nested tree so the
  // generator and later passes can use origin metadata.
  function annotateSetOrigins(node) {
    if (!node) return;
    if (Array.isArray(node)) {
      for (const n of node) annotateSetOrigins(n);
      return;
    }
    if (typeof node !== "object") return;
    // If this is a SPtempVars_setVar storing an execute reporter, record origin
    if (node.opcode === "SPtempVars_setVar" && Array.isArray(node.inputs)) {
      const val = node.inputs[2];
      if (val && val.opcode === "jwLambda_executeR") {
        const execArg = val.inputs && val.inputs[0];
        if (execArg && execArg.opcode === "jwClass_getProp" && Array.isArray(execArg.inputs)) {
          node.__origin = { type: "execGetProp", method: execArg.inputs[0], receiver: execArg.inputs[1] };
        } else if (execArg && execArg.opcode === "SPtempVars_getVar" && Array.isArray(execArg.inputs)) {
          node.__origin = { type: "execTempCall", referenced: execArg.inputs[1] };
        } else if (execArg && execArg.opcode === "jwArray_get" && Array.isArray(execArg.inputs)) {
          node.__origin = { type: "execArrayGet", arr: execArg.inputs[0], index: execArg.inputs[1] };
        } else if (execArg && execArg.opcode === "control_inline_stack_output" && Array.isArray(execArg.inputs)) {
          node.__origin = { type: "execInline" };
        }
      }
    }
    // Recurse into children arrays/substacks
    for (const k of Object.keys(node)) {
      const v = node[k];
      if (Array.isArray(v)) {
        for (const item of v) annotateSetOrigins(item);
      } else if (typeof v === "object" && v !== null) annotateSetOrigins(v);
    }
  }

  function collapseAllInlineWrappers(nested) {
    if (!Array.isArray(nested)) return;
    // If this array looks like a stack of child nodes (objects with opcode),
    // run the collapse pass directly on it.
    if (nested.length > 0 && nested[0] && typeof nested[0] === "object" && Object.prototype.hasOwnProperty.call(nested[0], "opcode")) {
      // No post-emit collapse pass: emit-time handling should avoid
      // double-exec patterns and annotateSetOrigins records origins.
    }
    for (const item of nested) {
      if (!item) continue;
      if (Array.isArray(item)) {
        collapseAllInlineWrappers(item);
        continue;
      }
      if (typeof item !== "object") continue;
      for (const k of Object.keys(item)) {
        const v = item[k];
        if (Array.isArray(v)) collapseAllInlineWrappers(v);
        else if (typeof v === "object" && v !== null) collapseAllInlineWrappers([v]);
      }
    }
  }

  try {
    // Normalize any inline set-of-executeR patterns across the nested tree
    // before annotating origins so the tree contains origin-tagged getters
    // instead of pre-executed jwLambda_executeR reporters.
    normalizeAllSetCallReporters(nestedInput);
    annotateSetOrigins(nestedInput);
    collapseAllInlineWrappers(nestedInput);
  } catch (e) {}

  // Write nested debug dump for easier inspection and pair-finder tooling.
  try {
    if (nestedInput) {
      const dbgPath = path.join(process.cwd(), "pang_nested_debug.json");
      fs.writeFileSync(dbgPath, JSON.stringify([nestedInput], null, 2), "utf8");
      console.log(`✅ pang_nested_debug.json written to ${dbgPath}`);
    }
  } catch (e) {
    console.error("Failed to write pang_nested_debug.json:", e && e.message);
  }

  //console.error("DEBUG_NESTED:\n" + JSON.stringify(nestedInput, null, 2));
  emitResult = generator.generateFromNested(nestedInput);
try {
  // DEBUG: dump nested representation to inspect emitted class/new/method shapes
  //console.error("DEBUG_NESTED:\n" + JSON.stringify(nestedInput, null, 2));
  emitResult = generator.generateFromNested(nestedInput);
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
      out.extensionURLs.jwClass || // jwClass backported from port to old compiler non core extension(unsandboxed)
      "data:text/javascript;charset=utf-8;base64,KGZ1bmN0aW9uIChTY3JhdGNoKSB7DQogICAgJ3VzZSBzdHJpY3QnOw0KIA0KICAgIGlmICghU2NyYXRjaC5leHRlbnNpb25zLnVuc2FuZGJveGVkKSB7DQogICAgICAgIHRocm93IG5ldyBFcnJvcignandDbGFzcyBtdXN0IGJlIGxvYWRlZCBhcyBhbiB1bnNhbmRib3hlZCBUdXJib1dhcnAgZXh0ZW5zaW9uLicpOw0KICAgIH0NCiANCiAgICBjb25zdCB2bSA9IFNjcmF0Y2gudm07DQogICAgY29uc3QgcnVudGltZSA9IHZtLnJ1bnRpbWU7DQogDQogICAgY29uc3QgQmxvY2tUeXBlID0gU2NyYXRjaC5CbG9ja1R5cGU7DQogICAgY29uc3QgQXJndW1lbnRUeXBlID0gU2NyYXRjaC5Bcmd1bWVudFR5cGU7DQogICAgY29uc3QgQmxvY2tTaGFwZSA9IFNjcmF0Y2guQmxvY2tTaGFwZSB8fCB7DQogICAgICAgIFNRVUFSRTogJ3NxdWFyZScsDQogICAgICAgIFRJQ0tFVDogJ3RpY2tldCcNCiAgICB9Ow0KIA0KICAgIGNvbnN0IHBtU3ltYm9sID0gU2NyYXRjaC5wbVN5bWJvbCB8fCB7DQogICAgICAgIGVxdWFsczogU3ltYm9sLmZvcigncG0uZXF1YWxzJykNCiAgICB9Ow0KIA0KICAgIGNvbnN0IGVzY2FwZUhUTUwgPSB1bnNhZmUgPT4gew0KICAgICAgICByZXR1cm4gU3RyaW5nKHVuc2FmZSkNCiAgICAgICAgICAgIC5yZXBsYWNlQWxsKCcmJywgJyZhbXA7JykNCiAgICAgICAgICAgIC5yZXBsYWNlQWxsKCc8JywgJyZsdDsnKQ0KICAgICAgICAgICAgLnJlcGxhY2VBbGwoJz4nLCAnJmd0OycpDQogICAgICAgICAgICAucmVwbGFjZUFsbCgnIicsICcmcXVvdDsnKQ0KICAgICAgICAgICAgLnJlcGxhY2VBbGwoIiciLCAnJiMwMzk7Jyk7DQogICAgfTsNCiANCiAgICBjb25zdCBjbGFzc1N5bWJvbCA9IFN5bWJvbCgnY2xhc3MnKTsNCiANCiAgICBsZXQgZG9nZWlzY3V0T2JqZWN0ID0gew0KICAgICAgICBUeXBlOiBjbGFzcyB7fSwNCiAgICAgICAgQmxvY2s6IHt9LA0KICAgICAgICBBcmd1bWVudDoge30NCiAgICB9Ow0KIA0KICAgIGxldCBqd1BvaW50ZXIgPSB7DQogICAgICAgIFR5cGU6IGNsYXNzIHt9LA0KICAgICAgICBCbG9jazoge30sDQogICAgICAgIEFyZ3VtZW50OiB7fQ0KICAgIH07DQogDQogICAgY29uc3QgcmVmcmVzaERlcHMgPSAoKSA9PiB7DQogICAgICAgIGlmICh2bS5kb2dlaXNjdXRPYmplY3QpIGRvZ2Vpc2N1dE9iamVjdCA9IHZtLmRvZ2Vpc2N1dE9iamVjdDsNCiAgICAgICAgaWYgKHZtLmp3UG9pbnRlcikgandQb2ludGVyID0gdm0uandQb2ludGVyOw0KICAgIH07DQogDQogICAgY2xhc3MgQ2xhc3NUeXBlIHsNCiAgICAgICAgY29uc3RydWN0b3IoY29uc3RydWN0ID0gZnVuY3Rpb24qICgpIHt9LCBuYW1lID0gJycsIGV4dGVuc2lvbiA9IG51bGwsIHByb2MgPSBudWxsKSB7DQogICAgICAgICAgICB0aGlzLmNvbnN0cnVjdCA9IGNvbnN0cnVjdDsNCiAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7DQogICAgICAgICAgICB0aGlzLmV4dGVuc2lvbiA9IGV4dGVuc2lvbjsNCiAgICAgICAgICAgIHRoaXMucHJvYyA9IHByb2MgPz8ge307DQogICAgICAgIH0NCiANCiAgICAgICAgdG9TdHJpbmcoKSB7DQogICAgICAgICAgICByZXR1cm4gdGhpcy5uYW1lLmxlbmd0aCA+IDAgPyBgQ2xhc3M8JHt0aGlzLm5hbWV9PmAgOiAnQ2xhc3MnOw0KICAgICAgICB9DQogDQogICAgICAgIGp3QXJyYXlIYW5kbGVyKCkgew0KICAgICAgICAgICAgcmV0dXJuIGVzY2FwZUhUTUwodGhpcy50b1N0cmluZygpKTsNCiAgICAgICAgfQ0KIA0KICAgICAgICBzdGF0aWMgdG9DbGFzcyh2KSB7DQogICAgICAgICAgICBpZiAodiBpbnN0YW5jZW9mIENsYXNzVHlwZSkgcmV0dXJuIHY7DQogICAgICAgICAgICByZXR1cm4gbmV3IENsYXNzVHlwZSgpOw0KICAgICAgICB9DQogDQogICAgICAgIGNyZWF0ZUluc3RhbmNlID0gZnVuY3Rpb24qICh0aHJlYWQsIHRhcmdldCkgew0KICAgICAgICAgICAgcmVmcmVzaERlcHMoKTsNCiANCiAgICAgICAgICAgIGlmICh0aGlzLnByb2MpIHRocmVhZC5wcm9jZWR1cmVzID0geyAuLi50aGlzLnByb2MsIC4uLnRocmVhZC5wcm9jZWR1cmVzIH07DQogDQogICAgICAgICAgICBpZiAoIXRoaXMuZXh0ZW5zaW9uKSB7DQogICAgICAgICAgICAgICAgbGV0IG9iamVjdCA9IG5ldyBkb2dlaXNjdXRPYmplY3QuVHlwZSgpOw0KICAgICAgICAgICAgICAgIG9iamVjdC5tYXAuc2V0KGNsYXNzU3ltYm9sLCB0aGlzKTsNCiAgICAgICAgICAgICAgICBsZXQgcG9pbnRlciA9IGp3UG9pbnRlci5UeXBlLmNyZWF0ZSgpOw0KICAgICAgICAgICAgICAgIHBvaW50ZXIudmFsdWUgPSBvYmplY3Q7DQogICAgICAgICAgICAgICAgeWllbGQqIHRoaXMuY29uc3RydWN0KHBvaW50ZXIsIHRocmVhZCwgdGFyZ2V0KTsNCiAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnRlcjsNCiAgICAgICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgICAgICAgbGV0IHBvaW50ZXIgPSB5aWVsZCogdGhpcy5leHRlbnNpb24uY3JlYXRlSW5zdGFuY2UodGhyZWFkLCB0YXJnZXQpOw0KICAgICAgICAgICAgICAgIGxldCBvYmplY3QgPSBwb2ludGVyLnZhbHVlOw0KICAgICAgICAgICAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBkb2dlaXNjdXRPYmplY3QuVHlwZSkgb2JqZWN0Lm1hcC5zZXQoY2xhc3NTeW1ib2wsIHRoaXMpOw0KICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLmNvbnN0cnVjdChwb2ludGVyLCB0aHJlYWQsIHRhcmdldCk7DQogICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50ZXI7DQogICAgICAgICAgICB9DQogICAgICAgIH07DQogDQogICAgICAgIGV4dGVuZChleHRlbnNpb24pIHsNCiAgICAgICAgICAgIHJldHVybiBuZXcgQ2xhc3NUeXBlKHRoaXMuY29uc3RydWN0LCB0aGlzLm5hbWUsIGV4dGVuc2lvbiwgdGhpcy5wcm9jKTsNCiAgICAgICAgfQ0KIA0KICAgICAgICBbcG1TeW1ib2wuZXF1YWxzXShvdGhlcikgew0KICAgICAgICAgICAgcmV0dXJuIHRoaXMgPT09IG90aGVyOw0KICAgICAgICB9DQogICAgfQ0KIA0KICAgIGNvbnN0IGp3Q2xhc3MgPSB7DQogICAgICAgIFR5cGU6IENsYXNzVHlwZSwNCiAgICAgICAgQmxvY2s6IHsNCiAgICAgICAgICAgIGJsb2NrVHlwZTogQmxvY2tUeXBlLlJFUE9SVEVSLA0KICAgICAgICAgICAgYmxvY2tTaGFwZTogQmxvY2tTaGFwZS5USUNLRVQsDQogICAgICAgICAgICBmb3JjZU91dHB1dFR5cGU6ICdqd0NsYXNzJywNCiAgICAgICAgICAgIGRpc2FibGVNb25pdG9yOiB0cnVlDQogICAgICAgIH0sDQogICAgICAgIEFyZ3VtZW50OiB7DQogICAgICAgICAgICBzaGFwZTogQmxvY2tTaGFwZS5USUNLRVQsDQogICAgICAgICAgICBjaGVjazogWydqd0NsYXNzJ10NCiAgICAgICAgfSwNCiANCiAgICAgICAgY2xhc3NTeW1ib2wsDQogDQogICAgICAgIHNldFByb3AobmFtZSwgcG9pbnRlciwgdmFsdWUpIHsNCiAgICAgICAgICAgIHJlZnJlc2hEZXBzKCk7DQogICAgICAgICAgICBpZiAoIShwb2ludGVyIGluc3RhbmNlb2YgandQb2ludGVyLlR5cGUpKSByZXR1cm47DQogICAgICAgICAgICBpZiAoIShwb2ludGVyLnZhbHVlIGluc3RhbmNlb2YgZG9nZWlzY3V0T2JqZWN0LlR5cGUpKSByZXR1cm47DQogICAgICAgICAgICBwb2ludGVyLnZhbHVlID0gZG9nZWlzY3V0T2JqZWN0LlR5cGUudG9PYmplY3QocG9pbnRlci52YWx1ZSk7IC8vIGNsb25lDQogICAgICAgICAgICBwb2ludGVyLnZhbHVlLm1hcC5zZXQobmFtZSwgdmFsdWUpOw0KICAgICAgICB9LA0KIA0KICAgICAgICBnZXRQcm9wKG5hbWUsIHBvaW50ZXIpIHsNCiAgICAgICAgICAgIHJlZnJlc2hEZXBzKCk7DQogICAgICAgICAgICBpZiAoIShwb2ludGVyIGluc3RhbmNlb2YgandQb2ludGVyLlR5cGUpKSByZXR1cm4gbnVsbDsNCiAgICAgICAgICAgIGlmICghKHBvaW50ZXIudmFsdWUgaW5zdGFuY2VvZiBkb2dlaXNjdXRPYmplY3QuVHlwZSkpIHJldHVybiBudWxsOw0KICAgICAgICAgICAgcmV0dXJuIHBvaW50ZXIudmFsdWUubWFwLmdldChuYW1lKTsNCiAgICAgICAgfSwNCiANCiAgICAgICAgaW5zdGFuY2VPZihwb2ludGVyLCBvdGhlckNsYXNzKSB7DQogICAgICAgICAgICByZWZyZXNoRGVwcygpOw0KICAgICAgICAgICAgbGV0IF9fY2xhc3NfXyA9IGp3Q2xhc3MuZ2V0UHJvcChjbGFzc1N5bWJvbCwgcG9pbnRlcik7DQogICAgICAgICAgICB3aGlsZSAoX19jbGFzc19fKSB7DQogICAgICAgICAgICAgICAgaWYgKF9fY2xhc3NfXyA9PT0gb3RoZXJDbGFzcykgcmV0dXJuIHRydWU7DQogICAgICAgICAgICAgICAgX19jbGFzc19fID0gX19jbGFzc19fLmV4dGVuc2lvbjsNCiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIHJldHVybiBmYWxzZTsNCiAgICAgICAgfQ0KICAgIH07DQogDQogICAgY2xhc3MgRXh0ZW5zaW9uIHsNCiAgICAgICAgY29uc3RydWN0b3IoKSB7DQogICAgICAgICAgICByZWZyZXNoRGVwcygpOw0KIA0KICAgICAgICAgICAgdHJ5IHsNCiAgICAgICAgICAgICAgICBpZiAocnVudGltZS5leHRlbnNpb25NYW5hZ2VyLmxvYWRFeHRlbnNpb25VUkwpIHsNCiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9hZGVkID0gcnVudGltZS5leHRlbnNpb25NYW5hZ2VyLmxvYWRFeHRlbnNpb25VUkwoDQogICAgICAgICAgICAgICAgICAgICAgICAnaHR0cHM6Ly9leHRlbnNpb25zLnBlbmd1aW5tb2QuY29tL2V4dGVuc2lvbnMvRG9nZWlzQ3V0L2RvZ2Vpc2N1dE9iamVjdC5qcycNCiAgICAgICAgICAgICAgICAgICAgKTsNCiAgICAgICAgICAgICAgICAgICAgaWYgKGxvYWRlZCAmJiB0eXBlb2YgbG9hZGVkLnRoZW4gPT09ICdmdW5jdGlvbicpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlZC50aGVuKHJlZnJlc2hEZXBzKS5jYXRjaCgoKSA9PiB7fSk7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICB9IGNhdGNoIChlKSB7fQ0KIA0KICAgICAgICAgICAgdHJ5IHsNCiAgICAgICAgICAgICAgICBpZiAocnVudGltZS5leHRlbnNpb25NYW5hZ2VyLmxvYWRFeHRlbnNpb25JZFN5bmMpIHsNCiAgICAgICAgICAgICAgICAgICAgcnVudGltZS5leHRlbnNpb25NYW5hZ2VyLmxvYWRFeHRlbnNpb25JZFN5bmMoJ2p3UG9pbnRlcicpO3J1bnRpbWUuZXh0ZW5zaW9uTWFuYWdlci5sb2FkRXh0ZW5zaW9uSWRTeW5jKCdqd0xhbWJkYScpOw0KICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9DQogDQogICAgICAgICAgICByZWZyZXNoRGVwcygpOw0KIA0KICAgICAgICAgICAgdm0uandDbGFzcyA9IGp3Q2xhc3M7DQogDQogICAgICAgICAgICBydW50aW1lLnJlZ2lzdGVyU2VyaWFsaXplcigNCiAgICAgICAgICAgICAgICAnandDbGFzcycsDQogICAgICAgICAgICAgICAgdiA9PiB2Lm5hbWUsDQogICAgICAgICAgICAgICAgdiA9PiBuZXcgandDbGFzcy5UeXBlKGZ1bmN0aW9uKiAoKSB7fSwgdi5uYW1lKQ0KICAgICAgICAgICAgKTsNCiANCiAgICAgICAgICAgIGlmIChydW50aW1lLnJlZ2lzdGVyQ29tcGlsZWRFeHRlbnNpb25CbG9ja3MpIHsNCiAgICAgICAgICAgICAgICBydW50aW1lLnJlZ2lzdGVyQ29tcGlsZWRFeHRlbnNpb25CbG9ja3MoJ2p3Q2xhc3MnLCB0aGlzLmdldENvbXBpbGVJbmZvKCkpOw0KICAgICAgICAgICAgfQ0KICAgICAgICB9DQogDQogICAgICAgIGdldEluZm8oKSB7DQogICAgICAgICAgICByZWZyZXNoRGVwcygpOw0KIA0KICAgICAgICAgICAgcmV0dXJuIHsNCiAgICAgICAgICAgICAgICBpZDogJ2p3Q2xhc3MnLA0KICAgICAgICAgICAgICAgIG5hbWU6ICdDbGFzc2VzJywNCiAgICAgICAgICAgICAgICBjb2xvcjE6ICcjNGJiZjU2JywNCiAgICAgICAgICAgICAgICBtZW51SWNvblVSSTogJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIWnBaWGRDYjNnOUlqQWdNQ0F5TUNBeU1DSStDaUFnUEdWc2JHbHdjMlVnYzNSNWJHVTlJbk4wY205clpUb2djbWRpS0RZd0xDQXhOVE1zSURZNUtUc2dabWxzYkRvZ2NtZGlLRGMxTENBeE9URXNJRGcyS1RzaUlHTjRQU0l4TUNJZ1kzazlJakV3SWlCeWVEMGlPUzQxSWlCeWVUMGlPUzQxSWo0OEwyVnNiR2x3YzJVK0NpQWdQR2MrQ2lBZ0lDQThjR0YwYUNCa1BTSk5JRFl1T1RjNElEVXVOVEUySUVNZ05DNDNNellnT0M0MU1EVWdOQzQzTXpZZ01URXVORGswSURZdU9UYzRJREUwTGpRNE5DSWdjM1J5YjJ0bFBTSWpabVptSWlCbWFXeHNQU0p1YjI1bElpQnpkSGxzWlQwaWMzUnliMnRsTFd4cGJtVnFiMmx1T2lCeWIzVnVaRHNnYzNSeWIydGxMV3hwYm1WallYQTZJSEp2ZFc1a095QnpkSEp2YTJVdGQybGtkR2c2SURJN0lqNDhMM0JoZEdnK0NpQWdJQ0E4Y0dGMGFDQmtQU0pOSURFMExqY3dNeUF4TkM0ME9EUWdReUF4TWk0ME5qRWdNVEV1TkRrMUlERXlMalEyTVNBNExqVXdOaUF4TkM0M01ETWdOUzQxTVRZaUlITjBjbTlyWlQwaUkyWm1aaUlnWm1sc2JEMGlibTl1WlNJZ2MzUjViR1U5SW5OMGNtOXJaUzFzYVc1bGFtOXBiam9nY205MWJtUTdJSE4wY205clpTMXNhVzVsWTJGd09pQnliM1Z1WkRzZ2MzUnliMnRsTFhkcFpIUm9PaUF5T3lCMGNtRnVjMlp2Y20wdFltOTRPaUJtYVd4c0xXSnZlRHNnZEhKaGJuTm1iM0p0TFc5eWFXZHBiam9nTlRBbElEVXdKVHNpSUhSeVlXNXpabTl5YlQwaWJXRjBjbWw0S0MweExDQXdMQ0F3TENBdE1Td2dMVEF1TURBd01EQXlMQ0F3S1NJK1BDOXdZWFJvUGdvZ0lEd3ZaejRLUEM5emRtYysnLA0KICAgICAgICAgICAgICAgIGJsb2NrczogWw0KICAgICAgICAgICAgICAgICAgICB7DQogICAgICAgICAgICAgICAgICAgICAgICBvcGNvZGU6ICdjbGFzcycsDQogICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnY2xhc3MgW05BTUVdIFtTRUxGXScsDQogICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBOQU1FOiB7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFyZ3VtZW50VHlwZS5TVFJJTkcsDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJycNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNFTEY6IHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbEluOiAnc2VsZicNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgICAgICB9LA0KICAgICAgICAgICAgICAgICAgICAgICAgYnJhbmNoZXM6IFt7fV0sDQogICAgICAgICAgICAgICAgICAgICAgICAuLi5qd0NsYXNzLkJsb2NrDQogICAgICAgICAgICAgICAgICAgIH0sDQogICAgICAgICAgICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIG9wY29kZTogJ3NlbGYnLA0KICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ3NlbGYnLA0KICAgICAgICAgICAgICAgICAgICAgICAgaGlkZUZyb21QYWxldHRlOiB0cnVlLA0KICAgICAgICAgICAgICAgICAgICAgICAgY2FuRHJhZ0R1cGxpY2F0ZTogdHJ1ZSwNCiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmp3UG9pbnRlci5CbG9jaw0KICAgICAgICAgICAgICAgICAgICB9LA0KICAgICAgICAgICAgICAgICAgICB7DQogICAgICAgICAgICAgICAgICAgICAgICBvcGNvZGU6ICdleHRlbmQnLA0KICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1tDTEFTU10gZXh0ZW5kcyBbRVhURU5TSU9OXScsDQogICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDTEFTUzogandDbGFzcy5Bcmd1bWVudCwNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBFWFRFTlNJT046IGp3Q2xhc3MuQXJndW1lbnQNCiAgICAgICAgICAgICAgICAgICAgICAgIH0sDQogICAgICAgICAgICAgICAgICAgICAgICAuLi5qd0NsYXNzLkJsb2NrDQogICAgICAgICAgICAgICAgICAgIH0sDQogICAgICAgICAgICAgICAgICAgICctLS0nLA0KICAgICAgICAgICAgICAgICAgICB7DQogICAgICAgICAgICAgICAgICAgICAgICBvcGNvZGU6ICdzZXRQcm9wJywNCiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdzZXQgW05BTUVdIG9uIFtQT0lOVEVSXSB0byBbVkFMVUVdJywNCiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrVHlwZTogQmxvY2tUeXBlLkNPTU1BTkQsDQogICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBOQU1FOiB7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFyZ3VtZW50VHlwZS5TVFJJTkcsDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2ZvbycNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBPSU5URVI6IGp3UG9pbnRlci5Bcmd1bWVudCwNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBWQUxVRTogew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBcmd1bWVudFR5cGUuU1RSSU5HLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdiYXInDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICB9LA0KICAgICAgICAgICAgICAgICAgICB7DQogICAgICAgICAgICAgICAgICAgICAgICBvcGNvZGU6ICdnZXRQcm9wJywNCiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdnZXQgW05BTUVdIG9uIFtQT0lOVEVSXScsDQogICAgICAgICAgICAgICAgICAgICAgICBibG9ja1R5cGU6IEJsb2NrVHlwZS5SRVBPUlRFUiwNCiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50czogew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5BTUU6IHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogQXJndW1lbnRUeXBlLlNUUklORywNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZm9vJw0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgUE9JTlRFUjogandQb2ludGVyLkFyZ3VtZW50DQogICAgICAgICAgICAgICAgICAgICAgICB9LA0KICAgICAgICAgICAgICAgICAgICAgICAgYWxsb3dEcm9wQW55d2hlcmU6IHRydWUNCiAgICAgICAgICAgICAgICAgICAgfSwNCiAgICAgICAgICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgICAgICAgICAgb3Bjb2RlOiAnZ2V0Q2xhc3MnLA0KICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ2dldCBjbGFzcyBvZiBbUE9JTlRFUl0nLA0KICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzOiB7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgUE9JTlRFUjogandQb2ludGVyLkFyZ3VtZW50DQogICAgICAgICAgICAgICAgICAgICAgICB9LA0KICAgICAgICAgICAgICAgICAgICAgICAgLi4uandDbGFzcy5CbG9jaw0KICAgICAgICAgICAgICAgICAgICB9LA0KICAgICAgICAgICAgICAgICAgICAnLS0tJywNCiAgICAgICAgICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgICAgICAgICAgb3Bjb2RlOiAnbmV3JywNCiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICduZXcgW0NMQVNTXScsDQogICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDTEFTUzogandDbGFzcy5Bcmd1bWVudA0KICAgICAgICAgICAgICAgICAgICAgICAgfSwNCiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmp3UG9pbnRlci5CbG9jaw0KICAgICAgICAgICAgICAgICAgICB9LA0KICAgICAgICAgICAgICAgICAgICB7DQogICAgICAgICAgICAgICAgICAgICAgICBvcGNvZGU6ICdnZXROYW1lJywNCiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICduYW1lIG9mIFtDTEFTU10nLA0KICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tUeXBlOiBCbG9ja1R5cGUuUkVQT1JURVIsDQogICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDTEFTUzogandDbGFzcy5Bcmd1bWVudA0KICAgICAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICB9LA0KICAgICAgICAgICAgICAgICAgICAnLS0tJywNCiAgICAgICAgICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgICAgICAgICAgb3Bjb2RlOiAnaW5zdGFuY2VvZicsDQogICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnaXMgW1BPSU5URVJdIGluc3RhbmNlIG9mIFtDTEFTU10/JywNCiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrVHlwZTogQmxvY2tUeXBlLkJPT0xFQU4sDQogICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQT0lOVEVSOiBqd1BvaW50ZXIuQXJndW1lbnQsDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0xBU1M6IGp3Q2xhc3MuQXJndW1lbnQNCiAgICAgICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgIF0NCiAgICAgICAgICAgIH07DQogICAgICAgIH0NCiANCiAgICAgICAgZ2V0Q29tcGlsZUluZm8oKSB7DQogICAgICAgICAgICByZXR1cm4gew0KICAgICAgICAgICAgICAgIGlyOiB7DQogICAgICAgICAgICAgICAgICAgIGNsYXNzOiAoZ2VuZXJhdG9yLCBibG9jaykgPT4gew0KICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdG9yLnNjcmlwdC55aWVsZHMgPSB0cnVlOw0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnaW5wdXQnLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGdlbmVyYXRvci5kZXNjZW5kSW5wdXRPZkJsb2NrKGJsb2NrLCAnTkFNRScpLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnN0YWNrOiBnZW5lcmF0b3IuZGVzY2VuZFN1YnN0YWNrKGJsb2NrLCAnU1VCU1RBQ0snKQ0KICAgICAgICAgICAgICAgICAgICAgICAgfTsNCiAgICAgICAgICAgICAgICAgICAgfSwNCiANCiAgICAgICAgICAgICAgICAgICAgc2VsZjogKCkgPT4gKHsNCiAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6ICdpbnB1dCcNCiAgICAgICAgICAgICAgICAgICAgfSksDQogDQogICAgICAgICAgICAgICAgICAgIGV4dGVuZDogKGdlbmVyYXRvciwgYmxvY2spID0+ICh7DQogICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnaW5wdXQnLA0KICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IGdlbmVyYXRvci5kZXNjZW5kSW5wdXRPZkJsb2NrKGJsb2NrLCAnQ0xBU1MnKSwNCiAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbjogZ2VuZXJhdG9yLmRlc2NlbmRJbnB1dE9mQmxvY2soYmxvY2ssICdFWFRFTlNJT04nKQ0KICAgICAgICAgICAgICAgICAgICB9KSwNCiANCiAgICAgICAgICAgICAgICAgICAgc2V0UHJvcDogKGdlbmVyYXRvciwgYmxvY2spID0+ICh7DQogICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnc3RhY2snLA0KICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZ2VuZXJhdG9yLmRlc2NlbmRJbnB1dE9mQmxvY2soYmxvY2ssICdOQU1FJyksDQogICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVyOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ1BPSU5URVInKSwNCiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ1ZBTFVFJykNCiAgICAgICAgICAgICAgICAgICAgfSksDQogDQogICAgICAgICAgICAgICAgICAgIGdldFByb3A6IChnZW5lcmF0b3IsIGJsb2NrKSA9PiAoew0KICAgICAgICAgICAgICAgICAgICAgICAga2luZDogJ2lucHV0JywNCiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGdlbmVyYXRvci5kZXNjZW5kSW5wdXRPZkJsb2NrKGJsb2NrLCAnTkFNRScpLA0KICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlcjogZ2VuZXJhdG9yLmRlc2NlbmRJbnB1dE9mQmxvY2soYmxvY2ssICdQT0lOVEVSJykNCiAgICAgICAgICAgICAgICAgICAgfSksDQogDQogICAgICAgICAgICAgICAgICAgIGdldENsYXNzOiAoZ2VuZXJhdG9yLCBibG9jaykgPT4gKHsNCiAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6ICdpbnB1dCcsDQogICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVyOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ1BPSU5URVInKQ0KICAgICAgICAgICAgICAgICAgICB9KSwNCiANCiAgICAgICAgICAgICAgICAgICAgbmV3OiAoZ2VuZXJhdG9yLCBibG9jaykgPT4gew0KICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdG9yLnNjcmlwdC55aWVsZHMgPSB0cnVlOw0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnaW5wdXQnLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ0NMQVNTJykNCiAgICAgICAgICAgICAgICAgICAgICAgIH07DQogICAgICAgICAgICAgICAgICAgIH0sDQogDQogICAgICAgICAgICAgICAgICAgIGdldE5hbWU6IChnZW5lcmF0b3IsIGJsb2NrKSA9PiAoew0KICAgICAgICAgICAgICAgICAgICAgICAga2luZDogJ2lucHV0JywNCiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBnZW5lcmF0b3IuZGVzY2VuZElucHV0T2ZCbG9jayhibG9jaywgJ0NMQVNTJykNCiAgICAgICAgICAgICAgICAgICAgfSksDQogDQogICAgICAgICAgICAgICAgICAgIGluc3RhbmNlb2Y6IChnZW5lcmF0b3IsIGJsb2NrKSA9PiAoew0KICAgICAgICAgICAgICAgICAgICAgICAga2luZDogJ2lucHV0JywNCiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50ZXI6IGdlbmVyYXRvci5kZXNjZW5kSW5wdXRPZkJsb2NrKGJsb2NrLCAnUE9JTlRFUicpLA0KICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IGdlbmVyYXRvci5kZXNjZW5kSW5wdXRPZkJsb2NrKGJsb2NrLCAnQ0xBU1MnKQ0KICAgICAgICAgICAgICAgICAgICB9KQ0KICAgICAgICAgICAgICAgIH0sDQogDQogICAgICAgICAgICAgICAganM6IHsNCiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IChub2RlLCBjb21waWxlciwgaW1wb3J0cykgPT4gew0KICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IGNvbXBpbGVyLnNvdXJjZTsNCiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVyLnNvdXJjZSA9ICcobmV3IHZtLmp3Q2xhc3MuVHlwZShmdW5jdGlvbiooX2p3Q2xhc3NTZWxmLCB0aHJlYWQsIHRhcmdldCkge1xuJzsNCiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVyLmRlc2NlbmRTdGFjayhub2RlLnN1YnN0YWNrLCBuZXcgaW1wb3J0cy5GcmFtZShmYWxzZSwgdW5kZWZpbmVkLCB0cnVlKSk7DQogICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlci5zb3VyY2UgKz0gYH0sICR7Y29tcGlsZXIuZGVzY2VuZElucHV0KG5vZGUubmFtZSkuYXNVbmtub3duKCl9LCBudWxsLCB0aHJlYWQucHJvY2VkdXJlcykpYDsNCiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldHVybnMgPSBjb21waWxlci5zb3VyY2U7DQogICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlci5zb3VyY2UgPSB0ZW1wOw0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpbXBvcnRzLlR5cGVkSW5wdXQocmV0dXJucywgaW1wb3J0cy5UWVBFX1VOS05PV04pOw0KICAgICAgICAgICAgICAgICAgICB9LA0KIA0KICAgICAgICAgICAgICAgICAgICBzZWxmOiAobm9kZSwgY29tcGlsZXIsIGltcG9ydHMpID0+IHsNCiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaW1wb3J0cy5UeXBlZElucHV0KA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICcodHlwZW9mIF9qd0NsYXNzU2VsZiAhPT0gInVuZGVmaW5lZCIgPyBfandDbGFzc1NlbGYgOiBuZXcgdm0uandQb2ludGVyLlR5cGUoMCkpJywNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRzLlRZUEVfVU5LTk9XTg0KICAgICAgICAgICAgICAgICAgICAgICAgKTsNCiAgICAgICAgICAgICAgICAgICAgfSwNCiANCiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kOiAobm9kZSwgY29tcGlsZXIsIGltcG9ydHMpID0+IHsNCiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaW1wb3J0cy5UeXBlZElucHV0KA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB2bS5qd0NsYXNzLlR5cGUudG9DbGFzcygke2NvbXBpbGVyLmRlc2NlbmRJbnB1dChub2RlLmNsYXNzKS5hc1Vua25vd24oKX0pLmV4dGVuZCgke2NvbXBpbGVyLmRlc2NlbmRJbnB1dChub2RlLmV4dGVuc2lvbikuYXNVbmtub3duKCl9KWAsDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0cy5UWVBFX1VOS05PV04NCiAgICAgICAgICAgICAgICAgICAgICAgICk7DQogICAgICAgICAgICAgICAgICAgIH0sDQogDQogICAgICAgICAgICAgICAgICAgIHNldFByb3A6IChub2RlLCBjb21waWxlciwgaW1wb3J0cykgPT4gew0KICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZXIuc291cmNlICs9IGB2bS5qd0NsYXNzLnNldFByb3AoJHtjb21waWxlci5kZXNjZW5kSW5wdXQobm9kZS5uYW1lKS5hc1Vua25vd24oKX0sICR7Y29tcGlsZXIuZGVzY2VuZElucHV0KG5vZGUucG9pbnRlcikuYXNVbmtub3duKCl9LCAke2NvbXBpbGVyLmRlc2NlbmRJbnB1dChub2RlLnZhbHVlKS5hc1Vua25vd24oKX0pO1xuYDsNCiAgICAgICAgICAgICAgICAgICAgfSwNCiANCiAgICAgICAgICAgICAgICAgICAgZ2V0UHJvcDogKG5vZGUsIGNvbXBpbGVyLCBpbXBvcnRzKSA9PiB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGltcG9ydHMuVHlwZWRJbnB1dCgNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdm0uandDbGFzcy5nZXRQcm9wKCR7Y29tcGlsZXIuZGVzY2VuZElucHV0KG5vZGUubmFtZSkuYXNVbmtub3duKCl9LCAke2NvbXBpbGVyLmRlc2NlbmRJbnB1dChub2RlLnBvaW50ZXIpLmFzVW5rbm93bigpfSlgLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydHMuVFlQRV9VTktOT1dODQogICAgICAgICAgICAgICAgICAgICAgICApOw0KICAgICAgICAgICAgICAgICAgICB9LA0KIA0KICAgICAgICAgICAgICAgICAgICBnZXRDbGFzczogKG5vZGUsIGNvbXBpbGVyLCBpbXBvcnRzKSA9PiB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGltcG9ydHMuVHlwZWRJbnB1dCgNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdm0uandDbGFzcy5nZXRQcm9wKHZtLmp3Q2xhc3MuY2xhc3NTeW1ib2wsICR7Y29tcGlsZXIuZGVzY2VuZElucHV0KG5vZGUucG9pbnRlcikuYXNVbmtub3duKCl9KWAsDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0cy5UWVBFX1VOS05PV04NCiAgICAgICAgICAgICAgICAgICAgICAgICk7DQogICAgICAgICAgICAgICAgICAgIH0sDQogDQogICAgICAgICAgICAgICAgICAgIG5ldzogKG5vZGUsIGNvbXBpbGVyLCBpbXBvcnRzKSA9PiB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGltcG9ydHMuVHlwZWRJbnB1dCgNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgKHlpZWxkKiB2bS5qd0NsYXNzLlR5cGUudG9DbGFzcygke2NvbXBpbGVyLmRlc2NlbmRJbnB1dChub2RlLmNsYXNzKS5hc1Vua25vd24oKX0pLmNyZWF0ZUluc3RhbmNlKHRocmVhZCwgdGFyZ2V0KSlgLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydHMuVFlQRV9VTktOT1dODQogICAgICAgICAgICAgICAgICAgICAgICApOw0KICAgICAgICAgICAgICAgICAgICB9LA0KIA0KICAgICAgICAgICAgICAgICAgICBnZXROYW1lOiAobm9kZSwgY29tcGlsZXIsIGltcG9ydHMpID0+IHsNCiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaW1wb3J0cy5UeXBlZElucHV0KA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB2bS5qd0NsYXNzLlR5cGUudG9DbGFzcygke2NvbXBpbGVyLmRlc2NlbmRJbnB1dChub2RlLmNsYXNzKS5hc1Vua25vd24oKX0pLm5hbWVgLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydHMuVFlQRV9TVFJJTkcNCiAgICAgICAgICAgICAgICAgICAgICAgICk7DQogICAgICAgICAgICAgICAgICAgIH0sDQogDQogICAgICAgICAgICAgICAgICAgIGluc3RhbmNlb2Y6IChub2RlLCBjb21waWxlciwgaW1wb3J0cykgPT4gew0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpbXBvcnRzLlR5cGVkSW5wdXQoDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgYHZtLmp3Q2xhc3MuaW5zdGFuY2VPZigke2NvbXBpbGVyLmRlc2NlbmRJbnB1dChub2RlLnBvaW50ZXIpLmFzVW5rbm93bigpfSwgdm0uandDbGFzcy5UeXBlLnRvQ2xhc3MoJHtjb21waWxlci5kZXNjZW5kSW5wdXQobm9kZS5jbGFzcykuYXNVbmtub3duKCl9KSlgLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydHMuVFlQRV9CT09MRUFODQogICAgICAgICAgICAgICAgICAgICAgICApOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgfTsNCiAgICAgICAgfQ0KIA0KICAgICAgICBjbGFzcyh7IE5BTUUsIFNFTEYgfSwgdXRpbCkgew0KICAgICAgICAgICAgcmVmcmVzaERlcHMoKTsNCiAgICAgICAgICAgIHJldHVybiBuZXcgandDbGFzcy5UeXBlKGZ1bmN0aW9uKiAoX2p3Q2xhc3NTZWxmLCB0aHJlYWQsIHRhcmdldCkge30sIE5BTUUsIG51bGwsIHV0aWwudGhyZWFkPy5wcm9jZWR1cmVzKTsNCiAgICAgICAgfQ0KIA0KICAgICAgICBzZWxmKCkgew0KICAgICAgICAgICAgcmVmcmVzaERlcHMoKTsNCiAgICAgICAgICAgIHJldHVybiBuZXcgandQb2ludGVyLlR5cGUoMCk7DQogICAgICAgIH0NCiANCiAgICAgICAgZXh0ZW5kKHsgQ0xBU1MsIEVYVEVOU0lPTiB9KSB7DQogICAgICAgICAgICByZWZyZXNoRGVwcygpOw0KICAgICAgICAgICAgQ0xBU1MgPSBqd0NsYXNzLlR5cGUudG9DbGFzcyhDTEFTUyk7DQogICAgICAgICAgICBFWFRFTlNJT04gPSBqd0NsYXNzLlR5cGUudG9DbGFzcyhFWFRFTlNJT04pOw0KICAgICAgICAgICAgcmV0dXJuIENMQVNTLmV4dGVuZChFWFRFTlNJT04pOw0KICAgICAgICB9DQogDQogICAgICAgIHNldFByb3AoeyBOQU1FLCBQT0lOVEVSLCBWQUxVRSB9KSB7DQogICAgICAgICAgICByZWZyZXNoRGVwcygpOw0KICAgICAgICAgICAgandDbGFzcy5zZXRQcm9wKE5BTUUsIFBPSU5URVIsIFZBTFVFKTsNCiAgICAgICAgfQ0KIA0KICAgICAgICBnZXRQcm9wKHsgTkFNRSwgUE9JTlRFUiB9KSB7DQogICAgICAgICAgICByZWZyZXNoRGVwcygpOw0KICAgICAgICAgICAgcmV0dXJuIGp3Q2xhc3MuZ2V0UHJvcChOQU1FLCBQT0lOVEVSKTsNCiAgICAgICAgfQ0KIA0KICAgICAgICBnZXRDbGFzcyh7IFBPSU5URVIgfSkgew0KICAgICAgICAgICAgcmVmcmVzaERlcHMoKTsNCiAgICAgICAgICAgIHJldHVybiBqd0NsYXNzLmdldFByb3AoY2xhc3NTeW1ib2wsIFBPSU5URVIpOw0KICAgICAgICB9DQogDQogICAgICAgIG5ldyh7IENMQVNTIH0sIHV0aWwpIHsNCiAgICAgICAgICAgIHJlZnJlc2hEZXBzKCk7DQogICAgICAgICAgICBDTEFTUyA9IGp3Q2xhc3MuVHlwZS50b0NsYXNzKENMQVNTKTsNCiAgICAgICAgICAgIHJldHVybiBDTEFTUy5jcmVhdGVJbnN0YW5jZSh1dGlsLnRocmVhZCwgdXRpbC50YXJnZXQpOw0KICAgICAgICB9DQogDQogICAgICAgIGdldE5hbWUoeyBDTEFTUyB9KSB7DQogICAgICAgICAgICByZWZyZXNoRGVwcygpOw0KICAgICAgICAgICAgQ0xBU1MgPSBqd0NsYXNzLlR5cGUudG9DbGFzcyhDTEFTUyk7DQogICAgICAgICAgICByZXR1cm4gQ0xBU1MubmFtZTsNCiAgICAgICAgfQ0KIA0KICAgICAgICBpbnN0YW5jZW9mKHsgUE9JTlRFUiwgQ0xBU1MgfSkgew0KICAgICAgICAgICAgcmVmcmVzaERlcHMoKTsNCiAgICAgICAgICAgIHJldHVybiBqd0NsYXNzLmluc3RhbmNlT2YoUE9JTlRFUiwgandDbGFzcy5UeXBlLnRvQ2xhc3MoQ0xBU1MpKTsNCiAgICAgICAgfQ0KICAgIH0NCiANCiAgICBTY3JhdGNoLmV4dGVuc2lvbnMucmVnaXN0ZXIobmV3IEV4dGVuc2lvbigpKTsNCn0pKFNjcmF0Y2gpOw==";
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
  console.log(
    `✅ ${outJSONLocation.split(path.sep).pop()} written with`,
    Object.keys(emitResult.blocks).length,
    "blocks.",
  );
}
