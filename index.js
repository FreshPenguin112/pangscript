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
  return `__${genRandomUid()}_${clean}${__pw_temp_counter}`;
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
    try {
      //fs.writeFileSync("/tmp/pang_ast_debug.json", JSON.stringify(ast, null, 2), "utf8");
    } catch (e) {}
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
        //fs.writeFileSync("/tmp/pang_ast_debug_normalized.json", JSON.stringify(ast, null, 2), "utf8");
      } catch (e) {}
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
      if (node.type === "On" && node.body && Array.isArray(node.body.body)) return walk(node.body.body, false);
      if (node.body && Array.isArray(node.body)) return walk(node.body, false);
    }
    walk(root, true);
  }
  collectGlobalVariables(ast);

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
          if (Array.isArray(retLambdaParams) && retLambdaParams.length > 0) {
            classRegistry[name].methodReturnOriginals[m.name] = retLambdaParams.slice();
            classRegistry[name].methodReturns[m.name] = retLambdaParams.map((p, i) => 'arg' + i);
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
      // Track variables initialized to lambda expressions so we know their arg names
      if (node.type === "Declare" && node.value && node.value.type === "Lambda") {
        const lp = node.value.params;
        if (Array.isArray(lp)) {
          const arr = lp.map((p, i) => '__arg' + i);
          const map = {};
          lp.forEach((p, i) => { if (p) map[p] = '__arg' + i; });
          varToLambda[node.name] = { arr, map, params: lp.slice() };
        } else if (lp) {
          const tmp = '__arg0';
          varToLambda[node.name] = { arr: [tmp], map: { [lp]: tmp }, params: [lp] };
        } else varToLambda[node.name] = { arr: [], map: {}, params: [] };
      }
      // If a variable is declared with an Array literal that contains a Lambda
      // element, record the lambda param tagging so later `get(var, idx)` can
      // reuse the same arg temp names. Use the first Lambda element found.
      if (node.type === "Declare" && node.value && node.value.type === "Array") {
        const els = Array.isArray(node.value.elements) ? node.value.elements : [];
        for (let ei = 0; ei < els.length; ei++) {
          const el = els[ei];
          if (el && el.type === "Lambda") {
            const lp = el.params;
            if (Array.isArray(lp)) {
              const arr = lp.map((p, i) => 'arg' + i);
              const map = {};
              lp.forEach((p, i) => { if (p) map[p] = 'arg' + i; });
              varToLambda[node.name] = { arr, map, params: lp.slice() };
            } else if (lp) {
              const tmp = 'arg0';
              varToLambda[node.name] = { arr: [tmp], map: { [lp]: tmp }, params: [lp] };
            } else varToLambda[node.name] = { arr: [], map: {}, params: [] };
            break;
          }
        }
      }
      if (node.type === "Assign" && node.value && node.value.type === "New") {
        const callee = node.value.callee;
        if (callee && callee.type === "Call" && typeof callee.name === "string") {
          varToClass[node.name] = callee.name;
        }
      }
      if (node.type === "Assign" && node.value && node.value.type === "Lambda") {
        const lp = node.value.params;
        if (Array.isArray(lp)) {
          const arr = lp.map((p, i) => (p ? __pw_newArgTemp(p, `var:${node.name}:param:${i}:${p}`) : p));
          const map = {};
          for (let i = 0; i < lp.length; i++) if (lp[i]) map[lp[i]] = arr[i];
          varToLambda[node.name] = { arr, map, params: lp.slice() };
        } else if (lp) {
          const tmp = __pw_newArgTemp(lp, `var:${node.name}:param:0:${lp}`);
          varToLambda[node.name] = { arr: [tmp], map: { [lp]: tmp }, params: [lp] };
        } else varToLambda[node.name] = { arr: [], map: {}, params: [] };
      }
      // Also handle Assign where RHS is an Array containing a Lambda
      if (node.type === "Assign" && node.value && node.value.type === "Array") {
        const els = Array.isArray(node.value.elements) ? node.value.elements : [];
        for (let ei = 0; ei < els.length; ei++) {
          const el = els[ei];
          if (el && el.type === "Lambda") {
            const lp = el.params;
            if (Array.isArray(lp)) {
              const arr = lp.map((p, i) => (p ? __pw_newArgTemp(p, `var:${node.name}:param:${i}:${p}`) : p));
              const map = {};
              for (let i = 0; i < lp.length; i++) if (lp[i]) map[lp[i]] = arr[i];
              varToLambda[node.name] = { arr, map, params: lp.slice() };
            } else if (lp) {
              const tmp = __pw_newArgTemp(lp, `var:${node.name}:param:0:${lp}`);
              varToLambda[node.name] = { arr: [tmp], map: { [lp]: tmp }, params: [lp] };
            } else varToLambda[node.name] = { arr: [], map: {}, params: [] };
            break;
          }
        }
      }
      if (node.type === "Block" && Array.isArray(node.body)) return walk(node.body);
      if (node.type === "On" && node.body && Array.isArray(node.body.body)) return walk(node.body.body);
      if (node.body && Array.isArray(node.body)) return walk(node.body);
    }
    walk(root);
  }
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

  // Helper to decide whether a variable name should be emitted as a
  // thread-scoped temp or a global. Preferences:
  // - explicit `thread` kind -> thread
  // - inside a method: params, synthetic `__` names, and any name declared
  //   in the current method -> thread
  // - otherwise, if a known top-level global -> global
  // - fallback: thread inside methods, global at top-level
  function varScopeForName(name, inMethod, paramMap, kind) {
    if (kind === "thread") return "thread";
    if (inMethod) {
      if (name && paramMap && Object.prototype.hasOwnProperty.call(paramMap, name)) return "thread";
      if (name && name.startsWith("__")) return "thread";
      if (currentEmittingMethodKey && methodLocalDecls[currentEmittingMethodKey] && methodLocalDecls[currentEmittingMethodKey].has(name)) return "thread";
      if (name && globalNames.has(name)) return "global";
      return "thread";
    }
    return "global";
  }

  // When emitting class method bodies we set this to the current class
  // name so `this` receiver lookups can be resolved to the proper
  // `classRegistry` entry (ensures `this.add(...)` uses the same
  // tagged param names as external calls like `num.add(...)`).
  let emittingClass = null;

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
      return { opcode: "operator_add", inputs: [{ opcode: "SPtempVars_getVar", inputs: [getterType, String(vname)] }, 1] };
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
          if (p) localParamMap[p] = '__arg' + i;
        });
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
                return { opcode: "control_inline_stack_output", inputs: [inlineChildren] };
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
              return { opcode: "control_inline_stack_output", inputs: [inlineChildren] };
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
      // IMPORTANT: do NOT pre-evaluate object receivers here. If the
      // receiver is an embedded Call/MemberCall AST we must let
      // `flattenMemberCall` emit the steps to avoid double-wrapping
      // (previous code called `exprToNested` too early and produced
      // nested `control_inline_stack_output` wrappers).
      let objReceiver = null;
      const first = chain[0];
      if (typeof first === "string") {
        objReceiver = first === "this" ? { opcode: "jwClass_self", inputs: [], noPlaceholder: true } : { type: "Var", name: first };
      } else {
        // do not call exprToNested(first) when `first` is an object;
        // flattenMemberCall will handle emitting the necessary steps.
        objReceiver = null;
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
        if (Array.isArray(methodParams) && methodParams.length > 0) {
          const setters = [];
          let receiverTempName = null;
          let receiverRef = objReceiver;
          const needTempForReceiver = !(objReceiver && objReceiver.opcode === "jwClass_self");
          if (needTempForReceiver) {
            receiverTempName = __pw_newTemp("__m");
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
          const ret2 = { opcode: "procedures_return", inputs: [callMethod2] };
          const inlineChildren2 = [].concat(setters2, [ret2]);
          return { opcode: "control_inline_stack_output", inputs: [inlineChildren2] };
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
          const argsArr = (step.args || []).map((a) => (a === undefined ? "" : exprToNested(a, inMethod, paramMap)));
          if (typeof cname === "string" && varToLambda && varToLambda[cname]) {
            const vinfo = varToLambda[cname];
            const getterType = varScopeForName(cname, inMethod, paramMap, undefined);
            const lambdaGetter = { opcode: "SPtempVars_getVar", inputs: [getterType, String(cname)] };
            // If we have recorded tagged arg names, set them before executing
            if (vinfo && Array.isArray(vinfo.arr) && vinfo.arr.length > 0) {
              for (let i = 0; i < vinfo.arr.length; i++) {
                const pname = vinfo.arr[i];
                const argExpr = step.args && step.args[i] ? exprToNested(step.args[i], inMethod, paramMap) : "";
                inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
              }
              const callReporter = { opcode: "jwLambda_executeR", inputs: [lambdaGetter, ""] };
              const tempName = __pw_newTemp("__c");
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] });
              prevTemp = tempName;
              prevReturnedLambdaArgs = null;
              prevStepMethodName = null;
              continue;
            }
            // Fallback: single-positional-arg synthetic temp
            const argPos = step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
            if (argPos !== "") {
              const at = __pw_newArgTemp("value");
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

        // If this step is a normal method call (methodName present)
        if (step.methodName) {
          // special-case: receiver is previous temp and the current method name
          // matches the previous method — this pattern indicates we should
          // invoke the function value stored in the previous temp rather than
          // re-looking-up the method on that temp (produces num.test()("bar ")()).
          const isReceiverPrevTemp =
            receiverRef && receiverRef.opcode === "SPtempVars_getVar" && Array.isArray(receiverRef.inputs) &&
            prevTemp && receiverRef.inputs[1] === prevTemp;
          if (isReceiverPrevTemp && prevStepMethodName === step.methodName) {
            // If we know the returned lambda arg names, map them.
            if (Array.isArray(prevReturnedLambdaArgs) && prevReturnedLambdaArgs.length > 0) {
              for (let pi = 0; pi < prevReturnedLambdaArgs.length; pi++) {
                const pname = prevReturnedLambdaArgs[pi];
                const argExpr = step.args && step.args[pi] ? exprToNested(step.args[pi], inMethod, paramMap) : "";
                inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", pname, argExpr] });
              }
            } else {
              // fallback: use a synthetic arg temp for a single positional arg
              const argPosLocal = step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
              if (argPosLocal !== "") {
                const argTemp = __pw_newArgTemp("value");
                inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp, argPosLocal] });
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
            const boundMethod = { opcode: "jwClass_getProp", inputs: [step.methodName, receiverRef] };
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
          const boundMethod = { opcode: "jwClass_getProp", inputs: [step.methodName, receiverRef] };
          if (argPos !== "") {
            const argTemp = __pw_newArgTemp("value");
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
            const callReporter = { opcode: "jwLambda_executeR", inputs: [boundMethod, ""] };
            const tempName = __pw_newTemp("__c");
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName, callReporter] });
            prevTemp = tempName;
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
          // fallback: no named params for fakeMethod — treat like unknown-param method
          const fakeArgExpr =
            step.args && step.args.length > 0 ? exprToNested(step.args[0], inMethod, paramMap) : "";
          if (fakeArgExpr !== "") {
            const argTemp = __pw_newArgTemp("value");
            inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp, fakeArgExpr] });
          }
          const boundMethod2 = {
            opcode: "jwClass_getProp",
            inputs: [fakeMethod, { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] }],
          };
          const callReporter2 = { opcode: "jwLambda_executeR", inputs: [boundMethod2, ""] };
          const tempName2 = __pw_newTemp("__c");
          inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", tempName2, callReporter2] });
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
          const argTemp2 = __pw_newArgTemp("value");
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
        // Fallback: use synthetic arg temp for a single positional arg
        const argPos = expr.args && expr.args.length > 0 ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        if (argPos !== "") {
          const at = __pw_newArgTemp("value");
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
          const argPos = expr.args && expr.args.length > 0 ? exprToNested(expr.args[0], inMethod, paramMap) : "";
          if (argPos !== "") {
            const at = __pw_newArgTemp("value");
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
          const pname = '__arg' + i;
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
        const argPos = expr.args && expr.args.length > 0 ? exprToNested(expr.args[0], inMethod, paramMap) : "";
        if (argPos !== "") {
          const at = __pw_newArgTemp("value");
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
          const destType = resolveScope(varName);
          const getter = { opcode: "SPtempVars_getVar", inputs: [destType, varName] };
          const appendCall = { opcode: "jwArray_append", inputs: [getter, valArg] };
          return { opcode: "SPtempVars_setVar", inputs: [destType, varName, appendCall] };
        }
        if (arrArg && typeof arrArg === "object" && arrArg.opcode === "jwClass_getProp") {
          const propName = arrArg.inputs && arrArg.inputs[0];
          const receiver = arrArg.inputs && arrArg.inputs[1];
          const appendCall = { opcode: "jwArray_append", inputs: [arrArg, valArg] };
          return { opcode: "jwClass_setProp", inputs: [propName, receiver, appendCall] };
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
            const boundMethod = { opcode: "jwClass_getProp", inputs: [step.methodName, receiverRef] };
            if (argPos !== "") {
              const argTemp = __pw_newArgTemp("value");
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
              const callReporter = { opcode: "jwLambda_executeR", inputs: [boundMethod, ""] };
              const tempName = __pw_newTemp("__c");
              inlineChildren.push({
                opcode: "SPtempVars_setVar",
                inputs: ["thread", tempName, callReporter],
              });
              prevTemp = tempName;
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
            const callReporter2 = { opcode: "jwLambda_executeR", inputs: [boundMethod2, ""] };
            const tempName2 = __pw_newTemp("__c");
            inlineChildren.push({
              opcode: "SPtempVars_setVar",
              inputs: ["thread", tempName2, callReporter2],
            });
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
              const argTemp2 = __pw_newArgTemp("value");
              inlineChildren.push({ opcode: "SPtempVars_setVar", inputs: ["thread", argTemp2, argPos2] });
            }
            const boundMethod2 = {
              opcode: "jwClass_getProp",
              inputs: [prevStepMethodName, { opcode: "SPtempVars_getVar", inputs: ["thread", prevTemp] }],
            };
            const callReporter2 = { opcode: "jwLambda_executeR", inputs: [boundMethod2, ""] };
            const tempName2 = __pw_newTemp("__c");
            inlineChildren.push({
              opcode: "SPtempVars_setVar",
              inputs: ["thread", tempName2, callReporter2],
            });
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
            const _prevMethodKey = currentEmittingMethodKey;
            currentEmittingMethodKey = `${className}:${m.name}`;
            const raw = m.body.body.map((s) => stmtToNested(s, true, methodParamMap)).filter(Boolean);
            methodBody = flattenNestedResults(raw);
            assertReturnTerminal(methodBody, `method '${m.name}' body`);
            currentEmittingMethodKey = _prevMethodKey;
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

// Now always use nested input for generation
let emitResult;
try {
  // DEBUG: dump nested representation to inspect emitted class/new/method shapes
  try {
    //fs.writeFileSync("/tmp/pang_nested_debug.json", JSON.stringify(nestedInput, null, 2), "utf8");
  } catch (e) {}
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
  // dump emitResult to temp file for debugging malformed pseudocode
  try {
    //fs.writeFileSync("/tmp/pang_emit_debug.json", JSON.stringify(emitResult, null, 2), "utf8");
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
