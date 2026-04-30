#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const file = process.argv[2] || path.join(process.cwd(), 'project.json');
let json;
try {
  json = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (e) {
  console.error('Failed to read/parse', file, e.message);
  process.exit(2);
}

const badExecs = [];
const collected = new Set();

function traverse(v) {
  if (typeof v === 'string') {
    if (v.startsWith('__')) collected.add(v);
    return;
  }
  if (Array.isArray(v)) {
    for (const e of v) traverse(e);
    return;
  }
  if (v && typeof v === 'object') {
    for (const k of Object.keys(v)) traverse(v[k]);
  }
}

traverse(json);

for (const [id, block] of Object.entries(json)) {
  if (!block || !block.opcode) continue;
  if (block.opcode === 'jwLambda_execute' || block.opcode === 'jwLambda_executeR') {
    const arg = block.inputs && block.inputs['ARG'];
    if (arg) {
      if (Array.isArray(arg) && arg[0] === 1 && Array.isArray(arg[1])) {
        const v = arg[1][1];
        if (typeof v === 'string' && v.trim() !== '') badExecs.push({ id, opcode: block.opcode, arg: v });
      } else {
        badExecs.push({ id, opcode: block.opcode, arg: JSON.stringify(arg) });
      }
    }
  }
}

const badNames = [];
const namePattern = /^__[a-z0-9]{5,}_.+$/;
for (const s of Array.from(collected)) {
  if (!namePattern.test(s)) badNames.push(s);
}

if (badExecs.length === 0 && badNames.length === 0) {
  console.log('OK: project.json passes validation');
  process.exit(0);
} else {
  if (badExecs.length) {
    console.error('Found jwLambda_execute/executeR blocks with non-empty ARG:');
    for (const e of badExecs) console.error('-', e.id, e.opcode, e.arg);
  }
  if (badNames.length) {
    console.error('Found __-prefixed names that do not match run-uid pattern:');
    for (const n of badNames) console.error('-', n);
  }
  process.exit(1);
}
