// Simple LSP server for Pang using antlr4-generated parser for diagnostics
const {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  DiagnosticSeverity,
} = require("vscode-languageserver/node");
const antlr4 = require("antlr4");
const fs = require("fs");
const path = require("path");
// Try to require generated parser from the workspace repo's lib folder (copied into server/lib during packaging)
let PangLexer, PangParser, PangVisitor;
// First, try a static relative require so bundlers (esbuild) can inline the generated
// parser modules into the bundled server. If that fails (e.g. running from source),
// fall back to resolving the lib folder at runtime using pathResolveLib().
try {
  // Static relative require — will succeed when building the bundle and include
  // the parser files inside the bundle.
  PangLexer = require("./lib/PangLexer").default;
  PangParser = require("./lib/PangParser").default;
  try {
    PangVisitor = require("./lib/PangVisitor").default;
  } catch (e) {
    PangVisitor = null;
  }
} catch (e) {
  try {
    const libPath = pathResolveLib();
    PangLexer = require(libPath + "/PangLexer").default;
    PangParser = require(libPath + "/PangParser").default;
    try {
      PangVisitor = require(libPath + "/PangVisitor").default;
    } catch (ee) {
      PangVisitor = null;
    }
  } catch (ee) {
    PangLexer = null;
    PangParser = null;
    PangVisitor = null;
  }
}

function pathResolveLib() {
  // Look in server/lib (packaged), then repo root lib
  const packaged = path.join(__dirname, "lib");
  if (fs.existsSync(packaged)) return packaged;
  const repoLib = path.join(__dirname, "..", "..", "lib");
  return repoLib;
}

// When launched by the language client with IPC, process.send will be defined and
// createConnection without streams will use the IPC transport. When running the
// server directly for debugging, fall back to stdio.
const connection =
  typeof process.send === "function"
    ? createConnection(ProposedFeatures.all)
    : createConnection(ProposedFeatures.all, process.stdin, process.stdout);
const documents = new TextDocuments();

connection.onInitialize(() => {
  return {
    capabilities: {
      textDocumentSync: documents.syncKind,
      completionProvider: { resolveProvider: false },
      definitionProvider: true,
      hoverProvider: true, // ← add this
    },
  };
});

// Simple ANTLR error listener adapter
class CollectingErrorListener {
  constructor(errors) {
    this.errors = errors;
  }
  syntaxError(recognizer, offendingSymbol, line, column, msg) {
    this.errors.push({ line, column, msg });
  }
  reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs) {}
  reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs) {}
  reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs) {}
}

