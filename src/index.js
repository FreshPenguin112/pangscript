const { InputStream, CommonTokenStream, Token } = require("antlr4");
const SimpleLangLexer = require("../lib/LuaLexer").default;
const SimpleLangParser = require("../lib/LuaParser").default;
const _visitor = require("./visitor");
const _generator = require("../utils/generator");
const CompilerError = require('../utils/CompilerError');
const generator = new _generator();
// Optional config path handling (only accept .jsonh)
let configPath = null;
let configBaseDir = null;
const { readFileSync, writeFileSync } = require("fs");
const path = require("path");
const debug = process.argv.includes("--debug") || process.argv.includes("-d");
// Now that path/fs are available, parse config if provided
if (process.argv.includes("--config") || process.argv.includes("-c")) {
    configPath = process.argv[(process.argv.indexOf("-c") === -1 ? process.argv.indexOf("--config") : process.argv.indexOf("-c")) + 1];
    if (configPath) {
        const ext = path.extname(configPath).toLowerCase();
        if (ext !== '.jsonh') {
            console.error('Only .jsonh config files are supported.');
            process.exit(1);
        }
        try {
            let cfg = null;
            const configAbs = path.isAbsolute(configPath) ? configPath : path.join(process.cwd(), configPath);
            configBaseDir = path.dirname(configAbs);
            const raw = readFileSync(configAbs, 'utf8');
            try {
                const { JsonhReader } = require("jsonh-ts");
                cfg = JsonhReader.parseElementFromString(raw);
                // jsonh-ts returns a ParseElement with `.value`
                if (cfg && cfg.value) cfg = cfg.value;
            } catch (innerErr) {
                // jsonh-ts not installed — fallback to evaluating as a JS object literal in a VM.
                // This accepts the common jsonh style (unquoted keys) but is less safe; recommend
                // installing `jsonh-ts` via `npm install jsonh-ts` for robust parsing.
                console.warn('Warning: `jsonh-ts` not installed; using fallback JSONH parsing. Consider running `npm install jsonh-ts`.');
                const vm = require('vm');
                // Wrap in parentheses so object literal can be evaluated
                const wrapped = '(' + raw + ')';
                cfg = vm.runInNewContext(wrapped, {}, { timeout: 100 });
            }
            // Debug: show parsed config keys
            try {
                if (cfg && typeof cfg === 'object') console.log('Parsed config keys:', Object.keys(cfg));
                else console.log('Parsed config is not an object:', typeof cfg);
            } catch (e) {}

            // Apply per-target config. Top-level keys are target names (e.g. "Stage", "Sprite1").
            // When a config is provided, build a completely new `generator.template.targets`
            // array from the config keys, using the existing Stage/Sprite templates as
            // defaults for fields we don't explicitly set.
            if (cfg && typeof cfg === 'object') {
                const existingTargets = generator.template.targets || [];
                const stageTemplate = existingTargets.find(t => t.isStage) ? JSON.parse(JSON.stringify(existingTargets.find(t => t.isStage))) : JSON.parse(JSON.stringify(existingTargets[0] || {}));
                const spriteTemplate = existingTargets.find(t => !t.isStage) ? JSON.parse(JSON.stringify(existingTargets.find(t => !t.isStage))) : JSON.parse(JSON.stringify(existingTargets[1] || {}));

                const newTargets = [];
                for (const [targetName, spec] of Object.entries(cfg)) {
                    // Create a fresh target object from templates
                    const isStage = (targetName === 'Stage');
                    const base = isStage ? JSON.parse(JSON.stringify(stageTemplate)) : JSON.parse(JSON.stringify(spriteTemplate));
                    // Ensure required base fields
                    base.name = targetName;
                    base.isStage = !!isStage;
                    base.blocks = base.blocks || {};
                    base.variables = base.variables || {};
                    base.costumes = base.costumes || [];
                    base.sounds = base.sounds || [];
                    base.comments = base.comments || {};
                    base.extensionData = base.extensionData || {};

                    if (spec && typeof spec === 'object') {
                        // luaFile
                        if (spec.hasOwnProperty('luaFile')) base.extensionData.luaFile = spec.luaFile || null;
                        // variables
                        if (spec.variables && typeof spec.variables === 'object') {
                            for (const [k, v] of Object.entries(spec.variables)) {
                                base.variables[k] = [k, v];
                            }
                        }
                        // costumes
                        if (Array.isArray(spec.costumes)) {
                            // If the config explicitly provides costumes, drop any
                            // default costumes from the template copy so we don't
                            // duplicate the built-in starter assets.
                            base.costumes = [];
                            for (const c of spec.costumes) {
                                if (!c || !c.path) continue;
                                const candidate = path.isAbsolute(c.path) ? c.path : path.resolve(configBaseDir || process.cwd(), c.path);
                                const absPath = require('fs').existsSync(candidate) ? candidate : (path.isAbsolute(c.path) ? c.path : path.resolve(process.cwd(), c.path));
                                if (debug) console.log(`DBG asset resolve (costume) for target=${targetName} name=${c.name || ''}: candidate='${candidate}', resolved='${absPath}', exists=${require('fs').existsSync(absPath)}`);
                                // Use bare basename when possible so the md5ext matches
                                // the actual filename; only prefix with the target
                                // name if that basename is already registered.
                                const basename = path.basename(absPath);
                                let destName = basename;
                                if (generator._assets && Object.prototype.hasOwnProperty.call(generator._assets, destName)) {
                                    destName = `${targetName}_${basename}`;
                                }
                                generator.registerAsset(destName, absPath);
                                base.costumes.push({
                                    name: c.name || basename,
                                    dataFormat: path.extname(basename).replace('.', '') || 'svg',
                                    assetId: destName.replace(/\.[^.]+$/, ''),
                                    md5ext: destName,
                                    rotationCenterX: base.isStage ? 240 : 26,
                                    rotationCenterY: base.isStage ? 180 : 46,
                                });
                                if (c.default) base.currentCostume = base.costumes.length - 1;
                            }
                        }
                        // sounds
                        if (Array.isArray(spec.sounds)) {
                            // Similarly, when sounds are provided explicitly,
                            // clear template defaults so only config sounds remain.
                            base.sounds = [];
                            for (const s of spec.sounds) {
                                if (!s || !s.path) continue;
                                const candidateS = path.isAbsolute(s.path) ? s.path : path.resolve(configBaseDir || process.cwd(), s.path);
                                const absPath = require('fs').existsSync(candidateS) ? candidateS : (path.isAbsolute(s.path) ? s.path : path.resolve(process.cwd(), s.path));
                                if (debug) console.log(`DBG asset resolve (sound) for target=${targetName} name=${s.name || ''}: candidate='${candidateS}', resolved='${absPath}', exists=${require('fs').existsSync(absPath)}`);
                                const basename = path.basename(absPath);
                                let destName = basename;
                                if (generator._assets && Object.prototype.hasOwnProperty.call(generator._assets, destName)) {
                                    destName = `${targetName}_${basename}`;
                                }
                                generator.registerAsset(destName, absPath);
                                base.sounds.push({
                                    name: s.name || basename,
                                    assetId: destName.replace(/\.[^.]+$/, ''),
                                    dataFormat: path.extname(basename).replace('.', '') || 'wav',
                                    rate: s.rate || 48000,
                                    sampleCount: s.sampleCount || 0,
                                    md5ext: destName,
                                });
                            }
                        }
                    }

                    newTargets.push(base);
                }

                // Replace the project's targets with the config-provided targets
                generator.template.targets = newTargets;
                // Extra debug: print luaFile absolute/relative info for each constructed target
                try {
                    for (const t of newTargets) {
                        const lf = t.extensionData && t.extensionData.luaFile ? t.extensionData.luaFile : null;
                        if (!lf) console.log(`DBG: target ${t.name} luaFile: <none>`);
                        else console.log(`DBG: target ${t.name} luaFile: ${lf} (isAbsolute=${path.isAbsolute(lf)})`);
                    }
                } catch (e) {}
            }
        } catch (e) {
            console.error('Failed to parse config:', e && e.message ? e.message : e);
            process.exit(1);
        }
    }

    // Debug: print targets and their luaFile entries after applying config
    try {
        console.log('Targets after config parse:');
        for (const t of generator.template.targets) {
            console.log(` - ${t.name}: luaFile=${t.extensionData && t.extensionData.luaFile ? t.extensionData.luaFile : '<none>'}`);
        }
    } catch (e) {}
}

