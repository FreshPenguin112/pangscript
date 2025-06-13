class CompilerError extends Error {
    constructor(message, ctx, source) {
        super(message);
        this.name = "CompilerError";
        if (ctx && ctx.start) {
            this.line = ctx.start.line;
            this.column = ctx.start.column;
            this.lineContent = source
                ? source.split('\n')[ctx.start.line - 1]
                : null;
        }
        // Don't capture stack unless needed
    }

    toString({ showStack = false } = {}) {
        let msg = `${this.name}: ${this.message}`;
        if (this.line !== undefined) {
            msg += `\n  at line ${this.line}, column ${this.column + 1}`;
            if (this.lineContent) {
                msg += `\n  > ${this.lineContent}`;
            }
        }
        if (showStack && this.stack) {
            msg += `\n${this.stack}`;
        }
        return msg;
    }
}

module.exports = CompilerError;