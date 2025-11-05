"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _antlr = _interopRequireDefault(require("antlr4"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Generated from Pang.g4 by ANTLR 4.13.2
// jshint ignore: start

// This class defines a complete listener for a parse tree produced by PangParser.
class PangListener extends _antlr.default.tree.ParseTreeListener {
  // Enter a parse tree produced by PangParser#program.
  enterProgram(ctx) {}

  // Exit a parse tree produced by PangParser#program.
  exitProgram(ctx) {}

  // Enter a parse tree produced by PangParser#statementItem.
  enterStatementItem(ctx) {}

  // Exit a parse tree produced by PangParser#statementItem.
  exitStatementItem(ctx) {}

  // Enter a parse tree produced by PangParser#statement.
  enterStatement(ctx) {}

  // Exit a parse tree produced by PangParser#statement.
  exitStatement(ctx) {}

  // Enter a parse tree produced by PangParser#onCall.
  enterOnCall(ctx) {}

  // Exit a parse tree produced by PangParser#onCall.
  exitOnCall(ctx) {}

  // Enter a parse tree produced by PangParser#inlineBlock.
  enterInlineBlock(ctx) {}

  // Exit a parse tree produced by PangParser#inlineBlock.
  exitInlineBlock(ctx) {}

  // Enter a parse tree produced by PangParser#inlineBlockBody.
  enterInlineBlockBody(ctx) {}

  // Exit a parse tree produced by PangParser#inlineBlockBody.
  exitInlineBlockBody(ctx) {}

  // Enter a parse tree produced by PangParser#inlineStatement.
  enterInlineStatement(ctx) {}

  // Exit a parse tree produced by PangParser#inlineStatement.
  exitInlineStatement(ctx) {}

  // Enter a parse tree produced by PangParser#block.
  enterBlock(ctx) {}

  // Exit a parse tree produced by PangParser#block.
  exitBlock(ctx) {}

  // Enter a parse tree produced by PangParser#printCall.
  enterPrintCall(ctx) {}

  // Exit a parse tree produced by PangParser#printCall.
  exitPrintCall(ctx) {}

  // Enter a parse tree produced by PangParser#varDecl.
  enterVarDecl(ctx) {}

  // Exit a parse tree produced by PangParser#varDecl.
  exitVarDecl(ctx) {}

  // Enter a parse tree produced by PangParser#assignStmt.
  enterAssignStmt(ctx) {}

  // Exit a parse tree produced by PangParser#assignStmt.
  exitAssignStmt(ctx) {}

  // Enter a parse tree produced by PangParser#ifStmt.
  enterIfStmt(ctx) {}

  // Exit a parse tree produced by PangParser#ifStmt.
  exitIfStmt(ctx) {}

  // Enter a parse tree produced by PangParser#expr.
  enterExpr(ctx) {}

  // Exit a parse tree produced by PangParser#expr.
  exitExpr(ctx) {}

  // Enter a parse tree produced by PangParser#primary.
  enterPrimary(ctx) {}

  // Exit a parse tree produced by PangParser#primary.
  exitPrimary(ctx) {}

  // Enter a parse tree produced by PangParser#options_.
  enterOptions_(ctx) {}

  // Exit a parse tree produced by PangParser#options_.
  exitOptions_(ctx) {}

  // Enter a parse tree produced by PangParser#optionPair.
  enterOptionPair(ctx) {}

  // Exit a parse tree produced by PangParser#optionPair.
  exitOptionPair(ctx) {}

  // Enter a parse tree produced by PangParser#optionKey.
  enterOptionKey(ctx) {}

  // Exit a parse tree produced by PangParser#optionKey.
  exitOptionKey(ctx) {}

  // Enter a parse tree produced by PangParser#optionValue.
  enterOptionValue(ctx) {}

  // Exit a parse tree produced by PangParser#optionValue.
  exitOptionValue(ctx) {}

  // Enter a parse tree produced by PangParser#functionCall.
  enterFunctionCall(ctx) {}

  // Exit a parse tree produced by PangParser#functionCall.
  exitFunctionCall(ctx) {}
}
exports.default = PangListener;