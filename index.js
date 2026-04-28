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
    // Accept either an inlineBlock() or a normal block() to be flexible with
    // different parser/grammar shapes.
    let body = null;
    if (ctx.inlineBlock) body = this.visit(ctx.inlineBlock());
    else if (ctx.block) body = this.visit(ctx.block());
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
          } else if (st.ifStmt && st.ifStmt()) {
            stmts.push(this.visit(st.ifStmt()));
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
    // Prefer explicit unary handling for leading unary operators
    if (ctx.children && ctx.children[0] && ctx.children[0].getText) {
      const firstTok = ctx.children[0].getText();
      if (firstTok === "!" || firstTok === "~" || firstTok === "+" || firstTok === "-") {
        return { type: "Unary", op: firstTok, operand: this.visit(ctx.expr(0)) };
      }
    }

    // Ternary conditional: expr '?' expr ':' expr
    if (ctx.children && ctx.children.length === 5) {
      const hasQuestion = ctx.children.some(
        (c) => c && typeof c.getText === "function" && c.getText() === "?"
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
      return (n && typeof n.expr === 'function' && n.expr(0) && n.expr(1) && n.children && n.children.length === 3 && n.children[1].getText() !== '?' );
    }

    function helper(n) {
      if (!n) return;
      if (isBinaryNode(n)) {
        helper(n.expr(0));
        operators.push(n.children[1].getText());
        helper(n.expr(1));
      } else {
        // atomic node: handle primary/function/print/ident/number/string specially
        if (typeof n.primary === 'function' && n.primary()) {
          operands.push(self.visit(n.primary()));
          return;
        }
        if (typeof n.functionCall === 'function' && n.functionCall()) {
          operands.push(self.visit(n.functionCall()));
          return;
        }
        if (typeof n.printCall === 'function' && n.printCall()) {
          operands.push(self.visit(n.printCall()));
          return;
        }
        if (n.NUMBER && typeof n.NUMBER === 'function' && n.NUMBER()) {
          operands.push({ type: 'Literal', litType: 'number', value: Number(n.NUMBER().getText()) });
          return;
        }
        if (n.STRING && typeof n.STRING === 'function' && n.STRING()) {
          const s = n.STRING().getText();
          try { operands.push({ type: 'Literal', litType: 'string', value: JSON.parse(s) }); return; } catch (e) { operands.push({ type: 'Literal', litType: 'string', value: s.replace(/^"|"$/g, "") }); return; }
        }
        if (n.getText && (n.getText() === 'true' || n.getText() === 'false')) { operands.push({ type: 'Literal', litType: 'boolean', value: n.getText() === 'true' }); return; }
        if (n.IDENT && typeof n.IDENT === 'function' && n.IDENT()) { operands.push({ type: 'Var', name: n.IDENT().getText() }); return; }
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
      ["||"]
    ];

    let values = operands.slice();
    let ops = operators.slice();

    for (let level = 0; level < PRECEDENCE_LEVELS.length; level++) {
      const levelOps = PRECEDENCE_LEVELS[level];
      const rightAssoc = (level === 0); // `**` is right-associative
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
// Delegate block/project generation to lib/generator.js so index.js contains no
// manual block generation logic.
const generator = require("./lib/generator");

/* -------------------------
  CLI: glue
--------------------------*/
const input = process.argv[2]
  ? fs.readFileSync(process.argv[2], "utf8")
  : fs.readFileSync(path.join(__dirname, "test.ps"), "utf8");
const outJSONLocation = process.argv[3] || path.join(__dirname, "project.json");

// Do not strip comments here; ANTLR grammar handles both // and /* */ comments via lexer rules.
const cleaned = input;

// Decide whether input is nested JSON or source code. We must always use
// nested JSON internally, so convert any parsed AST into nested JSON first.
let nestedInput = null;
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
  } catch (e) {
    console.error("Parse/AST error:", (e && e.message) || e);
    if (e && e.stack) console.error(e.stack);
    process.exit(1);
  }

  // Debug: locate any Print statements that contain concat '..' expressions
  function containsConcat(node) {
    if (!node) return false;
    if (node.type === 'Binary' && node.op === '..') return true;
    if (node.type === 'Binary') return containsConcat(node.left) || containsConcat(node.right);
    if (node.type === 'Ternary') return containsConcat(node.cond) || containsConcat(node.thenExpr) || containsConcat(node.elseExpr);
    if (node.type === 'Unary') return containsConcat(node.operand);
    if (node.type === 'Call' && Array.isArray(node.args)) return node.args.some(containsConcat);
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
        case 'Declare':
          if (stmt.kind === 'const') {
            consts.add(stmt.name);
          }
          break;
        case 'Assign':
          if (consts.has(stmt.name)) {
            throw new Error(`Cannot reassign to const '${stmt.name}'`);
          }
          break;
        case 'If':
          for (const c of stmt.cases) {
            walkExpression(c.cond);
            walkStatement(c.thenBlock && c.thenBlock.body);
          }
          if (stmt.elseBlock) walkStatement(stmt.elseBlock.body);
          break;
        case 'Block':
          for (const s of stmt.body || []) walkStatement(s);
          break;
        case 'On':
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
        case 'Binary':
          walkExpression(expr.left);
          walkExpression(expr.right);
          break;
        case 'Unary':
          walkExpression(expr.operand);
          break;
        case 'Ternary':
          walkExpression(expr.cond);
          walkExpression(expr.thenExpr);
          walkExpression(expr.elseExpr);
          break;
        case 'Call':
          for (const a of expr.args || []) walkExpression(a);
          break;
        default:
          break;
      }
    }

    for (const node of rootAst) {
      if (node && node.type === 'On' && node.body && node.body.body) {
        for (const st of node.body.body) walkStatement(st);
      } else {
        walkStatement(node);
      }
    }
  }

  try {
    enforceConstImmutability(ast);
  } catch (e) {
    console.error('Const assignment error:', e.message);
    process.exit(1);
  }

  // Convert AST to nested JSON form (canonical representation generator expects)
  function exprToNested(expr) {
    if (!expr) return "";
    if (expr.type === "Literal") return expr.value;
    if (expr.type === "Var") return { type: "Var", name: expr.name };
    if (expr.type === "Call") {
      const name = expr.name;
      // Lookup block metadata to learn param ordering and shape
      const meta = blocksMeta[name] || blocksMeta[name.replace(/^operator_/, "operator_")] || null;
      const params = meta ? meta[0] : null;
      const shape = meta ? meta[1] : null;

      if (Array.isArray(params) && params.length > 0) {
        const argsArr = [];
        for (let i = 0; i < params.length; i++) {
          const a = expr.args && expr.args[i] !== undefined ? expr.args[i] : undefined;
          argsArr.push(a === undefined ? "" : exprToNested(a));
        }
        // append any extra positional args after declared params
        if (expr.args && expr.args.length > params.length) {
          for (let i = params.length; i < expr.args.length; i++) argsArr.push(exprToNested(expr.args[i]));
        }
        return { opcode: name, args: argsArr, __shape: shape };
      }

      return { opcode: name, args: (expr.args || []).map(exprToNested), __shape: shape };
    }
    if (expr.type === "Ternary") {
      // Represent ternary using positional args so nested objects are preserved
      return {
        opcode: "control_if_return_else_return",
        args: [exprToNested(expr.cond), exprToNested(expr.thenExpr), exprToNested(expr.elseExpr)]
      };
    }
    if (expr.type === "Unary") {
      // Handle unary +/-. For +, just return the operand. For - with a numeric
      // literal, return a negative literal so the converter emits a single
      // numeric shadow (e.g. -9). For non-literal operands, emit a
      // subtract call with a blank first arg so the converter produces a
      // block with NUM1 blank and NUM2 referencing the operand block.
      if (expr.op === "+") return exprToNested(expr.operand);
      if (expr.op === "-") {
        const opd = expr.operand;
        if (opd && opd.type === "Literal" && opd.litType === "number") {
          return -Number(opd.value);
        }
        // produce args ["", operand] to make NUM1 blank and NUM2 the block
        return { opcode: generator.mapOpToOpcode(expr.op), args: ["", exprToNested(opd)] };
      }
      // other unary ops (!, ~)
      const op = generator.mapOpToOpcode(expr.op);
      return { opcode: op, args: [exprToNested(expr.operand)] };
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
        const nestedParts = operands.map((o) => exprToNested(o));
        return { opcode: "operator_expandablejoininputs", inputs: nestedParts, mutation: { inputcount: String(operands.length) } };
      }
      const op = generator.mapOpToOpcode(expr.op);
      return { opcode: op, args: [exprToNested(expr.left), exprToNested(expr.right)] };
    }
    return "";
  }

  function stmtToNested(stmt) {
    if (!stmt) return null;
    if (stmt.type === "Print") {
      const msg = exprToNested(stmt.expr);
      const seconds = stmt.options && stmt.options.seconds !== undefined ? stmt.options.seconds : undefined;
      const opcode = seconds !== undefined ? "looks_sayforsecs" : "looks_say";
      const node = { opcode, args: [msg] };
      if (seconds !== undefined) node.args.push(seconds);
      return node;
    }
    if (stmt.type === "If") {
      const node = { opcode: "if", cases: [] };
      for (const c of stmt.cases) {
        node.cases.push({ cond: exprToNested(c.cond), then: (c.thenBlock.body || []).map(stmtToNested).filter(Boolean) });
      }
      if (stmt.elseBlock) node.else = (stmt.elseBlock.body || []).map(stmtToNested).filter(Boolean);
      return node;
    }
    if (stmt.type === "Call") return { opcode: stmt.name, args: (stmt.args || []).map(exprToNested) };
    if (stmt.type === "Declare") {
      if (stmt.value)
        return { opcode: "SPtempVars_setVar", args: [stmt.name, exprToNested(stmt.value)] };
      return { opcode: "SPtempVars_setVar", args: [stmt.name, ""] };
    }
    if (stmt.type === "Assign") return { opcode: "SPtempVars_setVar", args: [stmt.name, exprToNested(stmt.value)] };
    return { opcode: stmt.type, args: [] };
  }

  // top-level AST is list of On nodes
  nestedInput = ast.map((s) => {
    if (s.type === "On") {
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
      const children = (s.body && s.body.body ? s.body.body.map(stmtToNested).filter(Boolean) : []);
      return { opcode, children };
    }
    // fallback wrap
    return { opcode: "event_whenthisspriteclicked", children: [stmtToNested(s)].filter(Boolean) };
  });
}