function validateText(text, uri) {
  const diagnostics = [];
  if (!PangLexer || !PangParser) {
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
      message: "Pang parser not found. Generate parser with ANTLR and ensure lib/PangParser.js exists.",
      source: "pang",
    });
    return diagnostics;
  }

  try {
    // Prepare a parser-safe copy of the text by removing comments while
    // preserving newlines and original offsets. This prevents the lexer from
    // seeing raw comment markers (//, #) which cause mismatched-input errors.
    // 1) Remove block comments across the whole text (preserve newlines)
    const textNoBlock = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
    // 2) Remove single-line comments per-line (// and #) by replacing
    //    the comment span with spaces so columns remain stable.
    const parsedLines = textNoBlock.split(/\r?\n/).map((ln) => {
      // find earliest of // or # (if present) and blank out the rest
      const idx1 = ln.indexOf('//');
      const idx2 = ln.indexOf('#');
      let cut = -1;
      if (idx1 !== -1 && idx2 !== -1) cut = Math.min(idx1, idx2);
      else if (idx1 !== -1) cut = idx1;
      else if (idx2 !== -1) cut = idx2;
      if (cut === -1) return ln;
      return ln.slice(0, cut) + ' '.repeat(ln.length - cut);
    });
    const textForParser = parsedLines.join('\n');
    const chars = new antlr4.InputStream(textForParser);
    const lexer = new PangLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);

    const errors = [];
    const listener = new CollectingErrorListener(errors);
    lexer.removeErrorListeners();
    lexer.addErrorListener(listener);

    const parser = new PangParser(tokens);
    parser.removeErrorListeners();
    parser.addErrorListener(listener);
    parser.buildParseTrees = true;

    // Attempt parse
    parser.program();

    for (const e of errors) {
      const diag = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: Math.max(0, e.line - 1), character: Math.max(0, e.column) },
          end: { line: Math.max(0, e.line - 1), character: Math.max(0, e.column + 1) },
        },
        message: e.msg,
        source: "pang",
      };
      diagnostics.push(diag);
    }

    // Semantic checks: build a simple declaration map and warn on uses
    const keywords = new Set(["on", "let", "const", "if", "else", "print", "ask", "return", "true", "false"]);
    const builtins = new Set(["print", "ask", "on"]);
    const declared = new Map(); // name -> { line, start, end }
  // Use the parser-safe text previously prepared (block and single-line
  // comments were removed into `textForParser`) for semantic scanning as
  // well so both parser and semantic passes ignore comments.
  const lines = textForParser.split(/\r?\n/);

    // Helper: remove string contents from a single line while preserving
    // column indices. Handles escapes for double and single quotes.
    function stripStringsLine(line) {
      let out = '';
      let inSingle = false;
      let inDouble = false;
      let inBacktick = false;
      let escaped = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (escaped) {
          escaped = false;
          out += ' ';
          continue;
        }
        if (ch === '\\') {
          escaped = true;
          out += ' ';
          continue;
        }
        if (inSingle) {
          if (ch === "'") { inSingle = false; out += ' '; } else out += ' ';
          continue;
        }
        if (inDouble) {
          if (ch === '"') { inDouble = false; out += ' '; } else out += ' ';
          continue;
        }
        if (inBacktick) {
          if (ch === '`') { inBacktick = false; out += ' '; } else out += ' ';
          continue;
        }
        if (ch === "'") { inSingle = true; out += ' '; continue; }
        if (ch === '"') { inDouble = true; out += ' '; continue; }
        if (ch === '`') { inBacktick = true; out += ' '; continue; }
        out += ch;
      }
      return out;
    }

    // Helper: strip single-line comments (// and #) from a processed line,
    // replacing comment text with spaces so column indices remain valid.
    function stripSingleLineComments(line) {
      // Remove // comments
      const idx = line.search(/\/\//);
      const idxHash = line.search(/#/);
      let cut = -1;
      if (idx !== -1 && idxHash !== -1) cut = Math.min(idx, idxHash);
      else if (idx !== -1) cut = idx;
      else if (idxHash !== -1) cut = idxHash;
      if (cut === -1) return line;
      return line.slice(0, cut) + ' '.repeat(line.length - cut);
    }

    // First pass: find explicit declarations and simple assignments
    // Use processed lines with strings and single-line comments removed so
    // declarations inside strings/comments are ignored.
    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const processed = stripSingleLineComments(stripStringsLine(rawLine));
      // let/const declarations
      const declRe = /\b(?:let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
      let m;
      while ((m = declRe.exec(processed))) {
        const name = m[1];
        declared.set(name, {
          line: i,
          start: m.index + m[0].indexOf(name),
          end: m.index + m[0].indexOf(name) + name.length,
        });
      }
      // simple assignment at line start -> implicit var
      const assignRe = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/;
      const am = assignRe.exec(processed);
      if (am) {
        const name = am[1];
        const idx = processed.indexOf(name);
        declared.set(name, { line: i, start: idx, end: idx + name.length });
      }
    }

    // Second pass: find identifier usages that are not declared
    const identRe = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      // Remove strings and single-line comments so comment text is ignored
      const codeLine = stripSingleLineComments(stripStringsLine(rawLine));

      // Find and process each identifier
      let m2;
      while ((m2 = identRe.exec(codeLine))) {
        const name = m2[1];
        const start = m2.index;
        const end = m2.index + name.length;

        // Skip if it's a keyword or builtin
        if (keywords.has(name) || builtins.has(name)) continue;

        // Skip if it's followed by () or . (method/property access)
        const nextChar = codeLine[end];
        if (nextChar === "." || nextChar === "(") continue;

        // Skip if this is a key in a key:value pair
        const afterIdent = codeLine.slice(end).match(/^\s*:/);
        if (afterIdent) continue;

        // Only warn if it's not declared
        if (!declared.has(name)) {
          const diag = {
            severity: DiagnosticSeverity.Warning,
            range: { start: { line: i, character: start }, end: { line: i, character: end } },
            message: `Undeclared variable '${name}' — consider 'let ${name}' or implicit assignment.`,
            source: "pang",
          };
          diagnostics.push(diag);
        }
      }
    }

    // keep declared map on diagnostics object for later use (definitions)
    diagnostics._declared = declared;
  } catch (err) {
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
      message: "Parser runtime error: " + (err && err.message ? err.message : String(err)),
      source: "pang",
    });
  }

  return diagnostics;
}

// Keep track of cursor positions and incomplete edits
let cursorPositions = new Map(); // uri -> {line, character}

// Validate and send diagnostics for all open documents
function validateAllDocuments() {
  for (const doc of documents.all()) {
    validateDocument(doc);
  }
}

// Validate a single document and send diagnostics
function validateDocument(doc) {
  const text = doc.getText();
  let diags = validateText(text, doc.uri);

  // Add additional validation for unclosed strings
  const cursorPos = cursorPositions.get(doc.uri);
  if (cursorPos) {
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let inString = false;
      let escaped = false;
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === '"') {
          inString = !inString;
        }
      }
      // If line ends in unclosed string and cursor isn't on this line
      if (inString && i !== cursorPos.line) {
        diags.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: i, character: 0 },
            end: { line: i, character: line.length },
          },
          message: "Unclosed string literal",
          source: "pang",
        });
      }
    }
  }
  // --- FIX: Remove "unclosed string" errors from the active cursor line ---
  if (cursorPos) {
    diags = diags.filter(
      (d) => !(d.message.includes("Unclosed string") && d.range.start.line === cursorPos.line)
    );
  }
  connection.sendDiagnostics({ uri: doc.uri, diagnostics: diags });
}

