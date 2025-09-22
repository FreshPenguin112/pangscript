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

    let activeBlock = null;
    for (let i = 0; i < lines.length; i++) {
        const ln = lines[i];
        const lineNum = i + 1;

        // Detect multiline block start
        const mStart = ln.match(/^\s*--@label-start(?:\s+(.+))?$/);
        if (mStart) {
            activeBlock = { startLine: lineNum, text: (mStart[1] || '').trim() };
            continue;
        }
        // Detect multiline block end
        const mEnd = ln.match(/^\s*--@label-end\s*$/);
        if (mEnd && activeBlock) {
            activeBlock.endLine = lineNum;
            blockComments.push(activeBlock);
            activeBlock = null;
            continue;
        }

        // If inside an active block, accumulate the text
        if (activeBlock) {
            activeBlock.text += (activeBlock.text ? '\n' : '') + ln.replace(/^\s*--\s?/, '').trim();
            continue;
        }

        // Single-line label comment
        const mLine = ln.match(/^\s*--@label(?:\s+(.+))?$/);
        if (mLine) {
            lineComments[lineNum] = (mLine[1] || '').trim();
            continue;
        }

        // Inline value comment at end of line: --@val:some text
        const mInline = ln.match(/--@val:([^\n\r]+)$/);
        if (mInline) {
            inlineComments[lineNum] = (mInline[1] || '').trim();
            continue;
        }
    }

    // If a block was left open, close it at EOF
    if (activeBlock) {
        activeBlock.endLine = lines.length;
        blockComments.push(activeBlock);
    }

    return { lineComments, inlineComments, blockComments };
}

module.exports = { parseComments };
