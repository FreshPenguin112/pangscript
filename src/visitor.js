// the following regex can be used to find all uncommented console.log statements in vscode because i'm lazy
// ^(?!\s*\/\/).*console\.log\([^)]*\);?
const LuaParserVisitor = require("../lib/LuaParserVisitor").default;
const _generator = require("../utils/generator");
const CompilerError = require("../utils/CompilerError");

const { processedBlocks } = require("./blocks.js");

//console.log(Object.getOwnPropertyNames(v))
class visitor extends LuaParserVisitor {
    constructor(source) {
        super();
        this.idCounter = 0;
        this.blocks = {};
        this.source = source.toString(); // Store the full source for error reporting
        this.generator = new _generator();
        this.customBlocks = {};
        this.mainBodyBlockIds = [];
        this.variableScopes = {}; // { varName: "local" | "global" }
        // --- Semi-interpreted runtime ---
        this.runtime = {
            globals: {},
            functions: {},
            objects: {},
            classes: {},
        };
    }

    // --- Interpreter helpers ---
    setGlobal(name, value) { this.runtime.globals[name] = value; }
    getGlobal(name) { return this.runtime.globals[name]; }
    setFunction(name, fn) { this.runtime.functions[name] = fn; }
    getFunction(name) { return this.runtime.functions[name]; }

