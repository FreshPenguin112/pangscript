# Pang language support for VS Code

This is a minimal VS Code extension that provides basic syntax highlighting, language configuration, and snippets for the Pang language used in this repo.

What is included
- TextMate grammar for basic syntax highlighting (`syntaxes/pang.tmLanguage.json`)
- Language configuration (`language-configuration.json`) with comments, brackets, auto-closing pairs and folding
- Useful snippets (`snippets/pang.json`) for handlers and common constructs

How to try locally
1. In VS Code, open this workspace and then open the `vscode-pang` folder as the active folder (File → Open Folder...).
2. Press `F5` to launch the Extension Development Host. In that host, open a `.ps` file (for example, `test.ps`) to see highlighting and snippets.

Alternative install (package)
- Install `vsce` (optional): `npm install -g vsce`
- From the `vscode-pang` folder run: `vsce package` to create a `.vsix` file, then install the `.vsix` in VS Code.

Next steps (optional)
- Add a Language Server using the existing ANTLR parser to provide diagnostics, completions and go-to-definition.
- Improve the TextMate grammar for more precise tokenization of calls, arguments and pm-blocks-specific constructs.

If you want, I can add a basic language server wiring that calls the ANTLR parser for real-time diagnostics and completions — tell me if you'd like that and I will scaffold it next.