// On document change, run validation and send diagnostics immediately
// Debounced validation on text change
let validateTimeout = null;
const lastChangeVersion = new Map();

documents.onDidChangeContent((e) => {
  lastChangeVersion.set(e.document.uri, e.document.version);
  clearTimeout(validateTimeout);
  validateTimeout = setTimeout(() => {
    validateDocument(e.document);
  }, 200); // wait briefly to avoid flickering errors
});

// Track cursor position and revalidate if needed
connection.onNotification("custom/cursorMoved", (params) => {
  const { uri, position } = params;
  cursorPositions.set(uri, position);

  // Re-run validation if nothing changed recently (fixes quote deletion lag)
  const doc = documents.get(uri);
  if (doc && doc.version === lastChangeVersion.get(uri)) {
    validateDocument(doc);
  }
});
// Start periodic validation timer once initialized
connection.onInitialized(() => {
  setInterval(() => {
    validateAllDocuments();
  }, 1000); // Refresh every second
});

// Try to load blocks metadata for opcode completions
let blocksMeta = null;
try {
  blocksMeta = require(pathResolveLib().replace("/lib", "") + "/blocks").processedBlocks;
} catch (e) {
  try {
    blocksMeta = require("../../blocks").processedBlocks;
  } catch (ee) {
    blocksMeta = null;
  }
}

// Provide completion items: prefer snippets (from snippets/pang.json), then locals and opcodes
connection.onCompletion((textDocumentPosition) => {
  try {
    const doc = documents.get(textDocumentPosition.textDocument.uri);
    const text = doc ? doc.getText() : "";
    const items = [];

    // Load snippet suggestions from snippets/pang.json (if present)
    try {
      const snippetPath = path.join(__dirname, "..", "snippets", "pang.json");
      if (fs.existsSync(snippetPath)) {
        const raw = fs.readFileSync(snippetPath, "utf8");
        const sn = JSON.parse(raw);
        for (const key of Object.keys(sn)) {
          const s = sn[key];
          const label = s.prefix || key;
          const insert = Array.isArray(s.body) ? s.body.join("\n") : s.body;
          items.push({
            label,
            kind: 15,
            insertText: insert,
            insertTextFormat: 2,
            detail: s.description || "snippet",
            sortText: "000",
          });
        }
      }
    } catch (e) {
      // ignore snippet load errors
    }

    // Add declared variables (locals)
    const declared = new Set();
    const lines = text.split(/\r?\n/);
    const declRe = /\b(?:let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
    const assignRe = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/;
    for (let i = 0; i < lines.length; i++) {
      let m;
      while ((m = declRe.exec(lines[i]))) declared.add(m[1]);
      const am = assignRe.exec(lines[i]);
      if (am) declared.add(am[1]);
    }
    for (const v of declared) items.push({ label: v, kind: 6, sortText: "100" });

    // Add opcode completions from blocks metadata (if available)
    if (blocksMeta) {
      for (const k of Object.keys(blocksMeta)) items.push({ label: k, kind: 12, sortText: "200" });
    }

    return items;
  } catch (e) {
    return [];
  }
});

// Expose validateText for programmatic use and only start the connection loop when
// the script is executed directly (not when required by the extension bundle).
module.exports = module.exports || {};
module.exports.validateText = validateText;

if (require.main === module) {
  // Make the text document manager listen on the connection
  documents.listen(connection);
  connection.listen();
}

// Provide go-to-definition for variables using the declaration map we build during validation
connection.onDefinition((params) => {
  try {
    const doc = documents.get(params.textDocument.uri);
    if (!doc) return null;
    const line = doc.getText().split(/\r?\n/)[params.position.line] || "";
    // find word at position
    const re = /[a-zA-Z_][a-zA-Z0-9_]*/g;
    let match;
    let found = null;
    while ((match = re.exec(line))) {
      const start = match.index;
      const end = start + match[0].length;
      if (params.position.character >= start && params.position.character <= end) {
        found = match[0];
        break;
      }
    }
    if (!found) return null;

    // Re-run validation to obtain declared map
    const diags = validateText(doc.getText(), params.textDocument.uri);
    const declared = diags._declared || new Map();
    if (declared.has(found)) {
      const pos = declared.get(found);
      return [
        {
          uri: params.textDocument.uri,
          range: {
            start: { line: pos.line, character: pos.start },
            end: { line: pos.line, character: pos.end },
          },
        },
      ];
    }
    // fallback: search whole document for declaration
    const allLines = doc.getText().split(/\r?\n/);
    for (let i = 0; i < allLines.length; i++) {
      const l = allLines[i];
      const m = new RegExp("\\b(?:let|const)\\s+" + found + "\\b").exec(l);
      if (m) {
        const idx = l.indexOf(found);
        return [
          {
            uri: params.textDocument.uri,
            range: { start: { line: i, character: idx }, end: { line: i, character: idx + found.length } },
          },
        ];
      }
    }
    return null;
  } catch (e) {
    return null;
  }
});
