// deno-lint-ignore-file no-explicit-any


//@ts-ignore: goog...
globalThis.goog = {
    require: () => {},
    provide: () => {},
};
globalThis.Blockly = {
    //@ts-ignore:
    Blocks: {},
    Constants: {
        //@ts-ignore:
        Data: {}
    },
    Extensions: {
        registerMixin: () => {}
    },
    ScratchBlocks: {
        //@ts-ignore:
        ProcedureUtils: {
            //@ts-ignore:
            parseReturnMutation: () => {}
        }
    },
    //@ts-ignore:
    Msg: {},
    mainWorkspace: {
        options: {
            pathToMedia: ''
        },
        enableProcedureReturns() {}
    },
    //@ts-ignore:
    Categories: {},
    FieldDropdown: class FieldDropdown {}
};

require('./pm-block/msg/js/en.js');

require('./pm-block/core/constants.js');
require('./pm-block/core/colours.js');

module.exports.blockly = Blockly

require('./pm-block/blocks_vertical/control.js');
require('./pm-block/blocks_vertical/event.js');
require('./pm-block/blocks_vertical/looks.js');
require('./pm-block/blocks_vertical/motion.js');
require('./pm-block/blocks_vertical/operators.js');
require('./pm-block/blocks_vertical/sound.js');
require('./pm-block/blocks_vertical/sensing.js');
require('./pm-block/blocks_vertical/data.js');


// this is used for custom blocks
// await import('./pm-block/blocks_vertical/procedures.js');

function jsBlocksToJSON(jsblocks = globalThis.Blockly.Blocks) {
    const blocks = {};
    for (const [opcode, data] of Object.entries(jsblocks)) {
        let blockdata = {};
        const fakeThis = {
            // i think these kinds of block definitions don't have types in tw-types
            jsonInit (data) {
                blockdata = data
            },
            appendDummyInput() {
                return {
                    appendField() {return this}
                }
            },
            setCategory() {},
            setColour() {},
            setPreviousStatement() {},
            //@ts-ignore:
            workspace: Blockly.mainWorkspace,
        };
        data.init.call(fakeThis);
        // if(!blockdata.args1 || blockdata.args1.type == 'field_image') {
        blocks[opcode] = blockdata;
        // }
    }
    
    // console.debug(Object.keys(blocks))
    
    const processedBlocks = Object.fromEntries(
        Object.entries(blocks).map(([opcode, block]) => {
            // console.log(opcode, block)
            try {
                Object.keys(block)
                .filter(a => a.startsWith('args'))
                .map(n => block[n])
                .filter(a => a[0]?.type != 'field_image');
            } catch (error) {
                console.error(block,
                    Object.keys(block)
                    .filter(a => a.startsWith('args'))
                    .map(n => block[n]))
                throw error
            }
            const args = Object.keys(block)
                .filter(a => a.startsWith('args'))
                .map(n => block[n])
                .filter(a => a[0]?.type != 'field_image');
            
            if(args.find(k => k.type == 'input_statement')) {
                return [opcode, [(args[0] ?? []).map((arg) => {
                    if (arg.type == 'field_dropdown') {
                        return { //TODO - in some way implement this
                            name: arg.name,
                            type: 1,
                            field: arg.name,
                            options: arg.options,
                            variableTypes: arg.variableTypes
                        }
                    } else if (arg.type == 'field_image') {
                        return null
                    } else if (arg.type == 'field_variable') {
                        //TODO - implement this in a better way
                        return {
                            name: arg.name,
                            type: 1,
                            options: arg.options,
                            variableTypes: arg.variableTypes
                        }
                    } else if (arg.type == 'field_variable_getter') {
                        //TODO - maybe implement this, i mean setting and stuff is done thru syntax but uh
                        return null
                    } else if (arg.type == 'field_numberdropdown') {
                        // this is the list index type, if you didn't know in 2.0 you could
                        // use last, random/all (depending on block) and 3.0
                        // has that too, just no dropdown in the visible block
                        return {
                            name: arg.name,
                            type: 1,
                            variableTypes: arg.variableTypes
                        }
                    } else if (arg.type == 'input_statement') {
                        return {}
                    }
                    return {
                        name: arg.name,
                        type: arg.type == 'input_value' ? 1 : (() => {
                            console.error(block, args)
                            throw `Unknown input type ${arg.type} in ${opcode}.${arg.name}`
                        })(),
                        variableTypes: arg.variableTypes
                    }
                }) ?? [], 'branch', args.filter(k => k.type == 'input_statement').map(i => i.name)]]
            }
            return [opcode, [((args[0] ?? []).map((arg) => {
                if (arg.type == 'field_dropdown') {
                    return { //TODO - in some way implement this
                        name: arg.name,
                        type: 1,
                        field: arg.name,
                        options: arg.options,
                        variableTypes: arg.variableTypes
                    }
                } else if (arg.type == 'field_image') {
                    return null
                } else if (arg.type == 'field_variable') {
                    //TODO - implement this in a better way
                    return {
                        name: arg.name,
                        type: 1,
                        field: arg.name,
                        variableTypes: arg.variableTypes
                    }
                } else if (arg.type == 'field_variable_getter') {
                    //TODO - maybe implement this, i mean setting and stuff is done thru syntax but uh
                    return null
                } else if (arg.type == 'field_numberdropdown') {
                    // this is the list index type, if you didn't know in 2.0 you could
                    // use last, random/all (depending on block) and 3.0
                    // has that too, just no dropdown in the visible block
                    return {
                        name: arg.name,
                        type: 1,
                    }
                } else if (arg.type == 'input_statement') {
                    return {}
                }
                return {
                    name: arg.name,
                    type: arg.type == 'input_value' ? 1 : (() => {
                        console.error(block, args)
                        throw `Unknown input type ${arg.type} in ${opcode}.${arg.name}`
                    })(),
                    variableTypes: arg.variableTypes
                }
            }) ?? []), (block.extensions ?? []).includes("shape_hat") ? 'hat' : 'reporter']].filter(a => a != null)
        })
    )
    return processedBlocks
}
module.exports.processedBlocks = jsBlocksToJSON()
// --------------------------------------------


