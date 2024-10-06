"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _antlr = _interopRequireDefault(require("antlr4"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Generated from LuaParser.g4 by ANTLR 4.13.1
// jshint ignore: start

// This class defines a complete generic visitor for a parse tree produced by LuaParser.

class LuaParserVisitor extends _antlr.default.tree.ParseTreeVisitor {
  // Visit a parse tree produced by LuaParser#start_.
  visitStart_(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#chunk.
  visitChunk(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#block.
  visitBlock(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#statement.
  visitStatement(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#attnamelist.
  visitAttnamelist(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#attrib.
  visitAttrib(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#retstatement.
  visitRetstatement(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#label.
  visitLabel(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#funcname.
  visitFuncname(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#varlist.
  visitVarlist(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#namelist.
  visitNamelist(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#explist.
  visitExplist(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#exp.
  visitExp(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#var.
  visitVar(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#prefixexp.
  visitPrefixexp(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#functioncall.
  visitFunctioncall(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#args.
  visitArgs(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#functiondef.
  visitFunctiondef(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#funcbody.
  visitFuncbody(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#parlist.
  visitParlist(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#tableconstructor.
  visitTableconstructor(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#fieldlist.
  visitFieldlist(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#field.
  visitField(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#fieldsep.
  visitFieldsep(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#number.
  visitNumber(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by LuaParser#string.
  visitString(ctx) {
    return this.visitChildren(ctx);
  }
}
exports.default = LuaParserVisitor;