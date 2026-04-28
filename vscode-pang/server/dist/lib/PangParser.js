"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _antlr = _interopRequireDefault(require("antlr4"));
var _PangListener = _interopRequireDefault(require("./PangListener.js"));
var _PangVisitor = _interopRequireDefault(require("./PangVisitor.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Generated from Pang.g4 by ANTLR 4.13.1
// jshint ignore: start

const serializedATN = [4, 1, 47, 259, 2, 0, 7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4, 2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7, 7, 2, 8, 7, 8, 2, 9, 7, 9, 2, 10, 7, 10, 2, 11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13, 2, 14, 7, 14, 2, 15, 7, 15, 2, 16, 7, 16, 2, 17, 7, 17, 2, 18, 7, 18, 1, 0, 5, 0, 40, 8, 0, 10, 0, 12, 0, 43, 9, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 52, 8, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 3, 2, 60, 8, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 4, 1, 4, 1, 4, 1, 5, 1, 5, 5, 5, 74, 8, 5, 10, 5, 12, 5, 77, 9, 5, 1, 5, 1, 5, 1, 6, 1, 6, 1, 6, 1, 6, 3, 6, 85, 8, 6, 1, 7, 1, 7, 5, 7, 89, 8, 7, 10, 7, 12, 7, 92, 9, 7, 1, 7, 1, 7, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 3, 8, 101, 8, 8, 1, 8, 1, 8, 1, 9, 1, 9, 1, 9, 1, 9, 3, 9, 109, 8, 9, 1, 10, 1, 10, 1, 10, 1, 10, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 5, 11, 127, 8, 11, 10, 11, 12, 11, 130, 9, 11, 1, 11, 1, 11, 3, 11, 134, 8, 11, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 3, 12, 144, 8, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 5, 12, 188, 8, 12, 10, 12, 12, 12, 191, 9, 12, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 3, 13, 204, 8, 13, 1, 14, 1, 14, 3, 14, 208, 8, 14, 1, 14, 1, 14, 1, 14, 3, 14, 213, 8, 14, 1, 14, 5, 14, 216, 8, 14, 10, 14, 12, 14, 219, 9, 14, 1, 14, 3, 14, 222, 8, 14, 1, 14, 1, 14, 1, 15, 1, 15, 3, 15, 228, 8, 15, 1, 15, 1, 15, 3, 15, 232, 8, 15, 1, 15, 1, 15, 1, 16, 1, 16, 1, 17, 1, 17, 1, 17, 1, 17, 1, 17, 3, 17, 243, 8, 17, 1, 18, 1, 18, 1, 18, 1, 18, 1, 18, 5, 18, 250, 8, 18, 10, 18, 12, 18, 253, 9, 18, 3, 18, 255, 8, 18, 1, 18, 1, 18, 1, 18, 0, 1, 24, 19, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 0, 7, 1, 0, 10, 11, 1, 0, 17, 18, 2, 0, 6, 6, 19, 19, 1, 0, 20, 22, 1, 0, 23, 26, 1, 0, 27, 30, 2, 0, 40, 40, 43, 43, 287, 0, 41, 1, 0, 0, 0, 2, 51, 1, 0, 0, 0, 4, 59, 1, 0, 0, 0, 6, 61, 1, 0, 0, 0, 8, 68, 1, 0, 0, 0, 10, 71, 1, 0, 0, 0, 12, 84, 1, 0, 0, 0, 14, 86, 1, 0, 0, 0, 16, 95, 1, 0, 0, 0, 18, 104, 1, 0, 0, 0, 20, 110, 1, 0, 0, 0, 22, 114, 1, 0, 0, 0, 24, 143, 1, 0, 0, 0, 26, 203, 1, 0, 0, 0, 28, 205, 1, 0, 0, 0, 30, 225, 1, 0, 0, 0, 32, 235, 1, 0, 0, 0, 34, 242, 1, 0, 0, 0, 36, 244, 1, 0, 0, 0, 38, 40, 3, 4, 2, 0, 39, 38, 1, 0, 0, 0, 40, 43, 1, 0, 0, 0, 41, 39, 1, 0, 0, 0, 41, 42, 1, 0, 0, 0, 42, 44, 1, 0, 0, 0, 43, 41, 1, 0, 0, 0, 44, 45, 5, 0, 0, 1, 45, 1, 1, 0, 0, 0, 46, 52, 3, 6, 3, 0, 47, 52, 3, 16, 8, 0, 48, 52, 3, 36, 18, 0, 49, 52, 3, 18, 9, 0, 50, 52, 3, 20, 10, 0, 51, 46, 1, 0, 0, 0, 51, 47, 1, 0, 0, 0, 51, 48, 1, 0, 0, 0, 51, 49, 1, 0, 0, 0, 51, 50, 1, 0, 0, 0, 52, 3, 1, 0, 0, 0, 53, 54, 3, 2, 1, 0, 54, 55, 5, 1, 0, 0, 55, 60, 1, 0, 0, 0, 56, 57, 3, 22, 11, 0, 57, 58, 5, 1, 0, 0, 58, 60, 1, 0, 0, 0, 59, 53, 1, 0, 0, 0, 59, 56, 1, 0, 0, 0, 60, 5, 1, 0, 0, 0, 61, 62, 5, 2, 0, 0, 62, 63, 5, 3, 0, 0, 63, 64, 5, 43, 0, 0, 64, 65, 5, 4, 0, 0, 65, 66, 3, 8, 4, 0, 66, 67, 5, 5, 0, 0, 67, 7, 1, 0, 0, 0, 68, 69, 5, 6, 0, 0, 69, 70, 3, 10, 5, 0, 70, 9, 1, 0, 0, 0, 71, 75, 5, 7, 0, 0, 72, 74, 3, 12, 6, 0, 73, 72, 1, 0, 0, 0, 74, 77, 1, 0, 0, 0, 75, 73, 1, 0, 0, 0, 75, 76, 1, 0, 0, 0, 76, 78, 1, 0, 0, 0, 77, 75, 1, 0, 0, 0, 78, 79, 5, 8, 0, 0, 79, 11, 1, 0, 0, 0, 80, 81, 3, 2, 1, 0, 81, 82, 5, 1, 0, 0, 82, 85, 1, 0, 0, 0, 83, 85, 3, 22, 11, 0, 84, 80, 1, 0, 0, 0, 84, 83, 1, 0, 0, 0, 85, 13, 1, 0, 0, 0, 86, 90, 5, 7, 0, 0, 87, 89, 3, 4, 2, 0, 88, 87, 1, 0, 0, 0, 89, 92, 1, 0, 0, 0, 90, 88, 1, 0, 0, 0, 90, 91, 1, 0, 0, 0, 91, 93, 1, 0, 0, 0, 92, 90, 1, 0, 0, 0, 93, 94, 5, 8, 0, 0, 94, 15, 1, 0, 0, 0, 95, 96, 5, 9, 0, 0, 96, 97, 5, 3, 0, 0, 97, 100, 3, 24, 12, 0, 98, 99, 5, 4, 0, 0, 99, 101, 3, 28, 14, 0, 100, 98, 1, 0, 0, 0, 100, 101, 1, 0, 0, 0, 101, 102, 1, 0, 0, 0, 102, 103, 5, 5, 0, 0, 103, 17, 1, 0, 0, 0, 104, 105, 7, 0, 0, 0, 105, 108, 5, 40, 0, 0, 106, 107, 5, 12, 0, 0, 107, 109, 3, 24, 12, 0, 108, 106, 1, 0, 0, 0, 108, 109, 1, 0, 0, 0, 109, 19, 1, 0, 0, 0, 110, 111, 5, 40, 0, 0, 111, 112, 5, 12, 0, 0, 112, 113, 3, 24, 12, 0, 113, 21, 1, 0, 0, 0, 114, 115, 5, 13, 0, 0, 115, 116, 5, 3, 0, 0, 116, 117, 3, 24, 12, 0, 117, 118, 5, 5, 0, 0, 118, 128, 3, 14, 7, 0, 119, 120, 5, 14, 0, 0, 120, 121, 5, 13, 0, 0, 121, 122, 5, 3, 0, 0, 122, 123, 3, 24, 12, 0, 123, 124, 5, 5, 0, 0, 124, 125, 3, 14, 7, 0, 125, 127, 1, 0, 0, 0, 126, 119, 1, 0, 0, 0, 127, 130, 1, 0, 0, 0, 128, 126, 1, 0, 0, 0, 128, 129, 1, 0, 0, 0, 129, 133, 1, 0, 0, 0, 130, 128, 1, 0, 0, 0, 131, 132, 5, 14, 0, 0, 132, 134, 3, 14, 7, 0, 133, 131, 1, 0, 0, 0, 133, 134, 1, 0, 0, 0, 134, 23, 1, 0, 0, 0, 135, 136, 6, 12, -1, 0, 136, 144, 3, 26, 13, 0, 137, 138, 5, 15, 0, 0, 138, 144, 3, 24, 12, 16, 139, 140, 5, 16, 0, 0, 140, 144, 3, 24, 12, 15, 141, 142, 7, 1, 0, 0, 142, 144, 3, 24, 12, 14, 143, 135, 1, 0, 0, 0, 143, 137, 1, 0, 0, 0, 143, 139, 1, 0, 0, 0, 143, 141, 1, 0, 0, 0, 144, 189, 1, 0, 0, 0, 145, 146, 10, 13, 0, 0, 146, 147, 5, 41, 0, 0, 147, 188, 3, 24, 12, 14, 148, 149, 10, 12, 0, 0, 149, 150, 7, 2, 0, 0, 150, 188, 3, 24, 12, 13, 151, 152, 10, 11, 0, 0, 152, 153, 7, 1, 0, 0, 153, 188, 3, 24, 12, 12, 154, 155, 10, 10, 0, 0, 155, 156, 7, 3, 0, 0, 156, 188, 3, 24, 12, 11, 157, 158, 10, 9, 0, 0, 158, 159, 5, 42, 0, 0, 159, 188, 3, 24, 12, 10, 160, 161, 10, 8, 0, 0, 161, 162, 7, 4, 0, 0, 162, 188, 3, 24, 12, 9, 163, 164, 10, 7, 0, 0, 164, 165, 7, 5, 0, 0, 165, 188, 3, 24, 12, 8, 166, 167, 10, 6, 0, 0, 167, 168, 5, 31, 0, 0, 168, 188, 3, 24, 12, 7, 169, 170, 10, 5, 0, 0, 170, 171, 5, 32, 0, 0, 171, 188, 3, 24, 12, 6, 172, 173, 10, 4, 0, 0, 173, 174, 5, 33, 0, 0, 174, 188, 3, 24, 12, 5, 175, 176, 10, 3, 0, 0, 176, 177, 5, 34, 0, 0, 177, 188, 3, 24, 12, 4, 178, 179, 10, 2, 0, 0, 179, 180, 5, 35, 0, 0, 180, 188, 3, 24, 12, 3, 181, 182, 10, 1, 0, 0, 182, 183, 5, 36, 0, 0, 183, 184, 3, 24, 12, 0, 184, 185, 5, 37, 0, 0, 185, 186, 3, 24, 12, 2, 186, 188, 1, 0, 0, 0, 187, 145, 1, 0, 0, 0, 187, 148, 1, 0, 0, 0, 187, 151, 1, 0, 0, 0, 187, 154, 1, 0, 0, 0, 187, 157, 1, 0, 0, 0, 187, 160, 1, 0, 0, 0, 187, 163, 1, 0, 0, 0, 187, 166, 1, 0, 0, 0, 187, 169, 1, 0, 0, 0, 187, 172, 1, 0, 0, 0, 187, 175, 1, 0, 0, 0, 187, 178, 1, 0, 0, 0, 187, 181, 1, 0, 0, 0, 188, 191, 1, 0, 0, 0, 189, 187, 1, 0, 0, 0, 189, 190, 1, 0, 0, 0, 190, 25, 1, 0, 0, 0, 191, 189, 1, 0, 0, 0, 192, 204, 5, 44, 0, 0, 193, 204, 5, 43, 0, 0, 194, 204, 5, 38, 0, 0, 195, 204, 5, 39, 0, 0, 196, 204, 5, 40, 0, 0, 197, 204, 3, 16, 8, 0, 198, 204, 3, 36, 18, 0, 199, 200, 5, 3, 0, 0, 200, 201, 3, 24, 12, 0, 201, 202, 5, 5, 0, 0, 202, 204, 1, 0, 0, 0, 203, 192, 1, 0, 0, 0, 203, 193, 1, 0, 0, 0, 203, 194, 1, 0, 0, 0, 203, 195, 1, 0, 0, 0, 203, 196, 1, 0, 0, 0, 203, 197, 1, 0, 0, 0, 203, 198, 1, 0, 0, 0, 203, 199, 1, 0, 0, 0, 204, 27, 1, 0, 0, 0, 205, 207, 5, 7, 0, 0, 206, 208, 5, 45, 0, 0, 207, 206, 1, 0, 0, 0, 207, 208, 1, 0, 0, 0, 208, 209, 1, 0, 0, 0, 209, 217, 3, 30, 15, 0, 210, 212, 5, 4, 0, 0, 211, 213, 5, 45, 0, 0, 212, 211, 1, 0, 0, 0, 212, 213, 1, 0, 0, 0, 213, 214, 1, 0, 0, 0, 214, 216, 3, 30, 15, 0, 215, 210, 1, 0, 0, 0, 216, 219, 1, 0, 0, 0, 217, 215, 1, 0, 0, 0, 217, 218, 1, 0, 0, 0, 218, 221, 1, 0, 0, 0, 219, 217, 1, 0, 0, 0, 220, 222, 5, 45, 0, 0, 221, 220, 1, 0, 0, 0, 221, 222, 1, 0, 0, 0, 222, 223, 1, 0, 0, 0, 223, 224, 5, 8, 0, 0, 224, 29, 1, 0, 0, 0, 225, 227, 3, 32, 16, 0, 226, 228, 5, 45, 0, 0, 227, 226, 1, 0, 0, 0, 227, 228, 1, 0, 0, 0, 228, 229, 1, 0, 0, 0, 229, 231, 5, 37, 0, 0, 230, 232, 5, 45, 0, 0, 231, 230, 1, 0, 0, 0, 231, 232, 1, 0, 0, 0, 232, 233, 1, 0, 0, 0, 233, 234, 3, 34, 17, 0, 234, 31, 1, 0, 0, 0, 235, 236, 7, 6, 0, 0, 236, 33, 1, 0, 0, 0, 237, 243, 5, 43, 0, 0, 238, 243, 5, 44, 0, 0, 239, 243, 5, 38, 0, 0, 240, 243, 5, 39, 0, 0, 241, 243, 3, 24, 12, 0, 242, 237, 1, 0, 0, 0, 242, 238, 1, 0, 0, 0, 242, 239, 1, 0, 0, 0, 242, 240, 1, 0, 0, 0, 242, 241, 1, 0, 0, 0, 243, 35, 1, 0, 0, 0, 244, 245, 5, 40, 0, 0, 245, 254, 5, 3, 0, 0, 246, 251, 3, 24, 12, 0, 247, 248, 5, 4, 0, 0, 248, 250, 3, 24, 12, 0, 249, 247, 1, 0, 0, 0, 250, 253, 1, 0, 0, 0, 251, 249, 1, 0, 0, 0, 251, 252, 1, 0, 0, 0, 252, 255, 1, 0, 0, 0, 253, 251, 1, 0, 0, 0, 254, 246, 1, 0, 0, 0, 254, 255, 1, 0, 0, 0, 255, 256, 1, 0, 0, 0, 256, 257, 5, 5, 0, 0, 257, 37, 1, 0, 0, 0, 23, 41, 51, 59, 75, 84, 90, 100, 108, 128, 133, 143, 187, 189, 203, 207, 212, 217, 221, 227, 231, 242, 251, 254];
const atn = new _antlr.default.atn.ATNDeserializer().deserialize(serializedATN);
const decisionsToDFA = atn.decisionToState.map((ds, index) => new _antlr.default.dfa.DFA(ds, index));
const sharedContextCache = new _antlr.default.atn.PredictionContextCache();
class PangParser extends _antlr.default.Parser {
  static grammarFileName = "Pang.g4";
  static literalNames = [null, "';'", "'on'", "'('", "','", "')'", "'*'", "'{'", "'}'", "'print'", "'let'", "'const'", "'='", "'if'", "'else'", "'!'", "'~'", "'+'", "'-'", "'/'", "'<<'", "'>>'", "'>>>'", "'<'", "'<='", "'>'", "'>='", "'=='", "'!='", "'==='", "'!=='", "'&'", "'^'", "'|'", "'&&'", "'||'", "'?'", "':'", "'true'", "'false'"];
  static symbolicNames = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "IDENT", "POWER", "CONCAT", "STRING", "NUMBER", "WS", "LINE_COMMENT", "BLOCK_COMMENT"];
  static ruleNames = ["program", "statementItem", "statement", "onCall", "inlineBlock", "inlineBlockBody", "inlineStatement", "block", "printCall", "varDecl", "assignStmt", "ifStmt", "expr", "primary", "options_", "optionPair", "optionKey", "optionValue", "functionCall"];
  constructor(input) {
    super(input);
    this._interp = new _antlr.default.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = PangParser.ruleNames;
    this.literalNames = PangParser.literalNames;
    this.symbolicNames = PangParser.symbolicNames;
  }
  sempred(localctx, ruleIndex, predIndex) {
    switch (ruleIndex) {
      case 12:
        return this.expr_sempred(localctx, predIndex);
      default:
        throw "No predicate with index:" + ruleIndex;
    }
  }
  expr_sempred(localctx, predIndex) {
    switch (predIndex) {
      case 0:
        return this.precpred(this._ctx, 13);
      case 1:
        return this.precpred(this._ctx, 12);
      case 2:
        return this.precpred(this._ctx, 11);
      case 3:
        return this.precpred(this._ctx, 10);
      case 4:
        return this.precpred(this._ctx, 9);
      case 5:
        return this.precpred(this._ctx, 8);
      case 6:
        return this.precpred(this._ctx, 7);
      case 7:
        return this.precpred(this._ctx, 6);
      case 8:
        return this.precpred(this._ctx, 5);
      case 9:
        return this.precpred(this._ctx, 4);
      case 10:
        return this.precpred(this._ctx, 3);
      case 11:
        return this.precpred(this._ctx, 2);
      case 12:
        return this.precpred(this._ctx, 1);
      default:
        throw "No predicate with index:" + predIndex;
    }
  }
  program() {
    let localctx = new ProgramContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, PangParser.RULE_program);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 41;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      while ((_la & ~0x1f) === 0 && (1 << _la & 11780) !== 0 || _la === 40) {
        this.state = 38;
        this.statement();
        this.state = 43;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
      }
      this.state = 44;
      this.match(PangParser.EOF);
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  statementItem() {
    let localctx = new StatementItemContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, PangParser.RULE_statementItem);
    try {
      this.state = 51;
      this._errHandler.sync(this);
      var la_ = this._interp.adaptivePredict(this._input, 1, this._ctx);
      switch (la_) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          this.state = 46;
          this.onCall();
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          this.state = 47;
          this.printCall();
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          this.state = 48;
          this.functionCall();
          break;
        case 4:
          this.enterOuterAlt(localctx, 4);
          this.state = 49;
          this.varDecl();
          break;
        case 5:
          this.enterOuterAlt(localctx, 5);
          this.state = 50;
          this.assignStmt();
          break;
      }
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  statement() {
    let localctx = new StatementContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, PangParser.RULE_statement);
    try {
      this.state = 59;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 2:
        case 9:
        case 10:
        case 11:
        case 40:
          this.enterOuterAlt(localctx, 1);
          this.state = 53;
          this.statementItem();
          this.state = 54;
          this.match(PangParser.T__0);
          break;
        case 13:
          this.enterOuterAlt(localctx, 2);
          this.state = 56;
          this.ifStmt();
          this.state = 57;
          this.match(PangParser.T__0);
          break;
        default:
          throw new _antlr.default.error.NoViableAltException(this);
      }
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  onCall() {
    let localctx = new OnCallContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, PangParser.RULE_onCall);
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 61;
      this.match(PangParser.T__1);
      this.state = 62;
      this.match(PangParser.T__2);
      this.state = 63;
      this.match(PangParser.STRING);
      this.state = 64;
      this.match(PangParser.T__3);
      this.state = 65;
      this.inlineBlock();
      this.state = 66;
      this.match(PangParser.T__4);
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  inlineBlock() {
    let localctx = new InlineBlockContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, PangParser.RULE_inlineBlock);
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 68;
      this.match(PangParser.T__5);
      this.state = 69;
      this.inlineBlockBody();
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  inlineBlockBody() {
    let localctx = new InlineBlockBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, PangParser.RULE_inlineBlockBody);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 71;
      this.match(PangParser.T__6);
      this.state = 75;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      while ((_la & ~0x1f) === 0 && (1 << _la & 11780) !== 0 || _la === 40) {
        this.state = 72;
        this.inlineStatement();
        this.state = 77;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
      }
      this.state = 78;
      this.match(PangParser.T__7);
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  inlineStatement() {
    let localctx = new InlineStatementContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, PangParser.RULE_inlineStatement);
    try {
      this.state = 84;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 2:
        case 9:
        case 10:
        case 11:
        case 40:
          this.enterOuterAlt(localctx, 1);
          this.state = 80;
          this.statementItem();
          this.state = 81;
          this.match(PangParser.T__0);
          break;
        case 13:
          this.enterOuterAlt(localctx, 2);
          this.state = 83;
          this.ifStmt();
          break;
        default:
          throw new _antlr.default.error.NoViableAltException(this);
      }
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  block() {
    let localctx = new BlockContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, PangParser.RULE_block);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 86;
      this.match(PangParser.T__6);
      this.state = 90;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      while ((_la & ~0x1f) === 0 && (1 << _la & 11780) !== 0 || _la === 40) {
        this.state = 87;
        this.statement();
        this.state = 92;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
      }
      this.state = 93;
      this.match(PangParser.T__7);
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  printCall() {
    let localctx = new PrintCallContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, PangParser.RULE_printCall);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 95;
      this.match(PangParser.T__8);
      this.state = 96;
      this.match(PangParser.T__2);
      this.state = 97;
      this.expr(0);
      this.state = 100;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if (_la === 4) {
        this.state = 98;
        this.match(PangParser.T__3);
        this.state = 99;
        this.options_();
      }
      this.state = 102;
      this.match(PangParser.T__4);
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  varDecl() {
    let localctx = new VarDeclContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, PangParser.RULE_varDecl);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 104;
      _la = this._input.LA(1);
      if (!(_la === 10 || _la === 11)) {
        this._errHandler.recoverInline(this);
      } else {
        this._errHandler.reportMatch(this);
        this.consume();
      }
      this.state = 105;
      this.match(PangParser.IDENT);
      this.state = 108;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if (_la === 12) {
        this.state = 106;
        this.match(PangParser.T__11);
        this.state = 107;
        this.expr(0);
      }
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  assignStmt() {
    let localctx = new AssignStmtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, PangParser.RULE_assignStmt);
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 110;
      this.match(PangParser.IDENT);
      this.state = 111;
      this.match(PangParser.T__11);
      this.state = 112;
      this.expr(0);
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  ifStmt() {
    let localctx = new IfStmtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, PangParser.RULE_ifStmt);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 114;
      this.match(PangParser.T__12);
      this.state = 115;
      this.match(PangParser.T__2);
      this.state = 116;
      this.expr(0);
      this.state = 117;
      this.match(PangParser.T__4);
      this.state = 118;
      this.block();
      this.state = 128;
      this._errHandler.sync(this);
      var _alt = this._interp.adaptivePredict(this._input, 8, this._ctx);
      while (_alt != 2 && _alt != _antlr.default.atn.ATN.INVALID_ALT_NUMBER) {
        if (_alt === 1) {
          this.state = 119;
          this.match(PangParser.T__13);
          this.state = 120;
          this.match(PangParser.T__12);
          this.state = 121;
          this.match(PangParser.T__2);
          this.state = 122;
          this.expr(0);
          this.state = 123;
          this.match(PangParser.T__4);
          this.state = 124;
          this.block();
        }
        this.state = 130;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 8, this._ctx);
      }
      this.state = 133;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if (_la === 14) {
        this.state = 131;
        this.match(PangParser.T__13);
        this.state = 132;
        this.block();
      }
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  expr(_p) {
    if (_p === undefined) {
      _p = 0;
    }
    const _parentctx = this._ctx;
    const _parentState = this.state;
    let localctx = new ExprContext(this, this._ctx, _parentState);
    let _prevctx = localctx;
    const _startState = 24;
    this.enterRecursionRule(localctx, 24, PangParser.RULE_expr, _p);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 143;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 3:
        case 9:
        case 38:
        case 39:
        case 40:
        case 43:
        case 44:
          this.state = 136;
          this.primary();
          break;
        case 15:
          this.state = 137;
          this.match(PangParser.T__14);
          this.state = 138;
          this.expr(16);
          break;
        case 16:
          this.state = 139;
          this.match(PangParser.T__15);
          this.state = 140;
          this.expr(15);
          break;
        case 17:
        case 18:
          this.state = 141;
          _la = this._input.LA(1);
          if (!(_la === 17 || _la === 18)) {
            this._errHandler.recoverInline(this);
          } else {
            this._errHandler.reportMatch(this);
            this.consume();
          }
          this.state = 142;
          this.expr(14);
          break;
        default:
          throw new _antlr.default.error.NoViableAltException(this);
      }
      this._ctx.stop = this._input.LT(-1);
      this.state = 189;
      this._errHandler.sync(this);
      var _alt = this._interp.adaptivePredict(this._input, 12, this._ctx);
      while (_alt != 2 && _alt != _antlr.default.atn.ATN.INVALID_ALT_NUMBER) {
        if (_alt === 1) {
          if (this._parseListeners !== null) {
            this.triggerExitRuleEvent();
          }
          _prevctx = localctx;
          this.state = 187;
          this._errHandler.sync(this);
          var la_ = this._interp.adaptivePredict(this._input, 11, this._ctx);
          switch (la_) {
            case 1:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 145;
              if (!this.precpred(this._ctx, 13)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 13)");
              }
              this.state = 146;
              this.match(PangParser.POWER);
              this.state = 147;
              this.expr(14);
              break;
            case 2:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 148;
              if (!this.precpred(this._ctx, 12)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 12)");
              }
              this.state = 149;
              _la = this._input.LA(1);
              if (!(_la === 6 || _la === 19)) {
                this._errHandler.recoverInline(this);
              } else {
                this._errHandler.reportMatch(this);
                this.consume();
              }
              this.state = 150;
              this.expr(13);
              break;
            case 3:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 151;
              if (!this.precpred(this._ctx, 11)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 11)");
              }
              this.state = 152;
              _la = this._input.LA(1);
              if (!(_la === 17 || _la === 18)) {
                this._errHandler.recoverInline(this);
              } else {
                this._errHandler.reportMatch(this);
                this.consume();
              }
              this.state = 153;
              this.expr(12);
              break;
            case 4:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 154;
              if (!this.precpred(this._ctx, 10)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 10)");
              }
              this.state = 155;
              _la = this._input.LA(1);
              if (!((_la & ~0x1f) === 0 && (1 << _la & 7340032) !== 0)) {
                this._errHandler.recoverInline(this);
              } else {
                this._errHandler.reportMatch(this);
                this.consume();
              }
              this.state = 156;
              this.expr(11);
              break;
            case 5:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 157;
              if (!this.precpred(this._ctx, 9)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 9)");
              }
              this.state = 158;
              this.match(PangParser.CONCAT);
              this.state = 159;
              this.expr(10);
              break;
            case 6:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 160;
              if (!this.precpred(this._ctx, 8)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
              }
              this.state = 161;
              _la = this._input.LA(1);
              if (!((_la & ~0x1f) === 0 && (1 << _la & 125829120) !== 0)) {
                this._errHandler.recoverInline(this);
              } else {
                this._errHandler.reportMatch(this);
                this.consume();
              }
              this.state = 162;
              this.expr(9);
              break;
            case 7:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 163;
              if (!this.precpred(this._ctx, 7)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 7)");
              }
              this.state = 164;
              _la = this._input.LA(1);
              if (!((_la & ~0x1f) === 0 && (1 << _la & 2013265920) !== 0)) {
                this._errHandler.recoverInline(this);
              } else {
                this._errHandler.reportMatch(this);
                this.consume();
              }
              this.state = 165;
              this.expr(8);
              break;
            case 8:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 166;
              if (!this.precpred(this._ctx, 6)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
              }
              this.state = 167;
              this.match(PangParser.T__30);
              this.state = 168;
              this.expr(7);
              break;
            case 9:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 169;
              if (!this.precpred(this._ctx, 5)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
              }
              this.state = 170;
              this.match(PangParser.T__31);
              this.state = 171;
              this.expr(6);
              break;
            case 10:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 172;
              if (!this.precpred(this._ctx, 4)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
              }
              this.state = 173;
              this.match(PangParser.T__32);
              this.state = 174;
              this.expr(5);
              break;
            case 11:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 175;
              if (!this.precpred(this._ctx, 3)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
              }
              this.state = 176;
              this.match(PangParser.T__33);
              this.state = 177;
              this.expr(4);
              break;
            case 12:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 178;
              if (!this.precpred(this._ctx, 2)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
              }
              this.state = 179;
              this.match(PangParser.T__34);
              this.state = 180;
              this.expr(3);
              break;
            case 13:
              localctx = new ExprContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, PangParser.RULE_expr);
              this.state = 181;
              if (!this.precpred(this._ctx, 1)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
              }
              this.state = 182;
              this.match(PangParser.T__35);
              this.state = 183;
              this.expr(0);
              this.state = 184;
              this.match(PangParser.T__36);
              this.state = 185;
              this.expr(2);
              break;
          }
        }
        this.state = 191;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 12, this._ctx);
      }
    } catch (error) {
      if (error instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = error;
        this._errHandler.reportError(this, error);
        this._errHandler.recover(this, error);
      } else {
        throw error;
      }
    } finally {
      this.unrollRecursionContexts(_parentctx);
    }
    return localctx;
  }
  primary() {
    let localctx = new PrimaryContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, PangParser.RULE_primary);
    try {
      this.state = 203;
      this._errHandler.sync(this);
      var la_ = this._interp.adaptivePredict(this._input, 13, this._ctx);
      switch (la_) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          this.state = 192;
          this.match(PangParser.NUMBER);
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          this.state = 193;
          this.match(PangParser.STRING);
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          this.state = 194;
          this.match(PangParser.T__37);
          break;
        case 4:
          this.enterOuterAlt(localctx, 4);
          this.state = 195;
          this.match(PangParser.T__38);
          break;
        case 5:
          this.enterOuterAlt(localctx, 5);
          this.state = 196;
          this.match(PangParser.IDENT);
          break;
        case 6:
          this.enterOuterAlt(localctx, 6);
          this.state = 197;
          this.printCall();
          break;
        case 7:
          this.enterOuterAlt(localctx, 7);
          this.state = 198;
          this.functionCall();
          break;
        case 8:
          this.enterOuterAlt(localctx, 8);
          this.state = 199;
          this.match(PangParser.T__2);
          this.state = 200;
          this.expr(0);
          this.state = 201;
          this.match(PangParser.T__4);
          break;
      }
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  options_() {
    let localctx = new Options_Context(this, this._ctx, this.state);
    this.enterRule(localctx, 28, PangParser.RULE_options_);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 205;
      this.match(PangParser.T__6);
      this.state = 207;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if (_la === 45) {
        this.state = 206;
        this.match(PangParser.WS);
      }
      this.state = 209;
      this.optionPair();
      this.state = 217;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      while (_la === 4) {
        this.state = 210;
        this.match(PangParser.T__3);
        this.state = 212;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if (_la === 45) {
          this.state = 211;
          this.match(PangParser.WS);
        }
        this.state = 214;
        this.optionPair();
        this.state = 219;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
      }
      this.state = 221;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if (_la === 45) {
        this.state = 220;
        this.match(PangParser.WS);
      }
      this.state = 223;
      this.match(PangParser.T__7);
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  optionPair() {
    let localctx = new OptionPairContext(this, this._ctx, this.state);
    this.enterRule(localctx, 30, PangParser.RULE_optionPair);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 225;
      this.optionKey();
      this.state = 227;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if (_la === 45) {
        this.state = 226;
        this.match(PangParser.WS);
      }
      this.state = 229;
      this.match(PangParser.T__36);
      this.state = 231;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if (_la === 45) {
        this.state = 230;
        this.match(PangParser.WS);
      }
      this.state = 233;
      this.optionValue();
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  optionKey() {
    let localctx = new OptionKeyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 32, PangParser.RULE_optionKey);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 235;
      _la = this._input.LA(1);
      if (!(_la === 40 || _la === 43)) {
        this._errHandler.recoverInline(this);
      } else {
        this._errHandler.reportMatch(this);
        this.consume();
      }
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  optionValue() {
    let localctx = new OptionValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 34, PangParser.RULE_optionValue);
    try {
      this.state = 242;
      this._errHandler.sync(this);
      var la_ = this._interp.adaptivePredict(this._input, 20, this._ctx);
      switch (la_) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          this.state = 237;
          this.match(PangParser.STRING);
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          this.state = 238;
          this.match(PangParser.NUMBER);
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          this.state = 239;
          this.match(PangParser.T__37);
          break;
        case 4:
          this.enterOuterAlt(localctx, 4);
          this.state = 240;
          this.match(PangParser.T__38);
          break;
        case 5:
          this.enterOuterAlt(localctx, 5);
          this.state = 241;
          this.expr(0);
          break;
      }
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
  functionCall() {
    let localctx = new FunctionCallContext(this, this._ctx, this.state);
    this.enterRule(localctx, 36, PangParser.RULE_functionCall);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 244;
      this.match(PangParser.IDENT);
      this.state = 245;
      this.match(PangParser.T__2);
      this.state = 254;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if ((_la & ~0x1f) === 0 && (1 << _la & 492040) !== 0 || (_la - 38 & ~0x1f) === 0 && (1 << _la - 38 & 103) !== 0) {
        this.state = 246;
        this.expr(0);
        this.state = 251;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while (_la === 4) {
          this.state = 247;
          this.match(PangParser.T__3);
          this.state = 248;
          this.expr(0);
          this.state = 253;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
        }
      }
      this.state = 256;
      this.match(PangParser.T__4);
    } catch (re) {
      if (re instanceof _antlr.default.error.RecognitionException) {
        localctx.exception = re;
        this._errHandler.reportError(this, re);
        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }
    return localctx;
  }
}
exports.default = PangParser;
PangParser.EOF = _antlr.default.Token.EOF;
PangParser.T__0 = 1;
PangParser.T__1 = 2;
PangParser.T__2 = 3;
PangParser.T__3 = 4;
PangParser.T__4 = 5;
PangParser.T__5 = 6;
PangParser.T__6 = 7;
PangParser.T__7 = 8;
PangParser.T__8 = 9;
PangParser.T__9 = 10;
PangParser.T__10 = 11;
PangParser.T__11 = 12;
PangParser.T__12 = 13;
PangParser.T__13 = 14;
PangParser.T__14 = 15;
PangParser.T__15 = 16;
PangParser.T__16 = 17;
PangParser.T__17 = 18;
PangParser.T__18 = 19;
PangParser.T__19 = 20;
PangParser.T__20 = 21;
PangParser.T__21 = 22;
PangParser.T__22 = 23;
PangParser.T__23 = 24;
PangParser.T__24 = 25;
PangParser.T__25 = 26;
PangParser.T__26 = 27;
PangParser.T__27 = 28;
PangParser.T__28 = 29;
PangParser.T__29 = 30;
PangParser.T__30 = 31;
PangParser.T__31 = 32;
PangParser.T__32 = 33;
PangParser.T__33 = 34;
PangParser.T__34 = 35;
PangParser.T__35 = 36;
PangParser.T__36 = 37;
PangParser.T__37 = 38;
PangParser.T__38 = 39;
PangParser.IDENT = 40;
PangParser.POWER = 41;
PangParser.CONCAT = 42;
PangParser.STRING = 43;
PangParser.NUMBER = 44;
PangParser.WS = 45;
PangParser.LINE_COMMENT = 46;
PangParser.BLOCK_COMMENT = 47;
PangParser.RULE_program = 0;
PangParser.RULE_statementItem = 1;
PangParser.RULE_statement = 2;
PangParser.RULE_onCall = 3;
PangParser.RULE_inlineBlock = 4;
PangParser.RULE_inlineBlockBody = 5;
PangParser.RULE_inlineStatement = 6;
PangParser.RULE_block = 7;
PangParser.RULE_printCall = 8;
PangParser.RULE_varDecl = 9;
PangParser.RULE_assignStmt = 10;
PangParser.RULE_ifStmt = 11;
PangParser.RULE_expr = 12;
PangParser.RULE_primary = 13;
PangParser.RULE_options_ = 14;
PangParser.RULE_optionPair = 15;
PangParser.RULE_optionKey = 16;
PangParser.RULE_optionValue = 17;
PangParser.RULE_functionCall = 18;
class ProgramContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_program;
  }
  EOF() {
    return this.getToken(PangParser.EOF, 0);
  }
  statement = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(StatementContext);
    } else {
      return this.getTypedRuleContext(StatementContext, i);
    }
  };
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterProgram(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitProgram(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitProgram(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class StatementItemContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_statementItem;
  }
  onCall() {
    return this.getTypedRuleContext(OnCallContext, 0);
  }
  printCall() {
    return this.getTypedRuleContext(PrintCallContext, 0);
  }
  functionCall() {
    return this.getTypedRuleContext(FunctionCallContext, 0);
  }
  varDecl() {
    return this.getTypedRuleContext(VarDeclContext, 0);
  }
  assignStmt() {
    return this.getTypedRuleContext(AssignStmtContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterStatementItem(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitStatementItem(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitStatementItem(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class StatementContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_statement;
  }
  statementItem() {
    return this.getTypedRuleContext(StatementItemContext, 0);
  }
  ifStmt() {
    return this.getTypedRuleContext(IfStmtContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterStatement(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitStatement(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitStatement(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class OnCallContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_onCall;
  }
  STRING() {
    return this.getToken(PangParser.STRING, 0);
  }
  inlineBlock() {
    return this.getTypedRuleContext(InlineBlockContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterOnCall(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitOnCall(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitOnCall(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class InlineBlockContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_inlineBlock;
  }
  inlineBlockBody() {
    return this.getTypedRuleContext(InlineBlockBodyContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterInlineBlock(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitInlineBlock(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitInlineBlock(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class InlineBlockBodyContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_inlineBlockBody;
  }
  inlineStatement = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(InlineStatementContext);
    } else {
      return this.getTypedRuleContext(InlineStatementContext, i);
    }
  };
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterInlineBlockBody(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitInlineBlockBody(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitInlineBlockBody(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class InlineStatementContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_inlineStatement;
  }
  statementItem() {
    return this.getTypedRuleContext(StatementItemContext, 0);
  }
  ifStmt() {
    return this.getTypedRuleContext(IfStmtContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterInlineStatement(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitInlineStatement(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitInlineStatement(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class BlockContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_block;
  }
  statement = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(StatementContext);
    } else {
      return this.getTypedRuleContext(StatementContext, i);
    }
  };
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterBlock(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitBlock(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitBlock(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class PrintCallContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_printCall;
  }
  expr() {
    return this.getTypedRuleContext(ExprContext, 0);
  }
  options_() {
    return this.getTypedRuleContext(Options_Context, 0);
  }
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterPrintCall(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitPrintCall(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitPrintCall(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class VarDeclContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_varDecl;
  }
  IDENT() {
    return this.getToken(PangParser.IDENT, 0);
  }
  expr() {
    return this.getTypedRuleContext(ExprContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterVarDecl(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitVarDecl(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitVarDecl(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class AssignStmtContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_assignStmt;
  }
  IDENT() {
    return this.getToken(PangParser.IDENT, 0);
  }
  expr() {
    return this.getTypedRuleContext(ExprContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterAssignStmt(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitAssignStmt(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitAssignStmt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class IfStmtContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_ifStmt;
  }
  expr = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(ExprContext);
    } else {
      return this.getTypedRuleContext(ExprContext, i);
    }
  };
  block = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(BlockContext);
    } else {
      return this.getTypedRuleContext(BlockContext, i);
    }
  };
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterIfStmt(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitIfStmt(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitIfStmt(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class ExprContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_expr;
  }
  primary() {
    return this.getTypedRuleContext(PrimaryContext, 0);
  }
  expr = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(ExprContext);
    } else {
      return this.getTypedRuleContext(ExprContext, i);
    }
  };
  POWER() {
    return this.getToken(PangParser.POWER, 0);
  }
  CONCAT() {
    return this.getToken(PangParser.CONCAT, 0);
  }
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterExpr(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitExpr(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitExpr(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class PrimaryContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_primary;
  }
  NUMBER() {
    return this.getToken(PangParser.NUMBER, 0);
  }
  STRING() {
    return this.getToken(PangParser.STRING, 0);
  }
  IDENT() {
    return this.getToken(PangParser.IDENT, 0);
  }
  printCall() {
    return this.getTypedRuleContext(PrintCallContext, 0);
  }
  functionCall() {
    return this.getTypedRuleContext(FunctionCallContext, 0);
  }
  expr() {
    return this.getTypedRuleContext(ExprContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterPrimary(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitPrimary(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitPrimary(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class Options_Context extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_options_;
  }
  optionPair = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(OptionPairContext);
    } else {
      return this.getTypedRuleContext(OptionPairContext, i);
    }
  };
  WS = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(PangParser.WS);
    } else {
      return this.getToken(PangParser.WS, i);
    }
  };
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterOptions_(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitOptions_(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitOptions_(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class OptionPairContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_optionPair;
  }
  optionKey() {
    return this.getTypedRuleContext(OptionKeyContext, 0);
  }
  optionValue() {
    return this.getTypedRuleContext(OptionValueContext, 0);
  }
  WS = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(PangParser.WS);
    } else {
      return this.getToken(PangParser.WS, i);
    }
  };
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterOptionPair(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitOptionPair(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitOptionPair(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class OptionKeyContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_optionKey;
  }
  STRING() {
    return this.getToken(PangParser.STRING, 0);
  }
  IDENT() {
    return this.getToken(PangParser.IDENT, 0);
  }
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterOptionKey(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitOptionKey(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitOptionKey(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class OptionValueContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_optionValue;
  }
  STRING() {
    return this.getToken(PangParser.STRING, 0);
  }
  NUMBER() {
    return this.getToken(PangParser.NUMBER, 0);
  }
  expr() {
    return this.getTypedRuleContext(ExprContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterOptionValue(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitOptionValue(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitOptionValue(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class FunctionCallContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PangParser.RULE_functionCall;
  }
  IDENT() {
    return this.getToken(PangParser.IDENT, 0);
  }
  expr = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(ExprContext);
    } else {
      return this.getTypedRuleContext(ExprContext, i);
    }
  };
  enterRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.enterFunctionCall(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _PangListener.default) {
      listener.exitFunctionCall(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _PangVisitor.default) {
      return visitor.visitFunctionCall(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
PangParser.ProgramContext = ProgramContext;
PangParser.StatementItemContext = StatementItemContext;
PangParser.StatementContext = StatementContext;
PangParser.OnCallContext = OnCallContext;
PangParser.InlineBlockContext = InlineBlockContext;
PangParser.InlineBlockBodyContext = InlineBlockBodyContext;
PangParser.InlineStatementContext = InlineStatementContext;
PangParser.BlockContext = BlockContext;
PangParser.PrintCallContext = PrintCallContext;
PangParser.VarDeclContext = VarDeclContext;
PangParser.AssignStmtContext = AssignStmtContext;
PangParser.IfStmtContext = IfStmtContext;
PangParser.ExprContext = ExprContext;
PangParser.PrimaryContext = PrimaryContext;
PangParser.Options_Context = Options_Context;
PangParser.OptionPairContext = OptionPairContext;
PangParser.OptionKeyContext = OptionKeyContext;
PangParser.OptionValueContext = OptionValueContext;
PangParser.FunctionCallContext = FunctionCallContext;