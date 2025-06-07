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