var template = {
    targets: [
        {
            isStage: true,
            name: "Stage",
            variables: {},
            lists: {},
            broadcasts: {},
            customVars: [],
            blocks: {},
            comments: {},
            currentCostume: 0,
            costumes: [
                {
                    name: "backdrop1",
                    dataFormat: "svg",
                    assetId: "cd21514d0531fdffb22204e0ec5ed84a",
                    md5ext: "cd21514d0531fdffb22204e0ec5ed84a.svg",
                    rotationCenterX: 240,
                    rotationCenterY: 180,
                },
            ],
            sounds: [],
            id: "p]_uD8#0^Q=ryfqeQLud",
            volume: 100,
            layerOrder: 0,
            tempo: 60,
            videoTransparency: 50,
            videoState: "on",
            textToSpeechLanguage: null,
        },
        {
            isStage: false,
            name: "Sprite1",
            variables: {},
            lists: {},
            broadcasts: {},
            customVars: [],
            blocks: {},
            comments: {},
            currentCostume: 0,
            costumes: [
                {
                    name: "costume1",
                    bitmapResolution: 1,
                    dataFormat: "svg",
                    assetId: "c434b674f2da18ba13cdfe51dbc05ecc",
                    md5ext: "c434b674f2da18ba13cdfe51dbc05ecc.svg",
                    rotationCenterX: 26,
                    rotationCenterY: 46,
                },
            ],
            sounds: [
                {
                    name: "Squawk",
                    assetId: "e140d7ff07de8fa35c3d1595bba835ac",
                    dataFormat: "wav",
                    rate: 48000,
                    sampleCount: 17867,
                    md5ext: "e140d7ff07de8fa35c3d1595bba835ac.wav",
                },
            ],
            id: "5I9nI;7P)jdiR-_X;/%l",
            volume: 100,
            layerOrder: 1,
            visible: true,
            x: 0,
            y: 0,
            size: 100,
            direction: 90,
            draggable: false,
            rotationStyle: "all around",
        },
    ],
    monitors: [],
    extensionData: {},
    extensions: ["pmOperatorsExpansion", "jgJSON"],
    meta: {
        semver: "3.0.0",
        vm: "0.2.0",
        agent: "",
        platform: {
            name: "PangScript",
            url: "https://github.com/FreshPenguin112/pangscript/",
            version: "stable",
        },
    },
};
const jszip = require("jszip");
const { readFileSync } = require("fs");
const path = require("path");
const { processedBlocks } = require("../src/blocks.js");
class generator {
    constructor() {
        this.blocks = {};
        this.blockIdCounter = 1;
        this.template = template;
        // Collect hat blocks seen during generation. Map: opcode -> [{id, fields, inputs}]
        this._hatHandlers = {};
        // Registered asset files to include in the generated PMP: { destName: absolutePath }
        this._assets = {};
        // Optional explicit per-target blocks mapping: { targetName: { blocks... } }
        this._explicitTargetBlocks = {};
    }

    // Register an asset file to be included in the PMP zip. destName should be the filename used inside the zip.
    registerAsset(destName, absolutePath) {
        this._assets[destName] = absolutePath;
    }

    // Set explicit blocks for a given target name (overrides internal this.blocks)
    setTargetBlocks(targetName, blocksMap) {
        this._explicitTargetBlocks[targetName] = blocksMap || {};
    }
    //generatorBlocksArray(array) { }
    letterCount(num) {
        let letters = "abcdefghijklmnopqrstuvwxyz";
        let result = "";
        while (num > 0) {
            num--; // Adjust for 0-indexing
            result = letters[num % 26] + result;
            num = Math.floor(num / 26);
        }
        return result;
    }
    clearBlocks() {
        this.blocks = {};
        return this;
    }
    getBlocks() {
        return { ...this.blocks };
    }
    getAndClearBlocks() {
        const blocksCopy = { ...this.blocks };
        this.blocks = {};
        return blocksCopy;
    }