// Now always use nested input for generation
let emitResult;
try {
  emitResult = generator.generateFromNested(nestedInput);
  //console.log(JSON.stringify(emitResult, null, 2));
} catch (e) {
  console.error("Emit error:", (e && e.message) || e);
  if (e && e.stack) console.error(e.stack);
  process.exit(1);
}

// Convert pseudocode blocks into a real project.json `blocks` object
const pseudoConverter = require('./lib/pseudocodeToProject');
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
if (emitResult && (emitResult.pmOperatorsExpansion_used)) {
  out.extensions = out.extensions || [];
  if (!out.extensions.includes("pmOperatorsExpansion")) out.extensions.push("pmOperatorsExpansion");
}

// Write to file or package as .pmp (zip)
if (String(outJSONLocation).toLowerCase().endsWith('.pmp')) {
  const pmpPath = outJSONLocation;
  const assetsDir = path.join(__dirname, 'startingAssets');

  // create output stream for zip
  const output = fs.createWriteStream(pmpPath);
  const archive = ensureArchiver()('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`✅ ${path.basename(pmpPath)} written (${archive.pointer()} bytes)`);
    //console.log(Object.keys(emitResult.blocks).length, 'blocks included in project.json.');
  });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') console.warn(err.message);
    else throw err;
  });
  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  // Add project.json from memory
  archive.append(JSON.stringify(out, null, 2), { name: 'project.json' });

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
    })(assetsDir, '');
  } else {
    console.warn(`⚠️ startingAssets directory not found at ${assetsDir} — .pmp will only contain project.json`);
  }

  // Also write companion project.json next to the .pmp so file on disk
  // matches the packaged project (helpful for inspection/debugging).
  const companionJson = path.join(path.dirname(pmpPath), 'project.json');
  fs.writeFileSync(companionJson, JSON.stringify(out, null, 2), 'utf8');
  console.log(`✅ ${path.basename(companionJson)} written next to ${path.basename(pmpPath)}`);

  archive.finalize();
} else {
  fs.writeFileSync(outJSONLocation, JSON.stringify(out, null, 2), "utf8");
  console.log(
    `✅ ${outJSONLocation.split(path.sep).pop()} written with`,
    Object.keys(emitResult.blocks).length,
    "blocks."
  );
}
