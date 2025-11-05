const path = require('path');
const fs = require('fs');
const { workspace, window, commands, languages, Uri } = require('vscode');

// We'll implement language features directly in the extension host to avoid depending on
// `vscode-languageclient` / `vscode-languageserver`. This keeps the extension self-contained
// and simplifies packaging.

let outputChannel;
function log(msg) {
  if (!outputChannel) outputChannel = window.createOutputChannel('Pang Language');
  outputChannel.appendLine(`${new Date().toISOString()} - ${msg}`);
}

// Reuse validation and simple semantic analysis logic adapted from the previous server.
const antlr4 = (() => {
  try { return require(path.join(__dirname, 'lib', 'antlr4')); } catch (e) { try { return require('antlr4'); } catch (ee) { return null; } }
})();
let PangLexer = null, PangParser = null;
let serverModule = null;

// Defer loading generated parser files until activation so we can inspect the
// installed extension layout (bundled `server/dist/lib`) and the workspace.
function tryLoadParsers(extensionPath) {
  const candidates = [];
  // if extensionPath provided (activation), check bundled locations
  if (extensionPath) {
    // Prefer the bundled server entry if present — it bundles antlr4 and avoids
    // direct requires from generated parser files which may expect 'antlr4' in
    // node_modules.
    try {
      const serverBundle = path.join(extensionPath, 'server', 'dist', 'server.js');
      if (fs.existsSync(serverBundle)) {
        try {
          const mod = require(serverBundle);
          if (mod && typeof mod.validateText === 'function') {
            serverModule = mod;
            log(`Using bundled server validateText from ${serverBundle}`);
            return true;
          }
        } catch (e) {
          log(`Failed requiring bundled server at ${serverBundle}: ${String(e)}`);
        }
      }
    } catch (e) {}
    // typical layout in development: <ext>/lib
    candidates.push(path.join(extensionPath, 'lib'));
    // bundled layout after esbuild: <ext>/server/dist/lib
    candidates.push(path.join(extensionPath, 'server', 'dist', 'lib'));
    // also try <ext>/dist/lib in case of different packaging
    candidates.push(path.join(extensionPath, 'dist', 'lib'));
  }
  // fallback: relative to __dirname (works in dev with unbundled files)
  candidates.push(path.join(__dirname, 'lib'));
  // workspace-level lib (the user's repo root lib)
  try {
    const wsFolders = workspace.workspaceFolders || [];
    for (const f of wsFolders) candidates.push(path.join(f.uri.fsPath, 'lib'));
  } catch (e) {
    // ignore
  }

  for (const c of candidates) {
    try {
      if (!c) continue;
      const p = path.join(c, 'PangParser.js');
      if (fs.existsSync(p)) {
        // require the generated modules; support both default and named exports
        const lex = require(path.join(c, 'PangLexer'));
        const pars = require(path.join(c, 'PangParser'));
        PangLexer = lex && (lex.default || lex);
        PangParser = pars && (pars.default || pars);
        if (PangLexer && PangParser) {
          log(`Loaded Pang parser from ${c}`);
          return true;
        }
      }
    } catch (err) {
      // keep trying other locations
      log(`Failed loading parser from ${c}: ${String(err)}`);
    }
  }
  PangLexer = null; PangParser = null;
  return false;
}

