// blocks.js — generate processedBlocks from pm-blocks definitions
// This file adapts the user's pm-blocks extraction script to produce
// a map of opcode -> input definitions used by the emitter.

// Minimal browser globals that some pm-blocks expect
// deno-lint-ignore-file no-explicit-any

/* globalThis.goog and Blockly mocks */
// @ts-ignore
globalThis.goog = globalThis.goog || {
    require: () => {},
    provide: () => {},
};
globalThis.Blockly = globalThis.Blockly || {
    // @ts-ignore
    Blocks: {},
    Constants: {
        // @ts-ignore
        Data: {}
    },
    Extensions: {
        registerMixin: () => {}
    },
    ScratchBlocks: {
        // @ts-ignore
        ProcedureUtils: {
            // @ts-ignore
            parseReturnMutation: () => {}
        }
    },
    // @ts-ignore
    Msg: {},
    mainWorkspace: {
        options: {
            pathToMedia: ''
        },
        enableProcedureReturns() {}
    },
    // @ts-ignore
    Categories: {},
    FieldDropdown: class FieldDropdown {}
};

// minimal scratchBlocksUtils stubs used by pm-blocks during init
Blockly.scratchBlocksUtils = Blockly.scratchBlocksUtils || {
    generateMutatorShadow: function() { return null; },
    // other helpers pm-blocks may reference can be added as no-ops
    createVariableField: function() { return null; },
};

// Load pm-blocks package files. We expect a folder named `pm-blocks`
// containing the same structure as the original pm-block package.
require('./pm-blocks/msg/js/en.js');

require('./pm-blocks/core/constants.js');
require('./pm-blocks/core/colours.js');

module.exports.blockly = Blockly;

// core block definitions (vertical block sets)
require('./pm-blocks/blocks_vertical/control.js');
require('./pm-blocks/blocks_vertical/event.js');
require('./pm-blocks/blocks_vertical/looks.js');
require('./pm-blocks/blocks_vertical/motion.js');
require('./pm-blocks/blocks_vertical/operators.js');
require('./pm-blocks/blocks_vertical/sound.js');
require('./pm-blocks/blocks_vertical/sensing.js');
require('./pm-blocks/blocks_vertical/data.js');

// The pm-blocks package may also include procedures but we keep it optional.
// require('./pm-blocks/blocks_vertical/procedures.js');

function jsBlocksToJSON(jsblocks = globalThis.Blockly.Blocks) {
    const blocks = {};
    for (const [opcode, data] of Object.entries(jsblocks)) {
        let blockdata = {};
        const fakeThis = {
            jsonInit (d) {
                blockdata = d;
            },
            appendDummyInput() {
                return {
                    appendField() { return this; }
                };
            },
            appendValueInput() { return { appendField() { return this; } }; },
            appendStatementInput() { return { appendField() { return this; } }; },
            setPreviousStatement() {},
            setNextStatement() {},
            setOutput() {},
            setColour() {},
            setCategory() {},
            setTooltip() {},
            setHelpUrl() {},
            // @ts-ignore
            workspace: Blockly.mainWorkspace,
        };
        // Some block definitions expect `this.init()` to be called
        if (typeof data.init === 'function') data.init.call(fakeThis);
        blocks[opcode] = blockdata;
    }

    const processedBlocks = Object.fromEntries(
        Object.entries(blocks).map(([opcode, block]) => {
            //if (opcode === "control_inline_stack_output") console.log(block)
            // Collect arg groups in numeric order (args0, args1, ...)
            const argGroupKeys = Object.keys(block)
                .filter(k => k.startsWith('args'))
                .sort((a, b) => {
                    const na = parseInt(a.slice(4));
                    const nb = parseInt(b.slice(4));
                    return (isNaN(na) ? 0 : na) - (isNaN(nb) ? 0 : nb);
                });
            const argGroups = argGroupKeys.map(k => block[k]).filter(Boolean);

            // Flatten args preserving order, skipping images/getters
            const elements = [];
            for (const group of argGroups) {
                for (const arg of group) {
                    if (!arg) continue;
                    if (arg.type === 'field_image' || arg.type === 'field_variable_getter') continue;
                    elements.push(arg);
                }
            }

            // Build params preserving original order; include substacks as args
            const params = (elements.map((arg) => {
                if (arg.type === 'input_statement') {
                    return { name: arg.name, type: 'substack' };
                }
                if (arg.type == 'field_dropdown') {
                    return {
                        name: arg.name,
                        type: 1,
                        field: arg.name,
                        options: arg.options,
                        variableTypes: arg.variableTypes
                    };
                } else if (arg.type == 'field_variable') {
                    return {
                        name: arg.name,
                        type: 1,
                        field: arg.name,
                        variableTypes: arg.variableTypes
                    };
                } else if (arg.type == 'field_numberdropdown') {
                    return { name: arg.name, type: 1, variableTypes: arg.variableTypes };
                }
                return {
                    name: arg.name,
                    type: arg.type == 'input_value' ? 1 : 1,
                    variableTypes: arg.variableTypes
                };
            }) ?? []);

            // Substack (input_statement) names in order (still provided for compatibility)
            const substackNames = elements.filter(e => e.type === 'input_statement').map(e => e.name);
            let name = 'branch'
            // special case where a block returns a value but also has a substack (e.g. control_inline_stack_output) aka inline block
            if (block.output === null) name = "reporter_with_substack";
            if (substackNames.length > 0) {
                return [opcode, [params, name, substackNames]];
            }

            // Determine shape for non-branch blocks
            let shape;
            if ((block.extensions ?? []).includes('shape_hat')) {
                shape = 'hat';
            } else if ((block.extensions ?? []).includes('output_boolean') || (block.extensions ?? []).includes('output_string') || (block.extensions ?? []).includes('output_number')) {
                shape = 'reporter';
            } else if ((block.extensions ?? []).includes('shape_statement')) {
                shape = 'stack';
            } else {
                shape = 'stack';
            }
            return [opcode, [params, shape]];
        })
    );

    return processedBlocks;
}