// Do not add a global when-flag hat unconditionally; only inject it into
// the merged blocks when the main/top-level code actually exists.
//console.log(generator.blockIdCounter);

// Determine infile/outfile, but when a config is provided, disallow passing -i/--infile
if (configPath && (process.argv.includes("-i") || process.argv.includes("--infile"))) {
    console.error('The -i/--infile option is not allowed when using -c/--config.');
    process.exit(1);
}
const infile = (!configPath && (process.argv.includes("-i") || process.argv.includes("--infile"))) ? process.argv[(process.argv.indexOf("-i") == -1 ? process.argv.indexOf("--infile") : process.argv.indexOf("-i")) + 1] : (configPath ? null : "test.lua");
const outfile = process.argv.includes("-o") || process.argv.includes("--outfile") ? process.argv[(process.argv.indexOf("-o") == -1 ? process.argv.indexOf("-outfile") : process.argv.indexOf("-o")) + 1] : "../indexTest.pmp";
// Normalize outfile path; infilePath and rawSource are only relevant when not using a config
if (debug) console.log(`DBG: infile='${infile}', outfile='${outfile}', infile.isAbsolute=${infile ? path.isAbsolute(infile) : 'N/A'}`);
const infilePath = infile ? (path.isAbsolute(infile) ? infile : path.resolve(process.cwd(), infile)) : null;
const outfilePath = path.isAbsolute(outfile) ? outfile : path.resolve(process.cwd(), outfile);
let rawSource = "";
if (infilePath) rawSource = readFileSync(infilePath, "utf8").toString();

