const template = {
    targets: [
        {
            isStage: true,
            name: "Stage",
            variables: { "`jEk@4|i[#Fk?(8x)AV.-my variable": ["my variable", 0] },
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
    extensions: [],
    meta: {
        semver: "3.0.0",
        vm: "0.2.0",
        agent: "",
        platform: {
            name: "PenguinMod",
            url: "https://penguinmod.com/",
            version: "stable",
        },
    },
};
const jszip = require("jszip");
const { readFileSync } = require("fs");
const path = require("path");
class generator {
    constructor() {
        this.blocks = {};
        this.blockIdCounter = 1;
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
        console.log(this.blockIdCounter)
        const [id, opcode, next, parent, inputs, fields, shadow, topLevel] = [
            options.id || this.letterCount(this.blockIdCounter),
            options.opcode,
            options.next || this.letterCount(this.blockIdCounter + 1),
            options.parent || this.letterCount(this.blockIdCounter - 1),
            options.inputs || {},
            options.fields || {},
            options.shadow || false,
            options.topLevel || false,
        ];
        if (topLevel) {
            this.blocks[id] = {
                opcode,
                next,
                parent: null,
                inputs,
                fields,
                shadow,
                topLevel,
                x: 0,
                y: 0,
            };
        } else {
            this.blocks[id] = {
                opcode,
                next,
                parent,
                inputs,
                fields,
                shadow,
                topLevel,
            };
        }
        this.blockIdCounter++;
        return this;
    }
    importBlocks(blocks) {
        this.blocks = {...this.blocks,...blocks };
    }
    getProject() {
        let project = template;
        project.targets.find((x) => x.name === "Sprite1").blocks =
            this.getBlocks();
        let zip = new jszip();
        zip.file("project.json", JSON.stringify(project));
        zip.file(
            "c434b674f2da18ba13cdfe51dbc05ecc.svg",
            readFileSync(
                path.join(__dirname, "../Project/c434b674f2da18ba13cdfe51dbc05ecc.svg")
            ).toString()
        );
        zip.file(
            "cd21514d0531fdffb22204e0ec5ed84a.svg",
            readFileSync(
                path.join(__dirname, "../Project/cd21514d0531fdffb22204e0ec5ed84a.svg")
            ).toString()
        );
        zip.file(
            "e140d7ff07de8fa35c3d1595bba835ac.wav",
            readFileSync(
                path.join(__dirname, "../Project/e140d7ff07de8fa35c3d1595bba835ac.wav")
            )
        );
        return zip.generate({ type: "nodebuffer" });
    }
}
module.exports = generator;
