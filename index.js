// compiler.js — fixed version using string-placeholder preprocessing
// Usage: node compiler.js [input.lang]
// npm install antlr4

const fs = require("fs");
const path = require("path");
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
      return null;
    }
    if (ctx.ifStmt && ctx.ifStmt()) return this.visit(ctx.ifStmt());
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
    const body = this.visit(ctx.inlineBlock());
    return { type: "On", event, body };
  }

  // inlineBlock now contains an `inlineBlockBody` instead of a normal `block`.
  // Build a Block AST from its inlineStatement children.
  visitInlineBlock(ctx) {
    const bodyCtx = ctx.inlineBlockBody();
    const stmts = [];
    if (bodyCtx && bodyCtx.inlineStatement) {
      for (let i = 0; i < bodyCtx.inlineStatement().length; i++) {
        const st = bodyCtx.inlineStatement(i);
        // inlineStatement may contain a statementItem() (which contains onCall/printCall)
        if (st.statementItem && st.statementItem()) {
          const si = st.statementItem();
          if (si.onCall && si.onCall()) stmts.push(this.visit(si.onCall()));
          else if (si.printCall && si.printCall()) stmts.push(this.visit(si.printCall()));
          else if (si.functionCall && si.functionCall()) stmts.push(this.visit(si.functionCall()));
          else if (si.varDecl && si.varDecl()) stmts.push(this.visit(si.varDecl()));
          else if (si.assignStmt && si.assignStmt()) stmts.push(this.visit(si.assignStmt()));
        } else if (st.ifStmt && st.ifStmt()) {
          stmts.push(this.visit(st.ifStmt()));
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
    const name = ctx.IDENT().getText();
    const args = [];
    try {
      const exprs = ctx.expr ? ctx.expr() : null;
      if (exprs) {
        if (Array.isArray(exprs)) {
          for (let i = 0; i < exprs.length; i++) args.push(this.visit(exprs[i]));
        } else {
          args.push(this.visit(exprs));
        }
      }
    } catch (e) {
      // ignore
    }
    return { type: "Call", name, args };
  }

  visitVarDecl(ctx) {
    // ('let' | 'const') IDENT ('=' expr)?
    const kind = ctx.getChild(0).getText();
    const name = ctx.IDENT().getText();
    let value = null;
    if (ctx.expr && ctx.expr()) value = this.visit(ctx.expr());
    return { type: "Declare", kind, name, value };
  }

  visitAssignStmt(ctx) {
    const name = ctx.IDENT().getText();
    if (!ctx.expr || !ctx.expr()) return null;
    const value = this.visit(ctx.expr());
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

  visitExpr(ctx) {
    let node = null;

    // Handle unary NOT
    if (ctx.children && ctx.children[0] && ctx.children[0].getText() === "!") {
      node = { type: "Unary", op: "!", operand: this.visit(ctx.expr(0)) };
    }
    // Ternary conditional: expr '?' expr ':' expr
    else if (ctx.children && ctx.children.length === 5) {
      // look for '?' token among children to detect ternary
      const hasQuestion = ctx.children.some(
        (c) => c && typeof c.getText === "function" && c.getText() === "?"
      );
      if (hasQuestion) {
        const cond = this.visit(ctx.expr(0));
        const thenExpr = this.visit(ctx.expr(1));
        const elseExpr = this.visit(ctx.expr(2));
        node = { type: "Ternary", cond, thenExpr, elseExpr };
      }
    }
    // Handle binary operators
    else if (ctx.children && ctx.children.length === 3) {
      const left = this.visit(ctx.expr(0));
      const op = ctx.children[1].getText();
      const right = this.visit(ctx.expr(1));

      // All binary operators (math and logical)
      if (
        op === "**" ||
        op === "*" ||
        op === "/" ||
        op === "+" ||
        op === "-" ||
        op === ".." ||
        op === ">" ||
        op === ">=" ||
        op === "<" ||
        op === "<=" ||
        op === "==" ||
        op === "===" ||
        op === "!=" ||
        op === "!==" ||
        op === "&&" ||
        op === "||"
      ) {
        node = { type: "Binary", op, left, right };
      }
    }
    // Handle primary
    else if (ctx.primary()) {
      node = this.visit(ctx.primary());
    }
    // Handle child expr
    else if (ctx.expr(0)) {
      node = this.visit(ctx.expr(0));
    }

    return node;
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
    if (ctx.printCall()) return this.visit(ctx.printCall());
    if (ctx.functionCall && ctx.functionCall()) return this.visit(ctx.functionCall());
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
  let askUsed = false;

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
    if (stmt.type === "Call") return emitCallStmt(stmt);
    if (stmt.type === "Declare") return emitDeclare(stmt);
    if (stmt.type === "Assign") return emitAssign(stmt);
    throw new Error("emitStmt: unsupported stmt type " + stmt.type);
  }

  // Variable storage: varName -> { varKey, typeId, kind }
  const varInfo = {};
  const variables = {};

  function ensureVariable(name, kind = "let", initExpr) {
    if (varInfo[name]) return varInfo[name];
    const varKey = genId() + "|" + name;
    const typeId = Math.random().toString(36).slice(2, 10);
    // Determine initial value for project variables mapping
    let initial = 0;
    if (initExpr && initExpr.type === "Literal" && initExpr.litType === "number")
      initial = Number(initExpr.value);
    variables[varKey] = [name, initial];
    varInfo[name] = { varKey, typeId, kind };
    return varInfo[name];
  }

  function emitSetVar(name, valueExpr, allowConstInit = false) {
    // Create variable if necessary (implicit let)
    const info =
      varInfo[name] ||
      ensureVariable(name, "let", valueExpr && valueExpr.type === "Literal" ? valueExpr : null);
    if (info.kind === "const" && !allowConstInit) throw new Error("Cannot assign to const " + name);

    const id = genId();
    const inputs = {};
    // NAME is literal string
    inputs.NAME = [1, [InputTypes.text, String(name)]];
    // VALUE may be a literal or reporter
    if (!valueExpr) inputs.VALUE = [1, [InputTypes.text, ""]];
    else if (valueExpr.type === "lit") inputs.VALUE = valueExpr.value;
    else {
      inputs.VALUE = [3, valueExpr.id, makeShadowForExpr(valueExpr.node || null)];
      // attach child parent
      blocks[valueExpr.id].parent = id;
    }
    const fields = { TYPE: ["global", info.typeId] };
    blocks[id] = {
      opcode: "SPtempVars_setVar",
      next: null,
      parent: null,
      inputs,
      fields,
      shadow: false,
      topLevel: false,
    };
    return { first: id, last: id };
  }

  function emitGetVar(name) {
    const info = varInfo[name] || ensureVariable(name, "let", null);
    const id = genId();
    const inputs = { NAME: [1, [InputTypes.text, String(name)]] };
    const fields = { TYPE: ["global", info.typeId] };
    blocks[id] = {
      opcode: "SPtempVars_getVar",
      next: null,
      parent: null,
      inputs,
      fields,
      shadow: false,
      topLevel: false,
    };
    return { type: "id", id, node: { type: "Var", name } };
  }

  function emitCallStmt(stmt) {
    // statement-level call: create a block with opcode = stmt.name
    const id = genId();
    // Try to use metadata to map positional args -> real input names
    let inputs = {};
    const meta = blocksMeta[stmt.name];
    if (meta && Array.isArray(meta)) {
      const params = meta[0] || [];
      if (stmt.args && stmt.args.length > 0) {
        for (let i = 0; i < stmt.args.length; i++) {
          const param = params[i] || { name: "INPUT" + (i + 1), type: null };
          const inName = param.name || "INPUT" + (i + 1);
          const a = stmt.args[i];
          if (!a) {
            inputs[inName] = [1, [InputTypes.text, ""]];
          } else if (a.type === "Literal") {
            // prefer param.type if available
            if (param.type === "number" || a.litType === "number")
              inputs[inName] = [1, [InputTypes.math_number, String(a.value)]];
            else inputs[inName] = [1, [InputTypes.text, String(a.value)]];
          } else {
            const emitted = emitExpression(a);
            if (!emitted) inputs[inName] = [1, [InputTypes.text, ""]];
            else if (emitted.type === "lit") inputs[inName] = emitted.value;
            else {
              inputs[inName] = [3, emitted.id, makeShadowForExpr(a)];
              blocks[emitted.id].parent = id;
            }
          }
        }
      }
    } else {
      // fallback to generic INPUTn mapping
      if (stmt.args && stmt.args.length > 0) {
        for (let i = 0; i < stmt.args.length; i++) {
          const a = stmt.args[i];
          const inName = "INPUT" + (i + 1);
          if (!a) {
            inputs[inName] = [1, [InputTypes.text, ""]];
          } else if (a.type === "Literal") {
            if (a.litType === "number") inputs[inName] = [1, [InputTypes.math_number, String(a.value)]];
            else inputs[inName] = [1, [InputTypes.text, String(a.value)]];
          } else {
            const emitted = emitExpression(a);
            if (emitted.type === "lit") inputs[inName] = emitted.value;
            else {
              inputs[inName] = [3, emitted.id, makeShadowForExpr(a)];
              blocks[emitted.id].parent = id;
            }
          }
        }
      }
    }
    blocks[id] = {
      opcode: stmt.name,
      next: null,
      parent: null,
      inputs,
      fields: {},
      shadow: false,
      topLevel: false,
    };
    return { first: id, last: id };
  }

  function emitDeclare(stmt) {
    // stmt: { type: 'Declare', kind, name, value }
    if (varInfo[stmt.name]) throw new Error("Variable " + stmt.name + " already declared");
    ensureVariable(stmt.name, stmt.kind, stmt.value);
    if (stmt.value) {
      // emit initial set
      const val =
        stmt.value.type === "Literal"
          ? {
              type: "lit",
              value:
                stmt.value.litType === "number"
                  ? [1, [InputTypes.math_number, String(stmt.value.value)]]
                  : [1, [InputTypes.text, String(stmt.value.value)]],
            }
          : emitExpression(stmt.value);
      return emitSetVar(stmt.name, val, true);
    }
    return { first: null, last: null };
  }

  function emitAssign(stmt) {
    // stmt: { type: 'Assign', name, value }
    if (!stmt || !stmt.value) return { first: null, last: null };
    const value =
      stmt.value.type === "Literal"
        ? {
            type: "lit",
            value:
              stmt.value.litType === "number"
                ? [1, [InputTypes.math_number, String(stmt.value.value)]]
                : [1, [InputTypes.text, String(stmt.value.value)]],
          }
        : emitExpression(stmt.value);
    return emitSetVar(stmt.name, value);
  }

  function emitPrint(node) {
    // MESSAGE should accept expressions. Emit expression first.
    const exprRes = emitExpression(node.expr);
    const hasSecs =
      node.options &&
      (typeof node.options.seconds === "number" ||
        (node.options.seconds && typeof node.options.seconds === "object"));
    const opcode = hasSecs ? "looks_sayforsecs" : "looks_say";

    // create block id early so child reporter parents can be attached
    const id = genId();

    // Build MESSAGE input: either a literal ([1,[type,value]]) or reporter ref ([3, id, shadow])
    let messageInput;
    if (!exprRes) {
      // fallback to empty text
      messageInput = [1, [InputTypes.text, ""]];
    } else if (exprRes.type === "lit") {
      messageInput = exprRes.value;
    } else {
      // reporter: [3, childId, shadow]
      const shadowLit = makeShadowForExpr(node.expr);
      messageInput = [3, exprRes.id, shadowLit];
    }

    const inputs = { MESSAGE: messageInput };

    // Build SECS input (seconds) — accept numeric literal or expression
    if (hasSecs) {
      if (typeof node.options.seconds === "number") {
        inputs.SECS = [1, [InputTypes.math_number, String(node.options.seconds)]];
      } else {
        const secsRes = emitExpression(node.options.seconds);
        if (!secsRes) {
          inputs.SECS = [1, [InputTypes.math_number, "0"]];
        } else if (secsRes.type === "lit") {
          inputs.SECS = secsRes.value;
        } else {
          inputs.SECS = [3, secsRes.id, makeShadowForExpr(node.options.seconds)];
          // attach child parent to this print block
          blocks[secsRes.id].parent = id;
        }
      }
    }

    blocks[id] = { opcode, next: null, parent: null, inputs, fields: {}, shadow: false, topLevel: false };

    // If MESSAGE used a child reporter, set its parent to this print block
    if (exprRes && exprRes.type === "id") {
      blocks[exprRes.id].parent = id;
    }

    return { first: id, last: id };
  }

  // Helper: decide a sensible shadow literal for an expression AST node.
  function makeShadowForExpr(exprNode) {
    if (!exprNode) return [InputTypes.text, ""];
    if (exprNode.type === "Literal") {
      if (exprNode.litType === "number") return [InputTypes.math_number, String(exprNode.value)];
      if (exprNode.litType === "string") return [InputTypes.text, String(exprNode.value)];
      // booleans: use text form
      return [InputTypes.text, String(exprNode.value)];
    }
    // For binary/unary expressions, prefer numeric shadow if it's a math op, otherwise text
    if (exprNode.type === "Binary") {
      if (["+", "-", "*", "/", "**"].includes(exprNode.op)) return [InputTypes.math_number, "0"];
      return [InputTypes.text, ""];
    }
    if (exprNode.type === "Unary") {
      if (exprNode.op === "!") return [InputTypes.text, "false"];
      return [InputTypes.text, ""];
    }
    return [InputTypes.text, ""];
  }
  // Map an operator token to the Scratch opcode for that operator
  function mapOpToOpcode(op) {
    switch (op) {
      case ">":
        return "operator_gt";
      case "<":
        return "operator_lt";
      case ">=":
        return "operator_gtorequal";
      case "<=":
        return "operator_ltorequal";
      case "==":
      case "===":
        return "operator_equals";
      case "!=":
      case "!==":
        return "operator_notequal";
      case "&&":
        return "operator_and";
      case "||":
        return "operator_or";
      case "!":
        return "operator_not";
      case "+":
        return "operator_add";
      case "-":
        return "operator_subtract";
      case "*":
        return "operator_multiply";
      case "/":
        return "operator_divide";
      case "**":
        return "operator_power";
      default:
        throw new Error("emit: unsupported operator " + op);
    }
  }

  // Emit an expression AST node into either a literal description or a reporter block id.
  // Returns { type: 'lit', value: [1,[typeCode, stringValue]] } or { type: 'id', id }
  function emitExpression(exprNode) {
    if (!exprNode) return null;
    if (exprNode.type === "Var") {
      return emitGetVar(exprNode.name, exprNode);
    }
    if (exprNode.type === "Ternary") {
      // Emit conditional reporter: control_if_return_else_return
      // cond ? thenExpr : elseExpr
      const condRes = emitExpression(exprNode.cond);
      if (!condRes) throw new Error("emitExpression: ternary condition missing");
      // ensure condition is a reporter id; if it's a literal, coerce it by emitting a boolean shadow block
      if (condRes.type !== "id") {
        // create boolean shadow (use operator_equals comparing literal to literal false?) — instead use checkbox shadow and a simple boolean shadow
        const boolId = genId();
        // create a tiny boolean block (shadow true/false) depending on truthiness
        const boolOpcode =
          condRes.type === "lit" &&
          condRes.value &&
          condRes.value[1] &&
          String(condRes.value[1][1]) === "true"
            ? "operator_trueBoolean"
            : "operator_falseBoolean";
        blocks[boolId] = {
          opcode: boolOpcode,
          next: null,
          parent: null,
          inputs: {},
          fields: {},
          shadow: true,
          topLevel: true,
        };
        // use that as the condition id
        condRes.id = boolId;
        condRes.type = "id";
      }

      // create a checkbox shadow as the boolean shadow input (like the if emitter)
      const checkboxId = genId();
      const checkboxUnique = Math.random().toString(36).slice(2, 10);
      blocks[checkboxId] = {
        opcode: "checkbox",
        next: null,
        parent: null,
        inputs: {},
        fields: { CHECKBOX: ["FALSE", checkboxUnique] },
        shadow: true,
        topLevel: true,
        x: 329,
        y: 425,
      };

      const id = genId();
      const inputs = {};
      // boolean input uses the cond reporter with the checkbox shadow
      inputs.boolean = [3, condRes.id, checkboxId];

      // Then and Else expressions: can be literals or reporters
      // TEXT1: thenExpr
      if (!exprNode.thenExpr) inputs.TEXT1 = [1, [InputTypes.text, ""]];
      else if (exprNode.thenExpr.type === "Literal") {
        const t = exprNode.thenExpr;
        inputs.TEXT1 =
          t.litType === "number"
            ? [1, [InputTypes.math_number, String(t.value)]]
            : [1, [InputTypes.text, String(t.value)]];
      } else {
        const thenRes = emitExpression(exprNode.thenExpr);
        if (!thenRes) inputs.TEXT1 = [1, [InputTypes.text, ""]];
        else if (thenRes.type === "lit") inputs.TEXT1 = thenRes.value;
        else {
          inputs.TEXT1 = [3, thenRes.id, makeShadowForExpr(exprNode.thenExpr)];
          blocks[thenRes.id].parent = id;
        }
      }

      // TEXT2: elseExpr
      if (!exprNode.elseExpr) inputs.TEXT2 = [1, [InputTypes.text, ""]];
      else if (exprNode.elseExpr.type === "Literal") {
        const t = exprNode.elseExpr;
        inputs.TEXT2 =
          t.litType === "number"
            ? [1, [InputTypes.math_number, String(t.value)]]
            : [1, [InputTypes.text, String(t.value)]];
      } else {
        const elseRes = emitExpression(exprNode.elseExpr);
        if (!elseRes) inputs.TEXT2 = [1, [InputTypes.text, ""]];
        else if (elseRes.type === "lit") inputs.TEXT2 = elseRes.value;
        else {
          inputs.TEXT2 = [3, elseRes.id, makeShadowForExpr(exprNode.elseExpr)];
          blocks[elseRes.id].parent = id;
        }
      }

      blocks[id] = {
        opcode: "control_if_return_else_return",
        next: null,
        parent: null,
        inputs,
        fields: {},
        shadow: false,
        topLevel: false,
      };
      // attach condition parent
      blocks[condRes.id].parent = id;
      return { type: "id", id, node: exprNode };
    }
    if (exprNode.type === "Literal") {
      if (exprNode.litType === "boolean") {
        const boolOpcode = exprNode.value ? "operator_trueBoolean" : "operator_falseBoolean";
        const id = genId();
        blocks[id] = {
          opcode: boolOpcode,
          next: null,
          parent: null,
          inputs: {},
          fields: {},
          shadow: true,
          topLevel: true,
        };
        return { type: "id", id, node: exprNode };
      }
      if (exprNode.litType === "number")
        return { type: "lit", value: [1, [InputTypes.math_number, String(exprNode.value)]] };
      return { type: "lit", value: [1, [InputTypes.text, String(exprNode.value)]] };
    }
    if (exprNode.type === "Call") {
      // Special-case `ask(...)` to emit an inline-stack reporter that asks and returns the answer
      if (exprNode.name === "ask") {
        askUsed = true;
        // create sensing_answer reporter
        const answerId = genId();
        blocks[answerId] = {
          opcode: "sensing_answer",
          next: null,
          parent: null,
          inputs: {},
          fields: {},
          shadow: false,
          topLevel: false,
        };

        // create procedures_return block (returns the answer reporter)
        const retId = genId();
        blocks[retId] = {
          opcode: "procedures_return",
          next: null,
          parent: null,
          inputs: { return: [3, answerId, [InputTypes.text, "1"]] },
          fields: {},
          shadow: false,
          topLevel: false,
        };
        blocks[answerId].parent = retId;

        // create sensing_askandwait block with QUESTION argument
        const askId = genId();
        const arg = exprNode.args && exprNode.args[0];
        let qInput = [1, [InputTypes.text, ""]];
        if (arg && arg.type === "Literal") {
          qInput =
            arg.litType === "number"
              ? [1, [InputTypes.math_number, String(arg.value)]]
              : [1, [InputTypes.text, String(arg.value)]];
        } else if (arg) {
          const emitted = emitExpression(arg);
          if (emitted && emitted.type === "lit") qInput = emitted.value;
          else if (emitted && emitted.type === "id") {
            qInput = [3, emitted.id, makeShadowForExpr(arg)];
            blocks[emitted.id].parent = askId;
          }
        }
        blocks[askId] = {
          opcode: "sensing_askandwait",
          next: retId,
          parent: null,
          inputs: { QUESTION: qInput },
          fields: {},
          shadow: false,
          topLevel: false,
        };
        blocks[retId].parent = askId;

        // create inline stack reporter block that wraps SUBSTACK pointing to askId
        const inlineId = genId();
        blocks[inlineId] = {
          opcode: "control_inline_stack_output",
          next: null,
          parent: null,
          inputs: { SUBSTACK: [2, askId] },
          fields: {},
          shadow: false,
          topLevel: false,
        };
        // set parents for the inner blocks
        blocks[askId].parent = inlineId;
        blocks[retId].parent = askId; // already set
        blocks[answerId].parent = retId; // already set

        return { type: "id", id: inlineId, node: exprNode };
      }
      // Emit a reporter block for the call; opcode = name
      const id = genId();
      // Try to use metadata to map positional args -> real input names
      const meta = blocksMeta[exprNode.name];
      let inputs = {};
      if (meta && Array.isArray(meta)) {
        const params = meta[0] || [];
        if (exprNode.args && exprNode.args.length > 0) {
          for (let i = 0; i < exprNode.args.length; i++) {
            const param = params[i] || { name: "INPUT" + (i + 1), type: null };
            const inName = param.name || "INPUT" + (i + 1);
            const a = exprNode.args[i];
            if (!a) {
              inputs[inName] = [1, [InputTypes.text, ""]];
            } else if (a.type === "Literal") {
              if (param.type === "number" || a.litType === "number")
                inputs[inName] = [1, [InputTypes.math_number, String(a.value)]];
              else inputs[inName] = [1, [InputTypes.text, String(a.value)]];
            } else {
              const emitted = emitExpression(a);
              if (!emitted) throw new Error("emitExpression: call arg missing");
              if (emitted.type === "lit") inputs[inName] = emitted.value;
              else {
                inputs[inName] = [3, emitted.id, makeShadowForExpr(a)];
                blocks[emitted.id].parent = id;
              }
            }
          }
        }
      } else {
        // fallback to generic INPUTn mapping
        if (exprNode.args && exprNode.args.length > 0) {
          for (let i = 0; i < exprNode.args.length; i++) {
            const a = exprNode.args[i];
            const inName = "INPUT" + (i + 1);
            if (!a) {
              inputs[inName] = [1, [InputTypes.text, ""]];
            } else if (a.type === "Literal") {
              if (a.litType === "number") inputs[inName] = [1, [InputTypes.math_number, String(a.value)]];
              else inputs[inName] = [1, [InputTypes.text, String(a.value)]];
            } else {
              const emitted = emitExpression(a);
              if (!emitted) throw new Error("emitExpression: call arg missing");
              if (emitted.type === "lit") inputs[inName] = emitted.value;
              else {
                inputs[inName] = [3, emitted.id, makeShadowForExpr(a)];
                blocks[emitted.id].parent = id;
              }
            }
          }
        }
      }
      blocks[id] = {
        opcode: exprNode.name,
        next: null,
        parent: null,
        inputs,
        fields: {},
        shadow: false,
        topLevel: false,
      };
      return { type: "id", id, node: exprNode };
    }
    if (exprNode.type === "Unary") {
      const opcode = mapOpToOpcode(exprNode.op);
      const id = genId();
      const inputs = {};
      const operand = emitExpression(exprNode.operand);
      if (!operand) throw new Error("emitExpression: unary operand missing");
      if (operand.type === "lit") inputs.OPERAND = operand.value;
      else {
        inputs.OPERAND = [3, operand.id, null];
        blocks[operand.id].parent = id;
      }
      blocks[id] = { opcode, next: null, parent: null, inputs, fields: {}, shadow: false, topLevel: false };
      return { type: "id", id, node: exprNode };
    }
    if (exprNode.type === "Binary") {
      // Special-case concatenation overload for Lua-style '..' — if operands are non-numeric, emit expandable join
      if (exprNode.op === "..") {
        // collect flattened operands
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
        const operands = collectConcatOperands(exprNode, []);

        // Determine if all operands are numeric literals — if so, treat as math add
        const allNumericLiterals = operands.every((o) => o.type === "Literal" && o.litType === "number");
        if (!allNumericLiterals) {
          // build expandable join
          const joinId = genId();
          const inputs = {};
          const mutation = { tagName: "mutation", children: [], inputcount: String(operands.length) };
          for (let i = 0; i < operands.length; i++) {
            const name = "INPUT" + (i + 1);
            const opNode = operands[i];
            const emitted = emitExpression(opNode);
            if (!emitted) throw new Error("emitExpression: join operand missing");
            if (emitted.type === "lit") {
              // join expects text inputs; coerce literal to text inner type
              const lit = emitted.value;
              // lit is [1,[typeCode,value]] — replace typeCode with text
              const val = [1, [InputTypes.text, String(lit[1][1])]];
              inputs[name] = val;
            } else {
              // reporter child with a shadow fallback
              const shadow = makeShadowForExpr(opNode);
              inputs[name] = [3, emitted.id, shadow];
              blocks[emitted.id].parent = joinId;
            }
          }
          blocks[joinId] = {
            opcode: "operator_expandablejoininputs",
            next: null,
            parent: null,
            inputs,
            fields: {},
            shadow: false,
            topLevel: false,
            mutation,
          };
          return { type: "id", id: joinId, node: exprNode };
        }
      }

      // General binary handling (math/comparison/logical)
      // if concat operator was used but all operands numeric, treat as numeric add
      const opForBinary =
        exprNode.op === ".." && typeof allNumericLiterals !== "undefined" && allNumericLiterals
          ? "+"
          : exprNode.op;
      const opcode = mapOpToOpcode(opForBinary);
      const id = genId();
      const inputs = {};
      const left = emitExpression(exprNode.left);
      const right = emitExpression(exprNode.right);
      if (!left || !right) throw new Error("emitExpression: binary operands missing");

      const mathOps = new Set([
        "operator_add",
        "operator_subtract",
        "operator_multiply",
        "operator_divide",
        "operator_power",
      ]);
      const leftName = mathOps.has(opcode) ? "NUM1" : "OPERAND1";
      const rightName = mathOps.has(opcode) ? "NUM2" : "OPERAND2";

      if (left.type === "lit") inputs[leftName] = left.value;
      else {
        inputs[leftName] = [3, left.id, null];
        if (!blocks[left.id]) throw new Error("emitExpression: missing left child " + left.id);
        blocks[left.id].parent = id;
      }
      if (right.type === "lit") inputs[rightName] = right.value;
      else {
        inputs[rightName] = [3, right.id, null];
        if (!blocks[right.id]) throw new Error("emitExpression: missing right child " + right.id);
        blocks[right.id].parent = id;
      }

      blocks[id] = { opcode, next: null, parent: null, inputs, fields: {}, shadow: false, topLevel: false };
      return { type: "id", id, node: exprNode };
    }
    throw new Error("emitExpression: unsupported node type " + exprNode.type);
  }

  function emitIf(node) {
    // node.cases: [{cond, thenBlock}, ...]
    const caseSeqs = [];
    for (let i = 0; i < node.cases.length; i++) {
      const cs = node.cases[i];
      caseSeqs.push(emitSequence(cs.thenBlock.body, null));
    }
    let elseSeq = null;
    if (node.elseBlock) elseSeq = emitSequence(node.elseBlock.body, null);

    // Emit condition reporters and checkbox shadows
    const condResArr = [];
    for (let i = 0; i < node.cases.length; i++) {
      const cond = node.cases[i].cond;
      const cres = emitExpression(cond);
      if (!cres) throw new Error("emitIf: condition must be an expression");
      // If literal, coerce to a boolean reporter by creating a shadow boolean block
      if (cres.type !== "id") {
        const boolId = genId();
        const boolOpcode =
          cres.type === "lit" && cres.value && cres.value[1] && String(cres.value[1][1]) === "true"
            ? "operator_trueBoolean"
            : "operator_falseBoolean";
        blocks[boolId] = {
          opcode: boolOpcode,
          next: null,
          parent: null,
          inputs: {},
          fields: {},
          shadow: true,
          topLevel: true,
        };
        cres.id = boolId;
        cres.type = "id";
      }
      condResArr.push(cres);
    }

    // Create checkbox shadows (one per condition) to use as shadows in BOOL inputs
    const checkboxIds = [];
    for (let i = 0; i < condResArr.length; i++) {
      const cid = genId();
      const unique = Math.random().toString(36).slice(2, 10);
      blocks[cid] = {
        opcode: "checkbox",
        next: null,
        parent: null,
        inputs: {},
        fields: { CHECKBOX: ["FALSE", unique] },
        shadow: true,
        topLevel: true,
      };
      checkboxIds.push(cid);
    }

    // Build the control_expandableIf block
    const ifId = genId();
    const inputs = {};
    // For each case, add BOOLi and SUBSTACKi
    for (let i = 0; i < condResArr.length; i++) {
      const idx = i + 1;
      inputs["BOOL" + idx] = [3, condResArr[i].id, checkboxIds[i]];
      inputs["SUBSTACK" + idx] = [2, caseSeqs[i].first || null];
    }
    // Add final SUBSTACK for else if there is an else, else it's omitted
    if (elseSeq) {
      inputs["SUBSTACK" + (condResArr.length + 1)] = [2, elseSeq.first || null];
    }

    const branches = String(condResArr.length + (elseSeq ? 1 : 0));
    const mutation = { tagName: "mutation", children: [], branches };
    mutation["ends-in-else"] = elseSeq ? "true" : "false";

    blocks[ifId] = {
      opcode: "control_expandableIf",
      next: null,
      parent: null,
      inputs,
      fields: {},
      shadow: false,
      topLevel: false,
      mutation,
    };

    // Wire parents for condition reporters and substack firsts
    for (let i = 0; i < condResArr.length; i++) {
      blocks[condResArr[i].id].parent = ifId;
      if (caseSeqs[i].first) blocks[caseSeqs[i].first].parent = ifId;
    }
    if (elseSeq && elseSeq.first) blocks[elseSeq.first].parent = ifId;

    return { first: ifId, last: ifId };
  }

  // top-level: only allow On statements
  for (const s of astStmts) {
    if (s.type !== "On") throw new Error("Top-level must be 'on' statements");
    let opcode = "";
    switch (s.event) {
        case "flag":
            opcode = "event_whenflagclicked";
            break;
        case "stop":
        case "stopped":
            opcode = "event_whenstopclicked";
            break;
        case "click":
        case "clicked":
            opcode = "event_whenthisspriteclicked";
            break;
        default:
            opcode = s.event;
    }
    const eventId = genId();
    const seq = emitSequence(s.body.body, eventId);
    blocks[eventId] = {
      opcode,
      next: seq.first || null,
      parent: null,
      inputs: {},
      fields: {},
      shadow: false,
      topLevel: true,
      x: 0,
      y: 0,
    };
    if (seq.first) blocks[seq.first].parent = eventId;
  }

  return { blocks, variables, askUsed };
}

/* -------------------------
  CLI: glue
--------------------------*/
const input = process.argv[2]
  ? fs.readFileSync(process.argv[2], "utf8")
  : `// example
on("flag", *{
  print("Hello!", {seconds: 2});
  if (1 > 0) {
    print(true, {seconds: 2});
  } else {
    print("false", {seconds: 2});
  }
});
`;
const outJSONLocation = process.argv[3] || path.join(__dirname, "project.json");

// Strip single-line // comments and leading blank lines; strings are parsed directly by the grammar
const cleaned = input.replace(/^\s*\/\/.*$/gm, "").replace(/^\n+/, "");

// Parse with ANTLR and build AST
let ast;
try {
  ast = parseWithAntlr(cleaned);
  //console.log('AST built (ANTLR)');
} catch (e) {
  console.error("Parse/AST error:", (e && e.message) || e);
  if (e && e.stack) console.error(e.stack);
  process.exit(1);
}

// (type checking and casting removed)

// Emit blocks
let emitResult;
try {
  emitResult = emitProject(ast);
  //console.log('Emit OK');
} catch (e) {
  console.error("Emit error:", (e && e.message) || e);
  if (e && e.stack) console.error(e.stack);
  process.exit(1);
}

// Produce final project JSON, preserving exact skeleton
const out = JSON.parse(JSON.stringify(TEMPLATE));
out.targets[1].blocks = emitResult.blocks;
// Never emit native target variables; always use SPtempVars extension for variables.
out.targets[1].variables = {};
// Also remove any template stage variables so the output contains no builtin variables.
out.targets[0].variables = {};
out.targets[0].blocks = out.targets[0].blocks || {};

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

// Write to file
fs.writeFileSync(outJSONLocation, JSON.stringify(out, null, 2), "utf8");
console.log(
  `✅ ${outJSONLocation.split(path.sep).pop()} written with`,
  Object.keys(emitResult.blocks).length,
  "blocks."
);