function validateText(text) {
  const diagnostics = [];
  if (!PangLexer || !PangParser || !antlr4) {
    // If we have a bundled server module available, delegate validation to it.
    if (serverModule && typeof serverModule.validateText === 'function') {
      try {
        const serverResult = serverModule.validateText(text);
        // serverResult is usually an array of diagnostics and may carry _declared
        const sd = Array.isArray(serverResult) ? serverResult : (serverResult.diagnostics || []);
        const declared = serverResult && serverResult._declared ? serverResult._declared : (sd._declared || new Map());
        return { diagnostics: sd, _declared: declared };
      } catch (e) {
        diagnostics.push({ severity: 0, range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } }, message: 'Bundled server validation failed: ' + String(e), source: 'pang' });
        return { diagnostics, _declared: new Map() };
      }
    }

    diagnostics.push({
      severity: 0, // Error
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
      message: 'Pang parser not found. Generate parser with ANTLR and ensure lib/PangParser.js exists next to the extension or in the workspace lib/.',
      source: 'pang'
    });
    return { diagnostics, _declared: new Map() };
  }

  try {
    const chars = new antlr4.InputStream(text);
    const lexer = new PangLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const errors = [];
    // ANTLR expects listeners to implement several methods. Provide no-op
    // implementations for all ErrorListener methods so the runtime won't try to
    // call undefined and crash (e.g., reportAttemptingFullContext).
    const listener = {
      syntaxError: (recognizer, offendingSymbol, line, column, msg) => errors.push({ line, column, msg }),
      reportAmbiguity: () => {},
      reportAttemptingFullContext: () => {},
      reportContextSensitivity: () => {}
    };
    lexer.removeErrorListeners && lexer.removeErrorListeners();
    lexer.addErrorListener && lexer.addErrorListener(listener);
    const parser = new PangParser(tokens);
    parser.removeErrorListeners && parser.removeErrorListeners();
    parser.addErrorListener && parser.addErrorListener(listener);
    parser.buildParseTrees = true;
    if (typeof parser.program === 'function') parser.program();

    for (const e of errors) {
      diagnostics.push({ severity: 0, range: { start: { line: Math.max(0, e.line - 1), character: Math.max(0, e.column) }, end: { line: Math.max(0, e.line - 1), character: Math.max(0, e.column + 1) } }, message: e.msg, source: 'pang' });
    }
  } catch (err) {
    diagnostics.push({ severity: 0, range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } }, message: 'Parser runtime error: ' + (err && err.message ? err.message : String(err)), source: 'pang' });
  }

  // Semantic (simple) checks
  const keywords = new Set(['on','let','const','if','else','print','ask','return','true','false']);
  const builtins = new Set(['print','ask','on']);
  const declared = new Map();
  const lines = text.split(/\r?\n/);

  // Helper: remove string literals from a line to avoid treating words inside
  // strings as identifiers. We replace matched strings with spaces to preserve
  // indices for ranges.
  function stripStrings(s) {
    return s.replace(/'[^']*'|"[^"]*"|`[^`]*`/g, (m) => ' '.repeat(m.length));
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const declRe = /\b(?:let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
    let m;
    while ((m = declRe.exec(line))) declared.set(m[1], { line: i, start: m.index + m[0].indexOf(m[1]), end: m.index + m[0].indexOf(m[1]) + m[1].length });
    const assignRe = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/;
    const am = assignRe.exec(line);
    if (am) declared.set(am[1], { line: i, start: line.indexOf(am[1]), end: line.indexOf(am[1]) + am[1].length });
  }

  const identRe = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = stripStrings(rawLine);
    // ignore single-line comments after // to avoid false positives
    const codeLine = line.split('//')[0];
    let m2;
    while ((m2 = identRe.exec(codeLine))) {
      const name = m2[1];
      if (keywords.has(name) || builtins.has(name)) continue;
      const afterIndex = m2.index + name.length;
      const rest = rawLine.slice(afterIndex);
      const nextChar = rest.length ? rest[0] : undefined;
      // skip property access or function call tokens
      if (nextChar === '.' || nextChar === '(') continue;
      // skip option keys like `key:` or `key :`
      if (/^\s*:/.test(rest)) continue;
      if (!declared.has(name)) {
        diagnostics.push({ severity: 2, range: { start: { line: i, character: m2.index }, end: { line: i, character: m2.index + name.length } }, message: `Undeclared variable '${name}' — consider 'let ${name}' or implicit assignment.`, source: 'pang' });
      }
    }
  }

  return { diagnostics, _declared: declared };
}

let diagnosticCollection = null;

