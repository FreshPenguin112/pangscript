const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Run the converter from src/
console.log('Running converter...');
execSync('cd src && node index.js -d -i test2.lua -o ../listtest.pmp', { stdio: 'inherit' });

// Unzip the generated pmp and read project.json
const tmpDir = path.join(__dirname, 'tmp_unzip');
if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
}
fs.mkdirSync(tmpDir);
execSync('unzip -q ../listtest.pmp -d ' + tmpDir, { cwd: path.join(__dirname, '..') });
const projectJson = JSON.parse(fs.readFileSync(path.join(tmpDir, 'project.json'), 'utf8'));

// Merge blocks from all targets for easier searching
let blocks = {};
for (const t of projectJson.targets) {
    if (t.blocks) {
        blocks = { ...blocks, ...t.blocks };
    }
}

// Find a jgJSON_json_array_length block that references jgJSON_json_keys
let arrayLengthBlockId = null;
for (const id in blocks) {
    if (blocks[id].opcode !== 'jgJSON_json_array_length') continue;
    const input = blocks[id].inputs && (blocks[id].inputs.array || blocks[id].inputs.JSON || blocks[id].inputs.json);
    if (!input || !Array.isArray(input) || input[0] !== 3) continue;
    const reporterId = input[1];
    if (!blocks[reporterId]) continue;
    if (blocks[reporterId].opcode === 'jgJSON_json_keys') {
        arrayLengthBlockId = id;
        break;
    }
}

if (!arrayLengthBlockId) {
    console.error('No jgJSON_json_array_length block found that references jgJSON_json_keys');
    process.exit(2);
}
console.log('Found jgJSON_json_array_length block:', arrayLengthBlockId);

// Its input should be a reporter reference to a jgJSON_json_keys block when applied to an object
const input = blocks[arrayLengthBlockId].inputs && blocks[arrayLengthBlockId].inputs.array;
if (!input) {
    console.error('jgJSON_json_array_length has no array input');
    process.exit(2);
}
if (!Array.isArray(input) || input[0] !== 3) {
    console.error('jgJSON_json_array_length input is not a reporter reference:', input);
    process.exit(2);
}
const reporterId = input[1];
if (!blocks[reporterId]) {
    console.error('Referenced reporter block not found:', reporterId);
    process.exit(2);
}
if (blocks[reporterId].opcode !== 'jgJSON_json_keys') {
    console.error('Referenced reporter is not jgJSON_json_keys:', blocks[reporterId].opcode);
    process.exit(2);
}
if (blocks[reporterId].parent !== arrayLengthBlockId) {
    console.error('Reporter parent is not the length block (parent:', blocks[reporterId].parent, 'expected:', arrayLengthBlockId);
    process.exit(2);
}
console.log('Test passed: object length uses jgJSON_json_keys -> jgJSON_json_array_length with proper parenting');
process.exit(0);
