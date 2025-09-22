const { execSync } = require('child_process');
const fs = require('fs');

const pmp = process.argv[2] || 'src/listtest.pmp';
try {
  const jsonText = execSync(`unzip -p ${pmp} project.json`, { encoding: 'utf8', stdio: ['pipe','pipe','pipe'] });
  const project = JSON.parse(jsonText);
  let blocks = {};
  for (const t of project.targets) {
    if (t.blocks) blocks = { ...blocks, ...t.blocks };
  }
  const nodes = Object.keys(blocks);
  console.log(`Loaded ${nodes.length} blocks from ${pmp}`);

  // Build adjacency for directed edges: follow 'next' and input block references (not 'parent')
  const adj = {};
  nodes.forEach(id => adj[id] = []);
  nodes.forEach(id => {
    const b = blocks[id];
    if (!b) return;
    if (b.next && typeof b.next === 'string') adj[id].push(b.next);
    // Also consider inputs that are block refs: inputs may be object mapping of inputName->[3, id, ...]
    if (b.inputs && typeof b.inputs === 'object') {
      for (const key of Object.keys(b.inputs)) {
        const v = b.inputs[key];
        if (Array.isArray(v) && v[0] === 3 && typeof v[1] === 'string') adj[id].push(v[1]);
      }
    }
  });

  // DFS for cycles
  const visited = new Set();
  const stack = new Set();
  const cycles = [];

  function dfs(u, path) {
    if (stack.has(u)) {
      const idx = path.indexOf(u);
      cycles.push(path.slice(idx));
      return;
    }
    if (visited.has(u)) return;
    visited.add(u);
    stack.add(u);
    const neighbors = adj[u] || [];
    for (const v of neighbors) {
      if (!blocks[v]) continue;
      dfs(v, path.concat(v));
    }
    stack.delete(u);
  }

  for (const n of nodes) dfs(n, [n]);

  if (cycles.length === 0) {
    console.log('No cycles detected.');
  } else {
    console.log(`Detected ${cycles.length} cycle(s):`);
    cycles.forEach((c,i) => console.log(`#${i+1}: ${c.map(id=> id + '(' + (blocks[id]&&blocks[id].opcode||'') + ')').join(' -> ')}`));
  }
} catch (e) {
  console.error('Error reading PMP or parsing project.json:', e.message);
  process.exit(2);
}
