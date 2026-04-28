"use strict";

// generator.js — produce simplified pseudocode blocks (arrays/objects)
// The output is intentionally simpler than Scratch project.json. A separate
// converter will map this pseudocode to real blocks using `blocks.js` metadata.
const blocksMeta = require("../blocks").processedBlocks;
function makeLetterIdGenerator() {
  let n = 0;
  return function nextId() {
    let x = n;
    let s = "";
    while (true) {
      const digit = x % 26;
      s = String.fromCharCode(97 + digit) + s;
      x = Math.floor(x / 26) - 1;
      if (x < 0) break;
    }
    n += 1;
    return s;
  };
}
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
      return "operator_equals";
    case "===":
      return "pmOperatorsExpansion_exactlyEqual";
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
    // Shifts
    case "<<":
      return "pmOperatorsExpansion_shiftLeft";
    case ">>":
      return "pmOperatorsExpansion_shiftRight";
    case ">>>":
      return "urshift";
    // Bitwise
    case "&":
      return "pmOperatorsExpansion_binnaryAnd";
    case "|":
      return "pmOperatorsExpansion_binnaryOr";
    case "^":
      return "pmOperatorsExpansion_binnaryXor";
    case "~":
      return "pmOperatorsExpansion_binnaryNot";
    default:
      throw new Error("emit: unsupported operator " + op);
  }
}

