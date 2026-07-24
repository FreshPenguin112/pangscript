const assert = require('assert');
const fs = require('fs');
const os = require('os');
const { spawnSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

function runFixture(fileName) {
  const input = path.join(root, 'tests', 'fixtures', fileName);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pang-test-'));
  const output = path.join(tempDir, 'project.json');
  const result = spawnSync(process.execPath, ['index.js', input, output], { cwd: root, encoding: 'utf8' });
  return { result, output };
}

const { result: success } = runFixture('type_inference_and_typeof.pang');
assert.strictEqual(success.status, 0, success.stderr || success.stdout);

const { result: failure } = runFixture('type_error_mismatch.pang');
assert.notStrictEqual(failure.status, 0, 'Expected compile-time type error');
assert.match(failure.stderr || failure.stdout, /Type error/i);

const { result: inferenceRequired } = runFixture('type_inference_required.pang');
assert.notStrictEqual(inferenceRequired.status, 0, 'Expected compile-time error when inference is insufficient');
assert.match(inferenceRequired.stderr || inferenceRequired.stdout, /Type inference/i);

const { result: typedObjectSuccess, output: typedObjectOutput } = runFixture('typed_object_and_casts.pang');
assert.strictEqual(typedObjectSuccess.status, 0, typedObjectSuccess.stderr || typedObjectSuccess.stdout);
assert.ok(fs.existsSync(typedObjectOutput), 'Expected temporary project output for typed object fixture');
const typedObjectEmitted = fs.readFileSync(typedObjectOutput, 'utf8');
assert.match(typedObjectEmitted, /"number"/, 'Expected typeof on a typed variable to resolve to its declared type as lowercase');

const { result: runtimeTypeof, output: runtimeTypeofOutput } = runFixture('type_runtime_helper.pang');
assert.strictEqual(runtimeTypeof.status, 0, runtimeTypeof.stderr || runtimeTypeof.stdout);
assert.ok(fs.existsSync(runtimeTypeofOutput), 'Expected temporary project output for runtime typeof fixture');
const runtimeTypeofEmitted = fs.readFileSync(runtimeTypeofOutput, 'utf8');
const runtimeTypeofProject = JSON.parse(runtimeTypeofEmitted);
const runtimeTypeofBlocks = runtimeTypeofProject.targets && runtimeTypeofProject.targets[1] && runtimeTypeofProject.targets[1].blocks ? runtimeTypeofProject.targets[1].blocks : {};
const runtimeHelperEntry = Object.entries(runtimeTypeofBlocks).find(([, block]) => {
  return block && block.opcode === 'SPtempVars_setVar' && block.inputs && block.inputs.NAME && Array.isArray(block.inputs.NAME[1]) && block.inputs.NAME[1][1] === '_INTERNAL__runtime_typeof__AABBCCDDEE12123434__';
});
assert.ok(runtimeHelperEntry, 'Expected runtime typeof helper to be emitted as a declaration');

const { result: invalidCast } = runFixture('invalid_cast.pang');
assert.notStrictEqual(invalidCast.status, 0, 'Expected compile-time type error for invalid cast');
assert.match(invalidCast.stderr || invalidCast.stdout, /Type error/i);

const { result: conditionalReassign } = runFixture('conditional_reassign_type_error.pang');
assert.notStrictEqual(conditionalReassign.status, 0, 'Expected compile-time type error for conditional reassignment to incompatible type');
assert.match(conditionalReassign.stderr || conditionalReassign.stdout, /Type error/i);

// Objects: success with literal properties
const { result: objSuccess } = runFixture('object_literal_success.pang');
assert.strictEqual(objSuccess.status, 0, objSuccess.stderr || objSuccess.stdout);

// Objects: success when property is a lambda
const { result: objLambda } = runFixture('object_literal_lambda.pang');
assert.strictEqual(objLambda.status, 0, objLambda.stderr || objLambda.stdout);

const { result: objArrayCall, output: projectJsonArray } = runFixture('object_property_array_call.pang');
assert.strictEqual(objArrayCall.status, 0, objArrayCall.stderr || objArrayCall.stdout);
assert.ok(fs.existsSync(projectJsonArray), 'Expected project.json to be generated for object property array call fixture');
const emittedArray = fs.readFileSync(projectJsonArray, 'utf8');
assert.match(emittedArray, /jwArray_append|dogeiscutObject_/, 'Expected object-property array helper call to emit an array helper block');
const projectArray = JSON.parse(emittedArray);

const { result: objLambdaArgNaming, output: objLambdaArgNamingOutput } = runFixture('object_lambda_arg_naming.pang');
assert.strictEqual(objLambdaArgNaming.status, 0, objLambdaArgNaming.stderr || objLambdaArgNaming.stdout);
assert.ok(fs.existsSync(objLambdaArgNamingOutput), 'Expected temporary project output for object lambda arg naming fixture');
const objLambdaArgNamingEmitted = fs.readFileSync(objLambdaArgNamingOutput, 'utf8');
const objLambdaArgNamingProject = JSON.parse(objLambdaArgNamingEmitted);
const objLambdaArgNamingBlocks = (objLambdaArgNamingProject.targets || []).reduce((acc, target) => {
  if (target && target.blocks) Object.assign(acc, target.blocks);
  return acc;
}, {});
const objLambdaArgNamingSetter = Object.entries(objLambdaArgNamingBlocks).find(([, block]) => {
  return block && block.opcode === 'SPtempVars_setVar' && block.inputs && block.inputs.NAME && Array.isArray(block.inputs.NAME[1]) && block.inputs.NAME[1][1] === '__arg0';
});
assert.ok(objLambdaArgNamingSetter, 'Expected object-lambda call emission to assign the argument into __arg0');
const arrayBlocks = projectArray.targets && projectArray.targets[1] && projectArray.targets[1].blocks ? projectArray.targets[1].blocks : {};
const appendBlockEntry = Object.entries(arrayBlocks).find(([, block]) => block && block.opcode === 'jwArray_append');
assert.ok(appendBlockEntry, 'Expected jwArray_append block to be emitted for object-property array push');
const [, appendBlock] = appendBlockEntry;
assert.ok(appendBlock.inputs && appendBlock.inputs.VALUE, 'Expected jwArray_append to receive a VALUE input');
const valueInput = appendBlock.inputs.VALUE;
const literalValue = Array.isArray(valueInput[1]) ? valueInput[1][1] : valueInput[1];
assert.strictEqual(String(literalValue), '4', 'Expected object-property push argument to be emitted into jwArray_append VALUE input');

// Objects: builder-style emission for literals should reach DogeisCut object blocks.
const { result: objBuilder, output: projectJson } = runFixture('object_literal_builder.pang');
assert.strictEqual(objBuilder.status, 0, objBuilder.stderr || objBuilder.stdout);
assert.ok(fs.existsSync(projectJson), 'Expected project.json to be generated');
const emitted = fs.readFileSync(projectJson, 'utf8');
assert.match(emitted, /dogeiscutObject_builder/,
  'Expected object literal builder block to be emitted');
const project = JSON.parse(emitted);
const spriteBlocks = project.targets && project.targets[1] && project.targets[1].blocks ? project.targets[1].blocks : {};
const builderEntries = Object.entries(spriteBlocks).filter(([, block]) => block && block.opcode === 'dogeiscutObject_builder');
assert.ok(builderEntries.length >= 1, 'Expected at least one dogeiscut object builder block in project.json');
const appendEntries = Object.entries(spriteBlocks).filter(([, block]) => block && block.opcode === 'dogeiscutObject_builderAppend');
assert.ok(appendEntries.length > 0, 'Expected builder append blocks to be emitted');
// Find the builder whose appends have text values (the user fixture's builder)
const textAppendEntries = appendEntries.filter(([, block]) => block.inputs.VALUE && block.inputs.VALUE[0] === 1 && block.inputs.VALUE[1] && block.inputs.VALUE[1][0] === 10);
assert.ok(textAppendEntries.length >= 2, 'Expected at least two builder append blocks with text values');
const textAppendById = Object.fromEntries(textAppendEntries);
const textBuilderEntry = builderEntries.find(([bid]) => textAppendEntries.some(([, ab]) => ab.parent === bid));
assert.ok(textBuilderEntry, 'Expected a builder parented to text-valued appends');
const [textBuilderId, textBuilder] = textBuilderEntry;
assert.strictEqual(textBuilder.inputs.CURRENT_OBJECT[0], 1, 'Expected CURRENT_OBJECT to be emitted as a direct block-reference input');
assert.strictEqual(typeof textBuilder.inputs.CURRENT_OBJECT[1], 'string', 'Expected CURRENT_OBJECT input to reference a block id');
assert.strictEqual(textBuilder.inputs.SUBSTACK[0], 2, 'Expected builder substack to be emitted as a block reference');
const firstTextAppendId = textAppendEntries.find(([, block]) => block.parent === textBuilderId)[0];
assert.ok(firstTextAppendId, 'Expected a text-valued builder append to be parented to its builder');
let prevId = firstTextAppendId;
for (let i = 1; i < textAppendEntries.length; i++) {
  const nextId = textAppendById[prevId].next;
  assert.ok(nextId, `Expected append block ${prevId} to link to the next append block`);
  assert.strictEqual(textAppendById[nextId].parent, prevId, 'Expected subsequent builder append to be parented to the previous append block');
  prevId = nextId;
}

const setWrapperEntry = Object.entries(spriteBlocks).find(([, block]) => {
  return block && block.opcode === 'SPtempVars_setVar' && block.inputs.VALUE && block.inputs.VALUE[0] === 3 && block.inputs.VALUE[1] && spriteBlocks[block.inputs.VALUE[1]] && spriteBlocks[block.inputs.VALUE[1]].opcode === 'dogeiscutObject_set';
});
assert.ok(setWrapperEntry, 'Expected object property assignment to be wrapped in SPtempVars_setVar when using DogeisCut object set');
const setWrapperBlock = setWrapperEntry[1];
const setChildId = setWrapperBlock.inputs.VALUE[1];
assert.ok(setChildId && spriteBlocks[setChildId] && spriteBlocks[setChildId].opcode === 'dogeiscutObject_set', 'Expected SPtempVars_setVar VALUE input to contain dogeiscutObject_set');

// Class instances: inferred class type must reject reassignment to a non-instance.
const { result: instanceInferError } = runFixture('class_instance_infer_reassign_error.pang');
assert.notStrictEqual(instanceInferError.status, 0, 'Expected compile-time type error when an inferred class instance is reassigned to a non-instance');
assert.match(instanceInferError.stderr || instanceInferError.stdout, /Type error/i);

// Class instances: explicit annotation + another instance of the same class is fine.
const { result: instanceExplicitOk } = runFixture('class_instance_explicit_annotation_ok.pang');
assert.strictEqual(instanceExplicitOk.status, 0, instanceExplicitOk.stderr || instanceExplicitOk.stdout);

// Class instances: explicit annotation + static factory usage must compile.
const { result: instanceStaticOk } = runFixture('class_instance_static_ok.pang');
assert.strictEqual(instanceStaticOk.status, 0, instanceStaticOk.stderr || instanceStaticOk.stdout);

// Dynamic .length with `as` cast must compile.
const { result: dynamicLengthAsCast } = runFixture('dynamic_length_as_cast.pang');
assert.strictEqual(dynamicLengthAsCast.status, 0, dynamicLengthAsCast.stderr || dynamicLengthAsCast.stdout);

// Dynamic .length without `as` cast must error.
const { result: dynamicLengthNoCast } = runFixture('dynamic_length_no_cast_error.pang');
assert.notStrictEqual(dynamicLengthNoCast.status, 0, 'Expected compile-time error when .length is accessed on a dynamic property without an as cast');
assert.match(dynamicLengthNoCast.stderr || dynamicLengthNoCast.stdout, /as.*cast/i);

// Class instances: explicit annotation must reject reassignment to a non-instance.
const { result: instanceExplicitError } = runFixture('class_instance_explicit_reassign_error.pang');
assert.notStrictEqual(instanceExplicitError.status, 0, 'Expected compile-time type error when an explicitly annotated class instance is reassigned to a non-instance');
assert.match(instanceExplicitError.stderr || instanceExplicitError.stdout, /Type error/i);

console.log('type system tests passed');