// Replace bracket-array literals [ ... ] with table constructors { ... }
// Heuristic: only replace a '[' that appears in a literal context, i.e. when the
// previous non-space character is one of start-of-file, '=', '(', ',', ':' or '{' or '\n'.
// This avoids converting indexing expressions like `a[1]`.
function rewriteBracketArrays(src) {
    let out = '';
    let i = 0;
    const len = src.length;
    const isPrevLiteralBoundary = (idx) => {
        // find previous non-space character
        let j = idx - 1;
        while (j >= 0 && /[\s\t\r]/.test(src[j])) j--;
        if (j < 0) return true;
        const c = src[j];
        return (c === '=' || c === '(' || c === ',' || c === ':' || c === '{' || c === '\n');
    };

    while (i < len) {
        const ch = src[i];
        if (ch === '[' && isPrevLiteralBoundary(i)) {
            // Attempt to find matching closing bracket, respecting nested brackets and strings
            let depth = 0;
            let j = i;
            let inString = null;
            let escaped = false;
            let found = false;
            while (j < len) {
                const cc = src[j];
                if (inString) {
                    if (!escaped && cc === inString) {
                        inString = null;
                    }
                    escaped = !escaped && cc === '\\';
                    j++;
                    continue;
                }
                if (cc === '"' || cc === "'") { inString = cc; j++; continue; }
                if (cc === '[') { depth++; j++; continue; }
                if (cc === ']') { depth--; j++; if (depth === 0) { found = true; break; } continue; }
                j++;
            }
            if (found) {
                // Replace outer [ ... ] with { ... }
                out += '{' + src.slice(i + 1, j - 1) + '}';
                i = j;
                continue;
            }
            // If not found, fall through and copy character
        }
        out += ch;
        i++;
    }
    return out;
}

