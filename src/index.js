const luaparse = require('luaparse');
const { readFileSync } = require('fs');
const path = require('path');
const compile = require('./compile');

const code = readFileSync(path.join(__dirname, './test.lua'));
compile(luaparse.parse(code));