    addBlock(options) {
        //console.log(options.next ? `Adding block with next: ${options.next}` : "Adding block without next");
        const [id, opcode, next, parent, inputs, fields, shadow, topLevel, mutation] = [
            options.id || this.letterCount(this.blockIdCounter),
            options.opcode,
            options.hasOwnProperty('next') ? options.next : this.letterCount(this.blockIdCounter + 1),
            options.hasOwnProperty('parent') ? options.parent : this.letterCount(this.blockIdCounter - 1),
            options.inputs || {},
            options.fields || {},
            options.shadow || false,
            options.topLevel || false,
            options.mutation || null
        ];

        // --- NEW: handle array-style inputs ---
        let processedInputs = inputs;
        if (Array.isArray(inputs) && processedBlocks[opcode]) {
            const inputMeta = processedBlocks[opcode][0];
            let mappedInputs = {};
            for (let i = 0; i < inputMeta.length; i++) {
                const inputName = inputMeta[i].name;
                let val = inputs[i];
                if (val === null) continue;
                // If input is a one-item array, treat as block id reference
                if (Array.isArray(val) && val.length === 1) {
                    mappedInputs[inputName] = [3, val[0], [10, ""]];
                } else if (Array.isArray(val)) {
                    // If already in [3, ...], [1, ...], [12, ...], etc., use as-is
                    mappedInputs[inputName] = val;
                } else if (typeof val === "number") {
                    mappedInputs[inputName] = [1, [4, String(val)]];
                } else if (typeof val === "string") {
                    mappedInputs[inputName] = [1, [10, val]];
                } else {
                    mappedInputs[inputName] = [1, [10, String(val ?? "")]];
                }
            }
            processedInputs = mappedInputs;
        }

        // If this is a jgJSON_* opcode, force it to be a reporter block
        // (cannot be a stacked/top-level block). Clear `next` and ensure
        // `topLevel` is false. Keep `parent` as provided or null when top-level.
        const isJgJSON = typeof opcode === 'string' && opcode.startsWith('jgJSON_');
        const finalNext = isJgJSON ? null : next;
        const finalTopLevel = isJgJSON ? false : topLevel;
        const finalParent = finalTopLevel ? null : parent;

        // If this is a top-level hat block (as marked in processedBlocks), record it
        try {
            const meta = processedBlocks[opcode];
            const isHat = meta && (meta.hat || meta[1] === 'hat');
            if (finalTopLevel && meta && isHat) {
                const list = this._hatHandlers[opcode] || [];
                list.push({ id, fields: fields || {}, inputs: processedInputs || {} });
                this._hatHandlers[opcode] = list;
            }
        } catch (e) {
            // ignore
        }

        if (finalTopLevel) {
            this.blocks[id] = {
                opcode,
                next: finalNext,
                parent: finalParent,
                inputs: processedInputs,
                fields,
                shadow,
                topLevel: finalTopLevel,
                mutation,
                x: 0,
                y: 0,
            };
        } else {
            this.blocks[id] = {
                opcode,
                next: finalNext,
                parent: finalParent,
                inputs: processedInputs,
                fields,
                shadow,
                topLevel: finalTopLevel,
                mutation,
            };
        }
        // If any inputs are reporter references, set their parent to this block id
        try {
            for (const key of Object.keys(processedInputs || {})) {
                const val = processedInputs[key];
                if (Array.isArray(val) && val[0] === 3 && typeof val[1] === 'string') {
                    const refId = val[1];
                    if (this.blocks[refId]) {
                        this.blocks[refId].parent = id;
                    }
                }
            }
        } catch (e) {
            // ignore
        }
        this.blockIdCounter++;
        return id;
    }
    importBlocks(blocks) {
        this.blocks = {...blocks, ...this.blocks };
        return this;
    }
    getProject() {
    let project = this.template;
        // Make a sanitized copy of blocks to ensure jgJSON_* opcodes are
        // emitted only as reporter blocks (no `next`, never topLevel).
        const rawBlocks = this.getBlocks();
        const sanitized = {};
        for (const id of Object.keys(rawBlocks)) {
            const blk = { ...rawBlocks[id] };
            if (typeof blk.opcode === 'string' && blk.opcode.startsWith('jgJSON_')) {
                blk.next = null;
                blk.topLevel = false;
            }
            sanitized[id] = blk;
        }
        // If explicit per-target blocks were provided, apply them (sanitizing jgJSON blocks)
        if (this._explicitTargetBlocks && Object.keys(this._explicitTargetBlocks).length) {
            for (const t of project.targets) {
                const explicit = this._explicitTargetBlocks[t.name];
                if (explicit) {
                    // sanitize the explicit blocks similarly
                    const sanitizedExplicit = {};
                    for (const id of Object.keys(explicit)) {
                        const blk = { ...explicit[id] };
                        if (typeof blk.opcode === 'string' && blk.opcode.startsWith('jgJSON_')) {
                            blk.next = null;
                            blk.topLevel = false;
                        }
                        sanitizedExplicit[id] = blk;
                    }
                    t.blocks = sanitizedExplicit;
                } else {
                    // fallback: apply the general sanitized blocks to any target without explicit blocks
                    t.blocks = sanitized;
                }
            }
        } else {
            // No explicit per-target blocks: prefer first non-stage target, otherwise first target
            const fallback = project.targets.find((x) => !x.isStage) || project.targets[0];
            if (fallback) fallback.blocks = sanitized;
        }
        // If we collected any hat handlers, put them into `extensionData.events`
        if (Object.keys(this._hatHandlers).length) {
            project.extensionData = project.extensionData || {};
            project.extensionData.events = this._hatHandlers;
        }
        // Ensure every target has the generated-project informational comment
        try {
            for (const t of project.targets) {
                t.comments = t.comments || {};
                t.comments["a"] = {
                    blockId: null,
                    x: 0,
                    y: -250,
                    width: 200,
                    height: 200,
                    minimized: false,
                    text: "This project was generated by PangScript!\nhttps://github.com/FreshPenguin112/pangscript\nIt is highly recommended that you run \"Clean up Blocks\" before viewing the generated code.",
                };
            }
        } catch (e) {
            // don't fail packaging for comment insertion errors
        }
        let zip = new jszip();
        zip.file("project.json", JSON.stringify(project));
        // Include any registered asset files
        for (const [name, pth] of Object.entries(this._assets)) {
            try {
                zip.file(name, readFileSync(pth));
            } catch (e) {
                // ignore missing assets; caller should validate
            }
        }
        zip.file(
            "c434b674f2da18ba13cdfe51dbc05ecc.svg",
            readFileSync(
                path.join(__dirname, "../startingAssets/c434b674f2da18ba13cdfe51dbc05ecc.svg")
            ).toString()
        );
        zip.file(
            "cd21514d0531fdffb22204e0ec5ed84a.svg",
            readFileSync(
                path.join(__dirname, "../startingAssets/cd21514d0531fdffb22204e0ec5ed84a.svg")
            ).toString()
        );
        zip.file(
            "e140d7ff07de8fa35c3d1595bba835ac.wav",
            readFileSync(
                path.join(__dirname, "../startingAssets/e140d7ff07de8fa35c3d1595bba835ac.wav")
            )
        );
        return zip.generate({ type: "nodebuffer" });
    }
}
module.exports = generator;