// Process main input only when no config was provided. When a config is used
// the project will be constructed from the config + any per-target luaFiles.
const processedSource = rawSource ? rewriteBracketArrays(rawSource) : "";
// Pass the original (unstripped) source to the visitor so it can parse directive comments
const visitor = new _visitor(rawSource || "");
if (!configPath) {
    // Previously we stripped `--@` directive comments before lexing so the parser
    // wouldn't see them. Now we let the lexer handle directives via the
    // `DIRECTIVE_COMMENT` token (sent to the HIDDEN channel). Use the processed
    // source directly as the lexer input so directive tokens are emitted.
    const input = new InputStream(processedSource);
    const lexer = new SimpleLangLexer(input);
    /*if (debug) {
        let token = lexer.nextToken();
        while (token.type !== Token.EOF) {
            console.log(`type: ${token.type}, text: ${token.text}`);
            token = lexer.nextToken();
        }
    }*/
    const tokens = new CommonTokenStream(lexer);
    const parser = new SimpleLangParser(tokens);
    //debug && console.log(parser.constructor)
    //parser.buildParseTrees = true;
    const tree = parser.block();
    if (debug) {
        console.log(`Main input tree:\n\n${tree.toStringTree(null, parser) || "blank tree"}\n`);
    }

    let a = generator.getBlocks();
    visitor.generator.blockIdCounter++;
    try {
        visitor.visitBlock(tree);
    } catch (err) {
        if (err instanceof CompilerError) {
            // Only print the user-friendly error
            console.error(err.toString());
        } else {
            // Print full stack for unexpected errors
            console.error(err.stack || err);
        }
        process.exit(1);
    }
    let result = visitor.getAndClearBlocks();
    const mergedBlocks = { ...a, ...result.blocks };
    // If no top-level/main code was produced, do not import an empty global when-flag
    if ((!visitor.mainBodyBlockIds || visitor.mainBodyBlockIds.length === 0) && mergedBlocks["a"]) {
        // Remove the synthetic when-flag hat 'a' so the Stage won't have an empty hat
        delete mergedBlocks["a"];
    }
    visitor.generator.importBlocks(mergedBlocks);

    // --- Chain main function body under whenflagclicked ---
    if (visitor.mainBodyBlockIds && visitor.mainBodyBlockIds.length > 0) {
        const firstBlockId = visitor.mainBodyBlockIds[0].entry ?? visitor.mainBodyBlockIds[0];
        // Ensure the global 'a' hat exists in the main generator; create if missing
        if (!visitor.generator.blocks["a"]) {
            try {
                visitor.generator.addBlock({ opcode: "event_whenflagclicked", topLevel: true, next: null, id: "a" });
            } catch (e) {
                // fallback: create minimal block object
                visitor.generator.blocks["a"] = {
                    opcode: "event_whenflagclicked",
                    next: null,
                    parent: null,
                    inputs: {},
                    fields: {},
                    shadow: false,
                    topLevel: true,
                    mutation: null,
                    x: 0,
                    y: 0
                };
            }
        }
        visitor.generator.blocks[firstBlockId].parent = "a";
        visitor.generator.blocks["a"].next = firstBlockId;
    }

    if (debug) {
        console.log("Main blocks:\n");
        console.log(JSON.stringify(visitor.generator.getBlocks(), null, 2));
        console.log();
    }
    // Write initial output containing main blocks
    console.log(`saved to file: ${outfilePath}`);
    console.log();
    writeFileSync(
        outfilePath,
        visitor.generator.getProject()
    );
}

