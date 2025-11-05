const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

// Bundle both the extension entry (`extension.js`) and the language server (`server/server.js`).
// We build them separately so each can have its own outdir and filename.
const serverEntry = path.resolve(__dirname, '..', 'server', 'server.js');
const serverOutdir = path.resolve(__dirname, '..', 'server', 'dist');
const serverOutfile = path.join(serverOutdir, 'server.js');

const extensionEntry = path.resolve(__dirname, '..', 'extension.js');
const extensionOutdir = path.resolve(__dirname, '..', 'dist');
const extensionOutfile = path.join(extensionOutdir, 'extension.js');

function ensureExists(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

if (!fs.existsSync(serverEntry)) {
  console.error('Bundle entry not found:', serverEntry);
  process.exit(1);
}
if (!fs.existsSync(extensionEntry)) {
  console.error('Bundle entry not found:', extensionEntry);
  process.exit(1);
}

ensureExists(serverOutdir);
ensureExists(extensionOutdir);

async function bundleServer() {
  try {
    console.log('Bundling server with esbuild...');
    await esbuild.build({
      entryPoints: [serverEntry],
      bundle: true,
      platform: 'node',
      target: ['node14'],
      outfile: serverOutfile,
      format: 'cjs',
      external: [],
      sourcemap: false,
      minify: false
    });
    console.log('Bundled server written to', serverOutfile);
    // If the project has a generated ANTLR parser in the repo-level `lib/` folder, copy it
    // into the server outdir so the bundled server can require it at runtime (it expects
    // to find a `lib` folder next to the server bundle).
  // repo-level lib is two levels up from vscode-pang/scripts: ../.. /lib
  const repoLib = path.resolve(__dirname, '..', '..', 'lib');
    const packagedLib = path.join(serverOutdir, 'lib');
    if (fs.existsSync(repoLib)) {
      try {
        console.log('Copying generated parser files from', repoLib, 'to', packagedLib);
        // prefer fs.cpSync if available (node16+), fall back to manual copy
        if (typeof fs.cpSync === 'function') {
          fs.cpSync(repoLib, packagedLib, { recursive: true });
        } else {
          // simple recursive copy
          const copyRecursive = (src, dest) => {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
            for (const name of fs.readdirSync(src)) {
              const s = path.join(src, name);
              const d = path.join(dest, name);
              const stat = fs.statSync(s);
              if (stat.isDirectory()) copyRecursive(s, d); else fs.copyFileSync(s, d);
            }
          };
          copyRecursive(repoLib, packagedLib);
        }
        console.log('Copied parser files to packaged server lib');
      } catch (e) {
        console.warn('Failed to copy parser files into server dist:', e && e.message ? e.message : e);
      }
    } else {
      console.log('No repo-level lib/ found; skipping copy of parser files');
    }
  } catch (e) {
    console.error('esbuild failed (server):', e && e.message ? e.message : e);
    process.exit(1);
  }
}

async function bundleExtension() {
  try {
    console.log('Bundling extension with esbuild...');
    await esbuild.build({
      entryPoints: [extensionEntry],
      bundle: true,
      platform: 'node',
      target: ['node14'],
      outfile: extensionOutfile,
      format: 'cjs',
      // The 'vscode' module is provided by the VS Code host at runtime and must be left external.
      external: ['vscode'],
      sourcemap: false,
      minify: false
    });
    console.log('Bundled extension written to', extensionOutfile);
  } catch (e) {
    console.error('esbuild failed (extension):', e && e.message ? e.message : e);
    process.exit(1);
  }
}

(async () => {
  await bundleExtension();
  await bundleServer();
})();
