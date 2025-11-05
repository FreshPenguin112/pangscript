const fs = require('fs');
const path = require('path');

// Copy all files under repo ../lib into this extension's server/lib folder so vsce will bundle them.
const repoLib = path.resolve(__dirname, '..', '..', 'lib');
const destLib = path.resolve(__dirname, '..', 'server', 'lib');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const ent of entries) {
    const srcPath = path.join(src, ent.name);
    const destPath = path.join(dest, ent.name);
    if (ent.isDirectory()) copyRecursive(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

try {
  // Ensure extension dependencies are installed so node_modules can be bundled into the VSIX
  try {
    const cp = require('child_process');
    const extDir = path.resolve(__dirname, '..');
    console.log('Installing extension dependencies in', extDir);
    const cmd = 'bun install';
    const res = cp.execSync(cmd, { cwd: extDir, stdio: 'inherit' });
    console.log('Dependencies installed');
  } catch (e) {
    console.error('Warning: failed to install extension dependencies before packaging:', e && e.message ? e.message : e);
    // proceed — packaging may still work if dependencies are not required at runtime
  }

  copyRecursive(repoLib, destLib);
  console.log('Copied lib -> server/lib');
} catch (e) {
  console.error('Failed to copy lib:', e && e.message ? e.message : e);
  process.exitCode = 1;
}