module.exports.processedBlocks = jsBlocksToJSON();

// Hardcoded additional processed blocks for extensions and special cases
Object.assign(module.exports.processedBlocks, {
    pmOperatorsExpansion_exactlyEqual: [[
        { name: 'ONE', type: 'number' },
        { name: 'TWO', type: 'number' }
    ], "reporter"],
    pmOperatorsExpansion_shiftLeft: [[
        { name: 'num1', type: 'number' },
        { name: 'num2', type: 'number' }
    ], "reporter"],
    pmOperatorsExpansion_shiftRight: [[
        { name: 'num1', type: 'number' },
        { name: 'num2', type: 'number' }
    ], "reporter"],
    pmOperatorsExpansion_binnaryAnd: [[
        { name: 'num1', type: 'number' },
        { name: 'num2', type: 'number' }
    ], "reporter"],
    pmOperatorsExpansion_binnaryOr: [[
        { name: 'num1', type: 'number' },
        { name: 'num2', type: 'number' }
    ], "reporter"],
    pmOperatorsExpansion_binnaryXor: [[
        { name: 'num1', type: 'number' },
        { name: 'num2', type: 'number' }
    ], "reporter"],
    pmOperatorsExpansion_binnaryNot: [[
        { name: 'num1', type: 'number' }
    ], "reporter"]
});

// Hardcode Temporary Variables (SPtempVars) block metadata so the generator
// can map positional args to named inputs/fields. These match the extension
// definition provided in the user's reference and always include the
// VAR_TYPES dropdown options (global/sprite/thread).
Object.assign(module.exports.processedBlocks, {
    // set [TYPE] var [NAME] to [VALUE]
    setVar: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME', type: 1 },
        { name: 'VALUE', type: 1 }
    ], "stack"],
    // namespaced variants used by extension loader/runtime
    SPtempVars_setVar: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME', type: 1 },
        { name: 'VALUE', type: 1 }
    ], "stack"],
    // change [TYPE] var [NAME] by [VALUE]
    changeVar: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME', type: 1 },
        { name: 'VALUE', type: 1 }
    ], "stack"],
    SPtempVars_changeVar: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME', type: 1 },
        { name: 'VALUE', type: 1 }
    ], "stack"],
    // swap [TYPE1] var [NAME1] with [TYPE2] var [NAME2]
    swapVar: [[
        { name: 'TYPE1', type: 1, field: 'TYPE1', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME1', type: 1 },
        { name: 'TYPE2', type: 1, field: 'TYPE2', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME2', type: 1 }
    ], "stack"],
    SPtempVars_swapVar: [[
        { name: 'TYPE1', type: 1, field: 'TYPE1', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME1', type: 1 },
        { name: 'TYPE2', type: 1, field: 'TYPE2', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME2', type: 1 }
    ], "stack"],
    // for each [TYPE] var [NAME] from [START] to [END] increment by [INC_VALUE]
    forVar: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME', type: 1 },
        { name: 'START', type: 'number' },
        { name: 'END', type: 'number' },
        { name: 'INC_VALUE', type: 'number' }
    ], "branch"],
    SPtempVars_forVar: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME', type: 1 },
        { name: 'START', type: 'number' },
        { name: 'END', type: 'number' },
        { name: 'INC_VALUE', type: 'number' }
    ], "branch"],
    // run thread vars in scope (no args)
    scopeVar: [[
    ], "branch"],
    SPtempVars_scopeVar: [[
    ], "branch"],
    // [TYPE] var [NAME] exists?
    varExists: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME', type: 1 }
    ], "reporter"],
    SPtempVars_varExists: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME', type: 1 }
    ], "reporter"],
    // get [TYPE] var [NAME]
    getVar: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME', type: 1 }
    ], "reporter"],
    SPtempVars_getVar: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME', type: 1 }
    ], "reporter"],
    // all [TYPE] variables
    allVars: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] }
    ], "reporter"],
    SPtempVars_allVars: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] }
    ], "reporter"],
    // delete all [TYPE] variables
    deleteAllVar: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] }
    ], "stack"],
    SPtempVars_deleteAllVar: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] }
    ], "stack"],
    // delete [TYPE] var [NAME]
    deleteVar: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME', type: 1 }
    ], "stack"],
    SPtempVars_deleteVar: [[
        { name: 'TYPE', type: 1, field: 'TYPE', options: ['global', 'sprite', 'thread'] },
        { name: 'NAME', type: 1 }
    ], "stack"]
});
