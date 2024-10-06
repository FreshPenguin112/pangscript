const { generator } = require("./generator");
const { writeFileSync } = require("fs");
const path = require("path");
const b = new generator();
writeFileSync(
    path.join(__dirname, "../generatorTest.pmp"),
    b.addBlock({ "opcode": "event_whenflagclicked", topLevel: true }).getProject()
);
