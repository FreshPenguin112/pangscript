module.exports = function () {
  return {
    visitor: {
      Program(path, state) {
        const filename = state.filename || '';
        // Only run on index.min.js and visitor.min.js
        if (!filename.endsWith('index.min.js') && !filename.endsWith('visitor.min.js')) {
          return;
        }

        path.traverse({
          CallExpression(callPath) {
            const callee = callPath.get('callee');
            if (!callee.isIdentifier({ name: 'require' })) return;

            const arg = callPath.get('arguments')[0];
            if (!arg || !arg.isStringLiteral()) return;

            let val = arg.node.value;
            if ((val.startsWith('./') || val.startsWith('../')) && val.endsWith('.js')) {
              const newVal = val.replace(/\.js$/, '.min.js');
              arg.replaceWithSourceString(`'${newVal}'`);
            }
          }
        });
      }
    }
  };
};