    // --- Dynamic interpreter loop ---
    interpretStatements(statements) {
        for (const stmt of statements) {
            this.interpretStatement(stmt);
        }
    }
    interpretStatement(ctx) {
        // Function definition
        if (
            ctx.children &&
            ctx.children.length === 3 &&
            ctx.children[0].getText() === "function" &&
            ctx.children[1].constructor.name === "FuncnameContext" &&
            ctx.children[2].constructor.name === "FuncbodyContext"
        ) {
            const funcName = ctx.children[1].getText();
            const funcbodyCtx = ctx.children[2];
            const parlist = funcbodyCtx.parlist();
            let argNames = [];
            if (parlist && parlist.namelist) {
                const namelist = parlist.namelist();
                if (namelist && namelist.NAME) {
                    const names = namelist.NAME();
                    for (let i = 0; i < names.length; i++) {
                        argNames.push(names[i].getText());
                    }
                }
            }
            // Store function as a closure
            this.setFunction(funcName, (...args) => {
                // Map args to globals for now (no local scope yet)
                argNames.forEach((name, i) => {
                    this.setGlobal(name, args[i]);
                });
                // Interpret body
                const block = funcbodyCtx.block();
                if (block && block.children) {
                    this.interpretStatements(block.children);
                }
            });
            return;
        }
        // Variable assignment
        if (
            ctx.children &&
            (
                (ctx.children.length === 4 && ctx.children[0].getText() === "local") ||
                (ctx.children.length === 3 && ctx.children[1].getText() === "=")
            )
        ) {
            let varName, valueExp;
            if (ctx.children.length === 4) {
                varName = ctx.children[1].getText();
                valueExp = this.interpretExp(ctx.children[3]);
            } else {
                varName = ctx.children[0].getText();
                valueExp = this.interpretExp(ctx.children[2]);
            }
            this.setGlobal(varName, valueExp);
            return;
        }
        // Compound assignment
        if (
            ctx.children &&
            (
                (ctx.children.length === 4 && ctx.children[0].getText() === "local" && ctx.children[2].getText().match(/^[+\-*/^]=$/)) ||
                (ctx.children.length === 3 && ctx.children[1].getText().match(/^[+\-*/^]=$/))
            )
        ) {
            let varName, op, expChild;
            if (ctx.children.length === 4) {
                varName = ctx.children[1].getText();
                op = ctx.children[2].getText();
                expChild = ctx.children[3];
            } else {
                varName = ctx.children[0].getText();
                op = ctx.children[1].getText();
                expChild = ctx.children[2];
            }
            const expResult = this.interpretExp(expChild);
            let current = this.getGlobal(varName) || 0;
            let result;
            switch (op) {
                case "+=": result = current + expResult; break;
                case "-=": result = current - expResult; break;
                case "*=": result = current * expResult; break;
                case "/=": result = current / expResult; break;
                case "^=": result = Math.pow(current, expResult); break;
            }
            this.setGlobal(varName, result);
            return;
        }
        // Print
        if (
            ctx.children &&
            ctx.children.length >= 2 &&
            ctx.children[0].getText() === "print"
        ) {
            const arg = this.interpretExp(ctx.children[1]);
            if (typeof arg === "function") {
                console.log(`<global __function__ ${arg.name || "anonymous"}>`);
            } else {
                console.log(arg);
            }
            return;
        }
        // If/elseif/else
        if (
            ctx.children &&
            ctx.children.length >= 3 &&
            ctx.children[0].getText() === "if"
        ) {
            let i = 0;
            let executed = false;
            while (i < ctx.children.length) {
                if (ctx.children[i].getText() === "if" || ctx.children[i].getText() === "elseif") {
                    const cond = this.interpretExp(ctx.children[i + 1]);
                    if (cond && !executed) {
                        this.interpretStatements(ctx.children[i + 3].children);
                        executed = true;
                    }
                    i += 3;
                } else if (ctx.children[i].getText() === "else") {
                    if (!executed) {
                        this.interpretStatements(ctx.children[i + 1].children);
                    }
                    i += 2;
                } else {
                    i++;
                }
            }
            return;
        }
        // While loop
        if (
            ctx.children &&
            ctx.children.length === 5 &&
            ctx.children[0].getText() === "while"
        ) {
            while (this.interpretExp(ctx.children[1])) {
                this.interpretStatements(ctx.children[3].children);
            }
            return;
        }
        // For loop
        if (
            ctx.children &&
            ctx.children.length >= 7 &&
            ctx.children[0].getText() === "for"
        ) {
            const varName = ctx.children[1].getText();
            const startExp = this.interpretExp(ctx.children[3]);
            const endExp = this.interpretExp(ctx.children[5]);
            let stepExp = 1;
            let bodyIdx = 7;
            if (ctx.children.length >= 9 && ctx.children[6].getText() === ",") {
                stepExp = this.interpretExp(ctx.children[7]);
                bodyIdx = 9;
            }
            for (let i = startExp; i <= endExp; i += stepExp) {
                this.setGlobal(varName, i);
                this.interpretStatements(ctx.children[bodyIdx].children);
            }
            return;
        }
        // Function call
        if (
            ctx.children &&
            ctx.children.length === 1 &&
            ctx.children[0].constructor.name === "FunctioncallContext"
        ) {
            const funcName = this.getText(ctx.children[0]);
            const fn = this.getFunction(funcName);
            if (fn) fn();
            return;
        }
        // --- IF/ELSEIF/ELSE CHAIN SUPPORT ---
        if (
            ctx.children &&
            ctx.children.length >= 3 &&
            ctx.children[0].getText() === "if"
        ) {
            // Parse all branches: if, elseif, else
            let branches = [];
            let i = 0;
            while (i < ctx.children.length) {
                if (
                    ctx.children[i].getText() === "if" ||
                    ctx.children[i].getText() === "elseif"
                ) {
                    // condition and block
                    const condCtx = ctx.children[i + 1];
                    const blockCtx = ctx.children[i + 3];
                    branches.push({
                        cond: condCtx,
                        block: blockCtx,
                    });
                    i += 3;
                } else if (ctx.children[i].getText() === "else") {
                    // else block
                    const blockCtx = ctx.children[i + 1];
                    branches.push({
                        cond: null,
                        block: blockCtx,
                    });
                    i += 2;
                } else {
                    i++;
                }
            }

            // Recursively build nested if/if-else blocks
            const buildIfElse = (visitor, branches, parentIfId = null) => {
                if (branches.length === 0) return null;
                const branch = branches[0];
                if (branch.cond) {
                    // if or elseif
                    const condId = visitor.visitExp(branch.cond);
                    const hasFinalElse =
                        branches[branches.length - 1].cond === null;
                    let blockId;
                    if (hasFinalElse) {
                        blockId = visitor.generator.letterCount(
                            visitor.generator.blockIdCounter++
                        );
                        // Visit then-block
                        let substackIds = [];
                        if (branch.block && branch.block.children) {
                            for (const child of branch.block.children) {
                                if (
                                    child.constructor &&
                                    child.constructor.name.endsWith(
                                        "StatementContext"
                                    )
                                ) {
                                    //console.log(this.getText(child));
                                    const stmtId = visitor.visit(child);
                                    if (stmtId) substackIds.push(stmtId);
                                }
                            }
                            // Chain next pointers
                            for (let i = 1; i < substackIds.length; i++) {
                                visitor.generator.blocks[
                                    substackIds[i - 1]
                                ].next = substackIds[i];
                                visitor.generator.blocks[
                                    substackIds[i]
                                ].parent = null;
                            }
                            // Set parent of first statement to control block
                            if (substackIds.length > 0) {
                                visitor.generator.blocks[
                                    substackIds[0]
                                ].parent = blockId;
                            }
                        }
                        // Recursively build the else/elseif chain
                        let elseId = buildIfElse(
                            visitor,
                            branches.slice(1),
                            blockId
                        );
                        // Set parent of else substack
                        if (elseId && visitor.generator.blocks[elseId]) {
                            visitor.generator.blocks[elseId].parent = blockId;
                        }
                        visitor.generator.addBlock({
                            opcode: "control_if_else",
                            id: blockId,
                            parent: parentIfId,
                            next: null,
                            inputs: {
                                CONDITION:
                                    typeof condId === "object"
                                        ? condId
                                        : [2, condId],
                                SUBSTACK:
                                    substackIds.length > 0
                                        ? [2, substackIds[0]]
                                        : [2, null],
                                SUBSTACK2: elseId ? [2, elseId] : [2, null],
                            },
                        });
                        return blockId;
                    } else {
                        blockId = visitor.generator.letterCount(
                            visitor.generator.blockIdCounter++
                        );
                        // Visit then-block
                        let substackIds = [];
                        if (branch.block && branch.block.children) {
                            for (const child of branch.block.children) {
                                if (
                                    child.constructor &&
                                    child.constructor.name.endsWith(
                                        "StatementContext"
                                    )
                                ) {
                                    const stmtId = visitor.visit(child);
                                    if (stmtId) substackIds.push(stmtId);
                                }
                            }
                            // Chain next pointers
                            for (let i = 1; i < substackIds.length; i++) {
                                visitor.generator.blocks[
                                    substackIds[i - 1]
                                ].next = substackIds[i];
                                visitor.generator.blocks[
                                    substackIds[i]
                                ].parent = null;
                            }
                            // Set parent of first statement to control block
                            if (substackIds.length > 0) {
                                visitor.generator.blocks[
                                    substackIds[0]
                                ].parent = blockId;
                            }
                        }
                        // Recursively build the elseif chain
                        let substackElseIf = buildIfElse(
                            visitor,
                            branches.slice(1),
                            blockId
                        );
                        // Chain last statement to next elseif
                        if (substackIds.length > 0 && substackElseIf) {
                            visitor.generator.blocks[
                                substackIds[substackIds.length - 1]
                            ].next = substackElseIf;
                            if (visitor.generator.blocks[substackElseIf]) {
                                visitor.generator.blocks[
                                    substackElseIf
                                ].parent = blockId;
                            }
                        } else if (
                            substackElseIf &&
                            visitor.generator.blocks[substackElseIf]
                        ) {
                            visitor.generator.blocks[substackElseIf].parent =
                                blockId;
                        }
                        visitor.generator.addBlock({
                            opcode: "control_if",
                            id: blockId,
                            parent: parentIfId,
                            next: null,
                            inputs: {
                                CONDITION:
                                    typeof condId === "object"
                                        ? condId
                                        : [2, condId],
                                SUBSTACK:
                                    substackIds.length > 0
                                        ? [2, substackIds[0]]
                                        : [2, substackElseIf],
                            },
                        });
                        return blockId;
                    }
                } else {
                    // else branch
                    let substackIds = [];
                    if (branch.block && branch.block.children) {
                        for (const child of branch.block.children) {
                            if (
                                child.constructor &&
                                child.constructor.name.endsWith(
                                    "StatementContext"
                                )
                            ) {
                                const stmtId = visitor.visit(child);
                                if (stmtId) substackIds.push(stmtId);
                            }
                        }
                        // Chain next pointers
                        for (let i = 1; i < substackIds.length; i++) {
                            //console.log("hhh")
                            visitor.generator.blocks[substackIds[i - 1]].next =
                                substackIds[i];
                            visitor.generator.blocks[substackIds[i]].parent =
                                null;
                        }
                    }
                    if (substackIds.length === 0) return null;
                    // The parent of the first statement will be set by the control block above
                    return substackIds[0];
                }
            };

            return buildIfElse(this, branches);
        }
        //console.log(ctx.children.map(c => c.getText()));
        if (
            ctx.children &&
            ctx.children.length === 5 &&
            ctx.children[0].getText() === "while"
        ) {
            // Handle while loop
            const condition = this.visitExp(ctx.children[1])[1];
            const bodyIds = this.visitBlock(ctx.children[3]) || [];

            let substackFirst = null;
            if (Array.isArray(bodyIds) && bodyIds.length > 0) {
                substackFirst = bodyIds[0];
                // Chain body blocks
                for (let i = 1; i < bodyIds.length; i++) {
                    this.generator.blocks[bodyIds[i - 1]].next = bodyIds[i];
                    this.generator.blocks[bodyIds[i]].parent = bodyIds[i - 1];
                }
                // Set parent of first block in substack to while block
                this.generator.blocks[bodyIds[0]].parent = null; // will be set below
            }

            const blockId = this.generator.letterCount(
                this.generator.blockIdCounter++
            );
            // Set parent of first block in substack to while block
            if (substackFirst) {
                this.generator.blocks[substackFirst].parent = blockId;
            }

            this.generator.addBlock({
                opcode: "control_while",
                id: blockId,
                parent: null,
                next: null,
                inputs: {
                    CONDITION: [2, condition],
                    SUBSTACK: [2, substackFirst],
                },
            });
            return blockId;
        }
        //console.log(ctx.children.map(c => c.getText()));
        if (
            ctx.children &&
            ctx.children.length >= 7 &&
            ctx.children[0].getText() === "for"
        ) {
            // Handles both: for i = 1, 5 do ... end
            //           and for i = 1, 5, 2 do ... end
            const varName = ctx.children[1].getText();
            const startExp = this.visitExp(ctx.children[3]);
            const endExp = this.visitExp(ctx.children[5]);
            let stepExp = 1;
            let bodyIdx = 7;
            // Check for optional step
            if (ctx.children.length >= 9 && ctx.children[6].getText() === ",") {
                stepExp = this.visitExp(ctx.children[7]);
                bodyIdx = 9;
            }
            const bodyIds = this.visitBlock(ctx.children[bodyIdx]) || [];

            // --- Variable declaration for for-loop variable ---
            if (!Object.prototype.hasOwnProperty.call(this.variableScopes, varName)) {
                this.variableScopes[varName] = "global";
                this.addVariableToProject(varName, typeof startExp === "number" ? startExp : 0, "global");
            }

            // Generate block IDs
            const setVarId = this.generator.letterCount(this.generator.blockIdCounter++);
            const repeatId = this.generator.letterCount(this.generator.blockIdCounter++);
            const eqId = this.generator.letterCount(this.generator.blockIdCounter++);
            const changeId = this.generator.letterCount(this.generator.blockIdCounter++);

            // 1. Set variable to start
            this.generator.addBlock({
                opcode: "data_setvariableto",
                id: setVarId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [1, [10, typeof startExp === "number" ? String(startExp) : String(startExp)]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });

            // 2. operator_gt (loop exit condition)
            this.generator.addBlock({
                opcode: "operator_gt",
                id: eqId,
                parent: repeatId,
                next: null,
                inputs: {
                    OPERAND1: [3, [12, varName, varName], [10, ""]],
                    OPERAND2: [1, [10, typeof endExp === "number" ? String(endExp) : String(endExp)]]
                }
            });

            // 3. data_changevariableby (increment, supports custom step)
            this.generator.addBlock({
                opcode: "data_changevariableby",
                id: changeId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [1, [4, typeof stepExp === "number" ? String(stepExp) : String(stepExp)]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });

            // 4. Chain body blocks (if any), then chain increment after the last body block
            let substackFirst = null;
            if (Array.isArray(bodyIds) && bodyIds.length > 0) {
                substackFirst = bodyIds[0];
                for (let i = 1; i < bodyIds.length; i++) {
                    this.generator.blocks[bodyIds[i - 1]].next = bodyIds[i];
                    this.generator.blocks[bodyIds[i]].parent = bodyIds[i - 1];
                }
                this.generator.blocks[bodyIds[bodyIds.length - 1]].next = changeId;
                this.generator.blocks[changeId].parent = bodyIds[bodyIds.length - 1];
                this.generator.blocks[bodyIds[0]].parent = repeatId;
            } else {
                substackFirst = changeId;
                this.generator.blocks[changeId].parent = repeatId;
            }
            this.generator.blocks[eqId].parent = repeatId;

            // 5. control_repeat_until
            this.generator.addBlock({
                opcode: "control_repeat_until",
                id: repeatId,
                parent: setVarId,
                next: null,
                inputs: {
                    SUBSTACK: [2, substackFirst],
                    CONDITION: [2, eqId]
                }
            });

            this.generator.blocks[setVarId].next = repeatId;
            return { entry: setVarId, exit: repeatId };
        }

        // --- Semi-interpreted: variable assignment ---
        if (
            ctx.children &&
            (
                (ctx.children.length === 4 && ctx.children[0].getText() === "local") ||
                (ctx.children.length === 3 && ctx.children[1].getText() === "=")
            )
        ) {
            let isLocal = false;
            let varName, valueExp;
            if (ctx.children.length === 4) {
                isLocal = true;
                varName = ctx.children[1].getText();
                valueExp = this.visitExp(ctx.children[3]);
            } else {
                varName = ctx.children[0].getText();
                valueExp = this.visitExp(ctx.children[2]);
            }
            // --- Interpreted ---
            this.setGlobal(varName, valueExp);
            // --- Transpile ---
            // Variable declaration/initialization block
            const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
            this.generator.addBlock({
                opcode: "data_setvariableto",
                id: blockId,
                parent: null,
                next: null,
                inputs: [null, this.wrapInput(typeof valueExp === "number" ? valueExp : [String(valueExp)])],
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });
            return blockId;
        }

        // --- Semi-interpreted: compound assignment ---
        if (
            ctx.children &&
            (
                (ctx.children.length === 4 && ctx.children[0].getText() === "local" && ctx.children[2].getText().match(/^[+\-*/^]=$/)) ||
                (ctx.children.length === 3 && ctx.children[1].getText().match(/^[+\-*/^]=$/))
            )
        ) {
            let isLocal = false;
            let varName, op, expChild;
            if (ctx.children.length === 4) {
                isLocal = true;
                varName = ctx.children[1].getText();
                op = ctx.children[2].getText();
                expChild = ctx.children[3];
            } else {
                varName = ctx.children[0].getText();
                op = ctx.children[1].getText();
                expChild = ctx.children[2];
            }
            const expResult = this.visitExp(expChild);
            let current = this.getGlobal(varName) || 0;
            let result;
            switch (op) {
                case "+=": result = current + expResult; break;
                case "-=": result = current - expResult; break;
                case "*=": result = current * expResult; break;
                case "/=": result = current / expResult; break;
                case "^=": result = Math.pow(current, expResult); break;
                default: throw new CompilerError(`Unsupported compound assignment: ${op}`, ctx, this.source);
            }
            this.setGlobal(varName, result);
            // --- Transpile ---
            // No need to declare variable again, just update its value
            const setBlockId = this.generator.letterCount(this.generator.blockIdCounter++);
            this.generator.addBlock({
                opcode: "data_setvariableto",
                id: setBlockId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [3, [12, varName, varName], [10, ""]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });
            return setBlockId; // <-- Return the set block as the entry
        }

        // --- Normal statement handling ---
        //console.log(ctx.children.map(c => c.getText()));
        if (
            ctx.children &&
            ctx.children.length === 5 &&
            ctx.children[0].getText() === "while"
        ) {
            // Handle while loop
            const condition = this.visitExp(ctx.children[1])[1];
            const bodyIds = this.visitBlock(ctx.children[3]) || [];

            let substackFirst = null;
            if (Array.isArray(bodyIds) && bodyIds.length > 0) {
                substackFirst = bodyIds[0];
                // Chain body blocks
                for (let i = 1; i < bodyIds.length; i++) {
                    this.generator.blocks[bodyIds[i - 1]].next = bodyIds[i];
                    this.generator.blocks[bodyIds[i]].parent = bodyIds[i - 1];
                }
                // Set parent of first block in substack to while block
                this.generator.blocks[bodyIds[0]].parent = null; // will be set below
            }

            const blockId = this.generator.letterCount(
                this.generator.blockIdCounter++
            );
            // Set parent of first block in substack to while block
            if (substackFirst) {
                this.generator.blocks[substackFirst].parent = blockId;
            }

            this.generator.addBlock({
                opcode: "control_while",
                id: blockId,
                parent: null,
                next: null,
                inputs: {
                    CONDITION: [2, condition],
                    SUBSTACK: [2, substackFirst],
                },
            });
            return blockId;
        }
        //console.log(ctx.children.map(c => c.getText()));
        if (
            ctx.children &&
            ctx.children.length >= 7 &&
            ctx.children[0].getText() === "for"
        ) {
            // Handles both: for i = 1, 5 do ... end
            //           and for i = 1, 5, 2 do ... end
            const varName = ctx.children[1].getText();
            const startExp = this.visitExp(ctx.children[3]);
            const endExp = this.visitExp(ctx.children[5]);
            let stepExp = 1;
            let bodyIdx = 7;
            // Check for optional step
            if (ctx.children.length >= 9 && ctx.children[6].getText() === ",") {
                stepExp = this.visitExp(ctx.children[7]);
                bodyIdx = 9;
            }
            const bodyIds = this.visitBlock(ctx.children[bodyIdx]) || [];

            // --- Variable declaration for for-loop variable ---
            if (!Object.prototype.hasOwnProperty.call(this.variableScopes, varName)) {
                this.variableScopes[varName] = "global";
                this.addVariableToProject(varName, typeof startExp === "number" ? startExp : 0, "global");
            }

            // Generate block IDs
            const setVarId = this.generator.letterCount(this.generator.blockIdCounter++);
            const repeatId = this.generator.letterCount(this.generator.blockIdCounter++);
            const eqId = this.generator.letterCount(this.generator.blockIdCounter++);
            const changeId = this.generator.letterCount(this.generator.blockIdCounter++);

            // 1. Set variable to start
            this.generator.addBlock({
                opcode: "data_setvariableto",
                id: setVarId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [1, [10, typeof startExp === "number" ? String(startExp) : String(startExp)]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });

            // 2. operator_gt (loop exit condition)
            this.generator.addBlock({
                opcode: "operator_gt",
                id: eqId,
                parent: repeatId,
                next: null,
                inputs: {
                    OPERAND1: [3, [12, varName, varName], [10, ""]],
                    OPERAND2: [1, [10, typeof endExp === "number" ? String(endExp) : String(endExp)]]
                }
            });

            // 3. data_changevariableby (increment, supports custom step)
            this.generator.addBlock({
                opcode: "data_changevariableby",
                id: changeId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [1, [4, typeof stepExp === "number" ? String(stepExp) : String(stepExp)]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });

            // 4. Chain body blocks (if any), then chain increment after the last body block
            let substackFirst = null;
            if (Array.isArray(bodyIds) && bodyIds.length > 0) {
                substackFirst = bodyIds[0];
                for (let i = 1; i < bodyIds.length; i++) {
                    this.generator.blocks[bodyIds[i - 1]].next = bodyIds[i];
                    this.generator.blocks[bodyIds[i]].parent = bodyIds[i - 1];
                }
                this.generator.blocks[bodyIds[bodyIds.length - 1]].next = changeId;
                this.generator.blocks[changeId].parent = bodyIds[bodyIds.length - 1];
                this.generator.blocks[bodyIds[0]].parent = repeatId;
            } else {
                substackFirst = changeId;
                this.generator.blocks[changeId].parent = repeatId;
            }
            this.generator.blocks[eqId].parent = repeatId;

            // 5. control_repeat_until
            this.generator.addBlock({
                opcode: "control_repeat_until",
                id: repeatId,
                parent: setVarId,
                next: null,
                inputs: {
                    SUBSTACK: [2, substackFirst],
                    CONDITION: [2, eqId]
                }
            });

            this.generator.blocks[setVarId].next = repeatId;
            return { entry: setVarId, exit: repeatId };
        }

        // --- Semi-interpreted: variable assignment ---
        if (
            ctx.children &&
            (
                (ctx.children.length === 4 && ctx.children[0].getText() === "local") ||
                (ctx.children.length === 3 && ctx.children[1].getText() === "=")
            )
        ) {
            let isLocal = false;
            let varName, valueExp;
            if (ctx.children.length === 4) {
                isLocal = true;
                varName = ctx.children[1].getText();
                valueExp = this.visitExp(ctx.children[3]);
            } else {
                varName = ctx.children[0].getText();
                valueExp = this.visitExp(ctx.children[2]);
            }
            // --- Interpreted ---
            this.setGlobal(varName, valueExp);
            // --- Transpile ---
            // Variable declaration/initialization block
            const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
            this.generator.addBlock({
                opcode: "data_setvariableto",
                id: blockId,
                parent: null,
                next: null,
                inputs: [null, this.wrapInput(typeof valueExp === "number" ? valueExp : [String(valueExp)])],
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });
            return blockId;
        }

        // --- Semi-interpreted: compound assignment ---
        if (
            ctx.children &&
            (
                (ctx.children.length === 4 && ctx.children[0].getText() === "local" && ctx.children[2].getText().match(/^[+\-*/^]=$/)) ||
                (ctx.children.length === 3 && ctx.children[1].getText().match(/^[+\-*/^]=$/))
            )
        ) {
            let isLocal = false;
            let varName, op, expChild;
            if (ctx.children.length === 4) {
                isLocal = true;
                varName = ctx.children[1].getText();
                op = ctx.children[2].getText();
                expChild = ctx.children[3];
            } else {
                varName = ctx.children[0].getText();
                op = ctx.children[1].getText();
                expChild = ctx.children[2];
            }
            const expResult = this.visitExp(expChild);
            let current = this.getGlobal(varName) || 0;
            let result;
            switch (op) {
                case "+=": result = current + expResult; break;
                case "-=": result = current - expResult; break;
                case "*=": result = current * expResult; break;
                case "/=": result = current / expResult; break;
                case "^=": result = Math.pow(current, expResult); break;
                default: throw new CompilerError(`Unsupported compound assignment: ${op}`, ctx, this.source);
            }
            this.setGlobal(varName, result);
            // --- Transpile ---
            // No need to declare variable again, just update its value
            const setBlockId = this.generator.letterCount(this.generator.blockIdCounter++);
            this.generator.addBlock({
                opcode: "data_setvariableto",
                id: setBlockId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [3, [12, varName, varName], [10, ""]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });
            return setBlockId; // <-- Return the set block as the entry
        }

        // --- Normal statement handling ---
        //console.log(ctx.children.map(c => c.getText()));
        if (
            ctx.children &&
            ctx.children.length === 5 &&
            ctx.children[0].getText() === "while"
        ) {
            // Handle while loop
            const condition = this.visitExp(ctx.children[1])[1];
            const bodyIds = this.visitBlock(ctx.children[3]) || [];

            let substackFirst = null;
            if (Array.isArray(bodyIds) && bodyIds.length > 0) {
                substackFirst = bodyIds[0];
                // Chain body blocks
                for (let i = 1; i < bodyIds.length; i++) {
                    this.generator.blocks[bodyIds[i - 1]].next = bodyIds[i];
                    this.generator.blocks[bodyIds[i]].parent = bodyIds[i - 1];
                }
                // Set parent of first block in substack to while block
                this.generator.blocks[bodyIds[0]].parent = null; // will be set below
            }

            const blockId = this.generator.letterCount(
                this.generator.blockIdCounter++
            );
            // Set parent of first block in substack to while block
            if (substackFirst) {
                this.generator.blocks[substackFirst].parent = blockId;
            }

            this.generator.addBlock({
                opcode: "control_while",
                id: blockId,
                parent: null,
                next: null,
                inputs: {
                    CONDITION: [2, condition],
                    SUBSTACK: [2, substackFirst],
                },
            });
            return blockId;
        }
        //console.log(ctx.children.map(c => c.getText()));
        if (
            ctx.children &&
            ctx.children.length >= 7 &&
            ctx.children[0].getText() === "for"
        ) {
            // Handles both: for i = 1, 5 do ... end
            //           and for i = 1, 5, 2 do ... end
            const varName = ctx.children[1].getText();
            const startExp = this.visitExp(ctx.children[3]);
            const endExp = this.visitExp(ctx.children[5]);
            let stepExp = 1;
            let bodyIdx = 7;
            // Check for optional step
            if (ctx.children.length >= 9 && ctx.children[6].getText() === ",") {
                stepExp = this.visitExp(ctx.children[7]);
                bodyIdx = 9;
            }
            const bodyIds = this.visitBlock(ctx.children[bodyIdx]) || [];

            // --- Variable declaration for for-loop variable ---
            if (!Object.prototype.hasOwnProperty.call(this.variableScopes, varName)) {
                this.variableScopes[varName] = "global";
                this.addVariableToProject(varName, typeof startExp === "number" ? startExp : 0, "global");
            }

            // Generate block IDs
            const setVarId = this.generator.letterCount(this.generator.blockIdCounter++);
            const repeatId = this.generator.letterCount(this.generator.blockIdCounter++);
            const eqId = this.generator.letterCount(this.generator.blockIdCounter++);
            const changeId = this.generator.letterCount(this.generator.blockIdCounter++);

            // 1. Set variable to start
            this.generator.addBlock({
                opcode: "data_setvariableto",
                id: setVarId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [1, [10, typeof startExp === "number" ? String(startExp) : String(startExp)]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });

            // 2. operator_gt (loop exit condition)
            this.generator.addBlock({
                opcode: "operator_gt",
                id: eqId,
                parent: repeatId,
                next: null,
                inputs: {
                    OPERAND1: [3, [12, varName, varName], [10, ""]],
                    OPERAND2: [1, [10, typeof endExp === "number" ? String(endExp) : String(endExp)]]
                }
            });

            // 3. data_changevariableby (increment, supports custom step)
            this.generator.addBlock({
                opcode: "data_changevariableby",
                id: changeId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [1, [4, typeof stepExp === "number" ? String(stepExp) : String(stepExp)]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });

            // 4. Chain body blocks (if any), then chain increment after the last body block
            let substackFirst = null;
            if (Array.isArray(bodyIds) && bodyIds.length > 0) {
                substackFirst = bodyIds[0];
                for (let i = 1; i < bodyIds.length; i++) {
                    this.generator.blocks[bodyIds[i - 1]].next = bodyIds[i];
                    this.generator.blocks[bodyIds[i]].parent = bodyIds[i - 1];
                }
                this.generator.blocks[bodyIds[bodyIds.length - 1]].next = changeId;
                this.generator.blocks[changeId].parent = bodyIds[bodyIds.length - 1];
                this.generator.blocks[bodyIds[0]].parent = repeatId;
            } else {
                substackFirst = changeId;
                this.generator.blocks[changeId].parent = repeatId;
            }
            this.generator.blocks[eqId].parent = repeatId;

            // 5. control_repeat_until
            this.generator.addBlock({
                opcode: "control_repeat_until",
                id: repeatId,
                parent: setVarId,
                next: null,
                inputs: {
                    SUBSTACK: [2, substackFirst],
                    CONDITION: [2, eqId]
                }
            });

            this.generator.blocks[setVarId].next = repeatId;
            return { entry: setVarId, exit: repeatId };
        }

        // --- Semi-interpreted: variable assignment ---
        if (
            ctx.children &&
            (
                (ctx.children.length === 4 && ctx.children[0].getText() === "local") ||
                (ctx.children.length === 3 && ctx.children[1].getText() === "=")
            )
        ) {
            let isLocal = false;
            let varName, valueExp;
            if (ctx.children.length === 4) {
                isLocal = true;
                varName = ctx.children[1].getText();
                valueExp = this.visitExp(ctx.children[3]);
            } else {
                varName = ctx.children[0].getText();
                valueExp = this.visitExp(ctx.children[2]);
            }
            // --- Interpreted ---
            this.setGlobal(varName, valueExp);
            // --- Transpile ---
            // Variable declaration/initialization block
            const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
            this.generator.addBlock({
                opcode: "data_setvariableto",
                id: blockId,
                parent: null,
                next: null,
                inputs: [null, this.wrapInput(typeof valueExp === "number" ? valueExp : [String(valueExp)])],
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });
            return blockId;
        }

        // --- Semi-interpreted: compound assignment ---
        if (
            ctx.children &&
            (
                (ctx.children.length === 4 && ctx.children[0].getText() === "local" && ctx.children[2].getText().match(/^[+\-*/^]=$/)) ||
                (ctx.children.length === 3 && ctx.children[1].getText().match(/^[+\-*/^]=$/))
            )
        ) {
            let isLocal = false;
            let varName, op, expChild;
            if (ctx.children.length === 4) {
                isLocal = true;
                varName = ctx.children[1].getText();
                op = ctx.children[2].getText();
                expChild = ctx.children[3];
            } else {
                varName = ctx.children[0].getText();
                op = ctx.children[1].getText();
                expChild = ctx.children[2];
            }
            const expResult = this.visitExp(expChild);
            let current = this.getGlobal(varName) || 0;
            let result;
            switch (op) {
                case "+=": result = current + expResult; break;
                case "-=": result = current - expResult; break;
                case "*=": result = current * expResult; break;
                case "/=": result = current / expResult; break;
                case "^=": result = Math.pow(current, expResult); break;
                default: throw new CompilerError(`Unsupported compound assignment: ${op}`, ctx, this.source);
            }
            this.setGlobal(varName, result);
            // --- Transpile ---
            // No need to declare variable again, just update its value
            const setBlockId = this.generator.letterCount(this.generator.blockIdCounter++);
            this.generator.addBlock({
                opcode: "data_setvariableto",
                id: setBlockId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [3, [12, varName, varName], [10, ""]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });
            return setBlockId; // <-- Return the set block as the entry
        }

        // --- Normal statement handling ---
        //console.log(ctx.children.map(c => c.getText()));
        if (
            ctx.children &&
            ctx.children.length === 5 &&
            ctx.children[0].getText() === "while"
        ) {
            // Handle while loop
            const condition = this.visitExp(ctx.children[1])[1];
            const bodyIds = this.visitBlock(ctx.children[3]) || [];

            let substackFirst = null;
            if (Array.isArray(bodyIds) && bodyIds.length > 0) {
                substackFirst = bodyIds[0];
                // Chain body blocks
                for (let i = 1; i < bodyIds.length; i++) {
                    this.generator.blocks[bodyIds[i - 1]].next = bodyIds[i];
                    this.generator.blocks[bodyIds[i]].parent = bodyIds[i - 1];
                }
                // Set parent of first block in substack to while block
                this.generator.blocks[bodyIds[0]].parent = null; // will be set below
            }

            const blockId = this.generator.letterCount(
                this.generator.blockIdCounter++
            );
            // Set parent of first block in substack to while block
            if (substackFirst) {
                this.generator.blocks[substackFirst].parent = blockId;
            }

            this.generator.addBlock({
                opcode: "control_while",
                id: blockId,
                parent: null,
                next: null,
                inputs: {
                    CONDITION: [2, condition],
                    SUBSTACK: [2, substackFirst],
                },
            });
            return blockId;
        }
        //console.log(ctx.children.map(c => c.getText()));
        if (
            ctx.children &&
            ctx.children.length >= 7 &&
            ctx.children[0].getText() === "for"
        ) {
            // Handles both: for i = 1, 5 do ... end
            //           and for i = 1, 5, 2 do ... end
            const varName = ctx.children[1].getText();
            const startExp = this.visitExp(ctx.children[3]);
            const endExp = this.visitExp(ctx.children[5]);
            let stepExp = 1;
            let bodyIdx = 7;
            // Check for optional step
            if (ctx.children.length >= 9 && ctx.children[6].getText() === ",") {
                stepExp = this.visitExp(ctx.children[7]);
                bodyIdx = 9;
            }
            const bodyIds = this.visitBlock(ctx.children[bodyIdx]) || [];

            // --- Variable declaration for for-loop variable ---
            if (!Object.prototype.hasOwnProperty.call(this.variableScopes, varName)) {
                this.variableScopes[varName] = "global";
                this.addVariableToProject(varName, typeof startExp === "number" ? startExp : 0, "global");
            }

            // Generate block IDs
            const setVarId = this.generator.letterCount(this.generator.blockIdCounter++);
            const repeatId = this.generator.letterCount(this.generator.blockIdCounter++);
            const eqId = this.generator.letterCount(this.generator.blockIdCounter++);
            const changeId = this.generator.letterCount(this.generator.blockIdCounter++);

            // 1. Set variable to start
            this.generator.addBlock({
                opcode: "data_setvariableto",
                id: setVarId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [1, [10, typeof startExp === "number" ? String(startExp) : String(startExp)]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });

            // 2. operator_gt (loop exit condition)
            this.generator.addBlock({
                opcode: "operator_gt",
                id: eqId,
                parent: repeatId,
                next: null,
                inputs: {
                    OPERAND1: [3, [12, varName, varName], [10, ""]],
                    OPERAND2: [1, [10, typeof endExp === "number" ? String(endExp) : String(endExp)]]
                }
            });

            // 3. data_changevariableby (increment, supports custom step)
            this.generator.addBlock({
                opcode: "data_changevariableby",
                id: changeId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [1, [4, typeof stepExp === "number" ? String(stepExp) : String(stepExp)]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });

            // 4. Chain body blocks (if any), then chain increment after the last body block
            let substackFirst = null;
            if (Array.isArray(bodyIds) && bodyIds.length > 0) {
                substackFirst = bodyIds[0];
                for (let i = 1; i < bodyIds.length; i++) {
                    this.generator.blocks[bodyIds[i - 1]].next = bodyIds[i];
                    this.generator.blocks[bodyIds[i]].parent = bodyIds[i - 1];
                }
                this.generator.blocks[bodyIds[bodyIds.length - 1]].next = changeId;
                this.generator.blocks[changeId].parent = bodyIds[bodyIds.length - 1];
                this.generator.blocks[bodyIds[0]].parent = repeatId;
            } else {
                substackFirst = changeId;
                this.generator.blocks[changeId].parent = repeatId;
            }
            this.generator.blocks[eqId].parent = repeatId;

            // 5. control_repeat_until
            this.generator.addBlock({
                opcode: "control_repeat_until",
                id: repeatId,
                parent: setVarId,
                next: null,
                inputs: {
                    SUBSTACK: [2, substackFirst],
                    CONDITION: [2, eqId]
                }
            });

            this.generator.blocks[setVarId].next = repeatId;
            return { entry: setVarId, exit: repeatId };
        }

        // --- Compound assignment support: +=, -=, *=, /=, ^=
        if (
            ctx.children &&
            (
                // local x += ...
                (ctx.children.length === 4 && ctx.children[0].getText() === "local" && ctx.children[2].getText().match(/^\+=|-=|\*=|\/=|\^=$/)) ||
                // x += ...
                (ctx.children.length === 3 && ctx.children[1].getText().match(/^\+=|-=|\*=|\/=|\^=$/))
            )
        ) {
            let isLocal = false;
            let varName, op, expChild;
            if (ctx.children.length === 4) {
                isLocal = true;
                varName = ctx.children[1].getText();
                op = ctx.children[2].getText();
                expChild = ctx.children[3];
            } else {
                varName = ctx.children[0].getText();
                op = ctx.children[1].getText();
                expChild = ctx.children[2];
            }
            const expResult = this.visitExp(expChild);
            let opcode;
            switch (op) {
                case "+=": opcode = "operator_add"; break;
                case "-=": opcode = "operator_subtract"; break;
                case "*=": opcode = "operator_multiply"; break;
                case "/=": opcode = "operator_divide"; break;
                case "^=": opcode = "operator_power"; break;
                default: throw new CompilerError(`Unsupported compound assignment: ${op}`, ctx, this.source);
            }
            // Variable declaration if needed
            if (!Object.prototype.hasOwnProperty.call(this.variableScopes, varName)) {
                this.variableScopes[varName] = isLocal ? "local" : "global";
                this.addVariableToProject(varName, 0, isLocal ? "local" : "global");
            }
            // Build the operator block
            const opBlockId = this.generator.letterCount(this.generator.blockIdCounter++);
            const setBlockId = this.generator.letterCount(this.generator.blockIdCounter++);
            //console.log(this.wrapInput(expResult));
            this.generator.addBlock({
                opcode,
                id: opBlockId,
                parent: setBlockId, // <-- Set parent to set block
                next: null,
                inputs: {
                    NUM1: [3, [12, varName, varName], [10, ""]],
                    NUM2: [1, [10, String(this.wrapInput(expResult))]]
                }
            });
            // Set variable to result
            this.generator.addBlock({
                opcode: "data_setvariableto",
                id: setBlockId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [3, opBlockId, [10, ""]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });
            return setBlockId; // <-- Return the set block as the entry
        }

        // --- Variable declaration/assignment support ---
        // Syntax: local x = ... | x = ...
        if (
            ctx.children &&
            (
                (ctx.children.length === 4 && ctx.children[0].getText() === "local") || // local x = ...
                (ctx.children.length === 3 && ctx.children[1].getText() === "=") // x = ...
            )
        ) {
            let isLocal = false;
            let varName, valueExp;
            if (ctx.children.length === 4) {
                // local x = ...
                isLocal = true;
                varName = ctx.children[1].getText();
                const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
                const expResult = this.visitExp(ctx.children[3], blockId); // <-- pass blockId
                valueExp = Array.isArray(expResult) ? expResult[1] : expResult;

                // Check for redeclaration with different scope
                if (Object.prototype.hasOwnProperty.call(this.variableScopes, varName)) {
                    if (
                        (isLocal && this.variableScopes[varName] !== "local") ||
                        (!isLocal && this.variableScopes[varName] !== "global")
                    ) {
                        throw new CompilerError(
                        `Variable '${varName}' already declared as ${this.variableScopes[varName]}, cannot redeclare as ${isLocal ? "local" : "global"}`,
                        ctx,
                        this.source
                    );
                    }
                } else {
                    // First declaration: add to project
                    this.variableScopes[varName] = isLocal ? "local" : "global";
                    this.addVariableToProject(varName, typeof valueExp === "number" ? valueExp : 0, isLocal ? "local" : "global");
                }

                this.generator.addBlock({
                    opcode: "data_setvariableto",
                    id: blockId,
                    parent: null,
                    next: null,
                    inputs: [null, this.wrapInput(typeof valueExp === "number" ? valueExp : [String(valueExp)])],
                    fields: {
                        VARIABLE: [varName, varName, ""]
                    }
                });
                return blockId;
            } else {
                // x = ...
                varName = ctx.children[0].getText();
                const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
                const expResult = this.visitExp(ctx.children[2], blockId); // <-- pass blockId
                valueExp = Array.isArray(expResult) ? expResult[1] : expResult;

                // Check for redeclaration with different scope
                if (Object.prototype.hasOwnProperty.call(this.variableScopes, varName)) {
                    if (
                        (isLocal && this.variableScopes[varName] !== "local") ||
                        (!isLocal && this.variableScopes[varName] !== "global")
                    ) {
                        throw new CompilerError(
                        `Variable '${varName}' already declared as ${this.variableScopes[varName]}, cannot redeclare as ${isLocal ? "local" : "global"}`,
                        ctx,
                        this.source
                    );
                    }
                } else {
                    // First declaration: add to project
                    this.variableScopes[varName] = isLocal ? "local" : "global";
                    this.addVariableToProject(varName, typeof valueExp === "number" ? valueExp : 0, isLocal ? "local" : "global");
                }

                this.generator.addBlock({
                    opcode: "data_setvariableto",
                    id: blockId,
                    parent: null,
                    next: null,
                    inputs: [null, this.wrapInput(typeof valueExp === "number" ? valueExp : [String(valueExp)])],
                    fields: {
                        VARIABLE: [varName, varName, ""]
                    }
                });
                return blockId;
            }
        }

        // fallback to default
        let x = this.visitChildren(ctx);
        return x instanceof Array ? x[0] : x;
    }
    visitConcatenation(ctx) {}
    // Helper to wrap block references for input arrays
    wrapInput(val) {
        if (Array.isArray(val) && val[0] === 3) return [val[1]];
        if (typeof val === "string" && this.generator.blocks[val]) return [val];
        return val;
    }
    visitFunctioncall(ctx, asReporter = false) {
        const funcName = this.getText(ctx.NAME ? ctx.NAME(0) : ctx);
        // --- Semi-interpreted: print ---
        if (funcName === "print") {
            const explist = ctx.args(0).explist(0);
            const exps = explist.exp ? explist.exp() : [];
            let messageInput = this.visitExp(exps[0], null, true);
            // If printing a function reference
            if (typeof messageInput === "string" && this.customBlocks[messageInput]) {
                messageInput = `<global __function__ ${messageInput}>`;
            } else if (typeof messageInput === "function") {
                messageInput = `<global __function__ ${messageInput.name}>`;
            }
            // --- Interpreted output ---
            if (typeof messageInput !== "undefined") {
                console.log(messageInput);
            }
            // ...existing transpile logic...
            // If there is a second argument, use sayforsecs
            let blockId;
            if (exps.length > 1) {
                const secs = this.visitExp(exps[exps.length - 1], null, true);
                blockId = this.generator.addBlock({
                    opcode: "looks_sayforsecs",
                    inputs: [
                        this.wrapInput(messageInput),
                        this.wrapInput(secs)
                    ],
                    parent: null,
                    next: null,
                    shadow: false,
                    topLevel: false,
                });
            } else {
                blockId = this.generator.addBlock({
                    opcode: "looks_say",
                    inputs: [
                        this.wrapInput(messageInput)
                    ],
                    parent: null,
                    next: null,
                    shadow: false,
                    topLevel: false,
                });
            }

            return blockId;
        }
        // Handle built-in or extension opcode calls (not user-defined)
        if (!this.customBlocks[funcName] && processedBlocks[funcName]) {
            const inputsMeta = processedBlocks[funcName][0];
            const explist = ctx.args && ctx.args(0) && ctx.args(0).explist
                ? ctx.args(0).explist(0)
                : null;
            const exps = explist && explist.exp ? explist.exp() : [];
            // Build array of inputs in order
            const inputArr = [];
            for (let i = 0; i < inputsMeta.length; i++) {
                let val = exps[i] ? this.visitExp(exps[i], null, true) : "";
                inputArr.push(this.wrapInput(val));
            }
            let blockId = this.generator.addBlock({
                opcode: funcName,
                inputs: inputArr,
                parent: null,
                next: null,
                shadow: false,
                topLevel: false,
            });
            return blockId;
        }
        // User-defined function call
        const proc = this.customBlocks[funcName];
        if (!proc) {
            return this.sendText(ctx);
        }
        const callId = this.generator.letterCount(
            this.generator.blockIdCounter++
        );
        let callArgs = [];
        if (ctx.args && typeof ctx.args === "function") {
            const argsCtx = ctx.args();
            if (
                argsCtx &&
                argsCtx.explist &&
                typeof argsCtx.explist === "function"
            ) {
                const explist = argsCtx.explist(0);
                if (explist && explist.exp) callArgs = explist.exp();
            }
        }
        let callInputs = [];
        for (let i = 0; i < proc.argumentids.length; i++) {
            callInputs.push(
                callArgs[i] ? this.wrapInput(this.visitExp(callArgs[i], callId)) : ""
            );
        }
        this.generator.addBlock({
            opcode: "procedures_call",
            id: callId,
            parent: null,
            next: null,
            inputs: callInputs,
            mutation: {
                tagName: "mutation",
                children: [],
                proccode: proc.proccode,
                argumentids: JSON.stringify(proc.argumentids),
                warp: "false",
                returns: "null",
                optype: "null",
                color: JSON.stringify(["#FF6680", "#FF4D6A", "#FF3355"]),
            },
        });
        return callId;
    }
    visitExp(ctx, parentId = null, forceStringFallback = false) {
        // --- Semi-interpreted: math, bitwise, boolean, variable, function call ---
        if (ctx.STRING) {
            return ctx.getText().slice(1, -1);
        }
        if (ctx.NUMBER) {
            return Number(ctx.getText());
        }
        if (ctx.getText() === "true") return true;
        if (ctx.getText() === "false") return false;
        // Variable reference
        if (
            ctx.children &&
            ctx.children.length === 1 &&
            ctx.children[0].constructor.name.endsWith("PrefixexpContext")
        ) {
            const varName = ctx.children[0].getText();
            return this.getGlobal(varName);
        }
        // Function reference
        if (
            ctx.children &&
            ctx.children.length === 1 &&
            ctx.children[0].constructor.name === "FunctioncallContext"
        ) {
            const funcName = this.getText(ctx.children[0]);
            return this.getFunction(funcName) || funcName;
        }

        // Arithmetic, comparison, and boolean operators
        if (
            ctx.children &&
            ctx.children.length === 3 &&
            ctx.children[0].constructor.name.endsWith("ExpContext") &&
            ctx.children[2].constructor.name.endsWith("ExpContext")
        ) {
            const leftCtx = ctx.children[0];
            const op = this.getText(ctx.children[1]);
            const rightCtx = ctx.children[2];

            // Map Lua operator to Scratch/PenguinMod opcode and input names
            const opMap = {
                "+": { opcode: "operator_add", left: "NUM1", right: "NUM2" },
                "-": {
                    opcode: "operator_subtract",
                    left: "NUM1",
                    right: "NUM2",
                },
                "*": {
                    opcode: "operator_multiply",
                    left: "NUM1",
                    right: "NUM2",
                },
                "/": { opcode: "operator_divide", left: "NUM1", right: "NUM2" },
                "%": { opcode: "operator_mod", left: "NUM1", right: "NUM2" },
                "^": { opcode: "operator_power", left: "NUM1", right: "NUM2" },
                "<": {
                    opcode: "operator_lt",
                    left: "OPERAND1",
                    right: "OPERAND2",
                },
                ">": {
                    opcode: "operator_gt",
                    left: "OPERAND1",
                    right: "OPERAND2",
                },
                "<=": {
                    opcode: "operator_ltorequal",
                    left: "OPERAND1",
                    right: "OPERAND2",
                },
                ">=": {
                    opcode: "operator_gtorequal",
                    left: "OPERAND1",
                    right: "OPERAND2",
                },
                "==": {
                    opcode: "operator_equals",
                    left: "OPERAND1",
                    right: "OPERAND2",
                },
                "~=": {
                    opcode: "operator_notequal",
                    left: "OPERAND1",
                    right: "OPERAND2",
                },
                and: {
                    opcode: "operator_and",
                    left: "OPERAND1",
                    right: "OPERAND2",
                },
                or: {
                    opcode: "operator_or",
                    left: "OPERAND1",
                    right: "OPERAND2",
                },
                "&": {opcode: "pmOperatorsExpansion_binnaryAnd", left: "num1", right: "num2"},
                "|": {opcode: "pmOperatorsExpansion_binnaryOr", left: "num1", right: "num2"},
                "~": {opcode: "pmOperatorsExpansion_binnaryXor", left: "num1", right: "num2"},
                "<<": {opcode: "pmOperatorsExpansion_shiftLeft", left: "num1", right: "num2"},
                ">>": {opcode: "pmOperatorsExpansion_shiftRight", left: "num1", right: "num2"},
            };

            if (opMap[op]) {
                const { opcode } = opMap[op];
                const blockId = this.generator.letterCount(
                    this.generator.blockIdCounter++
                );
                // Pass blockId as parentId to children so their parent is set to this block
                const leftVal = this.visitExp(leftCtx, blockId);
                const rightVal = this.visitExp(rightCtx, blockId);

                this.generator.addBlock({
                    opcode,
                    id: blockId,
                    parent: parentId, // Set parent to parentId
                    next: null,
                    inputs: [
                        this.wrapInput(leftVal),
                        this.wrapInput(rightVal)
                    ],
                });

                // Boolean blocks use [3, id, [4, ""]], string/number use [3, id, [10, ""]]
                const isBoolean = [
                    "operator_lt",
                    "operator_gt",
                    "operator_ltorequal",
                    "operator_gtorequal",
                    "operator_equals",
                    "operator_notequal",
                    "operator_and",
                    "operator_or",
                    "operator_xor",
                    "operator_nand",
                    "operator_nor",
                    "operator_xnor",
                ].includes(opcode);

                if (isBoolean) {
                    return forceStringFallback
                        ? [3, blockId, [10, ""]]
                        : [3, blockId];
                } else {
                    return [3, blockId, [10, ""]];
                }
            }
        }

        // Unary operators: not
        if (
            ctx.children &&
            ctx.children.length === 2 &&
            this.getText(ctx.children[0]) === "not" || this.getText(ctx.children[0]) === "~"
        ) {
            const op = this.getText(ctx.children[0]);
            const rightCtx = ctx.children[1];
            if (op === "not") {
                const blockId = this.generator.letterCount(
                    this.generator.blockIdCounter++
                );
                const rightVal = this.visitExp(rightCtx, blockId);
                this.generator.addBlock({
                    opcode: "operator_not",
                    id: blockId,
                    parent: parentId,
                    next: null,
                    inputs: [
                        this.wrapInput(rightVal)
                    ],
                });
                return forceStringFallback
                    ? [3, blockId, [10, ""]]
                    : [3, blockId];
            } else if (op === "~") {
                const blockId = this.generator.letterCount(
                    this.generator.blockIdCounter++
                );
                const rightVal = this.visitExp(rightCtx, blockId);
                this.generator.addBlock({
                    opcode: "pmOperatorsExpansion_binnaryNot",
                    id: blockId,
                    parent: parentId,
                    next: null,
                    inputs: [
                        this.wrapInput(rightVal)
                    ],
                });
                return forceStringFallback
                    ? [3, blockId, [10, ""]]
                    : [3, blockId];
            }
        }

        // Lua booleans
        if (ctx.getText() === "true" || ctx.getText() === "false") {
            const blockId = this.generator.letterCount(
                this.generator.blockIdCounter++
            );
            this.generator.addBlock({
                opcode:
                    ctx.getText() === "true"
                        ? "operator_trueBoolean"
                        : "operator_falseBoolean",
                id: blockId,
                parent: parentId,
                next: null,
                inputs: {},
            });
            return forceStringFallback ? [3, blockId, [10, ""]] : [3, blockId];
        }
        //console.log(Object.hasOwn(ctx.children[1] || {}, "children") ? ctx.children[1].children : ctx.children[1]);
        if (
            ctx.children &&
            ctx.children.length === 2 &&
            ctx.children[0].getText() === "-" &&
            ctx.children[1].children[0].constructor.name.endsWith(
                "NumberContext"
            )
        ) {
            // Compile as negative number string
            return "-" + ctx.children[1].getText();
        }
        // If it's a variable
        //console.log(this.getText(ctx.children[0]));
        //console.log(ctx.children.map(c => c.constructor.name));
        if (
            ctx.children &&
            ctx.children.length === 1 &&
            ctx.children[0].constructor.name.endsWith("PrefixexpContext")
        ) {
            const varName = ctx.children[0].getText();
            return [3, [12, varName, varName], [10, ""]];
        }

        // Not a concat or arithmetic, fallback to child or text
        if (
            ctx.exp &&
            typeof ctx.exp === "function" &&
            ctx.exp().length === 1
        ) {
            return this.visitExp(ctx.exp(0), parentId);
        }
        return this.getText(ctx, true);
    }
    visitFunctiondef(ctx) {
        // Get function name and body
        const funcbody = ctx.funcbody();
        const parlist = funcbody.parlist();
        const block = funcbody.block();

        // Generate a unique id for the prototype and definition
        const protoId = this.generator.letterCount(
            this.generator.blockIdCounter++
        );
        const defId = this.generator.letterCount(
            this.generator.blockIdCounter++
        );

        // Gather argument names
        let argumentnames = [];
        let argumentids = [];
        let argumentdefaults = [];
        if (parlist && parlist.namelist) {
            const namelist = parlist.namelist();
            if (namelist && namelist.NAME) {
                const names = namelist.NAME();
                for (let i = 0; i < names.length; i++) {
                    const argName = names[i].getText();
                    argumentnames.push(argName);
                    argumentids.push(protoId + "_arg" + i);
                    argumentdefaults.push("");
                }
            }
        }

        // Create the prototype block
        const prototype = {
            opcode: "procedures_prototype",
            id: protoId,
            next: null,
            parent: defId,
            inputs: {},
            shadow: true,
            mutation: {
                tagName: "mutation",
                children: [],
                proccode:
                    "myfunction" + argumentnames.map(() => " %s").join(""),
                argumentids: JSON.stringify(argumentids),
                argumentnames: JSON.stringify(argumentnames),
                argumentdefaults: JSON.stringify(argumentdefaults),
                warp: "false",
            },
        };

        // Create the definition block
        const definition = {
            opcode: "procedures_definition",
            id: defId,
            next: null,
            parent: null,
            inputs: {
                custom_block: [1, protoId],
            },
            topLevel: true,
            x: 0,
            y: 0,
        };

        // Add blocks to generator
        this.generator.addBlock(prototype);
        this.generator.addBlock(definition);

        // Visit the function body (block)
        if (block) {
            this.visitBlock(block);
        }

        // Optionally, store custom block info for calls
        // this.customBlocks[funcName] = { prototype, definition };

        return;
    }
}
module.exports = visitor;