function registerProviders(context) {
  diagnosticCollection = languages.createDiagnosticCollection('pang');
  context.subscriptions.push(diagnosticCollection);

  // Track cursor position
  let currentCursorPosition = null;
  context.subscriptions.push(window.onDidChangeTextEditorSelection((e) => {
    if (e.textEditor.document.languageId === 'pang' || e.textEditor.document.fileName.endsWith('.ps')) {
      const pos = e.selections[0].active;
      currentCursorPosition = pos;
      runValidate(e.textEditor.document, pos);
    }
  }));

  // Validate on open and change
  context.subscriptions.push(workspace.onDidOpenTextDocument((doc) => { 
    if (doc.languageId === 'pang' || doc.fileName.endsWith('.ps')) {
      const editor = window.activeTextEditor;
      const cursorPos = editor && editor.document === doc ? editor.selection.active : null;
      runValidate(doc, cursorPos);
    }
  }));
  context.subscriptions.push(workspace.onDidChangeTextDocument((e) => { 
    if (e.document.languageId === 'pang' || e.document.fileName.endsWith('.ps')) {
      runValidate(e.document, currentCursorPosition);
    }
  }));
  context.subscriptions.push(workspace.onDidSaveTextDocument((doc) => { 
    if (doc.languageId === 'pang' || doc.fileName.endsWith('.ps')) {
      const editor = window.activeTextEditor;
      const cursorPos = editor && editor.document === doc ? editor.selection.active : null;
      runValidate(doc, cursorPos);
    }
  }));

  // initial validate for already-open docs
  for (const doc of workspace.textDocuments) if (doc.languageId === 'pang' || doc.fileName.endsWith('.ps')) runValidate(doc);

  // Completion provider
  context.subscriptions.push(languages.registerCompletionItemProvider({ scheme: 'file', language: 'pang' }, {
    provideCompletionItems(document, position) {
      try {
        const text = document.getText();
        const items = [];
        // Load snippets
        try {
          const snippetPath = path.join(context.extensionPath || __dirname, 'snippets', 'pang.json');
          if (fs.existsSync(snippetPath)) {
            const raw = fs.readFileSync(snippetPath, 'utf8');
            const sn = JSON.parse(raw);
            for (const key of Object.keys(sn)) {
              const s = sn[key];
              const label = s.prefix || key;
              const insert = Array.isArray(s.body) ? s.body.join('\n') : s.body;
              items.push(new (require('vscode').CompletionItem)(label, require('vscode').CompletionItemKind.Snippet));
            }
          }
        } catch (e) {}
        // locals
        const declared = new Set();
        const lines = text.split(/\r?\n/);
        const declRe = /\b(?:let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
        const assignRe = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/;
        for (let i = 0; i < lines.length; i++) { let m; while ((m = declRe.exec(lines[i]))) declared.add(m[1]); const am = assignRe.exec(lines[i]); if (am) declared.add(am[1]); }
        for (const v of declared) items.push(new (require('vscode').CompletionItem)(v, require('vscode').CompletionItemKind.Variable));
        return items;
      } catch (e) { return []; }
    }
  }, '.', '(', ' '));

  // Definition provider
  context.subscriptions.push(languages.registerDefinitionProvider({ scheme: 'file', language: 'pang' }, {
    provideDefinition(document, position) {
      try {
        const line = document.getText().split(/\r?\n/)[position.line] || '';
        const re = /[a-zA-Z_][a-zA-Z0-9_]*/g;
        let match; let found = null;
        while ((match = re.exec(line))) { const start = match.index; const end = start + match[0].length; if (position.character >= start && position.character <= end) { found = match[0]; break; } }
        if (!found) return null;
        const out = validateText(document.getText());
        const declared = out._declared || new Map();
        if (declared.has(found)) {
          const pos = declared.get(found);
          return [ { uri: document.uri, range: new (require('vscode').Range)(pos.line, pos.start, pos.line, pos.end) } ];
        }
        return null;
      } catch (e) { return null; }
    }
  }));
}

function runValidate(document, cursorPos) {
  try {
    // Pass cursor position to validateText if running from server module
    if (serverModule && typeof serverModule.validateText === 'function') {
      const res = validateText(document.getText(), cursorPos);
      const diags = res.diagnostics.map(d => new (require('vscode').Diagnostic)(new (require('vscode').Range)(d.range.start.line, d.range.start.character, d.range.end.line, d.range.end.character), d.message, d.severity === 0 ? require('vscode').DiagnosticSeverity.Error : (d.severity === 2 ? require('vscode').DiagnosticSeverity.Warning : require('vscode').DiagnosticSeverity.Information)));
      diagnosticCollection.set(document.uri, diags);
    } else {
      // When using in-process validation, run without cursor position
      const res = validateText(document.getText());
      const diags = res.diagnostics.map(d => new (require('vscode').Diagnostic)(new (require('vscode').Range)(d.range.start.line, d.range.start.character, d.range.end.line, d.range.end.character), d.message, d.severity === 0 ? require('vscode').DiagnosticSeverity.Error : (d.severity === 2 ? require('vscode').DiagnosticSeverity.Warning : require('vscode').DiagnosticSeverity.Information)));
      diagnosticCollection.set(document.uri, diags);
    }
  } catch (e) {
    log('Validation error: ' + String(e));
  }
}

function activate(context) {
  outputChannel = window.createOutputChannel('Pang Language');
  log('Extension activate called (in-process providers)');
  try {
    // Try to load generated parser files from known locations (bundled server lib, extension lib, workspace lib)
    tryLoadParsers(context.extensionPath || __dirname);
    registerProviders(context);
    log('Registered in-process language providers for Pang');
  } catch (e) {
    log('Failed to register providers: ' + String(e));
  }
}

function deactivate() {
  if (diagnosticCollection) diagnosticCollection.dispose();
}

module.exports = { activate, deactivate };