// If any targets have per-target luaFile set in their extensionData, compile them and embed their blocks
try {
    const explicitBlocksMap = {};
    for (const t of generator.template.targets) {
        const luaFile = t.extensionData && t.extensionData.luaFile ? t.extensionData.luaFile : null;
        if (!luaFile) continue;
        // Resolve path relative to CWD if not absolute
    const luaPath = path.isAbsolute(luaFile) ? luaFile : path.resolve(configBaseDir || process.cwd(), luaFile);
    if (debug) console.log(`DBG per-target: t.name=${t.name}, luaFile='${luaFile}', luaPath='${luaPath}', isAbsolute=${path.isAbsolute(luaFile)}`);
        try {
            const src = readFileSync(luaPath, 'utf8');
            const psrc = rewriteBracketArrays(src);
            // Do not strip directive comments here — the lexer now recognizes
            // `DIRECTIVE_COMMENT` tokens so directive text is preserved for the
            // visitor (they remain on the HIDDEN channel so parsing is unaffected).
            const inp = new InputStream(psrc);
            const v = new _visitor(src);
            const lx = new SimpleLangLexer(inp);
            const toks = new CommonTokenStream(lx);
            const pars = new SimpleLangParser(toks);
            const tr = pars.block();
            if (debug) {
                console.log(`Per-target input tree for ${t.name}:\n\n${tr.toStringTree ? tr.toStringTree(null, pars) : '<no-tree>'}\n`);
            }
            // Ensure per-target generator has a when-flag hat with id 'a' so
            // main() of that lua file can be chained under it.
            try {
                v.generator.addBlock({ opcode: "event_whenflagclicked", topLevel: true, next: null, id: "a" });
            } catch (e) {
                // If the generator API differs, ignore and continue; chaining will be attempted below.
            }
            v.visitBlock(tr);
            // If this visitor collected a `main` body, chain it under the per-target 'a' hat.
            try {
                if (v.mainBodyBlockIds && v.mainBodyBlockIds.length > 0) {
                    const firstBlockId = v.mainBodyBlockIds[0].entry ?? v.mainBodyBlockIds[0];
                    if (v.generator && v.generator.blocks && v.generator.blocks[firstBlockId]) {
                        v.generator.blocks[firstBlockId].parent = "a";
                        if (v.generator.blocks["a"]) v.generator.blocks["a"].next = firstBlockId;
                    }
                }
            } catch (e) {
                if (debug) console.log('Per-target chaining warning:', e && e.message ? e.message : e);
            }
            // Prefer blocks collected in the visitor's internal generator
            const blocksFromGen = v.generator && typeof v.generator.getBlocks === 'function' ? v.generator.getBlocks() : {};
            try {
                const keys = Object.keys(blocksFromGen || {});
                if (debug) console.log(`Per-target compile for ${t.name}: visitor.generator block keys: ${keys.join(', ')}`);
            } catch (e) { if (debug) console.log('Per-target debug error', e && e.message ? e.message : e); }
            // Also include any visitor.local blocks if returned by getAndClearBlocks()
            let localBlocks = {};
            try {
                const maybe = v.getAndClearBlocks();
                if (maybe && typeof maybe === 'object') {
                    // If it's already a blocks map, use it directly; otherwise, if it has a .blocks property, use that.
                    if (maybe.blocks && typeof maybe.blocks === 'object') localBlocks = maybe.blocks;
                    else localBlocks = maybe;
                }
            } catch (e) {
                localBlocks = {};
            }
            if (debug) {
                console.log(`Per-target blocks for ${t.name}: ${Object.keys(localBlocks || {}).length} local blocks, ${Object.keys(blocksFromGen || {}).length} from generator`);
                console.log(JSON.stringify({ ...blocksFromGen, ...localBlocks }, null, 2));
            }
            explicitBlocksMap[t.name] = { ...blocksFromGen, ...localBlocks };
        } catch (e) {
            console.warn(`Failed to compile per-target luaFile for target ${t.name}: ${e && e.message ? e.message : e}`);
        }
    }
    // Apply explicit blocks to generator so getProject uses them
    console.log('Per-target explicitBlocksMap:', Object.keys(explicitBlocksMap).map(k => ({ target: k, count: Object.keys(explicitBlocksMap[k] || {}).length })));
    // Apply explicit per-target blocks into the same generator instance that
    // already contains the main/merged blocks (visitor.generator). This ensures
    // label/wrapper blocks from the main input are preserved in the final PMP.
    for (const [tname, blocks] of Object.entries(explicitBlocksMap)) {
        console.log(`Applying ${Object.keys(blocks || {}).length} blocks to target ${tname}`);
        try {
            // Prefer to set on visitor.generator which holds the merged main blocks
            const mainBlocks = (visitor && visitor.generator && typeof visitor.generator.getBlocks === 'function') ? visitor.generator.getBlocks() : generator.getBlocks();
            // Remap mainBlocks ids to avoid collisions with per-target blocks (both use 'a','b',... ids)
            const remapBlocks = (origBlocks, gen) => {
                if (!origBlocks) return {};
                const idMap = {};
                const newBlocks = {};
                // First pass: create new ids for each original id
                for (const oldId of Object.keys(origBlocks)) {
                    idMap[oldId] = gen.letterCount(gen.blockIdCounter++);
                }
                // Second pass: copy blocks with remapped ids and updated refs
                for (const [oldId, blk] of Object.entries(origBlocks)) {
                    const newId = idMap[oldId];
                    const copy = JSON.parse(JSON.stringify(blk));
                    // update parent/next if they reference an old id
                    if (copy.parent && idMap[copy.parent]) copy.parent = idMap[copy.parent];
                    if (copy.next && idMap[copy.next]) copy.next = idMap[copy.next];
                    // update inputs: any [3, id, ...] reporter refs
                    if (copy.inputs && typeof copy.inputs === 'object') {
                        for (const k of Object.keys(copy.inputs)) {
                            const v = copy.inputs[k];
                            if (Array.isArray(v) && v[0] === 3 && typeof v[1] === 'string' && idMap[v[1]]) {
                                v[1] = idMap[v[1]];
                            }
                            // For nested arrays (array-style inputs in generator), handle maps
                            if (Array.isArray(v) && Array.isArray(v[0]) && v[0][0] === 3 && idMap[v[0][1]]) {
                                v[0][1] = idMap[v[0][1]];
                            }
                        }
                    }
                    newBlocks[newId] = copy;
                }
                return newBlocks;
            };
            // Create a stable remapping for main blocks so their ids cannot
            // collide with per-target block ids. Use a simple prefixed id
            // scheme (`m1`, `m2`, ...) and update all `parent`, `next`, and
            // reporter input references found in the block objects.
            const remappedMain = (() => {
                if (!mainBlocks) return {};
                const idMap = {};
                let idx = 1;
                for (const oldId of Object.keys(mainBlocks)) {
                    idMap[oldId] = `m${idx++}`;
                }
                const newBlocks = {};
                for (const [oldId, blk] of Object.entries(mainBlocks)) {
                    const newId = idMap[oldId];
                    const copy = JSON.parse(JSON.stringify(blk));
                    // update parent/next
                    if (copy.parent && idMap[copy.parent]) copy.parent = idMap[copy.parent];
                    if (copy.next && idMap[copy.next]) copy.next = idMap[copy.next];
                    // recursively update any reporter references inside inputs
                    const walkAndRemap = (obj) => {
                        if (!obj) return obj;
                        if (Array.isArray(obj)) {
                            // patterns like [3, "id", ...] or nested arrays
                            if (obj.length >= 2 && obj[0] === 3 && typeof obj[1] === 'string' && idMap[obj[1]]) {
                                obj[1] = idMap[obj[1]];
                            }
                            for (let i = 0; i < obj.length; i++) walkAndRemap(obj[i]);
                        } else if (typeof obj === 'object') {
                            for (const k of Object.keys(obj)) walkAndRemap(obj[k]);
                        }
                        return obj;
                    };
                    if (copy.inputs && typeof copy.inputs === 'object') {
                        walkAndRemap(copy.inputs);
                    }
                    newBlocks[newId] = copy;
                }
                return newBlocks;
            })();
            const combined = { ...(remappedMain || {}), ...(blocks || {}) };
            if (visitor && visitor.generator && typeof visitor.generator.setTargetBlocks === 'function') {
                visitor.generator.setTargetBlocks(tname, combined);
            } else {
                // Fallback to the outer generator if visitor.generator is unavailable
                generator.setTargetBlocks(tname, combined);
            }
        } catch (e) {
            // On error, fallback to outer generator with best-effort merge
            try { generator.setTargetBlocks(tname, { ...(generator.getBlocks() || {}), ...(blocks || {}) }); } catch (er) { generator.setTargetBlocks(tname, blocks); }
        }
    }
    // Re-write output file with explicit target blocks embedded. Prefer visitor.generator
    // as it contains the merged main blocks; if unavailable, fall back to the outer generator.
    try {
        writeFileSync(outfilePath, visitor && visitor.generator ? visitor.generator.getProject() : generator.getProject());
    } catch (e) {
        // Final fallback
        writeFileSync(outfilePath, generator.getProject());
    }
} catch (e) {
    console.warn('Error while compiling per-target lua files:', e && e.message ? e.message : e);
}
