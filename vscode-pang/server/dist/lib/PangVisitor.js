"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _antlr = _interopRequireDefault(require("antlr4"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Generated from Pang.g4 by ANTLR 4.13.1
// jshint ignore: start

// This class defines a complete generic visitor for a parse tree produced by PangParser.

class PangVisitor extends _antlr.default.tree.ParseTreeVisitor {
  // Visit a parse tree produced by PangParser#program.
  visitProgram(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#statementItem.
  visitStatementItem(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#statement.
  visitStatement(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#onCall.
  visitOnCall(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#inlineBlock.
  visitInlineBlock(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#inlineBlockBody.
  visitInlineBlockBody(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#inlineStatement.
  visitInlineStatement(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#block.
  visitBlock(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#printCall.
  visitPrintCall(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#varDecl.
  visitVarDecl(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#assignStmt.
  visitAssignStmt(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#ifStmt.
  visitIfStmt(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#expr.
  visitExpr(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#primary.
  visitPrimary(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#options_.
  visitOptions_(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#optionPair.
  visitOptionPair(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#optionKey.
  visitOptionKey(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#optionValue.
  visitOptionValue(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by PangParser#functionCall.
  visitFunctionCall(ctx) {
    return this.visitChildren(ctx);
  }
}
exports.default = PangVisitor;