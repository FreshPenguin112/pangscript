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
            const args = Object.keys(block)
                .filter(a => a.startsWith('args'))
                .map(n => block[n])
                .filter(a => a && a[0]?.type != 'field_image');

            // If the block has an input_statement argument, treat it as a branch-style block
            if (args.find(k => k.type == 'input_statement')) {
                const params = (args[0] ?? []).map((arg) => {
                    if (arg.type == 'field_dropdown') {
                        return {
                            name: arg.name,
                            type: 1,
                            field: arg.name,
                            options: arg.options,
                            variableTypes: arg.variableTypes
                        };
                    } else if (arg.type == 'field_image') {
                        return null;
                    } else if (arg.type == 'field_variable') {
                        return {
                            name: arg.name,
                            type: 1,
                            options: arg.options,
                            variableTypes: arg.variableTypes
                        };
                    } else if (arg.type == 'field_variable_getter') {
                        return null;
                    } else if (arg.type == 'field_numberdropdown') {
                        return { name: arg.name, type: 1, variableTypes: arg.variableTypes };
                    } else if (arg.type == 'input_statement') {
                        return {};
                    }
                    return {
                        name: arg.name,
                        // treat input_value as value input (1); treat any field_* or unknown as field (1)
                        type: arg.type == 'input_value' ? 1 : 1,
                        variableTypes: arg.variableTypes
                    };
                }) ?? [];
                return [opcode, [params, 'branch', args.filter(k => k.type == 'input_statement').map(i => i.name)]];
            }

            const params = ((args[0] ?? []).map((arg) => {
                if (arg.type == 'field_dropdown') {
                    return {
                        name: arg.name,
                        type: 1,
                        field: arg.name,
                        options: arg.options,
                        variableTypes: arg.variableTypes
                    };
                } else if (arg.type == 'field_image') {
                    return null;
                } else if (arg.type == 'field_variable') {
                    return {
                        name: arg.name,
                        type: 1,
                        field: arg.name,
                        variableTypes: arg.variableTypes
                    };
                } else if (arg.type == 'field_variable_getter') {
                    return null;
                } else if (arg.type == 'field_numberdropdown') {
                    return { name: arg.name, type: 1 };
                } else if (arg.type == 'input_statement') {
                    return {};
                }
                return {
                    name: arg.name,
                    type: arg.type == 'input_value' ? 1 : 1,
                    variableTypes: arg.variableTypes
                };
            }) ?? []);

            const shape = (block.extensions ?? []).includes('shape_hat') ? 'hat' : 'reporter';
            return [opcode, [params, shape]];
        })
    );

    return processedBlocks;
}

module.exports.processedBlocks = jsBlocksToJSON();

// Hardcoded additional processed blocks for extensions and special cases
Object.assign(module.exports.processedBlocks, {
    pmOperatorsExpansion_shiftLeft: [[
        { name: 'num1', type: 'number' },
        { name: 'num2', type: 'number' }
    ]],
    pmOperatorsExpansion_shiftRight: [[
        { name: 'num1', type: 'number' },
        { name: 'num2', type: 'number' }
    ]],
    pmOperatorsExpansion_binnaryAnd: [[
        { name: 'num1', type: 'number' },
        { name: 'num2', type: 'number' }
    ]],
    pmOperatorsExpansion_binnaryOr: [[
        { name: 'num1', type: 'number' },
        { name: 'num2', type: 'number' }
    ]],
    pmOperatorsExpansion_binnaryXor: [[
        { name: 'num1', type: 'number' },
        { name: 'num2', type: 'number' }
    ]],
    pmOperatorsExpansion_binnaryNot: [[
        { name: 'num1', type: 'number' }
    ]]
});