// --- Hardcoded input maps for pmOperatorsExpansion bitwise blocks ---
Object.assign(module.exports.processedBlocks, {
    pmOperatorsExpansion_shiftLeft: [[
        { name: "num1", type: "number" },
        { name: "num2", type: "number" }
    ]],
    pmOperatorsExpansion_shiftRight: [[
        { name: "num1", type: "number" },
        { name: "num2", type: "number" }
    ]],
    pmOperatorsExpansion_binnaryAnd: [[
        { name: "num1", type: "number" },
        { name: "num2", type: "number" }
    ]],
    pmOperatorsExpansion_binnaryOr: [[
        { name: "num1", type: "number" },
        { name: "num2", type: "number" }
    ]],
    pmOperatorsExpansion_binnaryXor: [[
        { name: "num1", type: "number" },
        { name: "num2", type: "number" }
    ]],
    pmOperatorsExpansion_binnaryNot: [[
        { name: "num1", type: "number" }
    ]],
    // --- JSON extension input maps ---
    jgJSON_json_validate: [[
        { name: "json", type: "string" }
    ]],
    jgJSON_getValueFromJSON: [[
        { name: "VALUE", type: "string" },
        { name: "JSON", type: "string" }
    ]],
    jgJSON_getTreeValueFromJSON: [[
        { name: "VALUE", type: "string" },
        { name: "JSON", type: "string" }
    ]],
    jgJSON_setValueToKeyInJSON: [[
        { name: "VALUE", type: "string" },
        { name: "KEY", type: "string" },
        { name: "JSON", type: "string" }
    ]],
    jgJSON_json_delete: [[
        { name: "json", type: "string" },
        { name: "key", type: "string" }
    ]],
    jgJSON_json_values: [[
        { name: "json", type: "string" }
    ]],
    jgJSON_json_keys: [[
        { name: "json", type: "string" }
    ]],
    jgJSON_json_has: [[
        { name: "json", type: "string" },
        { name: "key", type: "string" }
    ]],
    jgJSON_json_combine: [[
        { name: "one", type: "string" },
        { name: "two", type: "string" }
    ]],
    jgJSON_json_array_validate: [[
        { name: "array", type: "string" }
    ]],
    jgJSON_json_array_split: [[
        { name: "text", type: "string" },
        { name: "delimeter", type: "string" }
    ]],
    jgJSON_json_array_join: [[
        { name: "array", type: "string" },
        { name: "delimeter", type: "string" }
    ]],
    jgJSON_json_array_push: [[
        { name: "array", type: "string" },
        { name: "item", type: "string" }
    ]],
    jgJSON_json_array_concatLayer1: [[
        { name: "array1", type: "string" },
        { name: "array2", type: "string" }
    ]],
    jgJSON_json_array_concatLayer2: [[
        { name: "array1", type: "string" },
        { name: "array2", type: "string" },
        { name: "array3", type: "string" }
    ]],
    jgJSON_json_array_delete: [[
        { name: "array", type: "string" },
        { name: "index", type: "number" }
    ]],
    jgJSON_json_array_reverse: [[
        { name: "array", type: "string" }
    ]],
    jgJSON_json_array_insert: [[
        { name: "array", type: "string" },
        { name: "index", type: "number" },
        { name: "value", type: "string" }
    ]],
    jgJSON_json_array_set: [[
        { name: "array", type: "string" },
        { name: "index", type: "number" },
        { name: "value", type: "string" }
    ]],
    jgJSON_json_array_get: [[
        { name: "array", type: "string" },
        { name: "index", type: "number" }
    ]],
    jgJSON_json_array_indexofNostart: [[
        { name: "array", type: "string" },
        { name: "value", type: "string" }
    ]],
    jgJSON_json_array_indexof: [[
        { name: "array", type: "string" },
        { name: "number", type: "number" },
        { name: "value", type: "string" }
    ]],
    jgJSON_json_array_length: [[
        { name: "array", type: "string" }
    ]],
    jgJSON_json_array_contains: [[
        { name: "array", type: "string" },
        { name: "value", type: "string" }
    ]],
    jgJSON_json_array_flat: [[
        { name: "array", type: "string" },
        { name: "layer", type: "number" }
    ]],
    jgJSON_json_array_getrange: [[
        { name: "array", type: "string" },
        { name: "index1", type: "number" },
        { name: "index2", type: "number" }
    ]],
    jgJSON_json_array_isempty: [[
        { name: "array", type: "string" }
    ]],
    jgJSON_json_array_listtoarray: [[
        { name: "list", type: "string" }
    ]],
    jgJSON_json_array_tolist: [[
        { name: "list", type: "string" },
        { name: "array", type: "string" }
    ]]
});
// ---------------------------------------------------------------