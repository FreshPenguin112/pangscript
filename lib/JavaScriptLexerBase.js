"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _antlr = _interopRequireDefault(require("antlr4"));
var _JavaScriptLexer = _interopRequireDefault(require("./JavaScriptLexer.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class JavaScriptLexerBase extends _antlr.default.Lexer {
  constructor(input) {
    super(input);
    this.scopeStrictModes = new Array();
    this.lastToken = null;
    this.useStrictDefault = false;
    this.useStrictCurrent = false;
    this.currentDepth = 0;
    this.templateDepthStack = new Array();
  }
  getStrictDefault() {
    return this.useStrictDefault;
  }
  setUseStrictDefault(value) {
    this.useStrictDefault = value;
    this.useStrictCurrent = value;
  }
  IsStrictMode() {
    return this.useStrictCurrent;
  }
  IsInTemplateString() {
    return this.templateDepthStack.length > 0 && this.templateDepthStack[this.templateDepthStack.length - 1] === this.currentDepth;
  }
  getCurrentToken() {
    return this.nextToken();
  }
  nextToken() {
    var next = super.nextToken();
    if (next.channel === _antlr.default.Token.DEFAULT_CHANNEL) {
      this.lastToken = next;
    }
    return next;
  }
  ProcessOpenBrace() {
    this.currentDepth++;
    this.useStrictCurrent = this.scopeStrictModes.length > 0 && this.scopeStrictModes[this.scopeStrictModes.length - 1] ? true : this.useStrictDefault;
    this.scopeStrictModes.push(this.useStrictCurrent);
  }
  ProcessCloseBrace() {
    this.useStrictCurrent = this.scopeStrictModes.length > 0 ? this.scopeStrictModes.pop() : this.useStrictDefault;
    this.currentDepth--;
  }
  ProcessStringLiteral() {
    if (this.lastToken === null || this.lastToken.type === _JavaScriptLexer.default.OpenBrace) {
      if (super.text === '"use strict"' || super.text === "'use strict'") {
        if (this.scopeStrictModes.length > 0) {
          this.scopeStrictModes.pop();
        }
        this.useStrictCurrent = true;
        this.scopeStrictModes.push(this.useStrictCurrent);
      }
    }
  }
  ProcessTemplateOpenBrace() {
    this.currentDepth++;
    this.templateDepthStack.push(this.currentDepth);
  }
  ProcessTemplateCloseBrace() {
    this.templateDepthStack.pop();
    this.currentDepth--;
  }
  IsRegexPossible() {
    if (this.lastToken === null) {
      return true;
    }
    switch (this.lastToken.type) {
      case _JavaScriptLexer.default.Identifier:
      case _JavaScriptLexer.default.NullLiteral:
      case _JavaScriptLexer.default.BooleanLiteral:
      case _JavaScriptLexer.default.This:
      case _JavaScriptLexer.default.CloseBracket:
      case _JavaScriptLexer.default.CloseParen:
      case _JavaScriptLexer.default.OctalIntegerLiteral:
      case _JavaScriptLexer.default.DecimalLiteral:
      case _JavaScriptLexer.default.HexIntegerLiteral:
      case _JavaScriptLexer.default.StringLiteral:
      case _JavaScriptLexer.default.PlusPlus:
      case _JavaScriptLexer.default.MinusMinus:
        return false;
      default:
        return true;
    }
  }
  IsStartOfFile() {
    return this.lastToken === null;
  }
  reset() {
    this.scopeStrictModes = new Array();
    this.lastToken = null;
    this.useStrictDefault = false;
    this.useStrictCurrent = false;
    this.currentDepth = 0;
    this.templateDepthStack = new Array();
    super.reset();
  }
}
exports.default = JavaScriptLexerBase;