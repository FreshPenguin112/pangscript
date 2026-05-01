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
  //console.log("generateFromAst input AST:", JSON.stringify(astStmts, null, 2));
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
  // Attach shadow/noPlaceholder flags from source AST node to pseudocode block
  function attachFlagsToPseudo(obj, src) {
    if (!src || typeof src !== 'object') return obj;
    if (src.shadow !== undefined) obj.shadow = !!src.shadow;
    if (src.noPlaceholder !== undefined) obj.noPlaceholder = !!src.noPlaceholder;
    return obj;
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
      case "While":
        return emitWhile(stmt);
      case "For":
        return emitFor(stmt);
      case "Call":
        return emitCallStmt(stmt);
      case "Declare":
        return emitDeclare(stmt);
      case "Assign":
        return emitAssign(stmt);
      case "On":
        return null;
      case "Break":
        return {
          opcode: 'control_exitLoop'
        };
      // handled at top-level
      default:
        throw new Error("emitStmt: unsupported stmt type " + stmt.type);
    }
  }
  function emitWhile(node) {
    const cres = node.cond ? emitExpression(node.cond) : null;
    if (!cres) throw new Error("emitWhile: missing condition");
    const condVal = cres.type === "lit" ? cres.value : cres.block;
    const body = node.body && node.body.body ? emitSequence(node.body.body) : []; // Keep existing logic
    return attachFlagsToPseudo({
      opcode: "control_while",
      inputs: [condVal, body] // Updated to prefer inputs
    }, node);
  }
  function emitFor(node) {
    // Expect node.init to be a Declare or Assign that names the loop variable
    let varName = "";
    let startVal = 0;
    if (node.init) {
      if (node.init.type === 'Declare' || node.init.type === 'Assign') {
        varName = node.init.name;
        if (node.init.value) {
          const sres = emitExpression(node.init.value);
          startVal = sres ? sres.type === 'lit' ? sres.value : sres.block : 0;
        }
      }
    }
    // Determine end value from condition if pattern matches (e.g., i < N or i > N)
    let endVal = 0;
    if (node.cond) {
      // if cond is Binary and compares varName to a value, use that value
      if (node.cond.type === 'Binary' && node.cond.left && node.cond.left.type === 'Var' && node.cond.left.name === varName) {
        const eres = emitExpression(node.cond.right);
        endVal = eres ? eres.type === 'lit' ? eres.value : eres.block : 0;
      } else {
        const cres = emitExpression(node.cond);
        endVal = cres ? cres.type === 'lit' ? cres.value : cres.block : 0;
      }
    }
    // Determine increment from update (e.g., i = i + 1)
    let incVal = 1;
    if (node.update) {
      if (node.update.type === 'Assign' && node.update.name === varName && node.update.value && node.update.value.type === 'Binary') {
        // i = i + N  or i = i - N
        const bin = node.update.value;
        const right = bin.right ? emitExpression(bin.right) : null;
        const rval = right ? right.type === 'lit' ? right.value : right.block : 1;
        incVal = bin.op === '+' ? rval : bin.op === '-' ? -rval : rval;
      } else {
        const ures = emitExpression(node.update);
        incVal = ures ? ures.type === 'lit' ? ures.value : ures.block : 1;
      }
    }
    // Ensure the loop index variable is known and mark it as thread-scoped
    if (varName) {
      ensureVariable(varName);
      if (varInfo[varName]) varInfo[varName].varType = 'thread';
    }
    const body = node.body && node.body.body ? emitSequence(node.body.body) : [];
    return attachFlagsToPseudo({
      opcode: 'SPtempVars_forVar',
      inputs: ['thread', varName, startVal, endVal, body, incVal] // Updated to prefer inputs
    }, node);
  }
  function emitSetVar(name, valueExpr, vtype = "global", srcNode) {
    ensureVariable(name);
    // If a specific variable scope is requested (e.g., 'thread'), record
    // it in varInfo so subsequent `emitGetVar` will produce the correct
    // `SPtempVars_getVar` reporter with that scope instead of defaulting
    // to 'global'. This ensures constructor/method arg setters marked as
    // thread become thread-scoped lookups when referenced.
    if (varInfo[name]) varInfo[name].varType = vtype || 'global';
    let value;
    if (!valueExpr) value = "";else if (valueExpr.type === "lit") value = valueExpr.value;else if (valueExpr.type === "block") value = valueExpr.block;else value = null;
    const out = {
      opcode: "SPtempVars_setVar",
      inputs: [vtype || "global", String(name), value]
    };
    // Prefer explicit srcNode; fall back to valueExpr.node when available
    const src = srcNode || (valueExpr && valueExpr.node ? valueExpr.node : null);
    return attachFlagsToPseudo(out, src);
  }
  function emitGetVar(name) {
    ensureVariable(name);
    const vtype = varInfo[name] && varInfo[name].varType ? varInfo[name].varType : "global";
    return {
      type: "block",
      block: {
        opcode: "SPtempVars_getVar",
        inputs: [vtype, String(name)]
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
    //console.log(stmt)
    return attachFlagsToPseudo({
      opcode: stmt.name,
      inputs
    }, stmt);
  }
  function emitDeclare(stmt) {
    if (varInfo[stmt.name]) throw new Error("Variable " + stmt.name + " already declared");
    ensureVariable(stmt.name, stmt.kind, stmt.value);
    if (stmt.value) {
      const val = emitExpression(stmt.value);
      return emitSetVar(stmt.name, val, undefined, stmt);
    }
    return null;
  }
  function emitAssign(stmt) {
    if (!stmt || !stmt.value) return null;
    const value = emitExpression(stmt.value);
    // If nested->AST preserved a varType (e.g., 'thread'), forward it to emitSetVar
    if (stmt.varType) return emitSetVar(stmt.name, value, stmt.varType, stmt);
    return emitSetVar(stmt.name, value, undefined, stmt);
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
    return attachFlagsToPseudo({
      opcode,
      inputs
    }, node);
  }
  function emitExpression(exprNode) {
    if (!exprNode) return null;
    // Handle RawArray nodes (produced by nestedToAst for substack-like arrays)
    if (Array.isArray(exprNode) || exprNode && exprNode.type === 'RawArray') {
      const items = Array.isArray(exprNode) ? exprNode : exprNode.value || [];
      // Prefer emitting a jwArray_builder reporter with a SUBSTACK of
      // jwArray_builderAppend stack-children when extension metadata exists.
      if (blocksMeta && blocksMeta['jwArray_builder']) {
        const substack = [];
        for (const el of items) {
          if (!el) continue;
          const rel = emitExpression(el);
          if (!rel) continue;
          const val = rel.type === 'lit' ? rel.value : rel.block;
          const appendBlk = {
            opcode: 'jwArray_builderAppend',
            inputs: [val]
          };
          // copy any source flags onto the append block when available
          if (el && el.shadow !== undefined) appendBlk.shadow = !!el.shadow;
          if (el && el.noPlaceholder !== undefined) appendBlk.noPlaceholder = !!el.noPlaceholder;
          substack.push(appendBlk);
        }
        const builder = {
          opcode: 'jwArray_builder',
          inputs: [{
            opcode: "jwArray_builderCurrent",
            shadow: true,
            noPlaceholder: true
          }, substack]
        };
        if (exprNode && exprNode.shadow !== undefined) builder.shadow = !!exprNode.shadow;
        if (exprNode && exprNode.noPlaceholder !== undefined) builder.noPlaceholder = !!exprNode.noPlaceholder;
        return {
          type: 'block',
          block: builder
        };
      }
      // Fallback: preserve previous behavior (literal/block value array)
      const arr = [];
      for (const el of items) {
        if (!el) continue;
        const rel = emitExpression(el);
        if (!rel) continue;
        if (rel.type === 'lit') arr.push(rel.value);else arr.push(rel.block);
      }
      return {
        type: 'block',
        block: arr
      };
    }
    // debug: removed verbose dump of exprNode
    if (exprNode.type === "Var") return emitGetVar(exprNode.name);
    if (exprNode.type === "Ternary") {
      const condRes = emitExpression(exprNode.cond);
      if (!condRes) throw new Error("emitExpression: ternary condition missing");
      const condVal = condRes.type === "lit" ? condRes.value : condRes.block;
      const thenVal = !exprNode.thenExpr ? "" : exprNode.thenExpr.type === "Literal" ? exprNode.thenExpr.litType === "number" ? Number(exprNode.thenExpr.value) : String(exprNode.thenExpr.value) : emitExpression(exprNode.thenExpr).type === "lit" ? emitExpression(exprNode.thenExpr).value : emitExpression(exprNode.thenExpr).block;
      const elseVal = !exprNode.elseExpr ? "" : exprNode.elseExpr.type === "Literal" ? exprNode.elseExpr.litType === "number" ? Number(exprNode.elseExpr.value) : String(exprNode.elseExpr.value) : emitExpression(exprNode.elseExpr).type === "lit" ? emitExpression(exprNode.elseExpr).value : emitExpression(exprNode.elseExpr).block;
      const blk = {
        opcode: "control_if_return_else_return",
        inputs: [condVal, thenVal, elseVal]
      };
      if (exprNode && exprNode.shadow !== undefined) blk.shadow = !!exprNode.shadow;
      if (exprNode && exprNode.noPlaceholder !== undefined) blk.noPlaceholder = !!exprNode.noPlaceholder;
      return {
        type: "block",
        block: blk,
        node: exprNode
      };
    }
    if (exprNode.type === "Literal") {
      if (exprNode.litType === "boolean") {
        // Represent boolean literals as boolean reporter blocks in pseudocode
        const boolOpcode = exprNode.value ? "operator_trueBoolean" : "operator_falseBoolean";
        const blk = {
          opcode: boolOpcode,
          inputs: []
        };
        if (exprNode && exprNode.shadow !== undefined) blk.shadow = !!exprNode.shadow;
        if (exprNode && exprNode.noPlaceholder !== undefined) blk.noPlaceholder = !!exprNode.noPlaceholder;
        return {
          type: "block",
          block: blk,
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
        if (exprNode && exprNode.shadow !== undefined) inlineBlock.shadow = !!exprNode.shadow;
        if (exprNode && exprNode.noPlaceholder !== undefined) inlineBlock.noPlaceholder = !!exprNode.noPlaceholder;
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
        if (exprNode && exprNode.shadow !== undefined) result.shadow = !!exprNode.shadow;
        if (exprNode && exprNode.noPlaceholder !== undefined) result.noPlaceholder = !!exprNode.noPlaceholder;
        return {
          type: 'block',
          block: result,
          node: exprNode
        };
      }
      if (exprNode.name === "pmOperatorsExpansion_exactlyEqual") pmOperatorsExpansion_used = true;
      // Special handling: if this is a lambda/block constructor, mark its
      // parameter names as thread-scoped before processing the body so that
      // variable lookups inside the lambda use thread-scoped getVar.
      // Special handling: if this is a lambda/block constructor, mark its
      // parameter names as thread-scoped before processing the body so that
      // variable lookups inside the lambda use thread-scoped getVar.
      // Also, ensure the emitted pseudocode uses a jwLambda_arg reporter
      // block (shadow + noPlaceholder) for the ARG input instead of a
      // raw string/array of names — the converter will then create the
      // appropriate reporter child block in project.json.
      let _emitLambdaArgAsBlock = false;
      if (exprNode.name === 'jwLambda_newLambda' || exprNode.name === 'jwLambda_newLambdaR') {
        const firstArg = exprNode.args && exprNode.args[0];
        const paramNames = [];
        if (firstArg) {
          if (firstArg.type === 'Literal') paramNames.push(String(firstArg.value));else if (firstArg.type === 'RawArray' && Array.isArray(firstArg.value)) {
            for (const el of firstArg.value) {
              if (el && el.type === 'Literal') paramNames.push(String(el.value));
            }
          }
        }
        for (const pn of paramNames) {
          if (!pn) continue;
          ensureVariable(pn);
          if (varInfo[pn]) varInfo[pn].varType = 'thread';
        }
        // request emitting a jwLambda_arg reporter for the first ARG slot
        _emitLambdaArgAsBlock = true;
      }
      if (exprNode.args && exprNode.args.length > 0) {
        for (let ai = 0; ai < exprNode.args.length; ai++) {
          const a = exprNode.args[ai];
          if (!a) {
            inputs.push("");
            continue;
          }
          // If requested, emit a jwLambda_arg reporter block for the
          // first ARG slot of new-lambda nodes instead of passing a
          // raw string/array of names. This keeps the ARG consistently
          // as a reporter block for downstream conversion.
          if (_emitLambdaArgAsBlock && ai === 0) {
            const argBlock = {
              opcode: 'jwLambda_arg',
              inputs: [],
              shadow: true,
              noPlaceholder: true
            };
            inputs.push(argBlock);
            continue;
          }
          // Support RawArray produced by nestedToAst when an argument
          // was originally a substack/array of nested blocks. Convert
          // each element via emitExpression and push the resulting
          // block/literal values as an array so pseudocodeToProject
          // recognizes substack inputs.
          if (a.type === "RawArray") {
            const arr = [];
            for (const el of a.value) {
              if (!el) continue;
              const rel = emitExpression(el);
              if (!rel) continue;
              if (rel.type === "lit") arr.push(rel.value);else arr.push(rel.block);
            }
            inputs.push(arr);
            continue;
          }
          if (a.type === "Literal") {
            if (a.litType === "number") {
              inputs.push(Number(a.value));
            } else if (a.litType === "boolean") {
              const boolOpcode = a.value ? "operator_trueBoolean" : "operator_falseBoolean";
              inputs.push({
                opcode: boolOpcode,
                inputs: []
              });
            } else {
              inputs.push(String(a.value));
            }
          } else {
            const r = emitExpression(a);
            if (!r) inputs.push("");else if (r.type === "lit") inputs.push(r.value);else inputs.push(r.block);
          }
        }
      }
      const blk = {
        opcode: exprNode.name,
        inputs
      };
      if (exprNode && exprNode.shadow !== undefined) blk.shadow = !!exprNode.shadow;
      if (exprNode && exprNode.noPlaceholder !== undefined) blk.noPlaceholder = !!exprNode.noPlaceholder;
      return {
        type: "block",
        block: blk,
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
        const blk = {
          opcode: 'operator_subtract',
          inputs: [0, rightVal]
        };
        if (exprNode && exprNode.shadow !== undefined) blk.shadow = !!exprNode.shadow;
        if (exprNode && exprNode.noPlaceholder !== undefined) blk.noPlaceholder = !!exprNode.noPlaceholder;
        return {
          type: 'block',
          block: blk,
          node: exprNode
        };
      }
      // other unary ops (!, ~)
      const opcode = mapOpToOpcode(op);
      if (String(opcode).startsWith('pmOperatorsExpansion_')) pmOperatorsExpansion_used = true;
      const opVal = operand.type === "lit" ? operand.value : operand.block;
      const blk = {
        opcode,
        inputs: [opVal]
      };
      if (exprNode && exprNode.shadow !== undefined) blk.shadow = !!exprNode.shadow;
      if (exprNode && exprNode.noPlaceholder !== undefined) blk.noPlaceholder = !!exprNode.noPlaceholder;
      return {
        type: "block",
        block: blk,
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
        const blk = {
          opcode: 'operator_expandablejoininputs',
          inputs: parts,
          mutation: {
            inputcount: String(parts.length)
          }
        };
        if (exprNode && exprNode.shadow !== undefined) blk.shadow = !!exprNode.shadow;
        if (exprNode && exprNode.noPlaceholder !== undefined) blk.noPlaceholder = !!exprNode.noPlaceholder;
        return {
          type: 'block',
          block: blk,
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
      const blk = {
        opcode,
        inputs: [leftVal, rightVal]
      };
      if (exprNode && exprNode.shadow !== undefined) blk.shadow = !!exprNode.shadow;
      if (exprNode && exprNode.noPlaceholder !== undefined) blk.noPlaceholder = !!exprNode.noPlaceholder;
      return {
        type: "block",
        block: blk,
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
      mutation // Updated to prefer inputs
    };
  }
  const outBlocks = [];
  for (const s of astStmts) {
    if (s.type === "On") {
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
    } else {
      // Top-level non-event statement(s): emit as top-level blocks
      const emitted = emitStmt(s);
      if (!emitted) continue;
      if (Array.isArray(emitted)) {
        for (const e of emitted) {
          if (e && typeof e === 'object') e.topLevel = true;
          outBlocks.push(e);
        }
      } else {
        if (emitted && typeof emitted === 'object') emitted.topLevel = true;
        outBlocks.push(emitted);
      }
    }
  }
  //console.log("generateFromAst output blocks:", JSON.stringify(outBlocks, null, 2));
  return {
    blocks: outBlocks,
    variables,
    askUsed,
    pmOperatorsExpansion_used
  };
}

// Convert a nested JSON description to the internal AST expected by generateFromAst
function nestedToAst(nestedArray) {
  function copyFlagsToAst(out, src) {
    if (!src || typeof src !== 'object') return out;
    if (src.shadow !== undefined) out.shadow = !!src.shadow;
    if (src.noPlaceholder !== undefined) out.noPlaceholder = !!src.noPlaceholder;
    return out;
  }
  function convArg(a) {
    // Preserve raw arrays (substack-like lists) so they survive conversion
    // through to generateFromAst.emitExpression. Convert elements recursively.
    if (Array.isArray(a)) {
      return {
        type: "RawArray",
        value: a.map(convArg)
      };
    }
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
      const argsArr = Array.isArray(a.inputs) ? a.inputs : [];
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
      const callNode = {
        type: "Call",
        name: opcode,
        args
      };
      copyFlagsToAst(callNode, a);
      return callNode;
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
    // Support while loop shape: control_while with inputs [cond, substack]
    if (op === 'control_while') {
      const inputsArr = Array.isArray(node.inputs) ? node.inputs : [];
      const condNode = inputsArr[0] !== undefined ? convArg(inputsArr[0]) : {
        type: 'Literal',
        litType: 'boolean',
        value: false
      };
      const substack = inputsArr[1] !== undefined ? inputsArr[1] : Array.isArray(node.children) ? node.children : [];
      const body = Array.isArray(substack) ? substack.map(convStmt).filter(Boolean) : [];
      return copyFlagsToAst({
        type: 'While',
        cond: condNode,
        body: {
          type: 'Block',
          body
        }
      }, node);
    }
    // Support for-loop shape emitted as SPtempVars_forVar: [TYPE, NAME, START, END, SUBSTACK, INC_VALUE]
    if (op === 'SPtempVars_forVar' || op === 'forVar') {
      const argsArr = Array.isArray(node.inputs) ? node.inputs : [];
      const nameRaw = argsArr[1] !== undefined ? argsArr[1] : "";
      const startRaw = argsArr[2] !== undefined ? argsArr[2] : 0;
      const endRaw = argsArr[3] !== undefined ? argsArr[3] : 0;
      const substackRaw = argsArr[4] !== undefined ? argsArr[4] : Array.isArray(node.children) ? node.children : [];
      const incRaw = argsArr[5] !== undefined ? argsArr[5] : 1;
      const name = typeof nameRaw === 'string' ? String(nameRaw) : nameRaw && nameRaw.name ? nameRaw.name : 'i';
      const startNode = convArg(startRaw);
      const endNode = convArg(endRaw);
      const incNode = convArg(incRaw);
      const body = Array.isArray(substackRaw) ? substackRaw.map(convStmt).filter(Boolean) : [];
      return copyFlagsToAst({
        type: 'For',
        init: {
          type: 'Declare',
          kind: 'let',
          name,
          value: startNode
        },
        cond: endNode,
        update: incNode,
        body: {
          type: 'Block',
          body
        }
      }, node);
    }
    if (op === 'control_exitLoop') {
      return copyFlagsToAst({
        type: 'Break'
      }, node);
    }
    if (op === "looks_sayforsecs" || op === "looks_say" || op === "say") {
      const msg = Array.isArray(node.inputs) && node.inputs[0] !== undefined ? convArg(node.inputs[0]) : {
        type: "Literal",
        litType: "string",
        value: ""
      };
      const opts = {};
      if (op === "looks_sayforsecs") {
        if (Array.isArray(node.inputs) && node.inputs[1] !== undefined) opts.seconds = convArg(node.inputs[1]);
      }
      return copyFlagsToAst({
        type: "Print",
        expr: msg,
        options: opts
      }, node);
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
        return copyFlagsToAst({
          type: "If",
          cases,
          elseBlock
        }, node);
      }
      const cases = [];
      const inputs = Array.isArray(node.inputs) ? node.inputs : [];
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
      return copyFlagsToAst({
        type: "If",
        cases,
        elseBlock
      }, node);
    }
    if (op === "SPtempVars_setVar" || op === "setVar") {
      // Accept either the full inputs form [TYPE, name, value]
      // or the simplified args form [name, value] produced by stmtToNested.
      let name = "";
      let val = null;
      let varType = null;
      //console.log(node)
      if (Array.isArray(node.inputs) && node.inputs.length >= 3) {
        varType = node.inputs[0] !== undefined ? node.inputs[0] : null;
        name = node.inputs[1] !== undefined ? node.inputs[1] : "";
        val = node.inputs[2] !== undefined ? convArg(node.inputs[2]) : null;
      } else if (Array.isArray(node.inputs) && node.inputs.length >= 2) {
        // simplified form: [name, value]
        name = node.inputs[0] !== undefined ? node.inputs[0] : "";
        val = node.inputs[1] !== undefined ? convArg(node.inputs[1]) : null;
      }
      return copyFlagsToAst({
        type: "Assign",
        name: String(name),
        value: val,
        varType: varType
      }, node);
    }
    return copyFlagsToAst({
      type: "Call",
      name: op,
      args: Array.isArray(node.inputs) ? node.inputs.map(convArg) : []
    }, node);
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
      const children = Array.isArray(item.children) ? item.children : Array.isArray(item.inputs) && Array.isArray(item.inputs[0]) ? item.inputs[0] : [];
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
      // Non-event top-level item: convert to one or more top-level statements
      if (Array.isArray(item.children)) {
        for (const ch of item.children) {
          const st = convStmt(ch);
          if (st) ast.push(st);
        }
      } else if (Array.isArray(item.inputs) && Array.isArray(item.inputs[0])) {
        // some callers may provide children under inputs[0]
        for (const ch of item.inputs[0]) {
          const st = convStmt(ch);
          if (st) ast.push(st);
        }
      } else {
        const st = convStmt(item);
        if (st) ast.push(st);
      }
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