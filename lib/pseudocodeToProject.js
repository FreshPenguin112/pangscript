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
    return { opcode: 'jwClass_self', inputs: [], fields: {} };
  }

  // Numeric inputs -> math_number shadow
  if (param.type === 'number') return { opcode: 'math_number', inputs: [], fields: {} };

  // If a specific shadow opcode was provided via param.shadow, use it
  if (param.shadow && typeof param.shadow === 'string' && param.shadow.length > 0) return { opcode: param.shadow, inputs: [], fields: {} };

  // Fallback: if a field name is present, try using it as opcode (best-effort),
  // otherwise return null (no shadow).
  if (param.field && typeof param.field === 'string' && param.field.length > 0) return { opcode: param.field, inputs: [], fields: {} };
  return null;
}
function convert(pseudocode) {
  console.log(JSON.stringify(pseudocode, null, 2));
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
    if (obj.opcode === "control_expandableIf" && Array.isArray(obj.cases)) {
      const cases = obj.cases || [];
      // create checkbox shadows first
      const checkboxIds = cases.map(() => createCheckbox());
      // create child reporters for each condition and substacks for then/else
      for (let i = 0; i < cases.length; i++) {
        const idx = i + 1;
        const c = cases[i];
        // condition: can be literal ([1,[...]] style) or a block description
        if (c.cond && typeof c.cond === "object" && c.cond.opcode) {
          const condChild = createBlock(c.cond, id);
          blocksOut[condChild.id].parent = id;
          entry.inputs["BOOL" + idx] = [3, condChild.id, checkboxIds[i]];
        } else {
          // literal condition -> create a tiny shadow reporter as literal
          const typeCode = Array.isArray(c.cond) && c.cond[0] ? c.cond[0] : InputTypes.text;
          entry.inputs["BOOL" + idx] = [1, [typeCode, String(c.cond === undefined ? "" : c.cond)]];
        }

        // then-substack
        let firstChild = null;
        let prev = null;
        if (Array.isArray(c.then)) {
          for (let j = 0; j < c.then.length; j++) {
            const ch = c.then[j];
            if (ch && ch.opcode === 'control_exitLoop' && j < c.then.length - 1) {
              throw new Error("control_exitLoop must be the last statement in a substack (found additional statements after break)");
            }
            const childEntry = createBlock(ch, id);
            blocksOut[childEntry.id].parent = id;
            blocksOut[childEntry.id].topLevel = false;
            if (!firstChild) firstChild = childEntry.id;
            if (prev) blocksOut[prev].next = childEntry.id;
            prev = childEntry.id;
          }
        }
        entry.inputs["SUBSTACK" + idx] = [2, firstChild];
      }

      // else branch (optional)
      if (obj.else) {
        let firstElse = null;
        let prevElse = null;
        if (Array.isArray(obj.else)) {
          for (let j = 0; j < obj.else.length; j++) {
            const ch = obj.else[j];
            if (ch && ch.opcode === 'control_exitLoop' && j < obj.else.length - 1) {
              throw new Error("control_exitLoop must be the last statement in a substack (found additional statements after break)");
            }
            const childEntry = createBlock(ch, id);
            blocksOut[childEntry.id].parent = id;
            blocksOut[childEntry.id].topLevel = false;
            if (!firstElse) firstElse = childEntry.id;
            if (prevElse) blocksOut[prevElse].next = childEntry.id;
            prevElse = childEntry.id;
          }
        }
        entry.inputs["SUBSTACK" + (cases.length + 1)] = [2, firstElse];
      }

      // attach mutation from pseudocode or compute
      const mut = Object.assign({
        tagName: "mutation",
        children: []
      }, obj.mutation || {});
      mut.branches = String(cases.length + (obj.else ? 1 : 0));
      mut["ends-in-else"] = String(!!obj.else);
      entry.mutation = mut;
      // expose id and register
      entry.id = id;
      blocksOut[id] = entry;
      return entry;
    }

    // Special-case: while loop emitted as `control_while` with inputs [cond, bodyArray]
    if (obj.opcode === 'control_while') {
      const condVal = Array.isArray(obj.inputs) && obj.inputs[0] !== undefined ? obj.inputs[0] : obj.args && obj.args[0] !== undefined ? obj.args[0] : null;
      const bodyArr = Array.isArray(obj.inputs) && obj.inputs[1] !== undefined ? obj.inputs[1] : obj.children && Array.isArray(obj.children) ? obj.children : obj.args && obj.args[1] !== undefined ? obj.args[1] : [];
      // create a checkbox shadow for the condition-target placeholder
      const condCheckbox = createCheckbox();
      // condition
      if (condVal && typeof condVal === 'object' && condVal.opcode) {
        const condChild = createBlock(condVal, id);
        blocksOut[condChild.id].parent = id;
        entry.inputs['CONDITION'] = [3, condChild.id, condCheckbox];
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
          if (ch && ch.opcode === 'control_exitLoop' && j < bodyArr.length - 1) {
            throw new Error("control_exitLoop must be the last statement in a substack (found additional statements after break)");
          }
          const childEntry = createBlock(ch, id);
          blocksOut[childEntry.id].parent = id;
          blocksOut[childEntry.id].topLevel = false;
          if (!firstChild) firstChild = childEntry.id;
          if (prev) blocksOut[prev].next = childEntry.id;
          prev = childEntry.id;
        }
      }
      entry.inputs['SUBSTACK'] = [2, firstChild];
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
          entry.inputs[name] = [3, child.id, [InputTypes.text, ""]];
        } else if (p && p.opcode) {
          // raw block-like object emitted by generator
          const child = createBlock(p, id);
          blocksOut[child.id].parent = id;
          entry.inputs[name] = [3, child.id, [InputTypes.text, ""]];
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
        // Use text shadow '1' for procedure return default as in sample
        entry.inputs.return = [3, child.id, [InputTypes.text, "1"]];
      } else {
        entry.inputs.return = [1, [InputTypes.text, "1"]];
      }
      entry.id = id;
      blocksOut[id] = entry;
      return entry;
    }

    // Special-case: control_exitLoop (break) — a stack block with no inputs
    if (obj.opcode === 'control_exitLoop') {
      entry.id = id;
      // ensure no children are attached by generator; converter-level defensive check
      entry.next = null;
      blocksOut[id] = entry;
      return entry;
    }

    // lookup metadata
    const meta = blocksMeta[obj.opcode] || blocksMeta[obj.opcode.replace(/^operator_/, "operator_")] || null;
    const params = meta ? meta[0] || [] : [];

    // Map positional inputs/args -> input slots. Support multiple input shapes:
    // - obj.inputs as an Array (positional)
    // - obj.args as an Array (positional)
    // - obj.inputs or obj.args as an Object mapping param names -> values
    let inArr = [];
    if (Array.isArray(obj.inputs)) inArr = obj.inputs;else if (Array.isArray(obj.args)) inArr = obj.args;else if (obj.inputs && typeof obj.inputs === 'object') {
      // map named inputs object to positional array based on params order
      for (let i = 0; i < params.length; i++) {
        const pname = params[i] && params[i].name ? params[i].name : i;
        inArr.push(obj.inputs[pname] !== undefined ? obj.inputs[pname] : "");
      }
    } else if (obj.args && typeof obj.args === 'object') {
      for (let i = 0; i < params.length; i++) {
        const pname = params[i] && params[i].name ? params[i].name : i;
        inArr.push(obj.args[pname] !== undefined ? obj.args[pname] : "");
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
            if (ch && ch.opcode === 'control_exitLoop' && j < val.length - 1) {
              throw new Error("control_exitLoop must be the last statement in a substack (found additional statements after break)");
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
        entry.inputs[p.name] = [2, created.length > 0 ? created[0] : null];
      } else {
        // value can be literal (string/number) or nested block object
        if (val && typeof val === "object" && val.opcode) {
          // create child block and inspect its shape
          const child = createBlock(val, id);
          blocksOut[child.id].parent = id;
          const childMeta = blocksMeta[val.opcode] || blocksMeta[val.opcode.replace(/^operator_/, "operator_")] || null;
          const childShape = childMeta ? childMeta[1] : null;
          const typeCode = typeCodeForParam(p);
          // Special-case: unary boolean negation should use a checkbox shadow placeholder
          if (!p.field) {
              if (obj.opcode === 'operator_not') {
                const cbid = createCheckbox();
                entry.inputs[p.name] = [3, child.id, cbid];
              } else if (
                // Omit placeholder for jwClass_getProp POINTER
                (obj.opcode === 'jwClass_getProp' && String(p.name).toUpperCase() === 'POINTER') ||
                // Omit placeholder for jwLambda_execute / jwLambda_executeR LAMBDA input
                ((obj.opcode === 'jwLambda_execute' || obj.opcode === 'jwLambda_executeR') && String(p.name).toUpperCase() === 'LAMBDA')
              ) {
                entry.inputs[p.name] = [3, child.id];
              } else {
                entry.inputs[p.name] = [3, child.id, [typeCode, String("")]];
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
                  blocksOut[child.id].parent = id;
                  entry.inputs[p.name] = [3, child.id, [typeCode, String("")]];
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
        if (ch && ch.opcode === 'control_exitLoop' && j < obj.children.length - 1) {
          throw new Error("control_exitLoop must be the last statement in a substack (found additional statements after break)");
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