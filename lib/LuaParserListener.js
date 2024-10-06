"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _antlr = _interopRequireDefault(require("antlr4"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Generated from LuaParser.g4 by ANTLR 4.13.1
// jshint ignore: start

// This class defines a complete listener for a parse tree produced by LuaParser.
class LuaParserListener extends _antlr.default.tree.ParseTreeListener {
  // Enter a parse tree produced by LuaParser#start_.
  enterStart_(ctx) {}

  // Exit a parse tree produced by LuaParser#start_.
  exitStart_(ctx) {}

  // Enter a parse tree produced by LuaParser#chunk.
  enterChunk(ctx) {}

  // Exit a parse tree produced by LuaParser#chunk.
  exitChunk(ctx) {}

  // Enter a parse tree produced by LuaParser#block.
  enterBlock(ctx) {}

  // Exit a parse tree produced by LuaParser#block.
  exitBlock(ctx) {}

  // Enter a parse tree produced by LuaParser#statment.
  enterStatment(ctx) {}

  // Exit a parse tree produced by LuaParser#statment.
  exitStatment(ctx) {}

  // Enter a parse tree produced by LuaParser#attnamelist.
  enterAttnamelist(ctx) {}

  // Exit a parse tree produced by LuaParser#attnamelist.
  exitAttnamelist(ctx) {}

  // Enter a parse tree produced by LuaParser#attrib.
  enterAttrib(ctx) {}

  // Exit a parse tree produced by LuaParser#attrib.
  exitAttrib(ctx) {}

  // Enter a parse tree produced by LuaParser#retstatment.
  enterRetstatment(ctx) {}

  // Exit a parse tree produced by LuaParser#retstatment.
  exitRetstatment(ctx) {}

  // Enter a parse tree produced by LuaParser#label.
  enterLabel(ctx) {}

  // Exit a parse tree produced by LuaParser#label.
  exitLabel(ctx) {}

  // Enter a parse tree produced by LuaParser#funcname.
  enterFuncname(ctx) {}

  // Exit a parse tree produced by LuaParser#funcname.
  exitFuncname(ctx) {}

  // Enter a parse tree produced by LuaParser#varlist.
  enterVarlist(ctx) {}

  // Exit a parse tree produced by LuaParser#varlist.
  exitVarlist(ctx) {}

  // Enter a parse tree produced by LuaParser#namelist.
  enterNamelist(ctx) {}

  // Exit a parse tree produced by LuaParser#namelist.
  exitNamelist(ctx) {}

  // Enter a parse tree produced by LuaParser#explist.
  enterExplist(ctx) {}

  // Exit a parse tree produced by LuaParser#explist.
  exitExplist(ctx) {}

  // Enter a parse tree produced by LuaParser#exp.
  enterExp(ctx) {}

  // Exit a parse tree produced by LuaParser#exp.
  exitExp(ctx) {}

  // Enter a parse tree produced by LuaParser#var.
  enterVar(ctx) {}

  // Exit a parse tree produced by LuaParser#var.
  exitVar(ctx) {}

  // Enter a parse tree produced by LuaParser#prefixexp.
  enterPrefixexp(ctx) {}

  // Exit a parse tree produced by LuaParser#prefixexp.
  exitPrefixexp(ctx) {}

  // Enter a parse tree produced by LuaParser#functioncall.
  enterFunctioncall(ctx) {}

  // Exit a parse tree produced by LuaParser#functioncall.
  exitFunctioncall(ctx) {}

  // Enter a parse tree produced by LuaParser#args.
  enterArgs(ctx) {}

  // Exit a parse tree produced by LuaParser#args.
  exitArgs(ctx) {}

  // Enter a parse tree produced by LuaParser#functiondef.
  enterFunctiondef(ctx) {}

  // Exit a parse tree produced by LuaParser#functiondef.
  exitFunctiondef(ctx) {}

  // Enter a parse tree produced by LuaParser#funcbody.
  enterFuncbody(ctx) {}

  // Exit a parse tree produced by LuaParser#funcbody.
  exitFuncbody(ctx) {}

  // Enter a parse tree produced by LuaParser#parlist.
  enterParlist(ctx) {}

  // Exit a parse tree produced by LuaParser#parlist.
  exitParlist(ctx) {}

  // Enter a parse tree produced by LuaParser#tableconstructor.
  enterTableconstructor(ctx) {}

  // Exit a parse tree produced by LuaParser#tableconstructor.
  exitTableconstructor(ctx) {}

  // Enter a parse tree produced by LuaParser#fieldlist.
  enterFieldlist(ctx) {}

  // Exit a parse tree produced by LuaParser#fieldlist.
  exitFieldlist(ctx) {}

  // Enter a parse tree produced by LuaParser#field.
  enterField(ctx) {}

  // Exit a parse tree produced by LuaParser#field.
  exitField(ctx) {}

  // Enter a parse tree produced by LuaParser#fieldsep.
  enterFieldsep(ctx) {}

  // Exit a parse tree produced by LuaParser#fieldsep.
  exitFieldsep(ctx) {}

  // Enter a parse tree produced by LuaParser#number.
  enterNumber(ctx) {}

  // Exit a parse tree produced by LuaParser#number.
  exitNumber(ctx) {}

  // Enter a parse tree produced by LuaParser#string.
  enterString(ctx) {}

  // Exit a parse tree produced by LuaParser#string.
  exitString(ctx) {}
}
exports.default = LuaParserListener;