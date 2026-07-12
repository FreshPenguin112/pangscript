Objects support demo and PenguinMod testing

Files added:
- `demo_objects.pang`: Pang source demo exercising object literals and lambdas.
- `tests/fixtures/object_literal_success.pang`: unit fixture — object of literals.
- `tests/fixtures/object_literal_lambda.pang`: unit fixture — object with lambda property.
- `tests/fixtures/object_literal_infer_fail.pang`: unit fixture — ambiguous object that should fail inference.

How to build the grammar and run tests:

```bash
# regenerate parser (if you use bun as in the project)
bun run build

# run type system tests
node tests/type_system.test.js
```

How to emit a PenguinMod project (.pmp):

```bash
# emit project JSON for the demo
node index.js demo_objects.pang demo_objects.project.json

# then convert to .pmp if you have the project's packaging tool, or load the JSON into PenguinMod's project importer
```

If you want, I can run the build and tests now and fix any issues that appear.  