// Convert AST to simple pseudocode block arrays.
// Returns { blocks: Array, variables: Object, askUsed: boolean }
function generateFromAst(astStmts) {
  const genId = makeLetterIdGenerator();
  const variables = {};
  const varInfo = {};
  let askUsed = false;
  // Flag to indicate source used any pmOperatorsExpansion operator (bitwise/shifts/etc.)
  let pmOperatorsExpansion_used = false;
  function ensureVariable(name, kind = "let", initExpr) {
    if (varInfo[name]) return varInfo[name];
    const varKey = genId() + "|" + name;
    let initial = 0;
    if (initExpr && initExpr.type === "Literal" && initExpr.litType === "number") initial = Number(initExpr.value);
    variables[varKey] = [name, initial];
    varInfo[name] = {
      varKey,
      kind
    };
    return varInfo[name];
  }
  function emitSequence(stmts) {
    const seq = [];
    for (const st of stmts) {
      const emitted = emitStmt(st);
      if (!emitted) continue;
      if (Array.isArray(emitted)) seq.push(...emitted);else seq.push(emitted);
    }
    return seq;
  }
  function emitStmt(stmt) {
    if (!stmt) return null;
    switch (stmt.type) {
      case "Print":
        return emitPrint(stmt);
      case "If":
        return emitIf(stmt);
      case "Call":
        return emitCallStmt(stmt);
      case "Declare":
        return emitDeclare(stmt);
      case "Assign":
        return emitAssign(stmt);
      case "On":
        return null;
      // handled at top-level
      default:
        throw new Error("emitStmt: unsupported stmt type " + stmt.type);
    }
  }
  function emitSetVar(name, valueExpr) {
    ensureVariable(name);
    let value;
    if (!valueExpr) value = "";else if (valueExpr.type === "lit") value = valueExpr.value;else if (valueExpr.type === "block") value = valueExpr.block;else value = null;
    return {
      opcode: "SPtempVars_setVar",
      inputs: ["global", String(name), value]
    };
  }
  function emitGetVar(name) {
    ensureVariable(name);
    return {
      type: "block",
      block: {
        opcode: "SPtempVars_getVar",
        inputs: ["global", String(name)]
      },
      node: {
        type: "Var",
        name
      }
    };
  }
  function emitCallStmt(stmt) {
    const inputs = [];
    if (stmt.args && stmt.args.length > 0) {
      for (const arg of stmt.args) {
        if (!arg) {
          inputs.push("");
          continue;
        }
        const res = emitExpression(arg);
        if (!res) {
          inputs.push("");
          continue;
        }
        if (res.type === "lit") inputs.push(res.value);else inputs.push(res.block);
      }
    }
    return {
      opcode: stmt.name,
      inputs
    };
  }
  function emitDeclare(stmt) {
    if (varInfo[stmt.name]) throw new Error("Variable " + stmt.name + " already declared");
    ensureVariable(stmt.name, stmt.kind, stmt.value);
    if (stmt.value) {
      const val = emitExpression(stmt.value);
      return emitSetVar(stmt.name, val);
    }
    return null;
  }
  function emitAssign(stmt) {
    if (!stmt || !stmt.value) return null;
    const value = emitExpression(stmt.value);
    return emitSetVar(stmt.name, value);
  }
  function emitPrint(node) {
    const exprRes = emitExpression(node.expr);
    const hasSecs = node.options && (typeof node.options.seconds === "number" || node.options.seconds && typeof node.options.seconds === "object");
    const opcode = hasSecs ? "looks_sayforsecs" : "looks_say";
    const msg = !exprRes ? "" : exprRes.type === "lit" ? exprRes.value : exprRes.block;
    const inputs = [msg];
    if (hasSecs) {
      if (typeof node.options.seconds === "number") inputs.push(node.options.seconds);else {
        const secsRes = emitExpression(node.options.seconds);
        inputs.push(secsRes && secsRes.type === "lit" ? secsRes.value : secsRes && secsRes.type === "block" ? secsRes.block : 0);
      }
    }
    return {
      opcode,
      inputs
    };
  }
  function emitExpression(exprNode) {
    if (!exprNode) return null;
    //console.log(exprNode);
    if (exprNode.type === "Var") return emitGetVar(exprNode.name);
    if (exprNode.type === "Ternary") {
      const condRes = emitExpression(exprNode.cond);
      if (!condRes) throw new Error("emitExpression: ternary condition missing");
      const condVal = condRes.type === "lit" ? condRes.value : condRes.block;
      const thenVal = !exprNode.thenExpr ? "" : exprNode.thenExpr.type === "Literal" ? exprNode.thenExpr.litType === "number" ? Number(exprNode.thenExpr.value) : String(exprNode.thenExpr.value) : emitExpression(exprNode.thenExpr).type === "lit" ? emitExpression(exprNode.thenExpr).value : emitExpression(exprNode.thenExpr).block;
      const elseVal = !exprNode.elseExpr ? "" : exprNode.elseExpr.type === "Literal" ? exprNode.elseExpr.litType === "number" ? Number(exprNode.elseExpr.value) : String(exprNode.elseExpr.value) : emitExpression(exprNode.elseExpr).type === "lit" ? emitExpression(exprNode.elseExpr).value : emitExpression(exprNode.elseExpr).block;
      return {
        type: "block",
        block: {
          opcode: "control_if_return_else_return",
          inputs: [condVal, thenVal, elseVal]
        },
        node: exprNode
      };
    }
    if (exprNode.type === "Literal") {
      if (exprNode.litType === "boolean") {
        // Represent boolean literals as boolean reporter blocks in pseudocode
        const boolOpcode = exprNode.value ? "operator_trueBoolean" : "operator_falseBoolean";
        return {
          type: "block",
          block: {
            opcode: boolOpcode,
            inputs: []
          },
          node: exprNode
        };
      }
      if (exprNode.litType === "number") return {
        type: "lit",
        value: Number(exprNode.value)
      };
      return {
        type: "lit",
        value: String(exprNode.value)
      };
    }
    if (exprNode.type === "Call") {
      if (exprNode.name === "ask") {
        askUsed = true;
        const arg = exprNode.args && exprNode.args[0];
        const qInput = arg && arg.type === "Literal" ? arg.litType === "number" ? Number(arg.value) : String(arg.value) : arg ? emitExpression(arg).type === "lit" ? emitExpression(arg).value : emitExpression(arg).block : "";
        const askBlock = {
          opcode: "sensing_askandwait",
          inputs: [qInput]
        };
        const answerBlock = {
          opcode: "sensing_answer",
          inputs: []
        };
        const retBlock = {
          opcode: "procedures_return",
          inputs: [answerBlock]
        };
        const inlineBlock = {
          opcode: "control_inline_stack_output",
          inputs: [[askBlock, retBlock]]
        };
        return {
          type: "block",
          block: inlineBlock,
          node: exprNode
        };
      }
      const inputs = [];
      // Special inline handling for unsigned right shift helper `urshift(x,n)`
      if (exprNode.name === 'urshift') {
        const ax = exprNode.args && exprNode.args[0] ? emitExpression(exprNode.args[0]) : null;
        const an = exprNode.args && exprNode.args[1] ? emitExpression(exprNode.args[1]) : null;
        const xVal = ax ? ax.type === 'lit' ? ax.value : ax.block : 0;
        const nVal = an ? an.type === 'lit' ? an.value : an.block : 0;
        // shiftRight = x >> n
        const shiftRight = {
          opcode: 'pmOperatorsExpansion_shiftRight',
          inputs: [xVal, nVal]
        };
        // innerNot = ~0
        const innerNot = {
          opcode: 'pmOperatorsExpansion_binnaryNot',
          inputs: [0]
        };
        // subtract = 32 - n
        const subtract = {
          opcode: 'operator_subtract',
          inputs: [32, nVal]
        };
        // shifted = innerNot << (32 - n)
        const shifted = {
          opcode: 'pmOperatorsExpansion_shiftLeft',
          inputs: [innerNot, subtract]
        };
        // mask = ~( shifted )
        const mask = {
          opcode: 'pmOperatorsExpansion_binnaryNot',
          inputs: [shifted]
        };
        // result = (x >> n) & mask
        const result = {
          opcode: 'pmOperatorsExpansion_binnaryAnd',
          inputs: [shiftRight, mask]
        };
        pmOperatorsExpansion_used = true;
        return {
          type: 'block',
          block: result,
          node: exprNode
        };
      }
      if (exprNode.name === "pmOperatorsExpansion_exactlyEqual") pmOperatorsExpansion_used = true;
      if (exprNode.args && exprNode.args.length > 0) {
        for (const a of exprNode.args) {
          if (!a) {
            inputs.push("");
            continue;
          }
          if (a.type === "Literal") {
            if (a.litType === "number") {
              inputs.push(Number(a.value));
            } else if (a.litType === "boolean") {
              // represent boolean literal as boolean reporter block
              const boolOpcode = a.value ? "operator_trueBoolean" : "operator_falseBoolean";
              inputs.push({
                opcode: boolOpcode,
                inputs: []
              });
            } else {
              // string/other -> keep as string literal
              inputs.push(String(a.value));
            }
          } else {
            const r = emitExpression(a);
            if (!r) inputs.push("");else if (r.type === "lit") inputs.push(r.value);else inputs.push(r.block);
          }
        }
      }
      return {
        type: "block",
        block: {
          opcode: exprNode.name,
          inputs
        },
        node: exprNode
      };
    }
    if (exprNode.type === "Unary") {
      const op = exprNode.op;
      const operand = emitExpression(exprNode.operand);
      if (!operand) throw new Error("emitExpression: unary operand missing");
      // unary + : no-op (coerce to number if literal)
      if (op === '+') {
        if (operand.type === 'lit' && typeof operand.value === 'number') return {
          type: 'lit',
          value: Number(operand.value)
        };
        return operand;
      }
      // unary - : negate literal or emit 0 - operand
      if (op === '-') {
        if (operand.type === 'lit' && typeof operand.value === 'number') return {
          type: 'lit',
          value: -operand.value
        };
        const rightVal = operand.type === 'lit' ? operand.value : operand.block;
        return {
          type: 'block',
          block: {
            opcode: 'operator_subtract',
            inputs: [0, rightVal]
          },
          node: exprNode
        };
      }
      // other unary ops (!, ~)
      const opcode = mapOpToOpcode(op);
      if (String(opcode).startsWith('pmOperatorsExpansion_')) pmOperatorsExpansion_used = true;
      const opVal = operand.type === "lit" ? operand.value : operand.block;
      return {
        type: "block",
        block: {
          opcode,
          inputs: [opVal]
        },
        node: exprNode
      };
    }
    if (exprNode.type === "Binary") {
      // Record if the source used strict equality '===' so index.js can add
      // the pmOperatorsExpansion extension when needed.
      //console.log(exprNode.op)

      if (exprNode.op === '===') pmOperatorsExpansion_used = true;
      if (exprNode.op === "..") {
        function collectConcatOperands(node, acc) {
          if (node.type === "Binary" && node.op === "..") {
            collectConcatOperands(node.left, acc);
            collectConcatOperands(node.right, acc);
          } else acc.push(node);
          return acc;
        }
        const operands = collectConcatOperands(exprNode, []);
        // Emit an expandable join reporter with mutation.inputcount for all concat chains.
        const parts = operands.map(op => {
          if (op.type === 'Literal') {
            if (op.litType === 'number') return {
              literal: [Number(op.value), 'number']
            };
            return {
              literal: [String(op.value), 'text']
            };
          }
          const r = emitExpression(op);
          if (!r) return {
            literal: ['', 'text']
          };
          if (r.type === 'lit') return {
            literal: [r.value, 'text']
          };
          return {
            block: r.block
          };
        });
        return {
          type: 'block',
          block: {
            opcode: 'operator_expandablejoininputs',
            inputs: parts,
            mutation: {
              inputcount: String(parts.length)
            }
          },
          node: exprNode
        };
      }
      const opcode = mapOpToOpcode(exprNode.op === ".." ? "+" : exprNode.op);
      const left = emitExpression(exprNode.left);
      const right = emitExpression(exprNode.right);
      if (!left || !right) throw new Error("emitExpression: binary operands missing");
      const leftVal = left.type === "lit" ? left.value : left.block;
      const rightVal = right.type === "lit" ? right.value : right.block;
      if (String(opcode).startsWith('pmOperatorsExpansion_')) pmOperatorsExpansion_used = true;
      return {
        type: "block",
        block: {
          opcode,
          inputs: [leftVal, rightVal]
        },
        node: exprNode
      };
    }
    throw new Error("emitExpression: unsupported node type " + exprNode.type);
  }
  function emitIf(node) {
    const caseSeqs = node.cases.map(c => emitSequence(c.thenBlock.body));
    const elseSeq = node.elseBlock ? emitSequence(node.elseBlock.body) : null;
    const cases = [];
    for (let i = 0; i < node.cases.length; i++) {
      const c = node.cases[i];
      const cres = emitExpression(c.cond);
      if (!cres) throw new Error("emitIf: condition must be an expression");
      const condVal = cres.type === "lit" ? cres.value : cres.block;
      const thenBlocks = caseSeqs[i] || [];
      cases.push({
        cond: condVal,
        then: thenBlocks
      });
    }
    const mutation = {
      branches: String(cases.length + (elseSeq ? 1 : 0)),
      "ends-in-else": String(!!elseSeq)
    };
    return {
      opcode: "control_expandableIf",
      cases,
      else: elseSeq || null,
      mutation
    };
  }
  const outBlocks = [];
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
    const children = emitSequence(s.body.body);
    outBlocks.push({
      opcode,
      children
    });
  }
  return {
    blocks: outBlocks,
    variables,
    askUsed,
    pmOperatorsExpansion_used
  };
}

