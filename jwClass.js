(function (Scratch) {
    'use strict';
 
    if (!Scratch.extensions.unsandboxed) {
        throw new Error('jwClass must be loaded as an unsandboxed TurboWarp extension.');
    }
 
    const vm = Scratch.vm;
    const runtime = vm.runtime;
 
    const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;
    const BlockShape = Scratch.BlockShape || {
        SQUARE: 'square',
        TICKET: 'ticket'
    };
 
    const pmSymbol = Scratch.pmSymbol || {
        equals: Symbol.for('pm.equals')
    };
 
    const escapeHTML = unsafe => {
        return String(unsafe)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    };
 
    const classSymbol = Symbol('class');
 
    let dogeiscutObject = {
        Type: class {},
        Block: {},
        Argument: {}
    };
 
    let jwPointer = {
        Type: class {},
        Block: {},
        Argument: {}
    };
 
    const refreshDeps = () => {
        if (vm.dogeiscutObject) dogeiscutObject = vm.dogeiscutObject;
        if (vm.jwPointer) jwPointer = vm.jwPointer;
    };
 
    class ClassType {
        constructor(construct = function* () {}, name = '', extension = null, proc = null, staticConstruct = function* () {}) {
            this.construct = construct;
            this.name = name;
            this.extension = extension;
            this.proc = proc ?? {};
            this.static = {};
            this.staticConstruct = staticConstruct;
        }
 
        toString() {
            return this.name.length > 0 ? `Class<${this.name}>` : 'Class';
        }
 
        jwArrayHandler() {
            return escapeHTML(this.toString());
        }
 
        static toClass(v) {
            if (v instanceof ClassType) return v;
            return new ClassType();
        }
 
        createInstance = function* (thread, target) {
            refreshDeps();
 
            if (this.proc) thread.procedures = { ...this.proc, ...thread.procedures };

            if (!this.extension) {
                let object = new dogeiscutObject.Type();
                object.map.set(classSymbol, this);
                let pointer = jwPointer.Type.create();
                pointer.value = object;
                yield* this.construct(pointer, thread, target);
                return pointer;
            } else {
                let pointer = yield* this.extension.createInstance(thread, target);
                let object = pointer.value;
                if (object instanceof dogeiscutObject.Type) object.map.set(classSymbol, this);
                yield* this.construct(pointer, thread, target);
                return pointer;
            }
        };
 
        extend(extension) {
            return new ClassType(this.construct, this.name, extension, this.proc, this.staticConstruct);
        }
 
        [pmSymbol.equals](other) {
            return this === other;
        }
    }
 
    const jwClass = {
        Type: ClassType,
        Block: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.TICKET,
            forceOutputType: 'jwClass',
            disableMonitor: true
        },
        Argument: {
            shape: BlockShape.TICKET,
            check: ['jwClass', 'Pointer']
        },
 
        classSymbol,
 
        setProp(name, pointer, value) {
            refreshDeps();
            if (!(pointer instanceof jwPointer.Type)) return;
            if (!(pointer.value instanceof dogeiscutObject.Type)) return;
            pointer.value = dogeiscutObject.Type.toObject(pointer.value); // clone
            pointer.value.map.set(name, value);
        },
 
        getProp(name, pointer) {
            refreshDeps();
            if (!(pointer instanceof jwPointer.Type)) return null;
            if (!(pointer.value instanceof dogeiscutObject.Type)) return null;
            return pointer.value.map.get(name);
        },

        setStatic(name, classType, value) {
            refreshDeps();
            classType = ClassType.toClass(classType);
            if (!(classType instanceof ClassType)) return;
            classType.static[name] = value;
        },

        getStatic(name, classType) {
            refreshDeps();
            classType = ClassType.toClass(classType);
            if (!(classType instanceof ClassType)) return null;
            return classType.static[name];
        },
 
        instanceOf(pointer, otherClass) {
            refreshDeps();
            let __class__ = jwClass.getProp(classSymbol, pointer);
            while (__class__) {
                if (__class__ === otherClass) return true;
                __class__ = __class__.extension;
            }
            return false;
        }
    };
 
    class Extension {
        constructor() {
            refreshDeps();
 
            try {
                if (runtime.extensionManager.loadExtensionURL) {
                    const loaded = runtime.extensionManager.loadExtensionURL(
                        'https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js'
                    );
                    if (loaded && typeof loaded.then === 'function') {
                        loaded.then(refreshDeps).catch(() => {});
                    }
                }
            } catch (e) {}
 
            try {
                if (runtime.extensionManager.loadExtensionIdSync) {
                    runtime.extensionManager.loadExtensionIdSync('jwPointer');runtime.extensionManager.loadExtensionIdSync('jwLambda');
                }
            } catch (e) {}
 
            refreshDeps();
 
            vm.jwClass = jwClass;
 
            runtime.registerSerializer(
                'jwClass',
                v => v.name,
                v => new jwClass.Type(function* () {}, v.name)
            );
 
            if (runtime.registerCompiledExtensionBlocks) {
                runtime.registerCompiledExtensionBlocks('jwClass', this.getCompileInfo());
            }
        }
 
        getInfo() {
            refreshDeps();
 
            return {
                id: 'jwClass',
                name: 'Classes',
                color1: '#4bbf56',
                menuIconURI: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCI+CiAgPGVsbGlwc2Ugc3R5bGU9InN0cm9rZTogcmdiKDYwLCAxNTMsIDY5KTsgZmlsbDogcmdiKDc1LCAxOTEsIDg2KTsiIGN4PSIxMCIgY3k9IjEwIiByeD0iOS41IiByeT0iOS41Ij48L2VsbGlwc2U+CiAgPGc+CiAgICA8cGF0aCBkPSJNIDYuOTc4IDUuNTE2IEMgNC43MzYgOC41MDUgNC43MzYgMTEuNDk0IDYuOTc4IDE0LjQ4NCIgc3Ryb2tlPSIjZmZmIiBmaWxsPSJub25lIiBzdHlsZT0ic3Ryb2tlLWxpbmVqb2luOiByb3VuZDsgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kOyBzdHJva2Utd2lkdGg6IDI7Ij48L3BhdGg+CiAgICA8cGF0aCBkPSJNIDE0LjcwMyAxNC40ODQgQyAxMi40NjEgMTEuNDk1IDEyLjQ2MSA4LjUwNiAxNC43MDMgNS41MTYiIHN0cm9rZT0iI2ZmZiIgZmlsbD0ibm9uZSIgc3R5bGU9InN0cm9rZS1saW5lam9pbjogcm91bmQ7IHN0cm9rZS1saW5lY2FwOiByb3VuZDsgc3Ryb2tlLXdpZHRoOiAyOyB0cmFuc2Zvcm0tYm94OiBmaWxsLWJveDsgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDUwJTsiIHRyYW5zZm9ybT0ibWF0cml4KC0xLCAwLCAwLCAtMSwgLTAuMDAwMDAyLCAwKSI+PC9wYXRoPgogIDwvZz4KPC9zdmc+',
                blocks: [
                    {
                        opcode: 'class',
                        text: ['class [NAME] [SELF]', 'static init [SELF2]'],
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: ''
                            },
                            SELF: {
                                fillIn: 'self'
                            },
                            SELF2: {
                                fillIn: 'self'
                            }
                        },
                        branches: [{}, {}],
                        alignments: [
                            null,
                            null,
                            Scratch.ArgumentAlignment.Left
                        ],
                        ...jwClass.Block
                    },
                    {
                        opcode: 'self',
                        text: 'self',
                        hideFromPalette: true,
                        canDragDuplicate: true,
                        ...jwPointer.Block
                    },
                    {
                        opcode: 'extend',
                        text: '[CLASS] extends [EXTENSION]',
                        arguments: {
                            CLASS: jwClass.Argument,
                            EXTENSION: jwClass.Argument
                        },
                        ...jwClass.Block
                    },
                    '---',
                    {
                        opcode: 'setProp',
                        text: 'set [NAME] on [POINTER] to [VALUE]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'foo'
                            },
                            POINTER: jwPointer.Argument,
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: 'bar'
                            }
                        }
                    },
                    {
                        opcode: 'getProp',
                        text: 'get [NAME] on [POINTER]',
                        blockType: BlockType.REPORTER,
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'foo'
                            },
                            POINTER: jwPointer.Argument
                        },
                        allowDropAnywhere: true
                    },
                    {
                        opcode: 'setStatic',
                        text: 'set static [NAME] on [CLASS] to [VALUE]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            NAME: { type: ArgumentType.STRING, defaultValue: 'foo' },
                            CLASS: jwClass.Argument,
                            VALUE: { type: ArgumentType.STRING, defaultValue: 'bar' }
                        }
                    },
                    {
                        opcode: 'getStatic',
                        text: 'get static [NAME] on [CLASS]',
                        blockType: BlockType.REPORTER,
                        arguments: {
                            NAME: { type: ArgumentType.STRING, defaultValue: 'foo' },
                            CLASS: jwClass.Argument
                        },
                        allowDropAnywhere: true
                    },
                    {
                        opcode: 'getClass',
                        text: 'get class of [POINTER]',
                        arguments: {
                            POINTER: jwPointer.Argument
                        },
                        ...jwClass.Block
                    },
                    '---',
                    {
                        opcode: 'new',
                        text: 'new [CLASS]',
                        arguments: {
                            CLASS: jwClass.Argument
                        },
                        ...jwPointer.Block
                    },
                    {
                        opcode: 'getName',
                        text: 'name of [CLASS]',
                        blockType: BlockType.REPORTER,
                        arguments: {
                            CLASS: jwClass.Argument
                        }
                    },
                    '---',
                    {
                        opcode: 'instanceof',
                        text: 'is [POINTER] instance of [CLASS]?',
                        blockType: BlockType.BOOLEAN,
                        arguments: {
                            POINTER: jwPointer.Argument,
                            CLASS: jwClass.Argument
                        }
                    }
                ]
            };
        }
 
        getCompileInfo() {
            return {
                ir: {
                    class: (generator, block) => {
                        generator.script.yields = true;
                        return {
                            kind: 'input',
                            name: generator.descendInputOfBlock(block, 'NAME'),
                            substack: generator.descendSubstack(block, 'SUBSTACK'),
                            substack2: generator.descendSubstack(block, 'SUBSTACK2')
                        };
                    },
 
                    self: () => ({
                        kind: 'input'
                    }),
 
                    extend: (generator, block) => ({
                        kind: 'input',
                        class: generator.descendInputOfBlock(block, 'CLASS'),
                        extension: generator.descendInputOfBlock(block, 'EXTENSION')
                    }),
 
                    setProp: (generator, block) => ({
                        kind: 'stack',
                        name: generator.descendInputOfBlock(block, 'NAME'),
                        pointer: generator.descendInputOfBlock(block, 'POINTER'),
                        value: generator.descendInputOfBlock(block, 'VALUE')
                    }),

                    setStatic: (generator, block) => ({
                        kind: 'stack',
                        name: generator.descendInputOfBlock(block, 'NAME'),
                        class: generator.descendInputOfBlock(block, 'CLASS'),
                        value: generator.descendInputOfBlock(block, 'VALUE')
                    }),
 
                    getProp: (generator, block) => ({
                        kind: 'input',
                        name: generator.descendInputOfBlock(block, 'NAME'),
                        pointer: generator.descendInputOfBlock(block, 'POINTER')
                    }),

                    getStatic: (generator, block) => ({
                        kind: 'input',
                        name: generator.descendInputOfBlock(block, 'NAME'),
                        class: generator.descendInputOfBlock(block, 'CLASS')
                    }),
 
                    getClass: (generator, block) => ({
                        kind: 'input',
                        pointer: generator.descendInputOfBlock(block, 'POINTER')
                    }),
 
                    new: (generator, block) => {
                        generator.script.yields = true;
                        return {
                            kind: 'input',
                            class: generator.descendInputOfBlock(block, 'CLASS')
                        };
                    },
 
                    getName: (generator, block) => ({
                        kind: 'input',
                        class: generator.descendInputOfBlock(block, 'CLASS')
                    }),
 
                    instanceof: (generator, block) => ({
                        kind: 'input',
                        pointer: generator.descendInputOfBlock(block, 'POINTER'),
                        class: generator.descendInputOfBlock(block, 'CLASS')
                    })
                },
 
                js: {
                    class: (node, compiler, imports) => {
                        const temp = compiler.source;
                        // create class, then run staticConstruct immediately
                        compiler.source = '(function() {\n';
                        compiler.source += 'const _cls = new vm.jwClass.Type(function*(_jwClassSelf, thread, target) {\n';
                        compiler.descendStack(node.substack, new imports.Frame(false, undefined, true));
                        compiler.source += `}, ${compiler.descendInput(node.name).asUnknown()}, null, thread.procedures, function*(_jwClassSelf, thread, target) {\n`;
                        compiler.descendStack(node.substack2, new imports.Frame(false, undefined, true));
                        compiler.source += '});\n';
                        compiler.source += 'try { const _g = _cls.staticConstruct && _cls.staticConstruct(_cls, thread, target); if (_g && typeof _g.next === "function") { let _r = _g.next(); while (!_r.done) _r = _g.next(); } } catch (e) {}\n';
                        compiler.source += 'return _cls;\n})();';
                        const returns = compiler.source;
                        compiler.source = temp;
                        return new imports.TypedInput(returns, imports.TYPE_UNKNOWN);
                    },
 
                    self: (node, compiler, imports) => {
                        return new imports.TypedInput(
                            '(typeof _jwClassSelf !== "undefined" ? _jwClassSelf : new vm.jwPointer.Type(0))',
                            imports.TYPE_UNKNOWN
                        );
                    },
 
                    extend: (node, compiler, imports) => {
                        return new imports.TypedInput(
                            `vm.jwClass.Type.toClass(${compiler.descendInput(node.class).asUnknown()}).extend(${compiler.descendInput(node.extension).asUnknown()})`,
                            imports.TYPE_UNKNOWN
                        );
                    },
 
                    setProp: (node, compiler, imports) => {
                        compiler.source += `vm.jwClass.setProp(${compiler.descendInput(node.name).asUnknown()}, ${compiler.descendInput(node.pointer).asUnknown()}, ${compiler.descendInput(node.value).asUnknown()});\n`;
                    },

                    setStatic: (node, compiler, imports) => {
                        compiler.source += `vm.jwClass.setStatic(${compiler.descendInput(node.name).asUnknown()}, ${compiler.descendInput(node.class).asUnknown()}, ${compiler.descendInput(node.value).asUnknown()});\n`;
                    },
 
                    getProp: (node, compiler, imports) => {
                        return new imports.TypedInput(
                            `vm.jwClass.getProp(${compiler.descendInput(node.name).asUnknown()}, ${compiler.descendInput(node.pointer).asUnknown()})`,
                            imports.TYPE_UNKNOWN
                        );
                    },

                    getStatic: (node, compiler, imports) => {
                        return new imports.TypedInput(
                            `vm.jwClass.getStatic(${compiler.descendInput(node.name).asUnknown()}, ${compiler.descendInput(node.class).asUnknown()})`,
                            imports.TYPE_UNKNOWN
                        );
                    },
 
                    getClass: (node, compiler, imports) => {
                        return new imports.TypedInput(
                            `vm.jwClass.getProp(vm.jwClass.classSymbol, ${compiler.descendInput(node.pointer).asUnknown()})`,
                            imports.TYPE_UNKNOWN
                        );
                    },
 
                    new: (node, compiler, imports) => {
                        return new imports.TypedInput(
                            `(yield* vm.jwClass.Type.toClass(${compiler.descendInput(node.class).asUnknown()}).createInstance(thread, target))`,
                            imports.TYPE_UNKNOWN
                        );
                    },
 
                    getName: (node, compiler, imports) => {
                        return new imports.TypedInput(
                            `vm.jwClass.Type.toClass(${compiler.descendInput(node.class).asUnknown()}).name`,
                            imports.TYPE_STRING
                        );
                    },
 
                    instanceof: (node, compiler, imports) => {
                        return new imports.TypedInput(
                            `vm.jwClass.instanceOf(${compiler.descendInput(node.pointer).asUnknown()}, vm.jwClass.Type.toClass(${compiler.descendInput(node.class).asUnknown()}))`,
                            imports.TYPE_BOOLEAN
                        );
                    }
                }
            };
        }
 
        class({ NAME, SELF }, util) {
            refreshDeps();
            // Try to capture runtime substacks if provided on util (best-effort)
            const instanceConstruct = function* (_jwClassSelf, thread, target) {
                if (util && typeof util.substack === 'function') {
                    yield* util.substack(thread, target);
                }
            };
            const staticConstruct = function* (_jwClassSelf, thread, target) {
                if (util && typeof util.substack2 === 'function') {
                    yield* util.substack2(thread, target);
                }
            };
            const cls = new jwClass.Type(instanceConstruct, NAME, null, util.thread?.procedures, staticConstruct);
            // Run static initializer now (when the class block is executed), best-effort.
            try {
                if (util && typeof util.substack2 === 'function') {
                    // If runtime provided a substack runner, use it so yields integrate with the thread
                    try {
                        util.substack2(util.thread, util.target);
                    } catch (e) {
                        // fall back to direct staticConstruct
                        const gen = cls.staticConstruct && cls.staticConstruct(cls, util?.thread, util?.target);
                        if (gen && typeof gen.next === 'function') {
                            let r = gen.next();
                            while (!r.done) r = gen.next();
                        }
                    }
                } else {
                    const gen = cls.staticConstruct && cls.staticConstruct(cls, util?.thread, util?.target);
                    if (gen && typeof gen.next === 'function') {
                        let r = gen.next();
                        while (!r.done) r = gen.next();
                    }
                }
            } catch (e) {}
            return cls;
        }
 
        self() {
            refreshDeps();
            return new jwPointer.Type(0);
        }
 
        extend({ CLASS, EXTENSION }) {
            refreshDeps();
            CLASS = jwClass.Type.toClass(CLASS);
            EXTENSION = jwClass.Type.toClass(EXTENSION);
            return CLASS.extend(EXTENSION);
        }
 
        setProp({ NAME, POINTER, VALUE }) {
            refreshDeps();
            jwClass.setProp(NAME, POINTER, VALUE);
        }

        setStatic({ NAME, CLASS, VALUE }) {
            refreshDeps();
            jwClass.setStatic(NAME, CLASS, VALUE);
        }
 
        getProp({ NAME, POINTER }) {
            refreshDeps();
            return jwClass.getProp(NAME, POINTER);
        }

        getStatic({ NAME, CLASS }) {
            refreshDeps();
            return jwClass.getStatic(NAME, CLASS);
        }
 
        getClass({ POINTER }) {
            refreshDeps();
            return jwClass.getProp(classSymbol, POINTER);
        }
 
        new({ CLASS }, util) {
            refreshDeps();
            CLASS = jwClass.Type.toClass(CLASS);
            return CLASS.createInstance(util.thread, util.target);
        }
 
        getName({ CLASS }) {
            refreshDeps();
            CLASS = jwClass.Type.toClass(CLASS);
            return CLASS.name;
        }
 
        instanceof({ POINTER, CLASS }) {
            refreshDeps();
            return jwClass.instanceOf(POINTER, jwClass.Type.toClass(CLASS));
        }
    }
 
    Scratch.extensions.register(new Extension());
})(Scratch);