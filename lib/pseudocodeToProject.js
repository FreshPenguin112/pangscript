"use strict";

// Convert simplified pseudocode blocks (array of {opcode, inputs, children, mutation})
// into a Scratch-style `blocks` object suitable for placing in project.json.
// This is intentionally minimal: it creates block entries with generated ids,
// maps positional inputs to the processedBlocks metadata from blocks.js, and
// nests children as statement inputs when the target block has substack params.
const blocksMeta = require("../blocks").processedBlocks;
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
  data_listcontents: 13
};
function makeFieldId() {
  return Math.random().toString(36).slice(2, 10);
}
function typeCodeForParam(p) {
  if (!p) return InputTypes.text;
  const name = String(p.name || "").toUpperCase();
  if (name.includes("NUM") || name.includes("SECS") || p.type && String(p.type).toLowerCase().includes("number")) return InputTypes.math_number;
  return InputTypes.text;
}
function makeId() {
  // generate short ids like a, b, c, ..., aa, ab, ... plus a suffix
  let n = 0;
  return function next() {
    let x = n++;
    let s = "";
    while (true) {
      const d = x % 26;
      s = String.fromCharCode(97 + d) + s;
      x = Math.floor(x / 26) - 1;
      if (x < 0) break;
    }
    return s + "_" + Math.random().toString(36).slice(2, 6);
  };
}
function makeShadowForParam(param) {
  // Create sensible shadow placeholders for common param shapes.
  if (!param) return null;
  if (param.type === "substack") return null;

  // If the param explicitly requests a class-like placeholder by name,
  // provide the `jwClass_self` reporter as a visible class placeholder.
  const pname = String(param.name || "").toUpperCase();
  if (pname === 'POINTER' || pname === 'CLASS' || pname === 'SELF') {
    return {
      opcode: 'jwClass_self',
      inputs: [],
      fields: {},
      shadow: true
    };
  }

  // Numeric inputs -> math_number shadow
  if (param.type === 'number') return {
    opcode: 'math_number',
    inputs: [],
    fields: {},
    shadow: true
  };

  // If a specific shadow opcode was provided via param.shadow, use it
  if (param.shadow && typeof param.shadow === 'string' && param.shadow.length > 0) return {
    opcode: param.shadow,
    inputs: [],
    fields: {},
    shadow: true
  };

  // Fallback: if a field name is present, try using it as opcode (best-effort),
  // otherwise return null (no shadow).
  if (param.field && typeof param.field === 'string' && param.field.length > 0) return {
    opcode: param.field,
    inputs: [],
    fields: {},
    shadow: true
  };
  return null;
}
function convert(pseudocode) {
  //console.log(JSON.stringify(pseudocode, null, 2));
  const idGen = makeId();
  const blocksOut = {};
  function createBlock(obj, parent = null) {
    const id = idGen();
    const entry = {
      opcode: obj.opcode,
      next: null,
      parent: parent,
      inputs: {},
      fields: {},
      shadow: false,
      topLevel: false
    };

    // honor explicit pseudocode-provided shadow flag
    if (obj && obj.shadow !== undefined) entry.shadow = !!obj.shadow;

    // helper to create a top-level checkbox shadow used by expandable-if
    function createCheckbox() {
      const cid = idGen();
      const fid = makeFieldId();
      const cb = {
        id: cid,
        opcode: "checkbox",
        next: null,
        parent: null,
        inputs: {},
        fields: {
          CHECKBOX: ["FALSE", fid]
        },
        shadow: true,
        topLevel: true,
        x: 0,
        y: 0
      };
      blocksOut[cid] = cb;
      return cid;
    }

    // Special-case: expandable if structure emitted by generator.js uses
    // `cases` and `else` arrays. Convert these to BOOL1/SUBSTACK1, BOOL2/SUBSTACK2, ...
    if (obj.opcode === "control_expandableIf") {
      let cases = Array.isArray(obj.cases) ? obj.cases : null;
      let elseBranch = obj.else;
      if (!Array.isArray(cases)) {
        const inputs = obj.inputs;
        if ((!inputs || Object.keys(inputs).length === 0) && !Array.isArray(obj.cases)) {
          console.error("DEBUG_IF_PARSE_MISS", JSON.stringify(obj, null, 2));
        }
        if (Array.isArray(inputs)) {
          cases = [];
          for (let i = 0; i + 1 < inputs.length; i += 2) {
            cases.push({
              cond: inputs[i],
              then: Array.isArray(inputs[i + 1]) ? inputs[i + 1] : []
            });
          }
          if (inputs.length % 2 === 1) {
            const last = inputs[inputs.length - 1];
            elseBranch = Array.isArray(last) ? last : [];
          }
        } else if (inputs && typeof inputs === 'object') {
          const caseIndexes = Object.keys(inputs).map(k => {
            const match = String(k).match(/^BOOL(\d+)$/i);
            return match ? Number(match[1]) : null;
          }).filter(n => n != null).sort((a, b) => a - b);
          if (caseIndexes.length > 0) {
            cases = caseIndexes.map(idx => ({
              cond: inputs[`BOOL${idx}`],
              then: Array.isArray(inputs[`SUBSTACK${idx}`]) ? inputs[`SUBSTACK${idx}`] : []
            }));
            const elseInput = inputs[`SUBSTACK${caseIndexes.length + 1}`];
            if (elseInput !== undefined) elseBranch = Array.isArray(elseInput) ? elseInput : [];
          }
        }
      }
      if (Array.isArray(cases)) {
        // create checkbox shadows first
        const checkboxIds = cases.map(() => createCheckbox());
        for (let i = 0; i < cases.length; i++) {
          const idx = i + 1;
          const c = cases[i];
          const cond = c && c.cond ? c.cond : false;
          if (cond && typeof cond === "object" && cond.opcode) {
            const condChild = createBlock(cond, id);
            blocksOut[condChild.id].parent = id;
            if (cond.noPlaceholder) entry.inputs[`BOOL${idx}`] = [3, condChild.id];else entry.inputs[`BOOL${idx}`] = [3, condChild.id, checkboxIds[i]];
          } else {
            const typeCode = Array.isArray(cond) && cond[0] ? cond[0] : InputTypes.text;
            entry.inputs[`BOOL${idx}`] = [1, [typeCode, String(cond === undefined ? "" : cond)]];
          }
          let firstChild = null;
          let prev = null;
          if (Array.isArray(c.then)) {
            for (let j = 0; j < c.then.length; j++) {
              const ch = c.then[j];
              if (ch && (ch.opcode === 'control_exitLoop' || ch.opcode === 'control_continueLoop' || ch.opcode === 'procedures_return' || ch.opcode === 'control_throw_error') && j < c.then.length - 1) {
                throw new Error("control_exitLoop/continue/return/throw must be the last statement in a substack (found additional statements after break/continue/return/throw)");
              }
              const childEntry = createBlock(ch, id);
              blocksOut[childEntry.id].parent = id;
              blocksOut[childEntry.id].topLevel = false;
              if (!firstChild) firstChild = childEntry.id;
              if (prev) blocksOut[prev].next = childEntry.id;
              prev = childEntry.id;
            }
          }
          if (firstChild) entry.inputs[`SUBSTACK${idx}`] = [2, firstChild];
        }
        if (Array.isArray(elseBranch)) {
          let firstElse = null;
          let prevElse = null;
          for (let j = 0; j < elseBranch.length; j++) {
            const ch = elseBranch[j];
            if (ch && (ch.opcode === 'control_exitLoop' || ch.opcode === 'control_continueLoop' || ch.opcode === 'procedures_return' || ch.opcode === 'control_throw_error') && j < elseBranch.length - 1) {
              throw new Error("control_exitLoop/continue/return/throw must be the last statement in a substack (found additional statements after break/continue/return/throw)");
            }
            const childEntry = createBlock(ch, id);
            blocksOut[childEntry.id].parent = id;
            blocksOut[childEntry.id].topLevel = false;
            if (!firstElse) firstElse = childEntry.id;
            if (prevElse) blocksOut[prevElse].next = childEntry.id;
            prevElse = childEntry.id;
          }
          if (firstElse) entry.inputs[`SUBSTACK${cases.length + 1}`] = [2, firstElse];
        }
        const mut = Object.assign({
          tagName: "mutation",
          children: []
        }, obj.mutation || {});
        mut.branches = String(cases.length + (Array.isArray(elseBranch) ? 1 : 0));
        mut["ends-in-else"] = String(!!elseBranch);
        entry.mutation = mut;
        entry.id = id;
        blocksOut[id] = entry;
        return entry;
      }
    }

    // Special-case: while loop emitted as `control_while` with inputs [cond, bodyArray]
    if (obj.opcode === 'control_while') {
      const condVal = Array.isArray(obj.inputs) && obj.inputs[0] !== undefined ? obj.inputs[0] : null;
      const bodyArr = Array.isArray(obj.inputs) && obj.inputs[1] !== undefined ? obj.inputs[1] : obj.children && Array.isArray(obj.children) ? obj.children : [];
      // create a checkbox shadow for the condition-target placeholder
      const condCheckbox = createCheckbox();
      // condition
      if (condVal && typeof condVal === 'object' && condVal.opcode) {
        const condChild = createBlock(condVal, id);
        blocksOut[condChild.id].parent = id;
        // respect noPlaceholder on the condition child
        if (condVal.noPlaceholder) entry.inputs['CONDITION'] = [3, condChild.id];else entry.inputs['CONDITION'] = [3, condChild.id, condCheckbox];
      } else {
        const typeCode = Array.isArray(condVal) && condVal[0] ? condVal[0] : InputTypes.text;
        entry.inputs['CONDITION'] = [1, [typeCode, String(condVal === undefined ? '' : condVal)]];
      }

      // substack body
      let firstChild = null;
      let prev = null;
      if (Array.isArray(bodyArr)) {
        for (let j = 0; j < bodyArr.length; j++) {
          const ch = bodyArr[j];
          if (ch && (ch.opcode === 'control_exitLoop' || ch.opcode === 'control_continueLoop' || ch.opcode === 'procedures_return' || ch.opcode === 'control_throw_error') && j < bodyArr.length - 1) {
            throw new Error("control_exitLoop/continue/return/throw must be the last statement in a substack (found additional statements after break/continue/return/throw)");
          }
          const childEntry = createBlock(ch, id);
          blocksOut[childEntry.id].parent = id;
          blocksOut[childEntry.id].topLevel = false;
          if (!firstChild) firstChild = childEntry.id;
          if (prev) blocksOut[prev].next = childEntry.id;
          prev = childEntry.id;
        }
      }
      if (firstChild) entry.inputs['SUBSTACK'] = [2, firstChild];
      entry.id = id;
      blocksOut[id] = entry;
      return entry;
    }

    // Special-case: expandable join inputs (string concat expandable)
    if (obj.opcode === "operator_expandablejoininputs" && Array.isArray(obj.inputs)) {
      const parts = obj.inputs || [];
      for (let i = 0; i < parts.length; i++) {
        const name = "INPUT" + (i + 1);
        const p = parts[i];
        // Accept multiple pseudocode shapes:
        // - primitive string/number (from generator.emitExpression)
        // - { literal: [value, kind] }
        // - { block: { opcode,... } } or raw block-like object { opcode: 'x', inputs: [...] }
        if (p == null) {
          entry.inputs[name] = [1, [InputTypes.text, ""]];
        } else if (typeof p === "string") {
          entry.inputs[name] = [1, [InputTypes.text, String(p)]];
        } else if (typeof p === "number") {
          entry.inputs[name] = [1, [InputTypes.math_number, String(p)]];
        } else if (p.literal && Array.isArray(p.literal)) {
          const val = p.literal[0];
          const kind = p.literal[1];
          if (kind === "number") entry.inputs[name] = [1, [InputTypes.math_number, String(val)]];else entry.inputs[name] = [1, [InputTypes.text, String(val)]];
        } else if (p.block && typeof p.block === "object" && p.block.opcode) {
          const child = createBlock(p.block, id);
          blocksOut[child.id].parent = id;
          const omitPh = !!p.block.noPlaceholder;
          if (omitPh) {
            entry.inputs[name] = [3, child.id];
          } else {
            entry.inputs[name] = [3, child.id, [InputTypes.text, ""]];
          }
        } else if (p && p.opcode) {
          // raw block-like object emitted by generator
          const child = createBlock(p, id);
          blocksOut[child.id].parent = id;
          const omitPh = !!p.noPlaceholder;
          if (omitPh) {
            entry.inputs[name] = [3, child.id];
          } else {
            entry.inputs[name] = [3, child.id, [InputTypes.text, ""]];
          }
        } else {
          entry.inputs[name] = [1, [InputTypes.text, ""]];
        }
      }
      // mutation
      entry.mutation = {
        tagName: "mutation",
        children: [],
        inputcount: String(obj.mutation && obj.mutation.inputcount ? obj.mutation.inputcount : Array.isArray(obj.inputs) ? obj.inputs.length : 0)
      };
      entry.id = id;
      blocksOut[id] = entry;
      return entry;
    }

    // Special-case: procedures_return often wraps a reporter block (e.g. answer reporter)
    if (obj.opcode === "procedures_return" && Array.isArray(obj.inputs) && obj.inputs.length > 0) {
      const inner = obj.inputs[0];
      if (inner && typeof inner === "object" && inner.opcode) {
        const child = createBlock(inner, id);
        blocksOut[child.id].parent = id;
        const omitPh = !!inner.noPlaceholder;
        // Use explicit text shadow block with default '1' for procedure return
        if (omitPh) {
          entry.inputs.return = [3, child.id];
        } else {
          entry.inputs.return = [3, child.id, [InputTypes.text, "1"]];
        }
      } else {
        // Map primitive literals to sensible input types instead of hardcoded "1".
        if (typeof inner === 'number') {
          entry.inputs.return = [1, [InputTypes.math_number, String(inner)]];
        } else if (typeof inner === 'string') {
          entry.inputs.return = [1, [InputTypes.text, inner]];
        } else if (typeof inner === 'boolean') {
          entry.inputs.return = [1, [InputTypes.text, String(inner)]];
        } else {
          // Fallback: preserve previous behavior (text '1') when unknown/missing
          entry.inputs.return = [1, [InputTypes.text, "1"]];
        }
      }
      entry.id = id;
      blocksOut[id] = entry;
      return entry;
    }

    // Special-case: control_exitLoop (break) and control_continueLoop (continue)
    if (obj.opcode === 'control_exitLoop' || obj.opcode === 'control_continueLoop' || obj.opcode === 'control_throw_error') {
      entry.id = id;
      // ensure no children are attached by generator; converter-level defensive check
      entry.next = null;
      blocksOut[id] = entry;
      return entry;
    }

    // lookup metadata
    const opName = obj && (obj.opcode || obj.name);
    if (!opName || typeof opName !== 'string') {
      throw new Error("pseudocodeToProject: missing or invalid opcode in pseudocode block: " + JSON.stringify(obj));
    }
    const meta = blocksMeta[opName] || blocksMeta[opName.replace(/^operator_/, "operator_")] || null;
    const params = meta ? meta[0] || [] : [];

    // Map positional inputs -> input slots. Expect `obj.inputs` as canonical shape.
    // Also accept a named `obj.inputs` object mapping param names -> values.
    let inArr = [];
    if (Array.isArray(obj.inputs)) inArr = obj.inputs;else if (obj.inputs && typeof obj.inputs === 'object') {
      // map named inputs object to positional array based on params order
      for (let i = 0; i < params.length; i++) {
        const pname = params[i] && params[i].name ? params[i].name : i;
        inArr.push(obj.inputs[pname] !== undefined ? obj.inputs[pname] : "");
      }
    } else {
      inArr = [];
    }
    let paramIndex = 0;
    for (let i = 0; i < params.length; i++) {
      const p = params[i];
      const val = inArr[paramIndex] !== undefined ? inArr[paramIndex] : "";
      if (p.type === "substack") {
        // val expected to be array of pseudocode child blocks; create chain and link with next/parent
        const created = [];
        if (Array.isArray(val)) {
          for (let j = 0; j < val.length; j++) {
            const ch = val[j];
            if (ch && (ch.opcode === 'control_exitLoop' || ch.opcode === 'control_continueLoop' || ch.opcode === 'procedures_return' || ch.opcode === 'control_throw_error') && j < val.length - 1) {
              throw new Error("control_exitLoop/continue/return/throw must be the last statement in a substack (found additional statements after break/continue/return/throw)");
            }
            const childEntry = createBlock(ch, id);
            // ensure child parent set
            blocksOut[childEntry.id].parent = id;
            blocksOut[childEntry.id].topLevel = false;
            created.push(childEntry.id);
          }
        }
        // link created children in sequence
        for (let j = 0; j < created.length; j++) {
          const cid = created[j];
          const nextId = created[j + 1] || null;
          blocksOut[cid].next = nextId;
        }
        if (created.length > 0) entry.inputs[p.name] = [2, created[0]];
      } else {
        // value can be literal (string/number) or nested block object
        if (val && typeof val === "object" && val.opcode) {
          // create child block and inspect its shape
          const child = createBlock(val, id);
          blocksOut[child.id].parent = id;
          const childMeta = blocksMeta[val.opcode] || blocksMeta[val.opcode.replace(/^operator_/, "operator_")] || null;
          const childShape = childMeta ? childMeta[1] : null;
          const typeCode = typeCodeForParam(p);
          const omitPh = !!val.noPlaceholder;
          // Special-case: unary boolean negation should use a checkbox shadow placeholder
          if (!p.field) {
            if (obj.opcode === 'operator_not') {
              const cbid = createCheckbox();
              entry.inputs[p.name] = omitPh ? [3, child.id] : [3, child.id, cbid];
            } else if (
            // Omit placeholder for jwClass_getProp POINTER
            obj.opcode === 'jwClass_getProp' && String(p.name).toUpperCase() === 'POINTER' ||
            // Omit placeholder for jwLambda_execute / jwLambda_executeR LAMBDA input
            (obj.opcode === 'jwLambda_execute' || obj.opcode === 'jwLambda_executeR') && String(p.name).toUpperCase() === 'LAMBDA') {
              entry.inputs[p.name] = [3, child.id];
            } else {
              if (omitPh) {
                entry.inputs[p.name] = [3, child.id];
              } else {
                entry.inputs[p.name] = [3, child.id, typeCode === InputTypes.math_number ? [typeCode, 0] : [typeCode, ""]];
              }
            }
          }
          if (p.field) entry.fields[p.field] = [String(val && val.name ? val.name : ""), makeFieldId()];
        } else {
          // literal or missing -> try to create a sensible shadow placeholder
          const typeCode = typeCodeForParam(p);
          // If no direct value provided and a specialized shadow exists (e.g. class pointer), use it
          if (!p.field) {
            const isEmpty = val === undefined || val === null || val === "";
            // For jwClass_getProp the POINTER argument should have no placeholder
            if (obj.opcode === 'jwClass_getProp' && String(p.name).toUpperCase() === 'POINTER' && isEmpty) {
              // intentionally leave no input entry for missing pointer
            } else {
              const shadowSpec = isEmpty ? makeShadowForParam(p) : null;
              if (shadowSpec) {
                const child = createBlock(shadowSpec, id);
                // created placeholder should be a shadow block
                blocksOut[child.id].parent = id;
                blocksOut[child.id].shadow = true;
                // reference the created shadow block as the input child (no separate shadow id)
                entry.inputs[p.name] = [3, child.id];
              } else {
                if (typeof val === "number") entry.inputs[p.name] = [1, [InputTypes.math_number, String(val)]];else if (typeof val === "string") entry.inputs[p.name] = [1, [typeCode, val]];else entry.inputs[p.name] = [1, [typeCode, String(val)]];
              }
            }
          }
          if (p.field) entry.fields[p.field] = [String(val), makeFieldId()];
        }
      }
      paramIndex++;
    }

    // Handle children (top-level children array) for hat-like blocks
    if (Array.isArray(obj.children) && obj.children.length > 0) {
      // create a child block chain, link to this hat block via next/parent
      let firstChildId = null;
      let prevChildId = null;
      for (let j = 0; j < obj.children.length; j++) {
        const ch = obj.children[j];
        if (ch && (ch.opcode === 'control_exitLoop' || ch.opcode === 'control_continueLoop' || ch.opcode === 'procedures_return' || ch.opcode === 'control_throw_error') && j < obj.children.length - 1) {
          throw new Error("control_exitLoop/continue/return/throw must be the last statement in a substack (found additional statements after break/continue/return/throw)");
        }
        const childEntry = createBlock(ch, id);
        blocksOut[childEntry.id].parent = id;
        blocksOut[childEntry.id].topLevel = false;
        if (!firstChildId) firstChildId = childEntry.id;
        if (prevChildId) blocksOut[prevChildId].next = childEntry.id;
        prevChildId = childEntry.id;
      }
      entry.next = firstChildId;
    }

    // attach mutation if provided in pseudocode
    if (obj.mutation) {
      const m = Object.assign({
        tagName: "mutation",
        children: []
      }, obj.mutation);
      if (m.branches !== undefined) m.branches = String(m.branches);
      if (m["inputcount"] !== undefined) m.inputcount = String(m["inputcount"]);
      if (m["ends-in-else"] !== undefined) m["ends-in-else"] = String(m["ends-in-else"]);
      entry.mutation = m;
    }

    // expose id for parent linkage
    entry.id = id;
    // default x/y for top-level hats
    if (obj.topLevel || obj.hat || entry.topLevel) {
      entry.x = obj.x !== undefined ? obj.x : 0;
      entry.y = obj.y !== undefined ? obj.y : 0;
    }
    blocksOut[id] = entry;
    return entry;
  }

  // top-level pseudocode array contains hat blocks
  for (const node of pseudocode.blocks || pseudocode) {
    const top = createBlock(node, null);
    // mark as top-level and ensure parent is null
    blocksOut[top.id].topLevel = true;
    blocksOut[top.id].parent = null;
    // set default x/y for hats (preserve if provided on pseudocode node)
    blocksOut[top.id].x = node.x !== undefined ? node.x : blocksOut[top.id].x !== undefined ? blocksOut[top.id].x : 0;
    blocksOut[top.id].y = node.y !== undefined ? node.y : blocksOut[top.id].y !== undefined ? blocksOut[top.id].y : 0;
  }

  // Remove internal .id fields for output (project.json expects object keyed by id)
  const outBlocks = {};
  for (const [k, v] of Object.entries(blocksOut)) {
    const copy = Object.assign({}, v);
    const id = copy.id;
    delete copy.id;
    // remove any transient properties that shouldn't be in project.json
    if (copy.children !== undefined) delete copy.children;
    outBlocks[id] = copy;
  }
  return outBlocks;
}
module.exports = {
  convert
};