// Convert a nested JSON description to the internal AST expected by generateFromAst
function nestedToAst(nestedArray) {
  function convArg(a) {
    if (a == null) return {
      type: "Literal",
      litType: "string",
      value: ""
    };
    if (typeof a === "string") return {
      type: "Literal",
      litType: "string",
      value: a
    };
    if (typeof a === "number") return {
      type: "Literal",
      litType: "number",
      value: a
    };
    if (typeof a === "boolean") return {
      type: "Literal",
      litType: "boolean",
      value: a
    };
    if (typeof a === "object") {
      if (a.type && (a.type === "Call" || a.type === "Literal" || a.type === "Var")) return a;
      const opcode = a.opcode || a.name;
      const argsArr = Array.isArray(a.inputs) ? a.inputs : Array.isArray(a.args) ? a.args : [];
      if (opcode === "control_if_return_else_return" || opcode === "if_return_else_return") {
        const condNode = argsArr[0] !== undefined ? convArg(argsArr[0]) : {
          type: "Literal",
          litType: "boolean",
          value: false
        };
        const thenNode = argsArr[1] !== undefined ? convArg(argsArr[1]) : {
          type: "Literal",
          litType: "string",
          value: ""
        };
        const elseNode = argsArr[2] !== undefined ? convArg(argsArr[2]) : {
          type: "Literal",
          litType: "string",
          value: ""
        };
        return {
          type: "Ternary",
          cond: condNode,
          thenExpr: thenNode,
          elseExpr: elseNode
        };
      }
      // Special-case expandable join inputs: convert back into a left-associative
      // Binary chain using '..' so downstream Binary handling emits the
      // operator_expandablejoininputs block with proper mutation/inputcount.
      if (opcode === 'operator_expandablejoininputs') {
        const operands = argsArr.map(convArg);
        if (operands.length === 0) return {
          type: "Literal",
          litType: "string",
          value: ""
        };
        if (operands.length === 1) return operands[0];
        // build left-associative Binary chain: (((a .. b) .. c) .. d)
        let node = {
          type: 'Binary',
          op: '..',
          left: operands[0],
          right: operands[1]
        };
        for (let i = 2; i < operands.length; i++) {
          node = {
            type: 'Binary',
            op: '..',
            left: node,
            right: operands[i]
          };
        }
        return node;
      }
      const args = argsArr.map(convArg);
      return {
        type: "Call",
        name: opcode,
        args
      };
    }
    return {
      type: "Literal",
      litType: "string",
      value: String(a)
    };
  }
  function convStmt(node) {
    if (!node) return null;
    const op = node.opcode || node.name;
    if (op === "looks_sayforsecs" || op === "looks_say" || op === "say") {
      const msg = Array.isArray(node.inputs) && node.inputs[0] !== undefined ? convArg(node.inputs[0]) : node.args && node.args[0] !== undefined ? convArg(node.args[0]) : {
        type: "Literal",
        litType: "string",
        value: ""
      };
      const opts = {};
      if (op === "looks_sayforsecs") {
        if (Array.isArray(node.inputs) && node.inputs[1] !== undefined) opts.seconds = convArg(node.inputs[1]);else if (node.args && node.args[1] !== undefined) opts.seconds = convArg(node.args[1]);
      }
      return {
        type: "Print",
        expr: msg,
        options: opts
      };
    }
    if (op === "if" || op === "control_expandableIf") {
      // Support two shapes:
      // - node.cases / node.else (produced by index.js stmtToNested)
      // - node.inputs / node.args alternating [cond, substack, cond, substack, ..., else?]
      if (Array.isArray(node.cases)) {
        const cases = node.cases.map(c => {
          const condNode = convArg(c.cond);
          const thenBody = Array.isArray(c.then) ? c.then.map(convStmt).filter(Boolean) : c.thenBlock && Array.isArray(c.thenBlock.body) ? c.thenBlock.body.map(convStmt).filter(Boolean) : [];
          return {
            cond: condNode,
            thenBlock: {
              type: "Block",
              body: thenBody
            }
          };
        });
        let elseBlock = null;
        if (node.else) {
          const elseBody = Array.isArray(node.else) ? node.else.map(convStmt).filter(Boolean) : node.elseBlock && Array.isArray(node.elseBlock.body) ? node.elseBlock.body.map(convStmt).filter(Boolean) : [];
          elseBlock = {
            type: "Block",
            body: elseBody
          };
        }
        return {
          type: "If",
          cases,
          elseBlock
        };
      }
      const cases = [];
      const inputs = Array.isArray(node.inputs) ? node.inputs : Array.isArray(node.args) ? node.args : [];
      for (let i = 0; i < inputs.length; i += 2) {
        const cond = inputs[i];
        const substack = inputs[i + 1];
        if (cond === undefined) break;
        const condNode = convArg(cond);
        const thenBlock = {
          type: "Block",
          body: Array.isArray(substack) ? substack.map(convStmt).filter(Boolean) : []
        };
        cases.push({
          cond: condNode,
          thenBlock
        });
      }
      let elseBlock = null;
      if (inputs.length % 2 === 1) {
        const last = inputs[inputs.length - 1];
        elseBlock = {
          type: "Block",
          body: Array.isArray(last) ? last.map(convStmt).filter(Boolean) : []
        };
      }
      return {
        type: "If",
        cases,
        elseBlock
      };
    }
    if (op === "SPtempVars_setVar" || op === "setVar") {
      // Accept either the full inputs form ["global", name, value]
      // or the simplified args form [name, value] produced by stmtToNested.
      let name = "";
      let val = null;
      if (Array.isArray(node.inputs) && node.inputs.length >= 2) {
        name = node.inputs[1] !== undefined ? node.inputs[1] : "";
        val = node.inputs[2] !== undefined ? convArg(node.inputs[2]) : null;
      } else if (Array.isArray(node.args) && node.args.length >= 1) {
        name = node.args[0] !== undefined ? node.args[0] : "";
        val = node.args[1] !== undefined ? convArg(node.args[1]) : null;
      }
      return {
        type: "Assign",
        name: String(name),
        value: val
      };
    }
    return {
      type: "Call",
      name: op,
      args: Array.isArray(node.inputs) ? node.inputs.map(convArg) : Array.isArray(node.args) ? node.args.map(convArg) : []
    };
  }
  const ast = [];
  for (const item of nestedArray) {
    const op = item.opcode || item.name;
    if (op && (op.startsWith("event_") || op === "click" || op === "flag" || op === "event_whenthisspriteclicked")) {
      let event;
      switch (op) {
        case "event_whenflagclicked":
        case "flag":
          event = "flag";
          break;
        case "event_whenstopclicked":
          event = "stop";
          break;
        case "event_whenthisspriteclicked":
        case "click":
          event = "click";
          break;
        default:
          event = op;
      }
      const children = Array.isArray(item.children) ? item.children : Array.isArray(item.inputs) && Array.isArray(item.inputs[0]) ? item.inputs[0] : item.args && Array.isArray(item.args[0]) ? item.args[0] : [];
      const body = {
        type: "Block",
        body: (children || []).map(convStmt).filter(Boolean)
      };
      ast.push({
        type: "On",
        event,
        body
      });
    } else {
      const body = {
        type: "Block",
        body: [convStmt(item)].filter(Boolean)
      };
      ast.push({
        type: "On",
        event: "click",
        body
      });
    }
  }
  return ast;
}
function generateFromNested(nestedArray) {
  const ast = nestedToAst(nestedArray);
  return generateFromAst(ast);
}
module.exports = {
  generateFromAst,
  generateFromNested
};

// Export operator mapping so external callers (index.js) can reuse it
module.exports.mapOpToOpcode = mapOpToOpcode;