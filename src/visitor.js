const LuaParserVisitor = require("../lib/LuaParserVisitor").default;
const _generator = require("../utils/generator");
const { processedBlocks } = require("./blocks.js");

//console.log(Object.getOwnPropertyNames(v))
class visitor extends LuaParserVisitor {
    constructor() {
        super();
        this.idCounter = 0;
        this.blocks = {};
        this.generator = new _generator();
        this.customBlocks = {};
        this.mainBodyBlockIds = [];
        this.variableScopes = {}; // { varName: "local" | "global" }
    }

    // Helper to add variable to the correct place in the project template
    addVariableToProject(varName, initialValue, scope = "global") {
        // Get the generator's template object
        const project = this.generator.template;
        let target;
        if (scope === "local") {
            target = project.targets.find(t => t.name === "Sprite1");
        } else {
            target = project.targets.find(t => t.isStage);
        }
        if (!target.variables) target.variables = {};
        // Only add if not already present
        if (!Object.prototype.hasOwnProperty.call(target.variables, varName)) {
            target.variables[varName] = [varName, initialValue];
        }
    }

    // isType and getText methods are just ripped straight from fplus
    /*
    might not even need isType because the you can just define
    visit methods for each type you need.
    fplus would've been way easier to make if i knew this lmao
    */
    isType(ctx, type) {
        return (() => {
            try {
                return !!ctx[type]();
            } catch (e) {
                return false;
            }
        })();
    }
    getText(ctx, parse = false) {
        return (() => {
            try {
                return parse ? JSON.parse(ctx.getText()) : ctx.getText();
            } catch (e) {
                return "";
            }
        })();
    }
    getName(ctx) {
        return (() => {
            try {
                return (
                    /*
                    shitty precedence order(based on what name you would most likely be looking for) 
                    to try and get token name lol
                    for example a statement would have the following precedence order,
                    statement ||
                    BREAK(the lexer token that equals the literal word "break") ||
                    break(what BREAK equals, matches the literal word "break" anywhere in the input)
                    */
                    ctx.parser.ruleNames[ctx.ruleIndex] ||
                    ctx.parser.symbolicNames[ctx.start.type] ||
                    ctx.parser.literalNames[ctx.start.type]
                );
            } catch (e) {
                return null;
            }
        })();
    }
    sendText(ctx, name = false) {
        return `${name || this.getName(ctx)}: ${this.getText(ctx)}`;
    }
    getAndClearBlocks() {
        let blocksCopy = { ...this.blocks };
        this.blocks = {};
        return blocksCopy;
    }
    visitStatement(ctx) {
        //console.log("visiting statement", this.getText(ctx));
        //console.log(ctx.children.length);
        //console.log("Statement children:", ctx.children.map(c => c.getText()));
        if (
            ctx.children &&
            ctx.children.length === 3 &&
            ctx.children[0].getText() === "function" &&
            ctx.children[1].constructor.name === "FuncnameContext" &&
            ctx.children[2].constructor.name === "FuncbodyContext"
        ) {
            const funcnameCtx = ctx.children[1];
            const funcbodyCtx = ctx.children[2];
            const funcName = funcnameCtx.getText();

            // Special handling for main
            if (funcName === "main") {
                // Visit the body and collect block IDs
                const block = funcbodyCtx.block();
                let bodyBlockIds = [];
                if (block && block.children) {
                    for (const child of block.children) {
                        if (
                            child.constructor &&
                            child.constructor.name.endsWith("StatementContext")
                        ) {
                            const stmtId = this.visit(child);
                            if (stmtId) bodyBlockIds.push(stmtId);
                        }
                    }
                }
                // --- CHAINING MAIN BODY ---
                if (bodyBlockIds.length > 0) {
                    // Set parent and next using actual block IDs
                    bodyBlockIds[0] && (this.generator.blocks[bodyBlockIds[0]].parent = null); // parent will be set to flag in index.js
                    for (let i = 1; i < bodyBlockIds.length; i++) {
                        this.generator.blocks[bodyBlockIds[i - 1]].next = bodyBlockIds[i];
                        this.generator.blocks[bodyBlockIds[i]].parent = bodyBlockIds[i - 1];
                    }
                    this.generator.blocks[bodyBlockIds[bodyBlockIds.length - 1]].next = null;
                }
                // Save for index.js to chain under flag
                this.mainBodyBlockIds = bodyBlockIds;
                // Do NOT emit any blocks for main itself
                return null;
            }

            // Get parameter names
            const parlist = funcbodyCtx.parlist();
            let argumentnames = [];
            if (parlist && parlist.namelist) {
                const namelist = parlist.namelist();
                if (namelist && namelist.NAME) {
                    const names = namelist.NAME();
                    for (let i = 0; i < names.length; i++) {
                        argumentnames.push(names[i].getText());
                    }
                }
            }

            // Special rule for "main" function: must have no arguments
            if (funcName === "main" && argumentnames.length > 0) {
                throw new Error(
                    'The "main" function must not have any arguments.'
                );
            }

            // --- Normal function/procedure block generation ---
            let argumentids = argumentnames.map(() =>
                this.generator.letterCount(this.generator.blockIdCounter++)
            );
            let argumentdefaults = argumentnames.map(() => "");
            let proccode =
                funcName +
                (argumentnames.length
                    ? " " + argumentnames.map(() => "%s").join(", ")
                    : "");
            const defId = this.generator.letterCount(
                this.generator.blockIdCounter++
            );
            const protoId = this.generator.letterCount(
                this.generator.blockIdCounter++
            );

            // Add prototype block
            this.generator.addBlock({
                opcode: "procedures_prototype",
                id: protoId,
                parent: defId,
                next: null,
                shadow: true,
                mutation: {
                    tagName: "mutation",
                    children: [],
                    proccode,
                    argumentids: JSON.stringify(argumentids),
                    argumentnames: JSON.stringify(argumentnames),
                    argumentdefaults: JSON.stringify(argumentdefaults),
                    warp: "true",
                    returns: "null",
                    edited: "true",
                    optype: "null",
                    color: JSON.stringify(["#FF6680", "#FF4D6A", "#FF3355"]),
                },
            });

            // Add argument blocks
            argumentids.forEach((id, i) => {
                this.generator.addBlock({
                    opcode: "argument_reporter_string_number",
                    id,
                    parent: protoId,
                    next: null,
                    shadow: true,
                    fields: { VALUE: [argumentnames[i], ""] },
                    mutation: {
                        color: JSON.stringify([
                            "#FF6680",
                            "#FF4D6A",
                            "#FF3355",
                        ]),
                    },
                });
            });

            // --- BODY PARSING ---
            const block = funcbodyCtx.block();
            let bodyBlockIds = [];
            if (block && block.children) {
                for (const child of block.children) {
                    if (
                        child.constructor &&
                        child.constructor.name.endsWith("StatementContext")
                    ) {
                        const stmtId = this.visit(child);
                        if (stmtId) bodyBlockIds.push(stmtId);
                    }
                }
            }

            // Add the definition block FIRST so it exists in generator.blocks
            this.generator.addBlock({
                opcode: "procedures_definition",
                id: defId,
                parent: null,
                // next will be set below
                topLevel: true,
                inputs: { custom_block: [1, protoId] },
                children: bodyBlockIds,
            });

            // --- CHAINING FIX ---
            if (bodyBlockIds.length > 0) {
                // Set parent and next using actual block IDs
                this.generator.blocks[bodyBlockIds[0]].parent = defId;
                this.generator.blocks[defId].next = bodyBlockIds[0];
                for (let i = 1; i < bodyBlockIds.length; i++) {
                    const prevId = bodyBlockIds[i - 1];
                    const currId = bodyBlockIds[i];
                    this.generator.blocks[currId].parent = prevId;
                    this.generator.blocks[prevId].next = currId;
                }
                this.generator.blocks[
                    bodyBlockIds[bodyBlockIds.length - 1]
                ].next = null;
            } else {
                this.generator.blocks[defId].next = null;
            }

            this.customBlocks[funcName] = {
                proccode,
                argumentids,
                argumentnames,
                protoId,
                defId,
            };

            return defId;
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
            const body = this.visitBlock(ctx.children[3])[0];
            const blockId = this.generator.letterCount(
                this.generator.blockIdCounter++
            );
            this.generator.addBlock({
                opcode: "control_while",
                id: blockId,
                parent: null,
                next: null,
                inputs: {
                    CONDITION: [2, condition],
                    SUBSTACK: [2, body],
                },
            });
            return blockId;
        }
        console.log(ctx.children.map(c => c.getText()));
        if (
            ctx.children &&
            ctx.children.length < 10 &&
            ctx.children[0].getText() === "for"
        ) {
            // Parse for loop: for x = start, end do ... end
            const varName = ctx.children[1].getText();
            const startExp = this.visitExp(ctx.children[3]);
            const endExp = this.visitExp(ctx.children[5]);
            const bodyIds = this.visitBlock(ctx.children[7]) || [];

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
                parent: null, // Will be set by parent (e.g., flag)
                next: repeatId,   // Set next to repeatId here!
                inputs: {
                    VALUE: [1, [10, typeof startExp === "number" ? String(startExp) : String(startExp)]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });

            // 2. operator_equals (loop exit condition)
            this.generator.addBlock({
                opcode: "operator_gt",
                id: eqId,
                parent: repeatId,
                next: null,
                inputs: {
                    OPERAND1: [3, [12, varName, varName], [10, ""]],
                    OPERAND2: [1, [10, String(endExp)]]
                }
            });

            // 3. data_changevariableby (increment)
            this.generator.addBlock({
                opcode: "data_changevariableby",
                id: changeId,
                parent: null, // Will be set below
                next: null,
                inputs: {
                    VALUE: [1, [4, "1"]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });

            // 4. Chain body blocks (if any), then chain increment after the last body block
            let substackFirst = null;
            if (Array.isArray(bodyIds) && bodyIds.length > 0) {
                substackFirst = bodyIds[0];
                // Chain body blocks
                for (let i = 1; i < bodyIds.length; i++) {
                    this.generator.blocks[bodyIds[i - 1]].next = bodyIds[i];
                    this.generator.blocks[bodyIds[i]].parent = bodyIds[i - 1];
                }
                // Chain increment after last body block
                this.generator.blocks[bodyIds[bodyIds.length - 1]].next = changeId;
                this.generator.blocks[changeId].parent = bodyIds[bodyIds.length - 1];
                // Set parent of first block in substack to repeatId
                this.generator.blocks[bodyIds[0]].parent = repeatId;
            } else {
                // No body, increment is the only substack
                substackFirst = changeId;
                this.generator.blocks[changeId].parent = repeatId;
            }
            // Set parent of condition block to repeatId
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

            // Ensure setvariableto's next is set to repeatId
            console.log(repeatId, setVarId);
            this.generator.blocks[setVarId].next = repeatId;

            // Return the id of the first block in the chain
            return setVarId;
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
                valueExp = this.visitExp(ctx.children[3]);
            } else {
                // x = ...
                varName = ctx.children[0].getText();
                valueExp = this.visitExp(ctx.children[2]);
            }

            // Check for redeclaration with different scope
            if (Object.prototype.hasOwnProperty.call(this.variableScopes, varName)) {
                if (
                    (isLocal && this.variableScopes[varName] !== "local") ||
                    (!isLocal && this.variableScopes[varName] !== "global")
                ) {
                    throw new Error(
                        `Variable '${varName}' already declared as ${this.variableScopes[varName]}, cannot redeclare as ${isLocal ? "local" : "global"}`
                    );
                }
            } else {
                // First declaration: add to project
                this.variableScopes[varName] = isLocal ? "local" : "global";
                this.addVariableToProject(varName, typeof valueExp === "number" ? valueExp : 0, isLocal ? "local" : "global");
            }

            // Assignment block
            const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
            this.generator.addBlock({
                opcode: "data_setvariableto",
                id: blockId,
                parent: null,
                next: null,
                inputs: {
                    VALUE: [1, [10, typeof valueExp === "number" ? String(valueExp) : String(valueExp)]]
                },
                fields: {
                    VARIABLE: [varName, varName, ""]
                }
            });
            return blockId;
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

        // Handle built-in print
        if (funcName === "print") {
            const explist = ctx.args(0).explist(0);
            const exps = explist.exp ? explist.exp() : [];
            let messageInput;
            let joinBlockIds = [];

            // Build the message input (join chain if needed)
            if (exps.length > 0) {
                let left = this.visitExp(exps[0], null, true);
                for (
                    let i = 1;
                    i < exps.length - (exps.length > 1 ? 1 : 0);
                    i++
                ) {
                    const rightVal = this.visitExp(exps[i], null, true);
                    const joinId = this.generator.letterCount(this.generator.blockIdCounter++);
                    this.generator.addBlock({
                        opcode: "operator_join",
                        id: joinId,
                        parent: null,
                        next: null,
                        inputs: [
                            this.wrapInput(left),
                            this.wrapInput(rightVal)
                        ],
                    });
                    joinBlockIds.push(joinId);
                    left = [3, joinId, [10, ""]];
                }
                messageInput = left;
            } else {
                messageInput = "";
            }

            // If messageInput is a block reference, set its parent to the say block's id
            if (
                Array.isArray(messageInput) &&
                messageInput[0] === 3 &&
                typeof messageInput[1] === "string"
            ) {
                const sayBlockId = this.generator.letterCount(
                    this.generator.blockIdCounter
                );
                this.generator.blocks[messageInput[1]].parent = sayBlockId;
            }

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

            // Set parent of join blocks to the say/sayforsecs block
            for (const joinId of joinBlockIds) {
                this.generator.blocks[joinId].parent = blockId;
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
        // If it's a string literal
        if (ctx.STRING) {
            return ctx.getText().slice(1, -1); // Remove quotes
        }

        // If it's a function call (reporter or user-defined)
        if (
            ctx.children &&
            ctx.children.length === 1
        ) {
            const child = ctx.children[0];
            // Direct function call
            if (child.constructor && child.constructor.name === "FunctioncallContext") {
                return this.visitFunctioncall(child, true);
            }
            // Prefixexp wrapping a function call
            if (
                child.constructor &&
                child.constructor.name === "PrefixexpContext" &&
                child.children &&
                child.children.length === 1 &&
                child.children[0].constructor &&
                child.children[0].constructor.name === "FunctioncallContext"
            ) {
                return this.visitFunctioncall(child.children[0], true);
            }
        }

        // Concatenation: exp .. exp
        if (
            ctx.children &&
            ctx.children.length >= 3 &&
            ctx.children.some((child) => this.getText(child) === "..")
        ) {
            // Find all exp children and all '..' operators
            let exps = [];
            for (let i = 0; i < ctx.children.length; i++) {
                if (ctx.children[i].constructor.name.endsWith("ExpContext")) {
                    exps.push(ctx.children[i]);
                }
            }

            // --- Use wrapInput for join inputs ---
            // Use the class method for consistency
            // Left-associative: (((a .. b) .. c) .. d)
            let currentInput = this.visitExp(exps[0], null);
            for (let i = 1; i < exps.length; i++) {
                const joinId = this.generator.letterCount(
                    this.generator.blockIdCounter++
                );
                const rightVal = this.visitExp(exps[i], null, true);

                this.generator.addBlock({
                    opcode: "operator_join",
                    id: joinId,
                    parent: parentId,
                    next: null,
                    inputs: [
                        this.wrapInput(currentInput),
                        this.wrapInput(rightVal)
                    ],
                });
                currentInput = [3, joinId, [10, ""]];
            }
            return currentInput;
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
            this.getText(ctx.children[0]) === "not"
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
