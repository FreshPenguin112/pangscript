// the following regex can be used to find all uncommented console.log statements in vscode because i'm lazy
// ^(?!\s*\/\/).*console\.log\([^)]*\);?
const LuaParserVisitor = require("../lib/LuaParserVisitor").default;
const _generator = require("../utils/generator");
const CompilerError = require("../utils/CompilerError");
const { processedBlocks } = require("./blocks.js");
const { parseComments } = require('./commentProcessor');

class visitor extends LuaParserVisitor {
    constructor(source) {
        super();
        this.idCounter = 0;
        this.blocks = {};
        this.source = source.toString();
        // parse comment directives from source
        const { lineComments, inlineComments, blockComments } = parseComments(this.source);
        this._lineComments = lineComments;
        this._inlineComments = inlineComments;
        this._blockComments = blockComments;
        this.generator = new _generator();
        this.customBlocks = {};
        this.mainBodyBlockIds = [];
        this.variableScopes = {};
        this.types = {};
        this.variableGetters = {};
    }

    // Helper to extract type annotation from context
    getTypeAnnotation(ctx) {
        if (!ctx) return null;
        try {
            if (typeof ctx.typeAnnotation === 'function') {
                const ta = ctx.typeAnnotation(0);
                if (ta && typeof ta.NAME === 'function' && ta.NAME().length > 0) {
                    return ta.NAME(0).getText();
                }
                if (ta && ta.NAME && typeof ta.NAME.getText === 'function') {
                    return ta.NAME.getText();
                }
            } else if (ctx.typeAnnotation && ctx.typeAnnotation.NAME) {
                return ctx.typeAnnotation.NAME.getText();
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    // Helper to extract base variable name and type from "name:type"
    extractVarNameAndType(varString) {
        if (typeof varString !== "string") return [varString, null];
        const match = /^([a-zA-Z_][a-zA-Z0-9_]*)(?::([a-zA-Z_][a-zA-Z0-9_]*))?$/.exec(varString);
        if (match) return [match[1], match[2] || null];
        return [varString, null];
    }

    // Helper to add variable to the correct place in the project template
    addVariableToProject(varName, initialValue, scope = "global", type = null) {
        const project = this.generator.template;
        let target;
        if (scope === "local") {
            target = project.targets.find(t => t.name === "Sprite1");
        } else {
            target = project.targets.find(t => t.isStage);
        }
        if (!target.variables) target.variables = {};
        const [baseName, typeFromName] = this.extractVarNameAndType(varName);
        // Always update type if provided (for reassignment)
        if (type || typeFromName) this.types[baseName] = type || typeFromName;
        if (!Object.prototype.hasOwnProperty.call(target.variables, baseName)) {
            target.variables[baseName] = [baseName, initialValue];
        }
        // Ensure a reporter block exists for the variable so inputs can reference it
        if (!this.variableGetters[baseName]) {
            const reporterId = this.generator.addBlock({
                opcode: "data_variable",
                parent: null,
                next: null,
                fields: { VARIABLE: [baseName, baseName, ""] },
                shadow: false,
                topLevel: false,
            });
            this.variableGetters[baseName] = reporterId;
        }
    }

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

    // Helper to wrap block references for input arrays
    wrapInput(val) {
        // (no-op) wrapInput runs on expression results and will normalize them
        // If it's already a block reference, ensure it points to a reporter-like block.
        if (Array.isArray(val) && val[0] === 3) {
            const refId = val[1];
            if (typeof refId === 'string' && this.generator.blocks[refId]) {
                const blk = this.generator.blocks[refId];
                const opcode = blk && blk.opcode ? blk.opcode : '';
                // If an inline comment exists for this expression's line, wrap the existing reporter
                try {
                    if (this._lastExpLine && this._inlineComments && this._inlineComments[this._lastExpLine]) {
                        const text = this._inlineComments[this._lastExpLine];
                        // if the reporter returns boolean-like value, create labelBoolean wrapper
                        const repWrapId = this.generator.letterCount(this.generator.blockIdCounter++);
                        const isBoolCandidate = opcode && (opcode.startsWith('operator_') && opcode.includes('true') === false);
                        // Choose label type conservatively: use labelReporter unless value looks boolean
                        const wrapOpcode = isBoolCandidate ? 'jwProto_labelBoolean' : 'jwProto_labelReporter';
                        // Add wrapper block that accepts the reporter as input (if reporterReporter needs input)
                        this.generator.addBlock({
                            opcode: wrapOpcode,
                            id: repWrapId,
                            parent: null,
                            next: null,
                            shadow: false,
                            topLevel: false,
                            inputs: [[3, refId, [10, '']]],
                            fields: { LABEL: [text, text, ''] }
                        });
                        // Re-parent the original reporter under the wrapper
                        try { this.generator.blocks[refId].parent = repWrapId; } catch (e) {}
                        return [3, repWrapId, [10, '']];
                    }
                } catch (e) {}
                // Treat all jgJSON_ opcodes as reporter blocks (they return modified data)
                if (typeof opcode === 'string' && opcode.startsWith('jgJSON_')) return val;
                // Use processedBlocks to determine if the opcode is a value-reporting block
                let isReporter = false;
                try {
                    const pb = processedBlocks[opcode];
                    if (pb && Array.isArray(pb)) {
                        // processedBlocks entries exist for value-reporting blocks; assume reporter
                        isReporter = true;
                    }
                } catch (e) {
                    // conservative fallback
                    isReporter = opcode.startsWith('operator_') || opcode === 'data_variable';
                }
                if (isReporter) return val;

                // If it's a setter statement with a VARIABLE field, try to map to the variable getter reporter
                if (blk.fields && blk.fields.VARIABLE && Array.isArray(blk.fields.VARIABLE)) {
                    const varName = blk.fields.VARIABLE[0];
                    const getter = this.variableGetters[varName];
                    if (getter) return [3, getter, [10, '']];
                }

                // Try to find a reporter child inside its inputs
                const inputs = blk.inputs || (blk.inputs === 0 ? blk.inputs : null);
                if (inputs) {
                    const candidates = Array.isArray(inputs) ? inputs : Object.values(inputs);
                    for (const inp of candidates) {
                        if (Array.isArray(inp) && inp[0] === 3 && typeof inp[1] === 'string' && this.generator.blocks[inp[1]]) {
                            return inp; // use the reporter child instead
                        }
                    }
                }
            }
            // Fallback: do not propagate statement block references into inputs
            return [1, [10, '']];
        }
        // If it's a variable reference (from visitExp): [12, varName, varName]
        if (Array.isArray(val) && val[0] === 12) {
            const varName = val[1];
            const [baseName] = this.extractVarNameAndType(varName);
            const getterId = this.variableGetters[baseName];
            if (getterId) {
                // Use the canonical getter reporter for this variable.
                // Parenting will be handled by the caller when the getter is used as an input.
                return [3, getterId, [10, ""]];
            }
            // fallback to previous behavior if no getter exists
            return [3, val, [10, ""]];
        }
    // If it's a block id string, prefer to use it only when it is a reporter-like block.
    if (typeof val === "string" && this.generator.blocks[val]) {
        const blk = this.generator.blocks[val];
        const opcode = blk && blk.opcode ? blk.opcode : "";
        const reporterPrefixes = [
            "operator_",
            "jgJSON_",
            "argument_reporter",
            "procedures_call",
            "pmOperatorsExpansion_",
            "operator_trueBoolean",
            "operator_falseBoolean",
            "data_variable"
        ];
        const isReporter = reporterPrefixes.some(p => opcode === p || opcode.startsWith(p));
        if (isReporter) {
            return [3, val, [10, ""]];
        }
        // If the referenced block is a statement, try to find a reporter child inside its inputs
        const inputs = blk.inputs || blk.inputs === 0 ? blk.inputs : null;
        if (inputs) {
            const candidates = Array.isArray(inputs) ? inputs : Object.values(inputs);
            for (const inp of candidates) {
                if (Array.isArray(inp) && inp[0] === 3 && typeof inp[1] === 'string' && this.generator.blocks[inp[1]]) {
                    return inp; // use the reporter child instead
                }
            }
        }
        // Fallback: return empty string literal instead of referencing a statement block
        return [1, [10, ""]];
    }
        // Otherwise, treat as direct value and return in the input-value shape
        if (typeof val === "number") {
            return [1, [4, String(val)]];
        }
        // If it's already a JSON-like string (e.g. "[1,2]") keep as string input
        // Attach inline comment if present on the same source line (if val came from visitExp with a _lastLine)
        const out = [1, [10, val == null ? "" : String(val)]];
        try {
            if (this._lastExpLine && this._inlineComments && this._inlineComments[this._lastExpLine]) {
                const text = this._inlineComments[this._lastExpLine];
                // If the literal is a boolean-like value, emit a labelBoolean
                const valStr = String(val == null ? '' : val).trim();
                if (valStr === 'true' || valStr === 'false' || typeof val === 'boolean') {
                    const repId = this.generator.addBlock({
                        opcode: 'jwProto_labelBoolean',
                        parent: null,
                        next: null,
                        shadow: false,
                        topLevel: false,
                        inputs: [],
                        fields: { LABEL: [text, text, ''] }
                    });
                    return [3, repId, [10, '']];
                }
                // Otherwise create a label reporter block and return its reporter id as wrapper
                const repId = this.generator.addBlock({
                    opcode: 'jwProto_labelReporter',
                    parent: null,
                    next: null,
                    shadow: false,
                    topLevel: false,
                    inputs: [out],
                    fields: { LABEL: [text, text, ''] }
                });
                // parent the original value into the reporter block
                if (Array.isArray(out) && out[0] === 3 && typeof out[1] === 'string' && this.generator.blocks[out[1]]) {
                    this.generator.blocks[out[1]].parent = repId;
                }
                return [3, repId, [10, '']];
            }
        } catch (e) {}
        return out;
    }

    // Helper: emit a line label block before the next top-level statement
    emitLineLabelFor(lineNumber, beforeBlockId) {
        if (!lineNumber) return null;
        const text = this._lineComments && this._lineComments[lineNumber];
        if (!text) return null;
        const id = this.generator.letterCount(this.generator.blockIdCounter++);
        this.generator.addBlock({
            opcode: 'jwProto_labelCommand',
            id,
            parent: null,
            next: null,
            shadow: false,
            topLevel: false,
            fields: { LABEL: [text, text, ''] }
        });
        // If beforeBlockId exists, chain label -> beforeBlockId
        if (beforeBlockId && this.generator.blocks[beforeBlockId]) {
            this.generator.blocks[id].next = beforeBlockId;
            this.generator.blocks[beforeBlockId].parent = id;
        }
        return id;
    }

    // --- Variable declaration/assignment support ---
    visitStatement(ctx) {
        // Emit any line label comment that appears on this statement's starting line
        try {
            const line = ctx.start && ctx.start.line;
            if (line && this._lineComments && this._lineComments[line]) {
                this._pendingLineLabel = { line, text: this._lineComments[line], type: 'command' };
            }
            // check for block comment starting at this line
            if (line && this._blockComments && Array.isArray(this._blockComments)) {
                for (const bc of this._blockComments) {
                    if (bc.startLine === line) {
                        // schedule a function-style label for the block
                        this._pendingLineLabel = { line, text: bc.text || '', type: 'function' };
                        break;
                    }
                }
            }
        } catch (e) {}
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
                    // Use .entry for the first block
                    const firstEntry = bodyBlockIds[0].entry ?? bodyBlockIds[0];
                    if (this.generator.blocks[firstEntry]) {
                        this.generator.blocks[firstEntry].parent = null;
                    }
                    for (let i = 0; i < bodyBlockIds.length - 1; i++) {
                        const current = bodyBlockIds[i];
                        const next = bodyBlockIds[i + 1];
                        const currentExit = current.exit ?? current;
                        const nextEntry = next.entry ?? next;
                        if (
                            this.generator.blocks[currentExit] &&
                            this.generator.blocks[nextEntry] &&
                            this.generator.blocks[currentExit].next == null
                        ) {
                                this.generator.blocks[currentExit].next = nextEntry;
                                // Ensure the next block's parent matches the current block's parent
                                try {
                                    const prevParent = this.generator.blocks[currentExit].parent ?? null;
                                    this.generator.blocks[nextEntry].parent = prevParent;
                                } catch (e) {
                                    // ignore if something unexpected
                                }
                        }
                    }
                }
                // Post-process: ensure parent links along the chain are consistent
                for (let i = 0; i < bodyBlockIds.length - 1; i++) {
                    const current = bodyBlockIds[i];
                    const next = bodyBlockIds[i + 1];
                    const currentExit = current.exit ?? current;
                    const nextEntry = next.entry ?? next;
                    if (this.generator.blocks[currentExit] && this.generator.blocks[nextEntry]) {
                        // set the next entry's parent to currentExit if not already set
                        try {
                            this.generator.blocks[nextEntry].parent = this.generator.blocks[nextEntry].parent || currentExit;
                        } catch (e) {}
                    }
                }
                // Save for index.js to chain under flag
                this.mainBodyBlockIds = bodyBlockIds;
                // Do NOT emit any blocks for main itself
                if (this._pendingLineLabel) this._pendingLineLabel = null;
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

            // --- CHAINING FIX for normal function/procedure ---
            if (bodyBlockIds.length > 0) {
                // Set parent and next using actual block IDs
                const firstEntry = bodyBlockIds[0].entry ?? bodyBlockIds[0];
                this.generator.blocks[firstEntry].parent = defId;
                this.generator.blocks[defId].next = firstEntry;
                for (let i = 1; i < bodyBlockIds.length; i++) {
                    const prev = bodyBlockIds[i - 1];
                    const curr = bodyBlockIds[i];
                    const prevExit = prev.exit ?? prev;
                    const currEntry = curr.entry ?? curr;
                    this.generator.blocks[currEntry].parent = prevExit;
                    this.generator.blocks[prevExit].next = currEntry;
                }
                const lastExit = (bodyBlockIds[bodyBlockIds.length - 1].exit ?? bodyBlockIds[bodyBlockIds.length - 1]);
                this.generator.blocks[lastExit].next = null;
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
            let varName, valueExp, type = null;
            if (ctx.children.length === 4) {
                // local x = ...
                isLocal = true;
                varName = ctx.children[1].getText();
                if (ctx.children[1].typeAnnotation) {
                    type = this.getTypeAnnotation(ctx.children[1]);
                }
                const [baseName, typeFromName] = this.extractVarNameAndType(varName);
                const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
                const expResult = this.visitExp(ctx.children[3], blockId);
                valueExp = expResult; // <--- use expResult directly!

                this.variableScopes[baseName] = isLocal ? "local" : "global";
                this.addVariableToProject(baseName, typeof valueExp === "number" ? valueExp : 0, isLocal ? "local" : "global", type || typeFromName);

                // Special handling for JSON arrays/objects: assign as direct value
                if (typeof valueExp === "string" && (valueExp.startsWith("[") || valueExp.startsWith("{"))) {
                    this.generator.addBlock({
                        opcode: "data_setvariableto",
                        id: blockId,
                        parent: null,
                        next: null,
                        inputs: {
                            VALUE: [1, [10, valueExp]]
                        },
                        fields: {
                            VARIABLE: [baseName, baseName, ""]
                        }
                    });
                    return blockId;
                }

                // If it's a block reference
                if (Array.isArray(valueExp) && valueExp[0] === 3) {
                    this.generator.addBlock({
                        opcode: "data_setvariableto",
                        id: blockId,
                        parent: null,
                        next: null,
                        inputs: {
                            VALUE: valueExp
                        },
                        fields: {
                            VARIABLE: [baseName, baseName, ""]
                        }
                    });
                    return blockId;
                }

                // Otherwise, treat as direct value (number or string)
                this.generator.addBlock({
                    opcode: "data_setvariableto",
                    id: blockId,
                    parent: null,
                    next: null,
                    inputs: {
                        VALUE: this.wrapInput(valueExp)
                    },
                    fields: {
                        VARIABLE: [baseName, baseName, ""]
                    }
                });
                return blockId;
            } else {
                // x = ...
                varName = ctx.children[0].getText();
                if (ctx.children[0].typeAnnotation) {
                    type = this.getTypeAnnotation(ctx.children[0]);
                }
                const [baseName, typeFromName] = this.extractVarNameAndType(varName);
                const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
                const expResult = this.visitExp(ctx.children[2], blockId);
                valueExp = expResult; // <--- use expResult directly!

                this.variableScopes[baseName] = isLocal ? "local" : "global";
                this.addVariableToProject(baseName, typeof valueExp === "number" ? valueExp : 0, isLocal ? "local" : "global", type || typeFromName);

                // Special handling for JSON arrays/objects: assign as direct value
                if (typeof valueExp === "string" && (valueExp.startsWith("[") || valueExp.startsWith("{"))) {
                    this.generator.addBlock({
                        opcode: "data_setvariableto",
                        id: blockId,
                        parent: null,
                        next: null,
                        inputs: {
                            VALUE: [1, [10, valueExp]]
                        },
                        fields: {
                            VARIABLE: [baseName, baseName, ""]
                        }
                    });
                    return blockId;
                }

                // If it's a block reference
                if (Array.isArray(valueExp) && valueExp[0] === 3) {
                    this.generator.addBlock({
                        opcode: "data_setvariableto",
                        id: blockId,
                        parent: null,
                        next: null,
                        inputs: {
                            VALUE: valueExp
                        },
                        fields: {
                            VARIABLE: [baseName, baseName, ""]
                        }
                    });
                    return blockId;
                }

                // Otherwise, treat as direct value (number or string)
                this.generator.addBlock({
                    opcode: "data_setvariableto",
                    id: blockId,
                    parent: null,
                    next: null,
                    inputs: {
                        VALUE: this.wrapInput(valueExp)
                    },
                    fields: {
                        VARIABLE: [baseName, baseName, ""]
                    }
                });
                return blockId;
            }
        }

        // Handle t[exp] = value (array/object set)
        if (
            ctx.children &&
            ctx.children.length === 3 &&
            ctx.children[0].constructor.name === "PrefixexpContext" &&
            ctx.children[1].getText() === '='
        ) {
            const prefixexp = ctx.children[0];
            // Table element assignment: t[exp] = value
            if (
                prefixexp.children &&
                prefixexp.children.length >= 4 &&
                prefixexp.children[1].getText() === '['
            ) {
                const tableVarNode = prefixexp.children[0];
                const tableVar = (tableVarNode && tableVarNode.constructor && tableVarNode.constructor.name && tableVarNode.constructor.name.endsWith("PrefixexpContext")) ?
                    this.visitPrefixexp(tableVarNode, null) :
                    this.visitExp(tableVarNode, null);
                const keyExp = prefixexp.children[2];
                const valueExp = this.visitExp(ctx.children[2]);
                const key = this.visitExp(keyExp);

                if (!isNaN(Number(key))) {
                    // json_array_set: Lua is 1-based, jgJSON arrays are 0-based
                    const zeroIndex = Number(key) - 1;
                    const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
                    this.generator.addBlock({
                        opcode: "jgJSON_json_array_set",
                        id: blockId,
                        parent: null,
                        next: null,
                        inputs: [
                            this.wrapInput(tableVar),
                            this.wrapInput(zeroIndex),
                            this.wrapInput(valueExp)
                        ]
                    });
                    return blockId;
                } else {
                    // setValueToKeyInJSON
                    const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
                    this.generator.addBlock({
                        opcode: "jgJSON_setValueToKeyInJSON",
                        id: blockId,
                        parent: null,
                        next: null,
                        inputs: [
                            this.wrapInput(valueExp),
                            this.wrapInput(key),
                            this.wrapInput(tableVar)
                        ]
                    });
                    return blockId;
                }
            }
        }

        // fallback to default
        let x = this.visitChildren(ctx);
        // If a pending line label was set for this statement, attach it before returned block
        try {
            if (this._pendingLineLabel && x) {
                const pending = this._pendingLineLabel;
                this._pendingLineLabel = null;
                const retId = x instanceof Array ? x[0] : x;
                if (retId && this.generator.blocks[retId]) {
                    const labId = this.generator.letterCount(this.generator.blockIdCounter++);
                    if (pending.type === 'function') {
                        // emit a labelFunction (stack) which conceptually wraps a branch
                        this.generator.addBlock({
                            opcode: 'jwProto_labelFunction',
                            id: labId,
                            parent: null,
                            next: null,
                            shadow: false,
                            topLevel: false,
                            fields: { LABEL: [pending.text, pending.text, ''] },
                            // children will be set by chaining below
                        });
                    } else {
                        this.generator.addBlock({
                            opcode: 'jwProto_labelCommand',
                            id: labId,
                            parent: null,
                            next: null,
                            shadow: false,
                            topLevel: false,
                            fields: { LABEL: [pending.text, pending.text, ''] }
                        });
                    }
                    this.generator.blocks[labId].next = retId;
                    this.generator.blocks[retId].parent = labId;
                    return labId;
                }
            }
        } catch (e) {}
        return x instanceof Array ? x[0] : x;
    }
    visitConcatenation(ctx) { }
    visitFunctioncall(ctx, asReporter = false) {
        const funcName = this.getText(ctx.NAME ? ctx.NAME(0) : ctx);
        // If this call corresponds to a hat block and is used as a statement with
        // an inline function argument, emit a top-level hat block whose SUBSTACK
        // is the function body. This allows Lua to register event handlers like
        // `event_whenkeypressed('a', function() ... end)`.
        try {
            const pb = processedBlocks[funcName];
            if (pb && pb[1] === 'hat') {
                // Only handle in statement context (not as reporter)
                if (!asReporter && ctx.args && ctx.args(0) && ctx.args(0).explist) {
                    const explist = ctx.args(0).explist(0);
                    const exps = explist && explist.exp ? explist.exp() : [];
                    if (exps.length > 0) {
                        const lastExp = exps[exps.length - 1];
                        // Check if lastExp is a function definition
                        if (lastExp && typeof lastExp.functiondef === 'function' && lastExp.functiondef()) {
                            // Build the hat block inputs/fields from earlier args (excluding last)
                            const inputMeta = pb[0] || [];
                            const inputArr = [];
                            const fieldsObj = {};
                            for (let i = 0; i < inputMeta.length; i++) {
                                const meta = inputMeta[i] || {};
                                const expNode = exps[i];
                                const val = expNode ? this.visitExp(expNode, null, true) : "";
                                if (meta.field) {
                                    // put into fields
                                    const fieldName = meta.field;
                                    const fieldVal = typeof val === 'string' ? val : (Array.isArray(val) && val[0] === 1 ? (val[1] && val[1][1]) : '');
                                    fieldsObj[fieldName] = [fieldVal, fieldVal, ""];
                                } else {
                                    inputArr.push(this.wrapInput(val));
                                }
                            }

                            // Visit the function body to collect statements
                            const funcDef = lastExp.functiondef();
                            const funcBodyBlock = funcDef.funcbody ? funcDef.funcbody() : null;
                            let bodyBlockIds = [];
                            if (funcBodyBlock && funcBodyBlock.block) {
                                const blk = funcBodyBlock.block();
                                if (blk && blk.children) {
                                    for (const child of blk.children) {
                                        if (child.constructor && child.constructor.name.endsWith('StatementContext')) {
                                            const stmtId = this.visit(child);
                                            if (stmtId) bodyBlockIds.push(stmtId);
                                        }
                                    }
                                }
                            }

                            // If a pending line label exists for this hat, emit a labelHat before the real hat
                            if (this._pendingLineLabel) {
                                const labHatId = this.generator.letterCount(this.generator.blockIdCounter++);
                                this.generator.addBlock({
                                    opcode: 'jwProto_labelHat',
                                    id: labHatId,
                                    parent: null,
                                    next: null,
                                    shadow: false,
                                    topLevel: true,
                                    fields: { LABEL: [this._pendingLineLabel.text, this._pendingLineLabel.text, ''] }
                                });
                                // clear pending
                                this._pendingLineLabel = null;
                            }
                            // Add the hat block as top-level
                            const hatId = this.generator.letterCount(this.generator.blockIdCounter++);
                            this.generator.addBlock({
                                opcode: funcName,
                                id: hatId,
                                parent: null,
                                next: null,
                                inputs: inputArr,
                                fields: fieldsObj,
                                shadow: false,
                                topLevel: true,
                            });

                            // Chain and parent the child's blocks under the hat: set hat.next to first entry
                            if (bodyBlockIds.length > 0) {
                                const firstEntry = bodyBlockIds[0].entry ?? bodyBlockIds[0];
                                // Set hat.next to the first statement in the body
                                if (this.generator.blocks[hatId]) this.generator.blocks[hatId].next = firstEntry;
                                // Parent the first statement to the hat
                                if (this.generator.blocks[firstEntry]) this.generator.blocks[firstEntry].parent = hatId;

                                // Chain subsequent statements
                                for (let i = 0; i < bodyBlockIds.length - 1; i++) {
                                    const cur = bodyBlockIds[i];
                                    const nxt = bodyBlockIds[i + 1];
                                    const curExit = cur.exit ?? cur;
                                    const nextEntry = nxt.entry ?? nxt;
                                    if (this.generator.blocks[curExit]) this.generator.blocks[curExit].next = nextEntry;
                                    // Keep parent of nextEntry as the previous block's exit (so nesting is regular)
                                    if (this.generator.blocks[nextEntry]) this.generator.blocks[nextEntry].parent = curExit;
                                }
                            }
                            return hatId;
                        }
                    }
                }
            }
        } catch (e) {}
        // Detect method-style calls like table.insert / table.remove / table.concat
        let methodFullName = null;
        try {
            // Prefer explicit NAME tokens if present (e.g. simple calls)
            if (ctx.NAME && typeof ctx.NAME === 'function' && ctx.NAME(0)) {
                const firstName = ctx.NAME(0).getText();
                // If there's a dot in the NAME token, use it
                if (firstName && firstName.includes('.')) methodFullName = firstName;
            }
            // Otherwise, inspect the callee prefixexp (covers method-style prefixes)
            if (!methodFullName && ctx && ctx.children && ctx.children.length > 0) {
                const calleeNode = ctx.children[0];
                // If calleeNode is a PrefixexpContext, try to extract a dotted name
                if (calleeNode && calleeNode.constructor && calleeNode.constructor.name === 'PrefixexpContext') {
                    // calleeNode.getText() may include the args; strip trailing args if present
                    const txt = calleeNode.getText ? calleeNode.getText() : null;
                    if (txt && txt.includes('.')) {
                        // The prefixexp text can be like "table.concat" or "table.concat(args)"; strip parentheses
                        const match = /^([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)+)/.exec(txt);
                        if (match) methodFullName = match[1];
                    }
                } else if (calleeNode && calleeNode.getText && typeof calleeNode.getText === 'function') {
                    const txt = calleeNode.getText();
                    if (txt && txt.includes('.')) {
                        const match = /^([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)+)/.exec(txt);
                        if (match) methodFullName = match[1];
                    }
                }
            }
        } catch (e) {
            methodFullName = null;
        }
        // Final fallback: scan the full ctx text for a dotted callee (covers nested/parenthesized forms)
        if (!methodFullName) {
            try {
                const fullTxt = ctx && ctx.getText ? ctx.getText() : null;
                if (fullTxt) {
                    const match = /^([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)+)/.exec(fullTxt);
                    if (match) methodFullName = match[1];
                }
            } catch (e) {
                /* ignore */
            }
        }

        // Handle table.* helpers (array operations) and method-style calls (a:insert)
            if (methodFullName && (methodFullName === 'table.insert' || methodFullName === 'table.remove' || methodFullName === 'table.concat' || /[:\.]/.test(methodFullName))) {
            // collect args
            const argsCtx = ctx.args && ctx.args() ? ctx.args() : null;
            const explist = argsCtx && argsCtx.explist ? argsCtx.explist(0) : null;
            const exps = explist && explist.exp ? explist.exp() : [];

            // Helper to get visited exp value
            const getVal = (expNode) => this.visitExp(expNode, null, true);
            // Determine whether this is a static table.* call or a method-style call (a:insert or a.insert)
            // Extract a possible method name and base expression
            let calleeTxt = null;
            try {
                calleeTxt = ctx.children && ctx.children[0] && typeof ctx.children[0].getText === 'function' ? ctx.children[0].getText() : methodFullName;
            } catch (e) {
                calleeTxt = methodFullName;
            }
            // Normalize: strip trailing parens if present
            if (typeof calleeTxt === 'string' && calleeTxt.includes('(')) calleeTxt = calleeTxt.split('(')[0];
            let isStaticTableCall = false;
            let isMethodCall = false;
            let methodName = null;
            let baseText = null;
            let separator = null;
            const m = /^(?<base>[a-zA-Z_][a-zA-Z0-9_]*(?:[\.:[a-zA-Z_][a-zA-Z0-9_]*)*)([\.:])(?<method>[a-zA-Z_][a-zA-Z0-9_]*)$/.exec(calleeTxt);
            if (m && m.groups) {
                baseText = m.groups.base;
                methodName = m.groups.method;
                separator = calleeTxt.charAt(baseText.length);
                isMethodCall = true;
                if (baseText === 'table') isStaticTableCall = true;
            } else if (methodFullName && methodFullName.startsWith('table.')) {
                isStaticTableCall = true;
                methodName = methodFullName.split('.')[1];
            }

            const effectiveMethod = methodName || (methodFullName && methodFullName.split('.').pop());

            // Helper to extract a variable name from a visited expression (if possible)
            const extractVariableName = (expr) => {
                if (!expr) return null;
                // [12, varName, varName]
                if (Array.isArray(expr) && expr[0] === 12) {
                    return expr[1];
                }
                // reporter reference to a data_variable block: [3, id, ...]
                if (Array.isArray(expr) && expr[0] === 3 && typeof expr[1] === 'string') {
                    const bid = expr[1];
                    const blk = this.generator.blocks[bid];
                    if (blk && blk.opcode === 'data_variable' && blk.fields && Array.isArray(blk.fields.VARIABLE)) {
                        return blk.fields.VARIABLE[0];
                    }
                }
                // string literal or other expression -> not a variable
                return null;
            };

            // For method calls like a:insert, derive arrVal expression from baseText when possible
            const getArrayExprForMethod = () => {
                // Prefer parsing via visitExp on the prefix if available
                try {
                    const calleeNode = ctx.children && ctx.children[0] ? ctx.children[0] : null;
                    if (calleeNode && calleeNode.constructor && calleeNode.constructor.name === 'PrefixexpContext') {
                        // The prefixexp text includes the method; try to get the child that represents the receiver
                        // Fallback: use the textual baseText as a variable placeholder
                        if (baseText && typeof baseText === 'string') return [12, baseText, baseText];
                    }
                } catch (e) {}
                if (baseText) return [12, baseText, baseText];
                return null;
            };

            // Now handle methods by their effective name
            if (effectiveMethod === 'insert') {
                // table.insert(t, value) or table.insert(t, pos, value)
                // Build helper to create push/insert reporter block
                const buildInsertReporter = (arrVal, indexInput, valueVal) => {
                    const op = indexInput ? 'jgJSON_json_array_insert' : 'jgJSON_json_array_push';
                    const inputsArr = indexInput ? [this.wrapInput(arrVal), indexInput, this.wrapInput(valueVal)] : [this.wrapInput(arrVal), this.wrapInput(valueVal)];
                    const repId = this.generator.addBlock({
                        opcode: op,
                        inputs: inputsArr,
                        parent: null,
                        next: null,
                        shadow: false,
                        topLevel: false,
                    });
                    // parent any reporter inputs to reporter block
                    try {
                        const arrRef = Array.isArray(arrVal) ? arrVal : null;
                        if (arrRef && arrRef[0] === 3 && typeof arrRef[1] === 'string' && this.generator.blocks[arrRef[1]]) this.generator.blocks[arrRef[1]].parent = repId;
                        if (Array.isArray(valueVal) && valueVal[0] === 3 && typeof valueVal[1] === 'string' && this.generator.blocks[valueVal[1]]) this.generator.blocks[valueVal[1]].parent = repId;
                        if (Array.isArray(indexInput) && indexInput[0] === 3 && typeof indexInput[1] === 'string' && this.generator.blocks[indexInput[1]]) this.generator.blocks[indexInput[1]].parent = repId;
                    } catch (e) {}
                    return repId;
                };

                if (exps.length === 2) {
                    const arrVal = getVal(exps[0]);
                    const valueVal = getVal(exps[1]);
                    if (!asReporter) {
                        // statement context: must modify a variable in-place
                        const varName = extractVariableName(arrVal);
                        if (!varName) throw new CompilerError('table.insert used in statement context requires a variable as first argument', ctx, this.source);
                        const repId = buildInsertReporter(arrVal, null, valueVal);
                        // set variable to result of reporter
                        const setId = this.generator.letterCount(this.generator.blockIdCounter++);
                        this.generator.addBlock({
                            opcode: 'data_setvariableto',
                            id: setId,
                            parent: null,
                            next: null,
                            inputs: { VALUE: [3, repId, [10, '']] },
                            fields: { VARIABLE: [varName, varName, ''] }
                        });
                        // parent rep to setter
                        this.generator.blocks[repId].parent = setId;
                        return setId;
                    } else {
                        // expression context: return reporter
                        return buildInsertReporter(arrVal, null, valueVal);
                    }
                } else if (exps.length === 3) {
                    const arrVal = getVal(exps[0]);
                    const posVal = getVal(exps[1]);
                    const valueVal = getVal(exps[2]);
                    // compute zero-based index from Lua 1-based pos
                    let indexInput;
                    if (!isNaN(Number(posVal))) {
                        indexInput = this.wrapInput(Number(posVal) - 1);
                    } else if (Array.isArray(posVal) && posVal[0] === 3) {
                        // build subtract node: (pos - 1)
                        const subId = this.generator.letterCount(this.generator.blockIdCounter++);
                        this.generator.addBlock({
                            opcode: 'operator_subtract',
                            id: subId,
                            parent: null,
                            next: null,
                            inputs: [posVal, [1, [4, '1']]]
                        });
                        indexInput = [3, subId, [10, '']];
                        if (Array.isArray(posVal) && posVal[0] === 3 && typeof posVal[1] === 'string' && this.generator.blocks[posVal[1]]) {
                            this.generator.blocks[posVal[1]].parent = subId;
                        }
                    } else if (typeof posVal === 'string' && posVal.match(/^\d+$/)) {
                        indexInput = this.wrapInput(Number(posVal) - 1);
                    } else {
                        indexInput = this.wrapInput(posVal);
                    }
                    if (!asReporter) {
                        const varName = extractVariableName(arrVal);
                        if (!varName) throw new CompilerError('table.insert used in statement context requires a variable as first argument', ctx, this.source);
                        const repId = buildInsertReporter(arrVal, indexInput, valueVal);
                        const setId = this.generator.letterCount(this.generator.blockIdCounter++);
                        this.generator.addBlock({
                            opcode: 'data_setvariableto',
                            id: setId,
                            parent: null,
                            next: null,
                            inputs: { VALUE: [3, repId, [10, '']] },
                            fields: { VARIABLE: [varName, varName, ''] }
                        });
                        this.generator.blocks[repId].parent = setId;
                        return setId;
                    } else {
                        return buildInsertReporter(arrVal, indexInput, valueVal);
                    }
                }
            }

            if (effectiveMethod === 'remove') {
                // table.remove(t) or table.remove(t, pos)
                const arrVal = exps[0] ? getVal(exps[0]) : '';
                const buildDeleteReporter = (arrayExpr, indexInput) => {
                    const delId = this.generator.addBlock({
                        opcode: 'jgJSON_json_array_delete',
                        inputs: [this.wrapInput(arrayExpr), indexInput],
                        parent: null,
                        next: null,
                        shadow: false,
                        topLevel: false,
                    });
                    // parent referenced reporters
                    try {
                        if (Array.isArray(indexInput) && indexInput[0] === 3 && typeof indexInput[1] === 'string' && this.generator.blocks[indexInput[1]]) this.generator.blocks[indexInput[1]].parent = delId;
                        if (Array.isArray(arrayExpr) && arrayExpr[0] === 3 && typeof arrayExpr[1] === 'string' && this.generator.blocks[arrayExpr[1]]) this.generator.blocks[arrayExpr[1]].parent = delId;
                    } catch (e) {}
                    return delId;
                };

                if (exps.length === 1) {
                    // need to delete last element: compute length-1
                    const keysLengthId = this.generator.letterCount(this.generator.blockIdCounter++);
                    this.generator.addBlock({
                        opcode: 'jgJSON_json_array_length',
                        id: keysLengthId,
                        parent: null,
                        next: null,
                        inputs: [this.wrapInput(arrVal)]
                    });
                    const subId = this.generator.letterCount(this.generator.blockIdCounter++);
                    this.generator.addBlock({
                        opcode: 'operator_subtract',
                        id: subId,
                        parent: null,
                        next: null,
                        inputs: [[3, keysLengthId, [10, '']], [1, [4, '1']]]
                    });
                    if (this.generator.blocks[keysLengthId]) this.generator.blocks[keysLengthId].parent = subId;
                    if (!asReporter) {
                        const varName = extractVariableName(arrVal);
                        if (!varName) throw new CompilerError('table.remove used in statement context requires a variable as first argument', ctx, this.source);
                        const repId = buildDeleteReporter(arrVal, [3, subId, [10, '']]);
                        const setId = this.generator.letterCount(this.generator.blockIdCounter++);
                        this.generator.addBlock({
                            opcode: 'data_setvariableto',
                            id: setId,
                            parent: null,
                            next: null,
                            inputs: { VALUE: [3, repId, [10, '']] },
                            fields: { VARIABLE: [varName, varName, ''] }
                        });
                        this.generator.blocks[repId].parent = setId;
                        if (this.generator.blocks[subId]) this.generator.blocks[subId].parent = repId;
                        return setId;
                    } else {
                        const delId = buildDeleteReporter(arrVal, [3, subId, [10, '']]);
                        if (this.generator.blocks[subId]) this.generator.blocks[subId].parent = delId;
                        return delId;
                    }
                } else if (exps.length >= 2) {
                    const posVal = getVal(exps[1]);
                    let indexInput;
                    if (!isNaN(Number(posVal))) {
                        indexInput = this.wrapInput(Number(posVal) - 1);
                    } else if (Array.isArray(posVal) && posVal[0] === 3) {
                        const subId = this.generator.letterCount(this.generator.blockIdCounter++);
                        this.generator.addBlock({
                            opcode: 'operator_subtract',
                            id: subId,
                            parent: null,
                            next: null,
                            inputs: [posVal, [1, [4, '1']]]
                        });
                        indexInput = [3, subId, [10, '']];
                        if (Array.isArray(posVal) && posVal[0] === 3 && typeof posVal[1] === 'string' && this.generator.blocks[posVal[1]]) {
                            this.generator.blocks[posVal[1]].parent = subId;
                        }
                    } else if (typeof posVal === 'string' && posVal.match(/^\d+$/)) {
                        indexInput = this.wrapInput(Number(posVal) - 1);
                    } else {
                        indexInput = this.wrapInput(posVal);
                    }
                    if (!asReporter) {
                        const varName = extractVariableName(arrVal);
                        if (!varName) throw new CompilerError('table.remove used in statement context requires a variable as first argument', ctx, this.source);
                        const repId = buildDeleteReporter(arrVal, indexInput);
                        const setId = this.generator.letterCount(this.generator.blockIdCounter++);
                        this.generator.addBlock({
                            opcode: 'data_setvariableto',
                            id: setId,
                            parent: null,
                            next: null,
                            inputs: { VALUE: [3, repId, [10, '']] },
                            fields: { VARIABLE: [varName, varName, ''] }
                        });
                        this.generator.blocks[repId].parent = setId;
                        return setId;
                    } else {
                        return buildDeleteReporter(arrVal, indexInput);
                    }
                }
            }

            if (effectiveMethod === 'concat') {
                // table.concat(t, delim?)
                const arrValNode = exps[0];
                const delimNode = exps[1];
                const arrVal = arrValNode ? this.visitExp(arrValNode, null, true) : '';
                const delimVal = delimNode ? this.visitExp(delimNode, null, true) : '';
                // For statement context, require variable receiver and set it to the join result
                const buildJoinReporter = (arrayExpr, delimiterExpr) => {
                    const id = this.generator.addBlock({
                        opcode: 'jgJSON_json_array_join',
                        inputs: [this.wrapInput(arrayExpr), this.wrapInput(delimiterExpr === '' ? '' : delimiterExpr)],
                        parent: null,
                        next: null,
                        shadow: false,
                        topLevel: false,
                    });
                    try {
                        if (Array.isArray(arrayExpr) && arrayExpr[0] === 3 && typeof arrayExpr[1] === 'string' && this.generator.blocks[arrayExpr[1]]) this.generator.blocks[arrayExpr[1]].parent = id;
                    } catch (e) {}
                    return id;
                };
                if (!asReporter) {
                    const varName = extractVariableName(arrVal);
                    if (!varName) throw new CompilerError('table.concat used in statement context requires a variable as first argument', ctx, this.source);
                    const repId = buildJoinReporter(arrVal, delimVal);
                    const setId = this.generator.letterCount(this.generator.blockIdCounter++);
                    this.generator.addBlock({
                        opcode: 'data_setvariableto',
                        id: setId,
                        parent: null,
                        next: null,
                        inputs: { VALUE: [3, repId, [10, '']] },
                        fields: { VARIABLE: [varName, varName, ''] }
                    });
                    this.generator.blocks[repId].parent = setId;
                    return setId;
                }
                return buildJoinReporter(arrVal, delimVal);
            }
        }

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
    // Helper for table/array access: t[2] or t["key"]
    handleTableAccess(tableVar, keyExp, parentId) {
        const key = this.visitExp(keyExp);
        // Normalize tableVar into a reporter/reference input when possible
        let tableArg;
        try {
            if (Array.isArray(tableVar) && tableVar[0] === 12) {
                // Variable placeholder -> prefer canonical getter reporter
                const varName = tableVar[1];
                const [baseName] = this.extractVarNameAndType(varName);
                const getter = this.variableGetters[baseName];
                if (getter) {
                    tableArg = [3, getter, [10, ""]];
                } else {
                    tableArg = this.wrapInput(tableVar);
                }
            } else if (typeof tableVar === 'string' && this.generator.blocks[tableVar]) {
                // If it's a block id (maybe the set-variable statement), try to map to the variable getter
                const blk = this.generator.blocks[tableVar];
                if (blk && blk.fields && Array.isArray(blk.fields.VARIABLE)) {
                    const varName = blk.fields.VARIABLE[0];
                    const getter = this.variableGetters[varName];
                    if (getter) tableArg = [3, getter, [10, ""]];
                    else tableArg = this.wrapInput(tableVar);
                } else {
                    tableArg = this.wrapInput(tableVar);
                }
            } else {
                tableArg = this.wrapInput(tableVar);
            }
        } catch (e) {
            tableArg = this.wrapInput(tableVar);
        }

        // If key is a number, use jgJSON_json_array_get
        if (!isNaN(Number(key))) {
            // numeric literal index: convert from 1-based Lua to 0-based jgJSON
            const zeroIndex = Number(key) - 1;
            const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
            this.generator.addBlock({
                opcode: "jgJSON_json_array_get",
                id: blockId,
                parent: parentId,
                next: null,
                inputs: [
                    tableArg,
                    this.wrapInput(zeroIndex)
                ]
            });
            if (Array.isArray(tableArg) && tableArg[0] === 3 && typeof tableArg[1] === 'string' && this.generator.blocks[tableArg[1]]) {
                this.generator.blocks[tableArg[1]].parent = blockId;
            }
            return blockId;
        } else {
            // jgJSON_getValueFromJSON for string keys
            // If key is an expression (not a plain number), visit it — if it yields a number expression,
            // we need to compute zero-based index by subtracting 1.
            const numericKey = this.visitExp(keyExp);
            let keyInput;
            if (!isNaN(Number(numericKey))) {
                // numeric literal inside bracket but parsed as non-Number earlier
                keyInput = this.wrapInput(Number(numericKey) - 1);
            } else if (Array.isArray(numericKey) && numericKey[0] === 3) {
                // expression producing a reporter — create an operator_subtract block: (key - 1)
                const subId = this.generator.letterCount(this.generator.blockIdCounter++);
                this.generator.addBlock({
                    opcode: "operator_subtract",
                    id: subId,
                    parent: null,
                    next: null,
                    inputs: [
                        numericKey,
                        [1, [4, "1"]]
                    ]
                });
                keyInput = [3, subId, [10, ""]];
            } else if (typeof numericKey === 'string' && numericKey.match(/^\d+$/)) {
                keyInput = this.wrapInput(Number(numericKey) - 1);
            } else {
                // treat as string key (non-numeric)
                keyInput = this.wrapInput(key);
            }

            const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
            this.generator.addBlock({
                opcode: "jgJSON_getValueFromJSON",
                id: blockId,
                parent: parentId,
                next: null,
                inputs: [
                    keyInput,
                    tableArg
                ]
            });
            // Parent the tableArg reporter to the new block if present
            if (Array.isArray(tableArg) && tableArg[0] === 3 && typeof tableArg[1] === 'string' && this.generator.blocks[tableArg[1]]) {
                this.generator.blocks[tableArg[1]].parent = blockId;
            }
            return blockId;
        }
    }

    // Detect and handle dot-notation like t.key and prefixexp indexing
    visitPrefixexp(ctx, parentId = null) {
        // If the prefixexp is simple (a variable), return a variable placeholder
        if (ctx.children && ctx.children.length === 1) {
            const varName = ctx.getText();
            return [12, varName, varName];
        }

        // Handle indexing: prefixexp '[' exp ']'
        // ctx.children example: [prefixexp, '[', exp, ']']
        if (ctx.children && ctx.children.length >= 4) {
            // Find if this uses indexing
            for (let i = 0; i < ctx.children.length; i++) {
                const child = ctx.children[i];
                if (child.getText && child.getText() === '[') {
                    const tableVarNode = ctx.children[0];
                    const keyNode = ctx.children[i + 1];
                    let tableVar = (tableVarNode && tableVarNode.constructor && tableVarNode.constructor.name && tableVarNode.constructor.name.endsWith("PrefixexpContext")) ?
                        this.visitPrefixexp(tableVarNode, parentId) :
                        this.visitExp(tableVarNode, parentId);
                    // If visitExp returned an empty string (common when passing a raw NAME node),
                    // treat it as a variable placeholder so wrapInput can produce a reporter getter.
                    if (tableVar === "" || tableVar === null || tableVar === undefined) {
                        const vn = tableVarNode && tableVarNode.getText ? tableVarNode.getText() : null;
                        if (vn) tableVar = [12, vn, vn];
                    }
                    // Create the access block and return a reporter reference shape
                    const accessId = this.handleTableAccess(tableVar, keyNode, parentId);
                    return [3, accessId, [10, ""]];
                }
            }
        }

        // Handle dot-notation: prefixexp '.' NAME
        // ctx.children example: [prefixexp, '.', NAME]
        if (ctx.children && ctx.children.length === 3 && ctx.children[1].getText() === '.') {
            const tableVarNode = ctx.children[0];
            const nameNode = ctx.children[2];
            let tableVar = (tableVarNode && tableVarNode.constructor && tableVarNode.constructor.name && tableVarNode.constructor.name.endsWith("PrefixexpContext")) ?
                this.visitPrefixexp(tableVarNode, parentId) :
                this.visitExp(tableVarNode, parentId);
            // If visitExp returned empty (e.g. raw NAME), treat as variable placeholder
            if (tableVar === "" || tableVar === null || tableVar === undefined) {
                const vn = tableVarNode && tableVarNode.getText ? tableVarNode.getText() : null;
                if (vn) tableVar = [12, vn, vn];
            }
            const key = nameNode && nameNode.getText ? nameNode.getText() : "";
            // Ensure key is a valid identifier (doesn't start with a number)
            if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
                const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
                const tableArg = this.wrapInput(tableVar);
                const literalKey = [1, [10, key == null ? "" : String(key)]];
                this.generator.addBlock({
                    opcode: "jgJSON_getValueFromJSON",
                    id: blockId,
                    parent: parentId,
                    next: null,
                    inputs: [
                        literalKey,
                        tableArg
                    ]
                });
                // Parent the tableArg reporter to the new block if it's a reporter reference
                if (Array.isArray(tableArg) && tableArg[0] === 3 && typeof tableArg[1] === 'string' && this.generator.blocks[tableArg[1]]) {
                    this.generator.blocks[tableArg[1]].parent = blockId;
                }
                return [3, blockId, [10, ""]];
            }
        }

        // Fallback: default handling
        return this.visitChildren(ctx);
    }

    visitExp(ctx, parentId = null, forceStringFallback = false) {
        if (!ctx) return "";
        try {
            if (ctx.start && typeof ctx.start.line === 'number') this._lastExpLine = ctx.start.line;
        } catch (e) {}
        // If it's a string literal
        if (ctx.STRING) {
            return ctx.getText().slice(1, -1); // Remove quotes
        }

        // If it's a table constructor (Lua table), delegate to visitTableconstructor
        if (typeof ctx.tableconstructor === 'function' && ctx.tableconstructor()) {
            return this.visitTableconstructor(ctx.tableconstructor());
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
                "&": { opcode: "pmOperatorsExpansion_binnaryAnd", left: "num1", right: "num2" },
                "|": { opcode: "pmOperatorsExpansion_binnaryOr", left: "num1", right: "num2" },
                "~": { opcode: "pmOperatorsExpansion_binnaryXor", left: "num1", right: "num2" },
                "<<": { opcode: "pmOperatorsExpansion_shiftLeft", left: "num1", right: "num2" },
                ">>": { opcode: "pmOperatorsExpansion_shiftRight", left: "num1", right: "num2" },
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
            (this.getText(ctx.children[0]) === "not" || this.getText(ctx.children[0]) === "~")
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
            const prefix = ctx.children[0];
            // If the prefixexp contains indexing or dot-notation, delegate to visitPrefixexp
            if (prefix.children && prefix.children.length > 1) {
                return this.visitPrefixexp(prefix);
            }
            const varName = prefix.getText();
            return [12, varName, varName];
        }

        // Table or string length: #t or #str
        if (
            ctx.children &&
            ctx.children.length === 2 &&
            ctx.children[0].getText() === "#"
        ) {
            const operand = this.visitExp(ctx.children[1]);
            let varName = null;
            if (Array.isArray(operand) && operand[1] && typeof operand[1] === "string") {
                [varName] = this.extractVarNameAndType(operand[1]);
            }
            let isString = false;
            if (typeof operand === "string" && operand[0] !== "[") isString = true;
            if (varName && this.types[varName] === "string") isString = true;
            if (isString) {
                const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
                const inputVal = this.wrapInput(operand);
                this.generator.addBlock({
                    opcode: "operator_length",
                    id: blockId,
                    parent: parentId,
                    next: null,
                    inputs: [
                        inputVal
                    ]
                });
                // If the input is a reporter/block reference, set its parent to this length block
                if (Array.isArray(inputVal) && inputVal[0] === 3 && typeof inputVal[1] === 'string' && this.generator.blocks[inputVal[1]]) {
                    this.generator.blocks[inputVal[1]].parent = blockId;
                }
                return blockId;
            } else {
                // Determine if operand is an object (JSON object string or annotated variable)
                let isObject = false;
                if (typeof operand === "string" && operand.trim().startsWith("{")) isObject = true;
                if (varName && this.types[varName] && this.types[varName].toLowerCase() === "object") isObject = true;

                if (isObject) {
                    // 1) Create a jgJSON_json_keys block that returns an array of keys
                    const keysId = this.generator.letterCount(this.generator.blockIdCounter++);
                    const keysInput = this.wrapInput(operand);
                    this.generator.addBlock({
                        opcode: "jgJSON_json_keys",
                        id: keysId,
                        parent: null,
                        next: null,
                        inputs: [
                            keysInput
                        ],
                        shadow: false,
                        topLevel: false,
                    });

                    // 2) Create an array-length block that takes the keys array as reporter input
                    const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
                    const keysRef = [3, keysId, [10, ""]];
                    this.generator.addBlock({
                        opcode: "jgJSON_json_array_length",
                        id: blockId,
                        parent: parentId,
                        next: null,
                        inputs: [
                            keysRef
                        ]
                    });

                    // Parent the keys reporter to the length block so it renders nested
                    if (this.generator.blocks[keysId]) {
                        this.generator.blocks[keysId].parent = blockId;
                    }
                    return blockId;
                }

                // Default: treat as array and always use reporter/reference for the input
                const blockId = this.generator.letterCount(this.generator.blockIdCounter++);
                const inputVal = this.wrapInput(operand);
                this.generator.addBlock({
                    opcode: "jgJSON_json_array_length",
                    id: blockId,
                    parent: parentId,
                    next: null,
                    inputs: [
                        inputVal
                    ]
                });
                // If the input is a reporter/block reference, set its parent to this length block
                if (Array.isArray(inputVal) && inputVal[0] === 3 && typeof inputVal[1] === 'string' && this.generator.blocks[inputVal[1]]) {
                    this.generator.blocks[inputVal[1]].parent = blockId;
                }
                return blockId;
            }
        }

        // Not a concat or arithmetic, fallback to child or text
        if (ctx.exp && typeof ctx.exp === "function") {
            const exps = ctx.exp();
            if (exps && exps.length === 1) {
                return this.visitExp(exps[0], parentId);
            }
        }
        return this.getText(ctx, true);
    }
    visitFunctiondef(ctx) {
        // Get function name and body
        const funcbody = ctx.funcbody();
        const parlist = funcbody.parlist();
        const returnType = this.getTypeAnnotation(funcbody.typeReturnAnnotation ? funcbody.typeReturnAnnotation() : null);
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
    visitTableconstructor(ctx) {
        // Handle bracket-only field lists (explicit [key]=value or [key] entries)
        if (ctx.bracketfieldlist && ctx.bracketfieldlist()) {
            const bracketFields = ctx.bracketfieldlist().bracketfield();
            // We'll only accept numeric indices and treat this as an array
            let arrayValues = [];
            for (const bf of bracketFields) {
                // bf: '[' exp ']' '=' exp   OR '[' exp ']'
                if (bf.children && bf.children.length >= 3) {
                    const keyExp = bf.children[1];
                    const keyVal = this.visitExp(keyExp);
                    if (isNaN(Number(keyVal))) {
                        throw new CompilerError('Bracket-style table constructors must use numeric indices only', bf, this.source);
                    }
                    const idx = Number(keyVal);
                    // value might be missing (e.g. [1]), in which case it's nil -> treat as null
                    let value = null;
                    if (bf.children.length === 5 && bf.children[3]) {
                        value = this.visitExp(bf.children[3]);
                    }
                    if (typeof value === 'object') throw new CompilerError('Cannot use block reference in table constructor', bf, this.source);
                    arrayValues[idx - 1] = value; // Lua is 1-based
                }
            }
            // Fill undefined holes with null to preserve indices
            for (let i = 0; i < arrayValues.length; i++) if (arrayValues[i] === undefined) arrayValues[i] = null;
            return JSON.stringify(arrayValues);
        }

        // Empty table
        if (!ctx.fieldlist || !ctx.fieldlist()) return "[]";
        const fields = ctx.fieldlist().field();
        let isArray = true;
        let arrayValues = [];
        let objectValues = {};

        for (const field of fields) {
            // [exp] = exp
            if (field.children.length === 5 && field.children[1].getText() === '[' && field.children[3].getText() === '=') {
                const key = this.visitExp(field.children[2]);
                let value = this.visitExp(field.children[4]);
                // Convert primitives to string for JSON
                if (typeof value === "object") throw new CompilerError("Cannot use block reference as table value", field, this.source);
                objectValues[key] = value;
                isArray = false;
            }
            // name = exp
            else if (field.children.length === 3 && field.children[1].getText() === '=') {
                const key = field.children[0].getText();
                let value = this.visitExp(field.children[2]);
                if (typeof value === "object") throw new CompilerError("Cannot use block reference as table value", field, this.source);
                objectValues[key] = value;
                isArray = false;
            }
            // exp (array element)
            else if (field.children.length === 1) {
                let value = this.visitExp(field.children[0]);
                if (typeof value === "object") throw new CompilerError("Cannot use block reference as array value", field, this.source);
                arrayValues.push(value);
            }
        }

        // Always stringify as JSON string
        if (isArray && Object.keys(objectValues).length === 0) {
            return JSON.stringify(arrayValues);
        } else {
            // Mixed: add array values as numeric keys (Lua is 1-based)
            arrayValues.forEach((v, i) => {
                objectValues[(i + 1).toString()] = v;
            });
            return JSON.stringify(objectValues);
        }
    }

    visitArrayconstructor(ctx) {
        // '[' explist? ']'
        if (!ctx || !ctx.explist || !ctx.explist()) return "[]";
        const exps = ctx.explist(0).exp ? ctx.explist(0).exp() : [];
        const arr = [];
        for (let i = 0; i < exps.length; i++) {
            const v = this.visitExp(exps[i]);
            if (typeof v === 'object') throw new CompilerError('Cannot use block reference as array value', ctx, this.source);
            arr.push(v);
        }
        return JSON.stringify(arr);
    }
}

module.exports = visitor;
