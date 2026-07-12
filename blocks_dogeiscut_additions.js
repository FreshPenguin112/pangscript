// This file adds DogeisCut processedBlocks entries at runtime.

const blocks = require('./blocks');
Object.assign(blocks.processedBlocks, {
  dogeiscutObject_blank: [[ /* no inputs */ ], 'reporter'],
  dogeiscutObject_parse: [[{ name: 'VALUE', type: 1 }], 'reporter'],
  dogeiscutObject_fromEntries: [[{ name: 'ARRAY', type: 1 }], 'reporter'],
  dogeiscutObject_currentObject: [[], 'reporter'],
  dogeiscutObject_builder: [[{ name: 'CURRENT_OBJECT', type: 1 }, { name: 'SUBSTACK', type: 'substack' }], 'reporter_with_substack'],
  dogeiscutObject_builderAppend: [[{ name: 'KEY', type: 1 }, { name: 'VALUE', type: 1 }], 'stack'],
  dogeiscutObject_builderAppendEmpty: [[{ name: 'KEY', type: 1 }], 'stack'],
  dogeiscutObject_builderSet: [[{ name: 'OBJECT', type: 1 }], 'stack'],
  dogeiscutObject_get: [[{ name: 'OBJECT', type: 1 }, { name: 'KEY', type: 1 }], 'reporter'],
  dogeiscutObject_getPath: [[{ name: 'ARRAY', type: 1 }, { name: 'OBJECT', type: 1 }], 'reporter'],
  dogeiscutObject_has: [[{ name: 'KEY', type: 1 }, { name: 'OBJECT', type: 1 }], 'reporter'],
  dogeiscutObject_size: [[{ name: 'OBJECT', type: 1 }], 'reporter'],
  dogeiscutObject_set: [[{ name: 'OBJECT', type: 1 }, { name: 'KEY', type: 1 }, { name: 'VALUE', type: 1 }], 'stack'],
  dogeiscutObject_setPath: [[{ name: 'OBJECT', type: 1 }, { name: 'ARRAY', type: 1 }, { name: 'VALUE', type: 1 }], 'stack'],
  dogeiscutObject_delete: [[{ name: 'KEY', type: 1 }, { name: 'OBJECT', type: 1 }], 'stack'],
  dogeiscutObject_deleteAtPath: [[{ name: 'OBJECT', type: 1 }, { name: 'ARRAY', type: 1 }, { name: 'VALUE', type: 1 }], 'stack'],
  dogeiscutObject_merge: [[{ name: 'ONE', type: 1 }, { name: 'TWO', type: 1 }], 'reporter'],
  dogeiscutObject_toString: [[{ name: 'OBJECT', type: 1 }, { name: 'FORMAT', type: 1 }], 'reporter'],
  dogeiscutObject_keys: [[{ name: 'OBJECT', type: 1 }], 'reporter'],
  dogeiscutObject_values: [[{ name: 'OBJECT', type: 1 }], 'reporter'],
  dogeiscutObject_entries: [[{ name: 'OBJECT', type: 1 }], 'reporter'],
  dogeiscutObject_forEach: [[{ name: 'SUBSTACK', type: 'substack' }, { name: 'OBJECT', type: 1 }], 'branch'],
  dogeiscutObject_is: [[{ name: 'VALUE', type: 1}], 'reporter']
});
