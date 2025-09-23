// Parses specially-formatted comment directives from Lua source.
// Supported directives (user-facing):
//  --@label <text>           -> a single-line comment placed before the statement on this line
//  --@val:<text>             -> an inline value comment attached to the expression on this line
//  --@label-start <text>     -> begin a multiline comment block
//  --@label-end              -> end the multiline comment block
// The processor returns maps keyed by 1-based line numbers for line/inline comments
// and an array of block ranges for multiline comments.
function parseComments(source) {
    const lines = String(source).split(/\r?\n/);
    const lineComments = {}; // lineNum -> text
    const inlineComments = {}; // lineNum -> text
    const blockComments = []; // {startLine, endLine, text}

    // support nested multiline label blocks using a stack
    const activeStack = [];
    for (let i = 0; i < lines.length; i++) {
        const ln = lines[i];
        const lineNum = i + 1;

        // Detect multiline block start
        const mStart = ln.match(/^\s*--@label-start(?:\s+(.+))?$/);
        if (mStart) {
            activeStack.push({ startLine: lineNum, text: (mStart[1] || '').trim() });
            continue;
        }
        // Detect multiline block end
        const mEnd = ln.match(/^\s*--@label-end\s*$/);
        if (mEnd && activeStack.length > 0) {
            const completed = activeStack.pop();
            completed.endLine = lineNum;
            blockComments.push(completed);
            continue;
        }

        // If inside an active block, accumulate the text only from comment lines
        if (activeStack.length > 0) {
            const top = activeStack[activeStack.length - 1];
            // Only lines that actually start with `--` should be added to the block text
            const mCommentLine = ln.match(/^\s*--\s?(.*)$/);
            if (mCommentLine) {
                top.text += (top.text ? '\n' : '') + mCommentLine[1].trim();
            }
            continue;
        }

        // Single-line label comment
        const mLine = ln.match(/^\s*--@label(?:\s+(.+))?$/);
        if (mLine) {
            lineComments[lineNum] = (mLine[1] || '').trim();
            continue;
        }

        // Inline value comment at end of line.
        // Support old form: --@val: some text  (maps to arg 1)
        const mInlineOld = ln.match(/--\s*@val:([^\n\r]+)$/);
        if (mInlineOld) {
            inlineComments[lineNum] = { byIndex: { 1: (mInlineOld[1] || '').trim() }, raw: (mInlineOld[1] || '').trim() };
            continue;
        }
        // New numbered form: --@val1 text @val2 other text ...
        if (ln.indexOf('@val') !== -1) {
            const rest = ln.substring(ln.indexOf('@val'));
            const byIndex = {};
            const tokenRe = /@val(\d+)\s*([^@]*)/g;
            let m;
            while ((m = tokenRe.exec(rest)) !== null) {
                const idx = Number(m[1]);
                const txt = (m[2] || '').trim();
                if (idx && txt) byIndex[idx] = txt;
            }
            if (Object.keys(byIndex).length > 0) {
                inlineComments[lineNum] = { byIndex, raw: rest };
                continue;
            }
        }
    }

    // If any blocks were left open, close them at EOF (preserve nesting order)
    while (activeStack.length > 0) {
        const rem = activeStack.pop();
        rem.endLine = lines.length;
        blockComments.push(rem);
    }

    return { lineComments, inlineComments, blockComments };
}

module.exports = { parseComments };
