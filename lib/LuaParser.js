"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _antlr = _interopRequireDefault(require("antlr4"));
var _LuaParserListener = _interopRequireDefault(require("./LuaParserListener.js"));
var _LuaParserVisitor = _interopRequireDefault(require("./LuaParserVisitor.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Generated from LuaParser.g4 by ANTLR 4.13.1
// jshint ignore: start

const serializedATN = [4, 1, 71, 480, 2, 0, 7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4, 2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7, 7, 2, 8, 7, 8, 2, 9, 7, 9, 2, 10, 7, 10, 2, 11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13, 2, 14, 7, 14, 2, 15, 7, 15, 2, 16, 7, 16, 2, 17, 7, 17, 2, 18, 7, 18, 2, 19, 7, 19, 2, 20, 7, 20, 2, 21, 7, 21, 2, 22, 7, 22, 2, 23, 7, 23, 2, 24, 7, 24, 2, 25, 7, 25, 2, 26, 7, 26, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 2, 5, 2, 61, 8, 2, 10, 2, 12, 2, 64, 9, 2, 1, 2, 3, 2, 67, 8, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 5, 3, 103, 8, 3, 10, 3, 12, 3, 106, 9, 3, 1, 3, 1, 3, 3, 3, 110, 8, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 3, 3, 122, 8, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 3, 3, 148, 8, 3, 3, 3, 150, 8, 3, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 5, 4, 157, 8, 4, 10, 4, 12, 4, 160, 9, 4, 1, 5, 1, 5, 1, 5, 3, 5, 165, 8, 5, 1, 6, 1, 6, 3, 6, 169, 8, 6, 1, 6, 1, 6, 3, 6, 173, 8, 6, 1, 6, 3, 6, 176, 8, 6, 1, 7, 1, 7, 1, 7, 1, 7, 1, 8, 1, 8, 1, 8, 5, 8, 185, 8, 8, 10, 8, 12, 8, 188, 9, 8, 1, 8, 1, 8, 3, 8, 192, 8, 8, 1, 9, 1, 9, 1, 9, 5, 9, 197, 8, 9, 10, 9, 12, 9, 200, 9, 9, 1, 10, 1, 10, 1, 10, 5, 10, 205, 8, 10, 10, 10, 12, 10, 208, 9, 10, 1, 11, 1, 11, 1, 11, 5, 11, 213, 8, 11, 10, 11, 12, 11, 216, 9, 11, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 3, 12, 230, 8, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 5, 12, 256, 8, 12, 10, 12, 12, 12, 259, 9, 12, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 3, 13, 269, 8, 13, 3, 13, 271, 8, 13, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 5, 14, 280, 8, 14, 10, 14, 12, 14, 283, 9, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 5, 14, 292, 8, 14, 10, 14, 12, 14, 295, 9, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 5, 14, 306, 8, 14, 10, 14, 12, 14, 309, 9, 14, 3, 14, 311, 8, 14, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 5, 15, 321, 8, 15, 10, 15, 12, 15, 324, 9, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 5, 15, 336, 8, 15, 10, 15, 12, 15, 339, 9, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 5, 15, 350, 8, 15, 10, 15, 12, 15, 353, 9, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 5, 15, 367, 8, 15, 10, 15, 12, 15, 370, 9, 15, 1, 15, 1, 15, 1, 15, 1, 15, 3, 15, 376, 8, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 5, 15, 385, 8, 15, 10, 15, 12, 15, 388, 9, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 5, 15, 398, 8, 15, 10, 15, 12, 15, 401, 9, 15, 1, 15, 1, 15, 1, 15, 5, 15, 406, 8, 15, 10, 15, 12, 15, 409, 9, 15, 1, 16, 1, 16, 3, 16, 413, 8, 16, 1, 16, 1, 16, 1, 16, 3, 16, 418, 8, 16, 1, 17, 1, 17, 1, 17, 1, 18, 1, 18, 1, 18, 1, 19, 1, 19, 1, 19, 1, 19, 3, 19, 430, 8, 19, 1, 19, 1, 19, 1, 19, 1, 20, 1, 20, 1, 20, 3, 20, 438, 8, 20, 1, 20, 1, 20, 3, 20, 442, 8, 20, 1, 21, 1, 21, 3, 21, 446, 8, 21, 1, 21, 1, 21, 1, 22, 1, 22, 1, 22, 1, 22, 5, 22, 454, 8, 22, 10, 22, 12, 22, 457, 9, 22, 1, 22, 3, 22, 460, 8, 22, 1, 23, 1, 23, 1, 23, 1, 23, 1, 23, 1, 23, 1, 23, 1, 23, 1, 23, 1, 23, 3, 23, 472, 8, 23, 1, 24, 1, 24, 1, 25, 1, 25, 1, 26, 1, 26, 1, 26, 0, 2, 24, 30, 27, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 0, 9, 2, 0, 28, 30, 33, 33, 3, 0, 37, 38, 45, 45, 54, 54, 2, 0, 29, 29, 44, 44, 4, 0, 19, 20, 40, 41, 50, 50, 56, 56, 3, 0, 28, 28, 34, 36, 52, 52, 2, 0, 24, 24, 69, 71, 2, 0, 1, 1, 15, 15, 1, 0, 61, 64, 1, 0, 58, 60, 539, 0, 54, 1, 0, 0, 0, 2, 57, 1, 0, 0, 0, 4, 62, 1, 0, 0, 0, 6, 149, 1, 0, 0, 0, 8, 151, 1, 0, 0, 0, 10, 164, 1, 0, 0, 0, 12, 172, 1, 0, 0, 0, 14, 177, 1, 0, 0, 0, 16, 181, 1, 0, 0, 0, 18, 193, 1, 0, 0, 0, 20, 201, 1, 0, 0, 0, 22, 209, 1, 0, 0, 0, 24, 229, 1, 0, 0, 0, 26, 270, 1, 0, 0, 0, 28, 310, 1, 0, 0, 0, 30, 375, 1, 0, 0, 0, 32, 417, 1, 0, 0, 0, 34, 419, 1, 0, 0, 0, 36, 422, 1, 0, 0, 0, 38, 425, 1, 0, 0, 0, 40, 441, 1, 0, 0, 0, 42, 443, 1, 0, 0, 0, 44, 449, 1, 0, 0, 0, 46, 471, 1, 0, 0, 0, 48, 473, 1, 0, 0, 0, 50, 475, 1, 0, 0, 0, 52, 477, 1, 0, 0, 0, 54, 55, 3, 2, 1, 0, 55, 56, 5, 0, 0, 1, 56, 1, 1, 0, 0, 0, 57, 58, 3, 4, 2, 0, 58, 3, 1, 0, 0, 0, 59, 61, 3, 6, 3, 0, 60, 59, 1, 0, 0, 0, 61, 64, 1, 0, 0, 0, 62, 60, 1, 0, 0, 0, 62, 63, 1, 0, 0, 0, 63, 66, 1, 0, 0, 0, 64, 62, 1, 0, 0, 0, 65, 67, 3, 12, 6, 0, 66, 65, 1, 0, 0, 0, 66, 67, 1, 0, 0, 0, 67, 5, 1, 0, 0, 0, 68, 150, 5, 1, 0, 0, 69, 70, 3, 18, 9, 0, 70, 71, 5, 2, 0, 0, 71, 72, 3, 22, 11, 0, 72, 150, 1, 0, 0, 0, 73, 150, 3, 30, 15, 0, 74, 150, 3, 14, 7, 0, 75, 150, 5, 3, 0, 0, 76, 77, 5, 4, 0, 0, 77, 150, 5, 57, 0, 0, 78, 79, 5, 5, 0, 0, 79, 80, 3, 4, 2, 0, 80, 81, 5, 6, 0, 0, 81, 150, 1, 0, 0, 0, 82, 83, 5, 7, 0, 0, 83, 84, 3, 24, 12, 0, 84, 85, 5, 5, 0, 0, 85, 86, 3, 4, 2, 0, 86, 87, 5, 6, 0, 0, 87, 150, 1, 0, 0, 0, 88, 89, 5, 8, 0, 0, 89, 90, 3, 4, 2, 0, 90, 91, 5, 9, 0, 0, 91, 92, 3, 24, 12, 0, 92, 150, 1, 0, 0, 0, 93, 94, 5, 10, 0, 0, 94, 95, 3, 24, 12, 0, 95, 96, 5, 11, 0, 0, 96, 104, 3, 4, 2, 0, 97, 98, 5, 12, 0, 0, 98, 99, 3, 24, 12, 0, 99, 100, 5, 11, 0, 0, 100, 101, 3, 4, 2, 0, 101, 103, 1, 0, 0, 0, 102, 97, 1, 0, 0, 0, 103, 106, 1, 0, 0, 0, 104, 102, 1, 0, 0, 0, 104, 105, 1, 0, 0, 0, 105, 109, 1, 0, 0, 0, 106, 104, 1, 0, 0, 0, 107, 108, 5, 13, 0, 0, 108, 110, 3, 4, 2, 0, 109, 107, 1, 0, 0, 0, 109, 110, 1, 0, 0, 0, 110, 111, 1, 0, 0, 0, 111, 112, 5, 6, 0, 0, 112, 150, 1, 0, 0, 0, 113, 114, 5, 14, 0, 0, 114, 115, 5, 57, 0, 0, 115, 116, 5, 2, 0, 0, 116, 117, 3, 24, 12, 0, 117, 118, 5, 15, 0, 0, 118, 121, 3, 24, 12, 0, 119, 120, 5, 15, 0, 0, 120, 122, 3, 24, 12, 0, 121, 119, 1, 0, 0, 0, 121, 122, 1, 0, 0, 0, 122, 123, 1, 0, 0, 0, 123, 124, 5, 5, 0, 0, 124, 125, 3, 4, 2, 0, 125, 126, 5, 6, 0, 0, 126, 150, 1, 0, 0, 0, 127, 128, 5, 14, 0, 0, 128, 129, 3, 20, 10, 0, 129, 130, 5, 16, 0, 0, 130, 131, 3, 22, 11, 0, 131, 132, 5, 5, 0, 0, 132, 133, 3, 4, 2, 0, 133, 134, 5, 6, 0, 0, 134, 150, 1, 0, 0, 0, 135, 136, 5, 17, 0, 0, 136, 137, 3, 16, 8, 0, 137, 138, 3, 38, 19, 0, 138, 150, 1, 0, 0, 0, 139, 140, 5, 18, 0, 0, 140, 141, 5, 17, 0, 0, 141, 142, 5, 57, 0, 0, 142, 150, 3, 38, 19, 0, 143, 144, 5, 18, 0, 0, 144, 147, 3, 8, 4, 0, 145, 146, 5, 2, 0, 0, 146, 148, 3, 22, 11, 0, 147, 145, 1, 0, 0, 0, 147, 148, 1, 0, 0, 0, 148, 150, 1, 0, 0, 0, 149, 68, 1, 0, 0, 0, 149, 69, 1, 0, 0, 0, 149, 73, 1, 0, 0, 0, 149, 74, 1, 0, 0, 0, 149, 75, 1, 0, 0, 0, 149, 76, 1, 0, 0, 0, 149, 78, 1, 0, 0, 0, 149, 82, 1, 0, 0, 0, 149, 88, 1, 0, 0, 0, 149, 93, 1, 0, 0, 0, 149, 113, 1, 0, 0, 0, 149, 127, 1, 0, 0, 0, 149, 135, 1, 0, 0, 0, 149, 139, 1, 0, 0, 0, 149, 143, 1, 0, 0, 0, 150, 7, 1, 0, 0, 0, 151, 152, 5, 57, 0, 0, 152, 158, 3, 10, 5, 0, 153, 154, 5, 15, 0, 0, 154, 155, 5, 57, 0, 0, 155, 157, 3, 10, 5, 0, 156, 153, 1, 0, 0, 0, 157, 160, 1, 0, 0, 0, 158, 156, 1, 0, 0, 0, 158, 159, 1, 0, 0, 0, 159, 9, 1, 0, 0, 0, 160, 158, 1, 0, 0, 0, 161, 162, 5, 19, 0, 0, 162, 163, 5, 57, 0, 0, 163, 165, 5, 20, 0, 0, 164, 161, 1, 0, 0, 0, 164, 165, 1, 0, 0, 0, 165, 11, 1, 0, 0, 0, 166, 168, 5, 21, 0, 0, 167, 169, 3, 22, 11, 0, 168, 167, 1, 0, 0, 0, 168, 169, 1, 0, 0, 0, 169, 173, 1, 0, 0, 0, 170, 173, 5, 3, 0, 0, 171, 173, 5, 22, 0, 0, 172, 166, 1, 0, 0, 0, 172, 170, 1, 0, 0, 0, 172, 171, 1, 0, 0, 0, 173, 175, 1, 0, 0, 0, 174, 176, 5, 1, 0, 0, 175, 174, 1, 0, 0, 0, 175, 176, 1, 0, 0, 0, 176, 13, 1, 0, 0, 0, 177, 178, 5, 23, 0, 0, 178, 179, 5, 57, 0, 0, 179, 180, 5, 23, 0, 0, 180, 15, 1, 0, 0, 0, 181, 186, 5, 57, 0, 0, 182, 183, 5, 27, 0, 0, 183, 185, 5, 57, 0, 0, 184, 182, 1, 0, 0, 0, 185, 188, 1, 0, 0, 0, 186, 184, 1, 0, 0, 0, 186, 187, 1, 0, 0, 0, 187, 191, 1, 0, 0, 0, 188, 186, 1, 0, 0, 0, 189, 190, 5, 39, 0, 0, 190, 192, 5, 57, 0, 0, 191, 189, 1, 0, 0, 0, 191, 192, 1, 0, 0, 0, 192, 17, 1, 0, 0, 0, 193, 198, 3, 26, 13, 0, 194, 195, 5, 15, 0, 0, 195, 197, 3, 26, 13, 0, 196, 194, 1, 0, 0, 0, 197, 200, 1, 0, 0, 0, 198, 196, 1, 0, 0, 0, 198, 199, 1, 0, 0, 0, 199, 19, 1, 0, 0, 0, 200, 198, 1, 0, 0, 0, 201, 206, 5, 57, 0, 0, 202, 203, 5, 15, 0, 0, 203, 205, 5, 57, 0, 0, 204, 202, 1, 0, 0, 0, 205, 208, 1, 0, 0, 0, 206, 204, 1, 0, 0, 0, 206, 207, 1, 0, 0, 0, 207, 21, 1, 0, 0, 0, 208, 206, 1, 0, 0, 0, 209, 214, 3, 24, 12, 0, 210, 211, 5, 15, 0, 0, 211, 213, 3, 24, 12, 0, 212, 210, 1, 0, 0, 0, 213, 216, 1, 0, 0, 0, 214, 212, 1, 0, 0, 0, 214, 215, 1, 0, 0, 0, 215, 23, 1, 0, 0, 0, 216, 214, 1, 0, 0, 0, 217, 218, 6, 12, -1, 0, 218, 230, 5, 24, 0, 0, 219, 230, 5, 25, 0, 0, 220, 230, 5, 26, 0, 0, 221, 230, 3, 50, 25, 0, 222, 230, 3, 52, 26, 0, 223, 230, 5, 55, 0, 0, 224, 230, 3, 34, 17, 0, 225, 230, 3, 28, 14, 0, 226, 230, 3, 42, 21, 0, 227, 228, 7, 0, 0, 0, 228, 230, 3, 24, 12, 8, 229, 217, 1, 0, 0, 0, 229, 219, 1, 0, 0, 0, 229, 220, 1, 0, 0, 0, 229, 221, 1, 0, 0, 0, 229, 222, 1, 0, 0, 0, 229, 223, 1, 0, 0, 0, 229, 224, 1, 0, 0, 0, 229, 225, 1, 0, 0, 0, 229, 226, 1, 0, 0, 0, 229, 227, 1, 0, 0, 0, 230, 257, 1, 0, 0, 0, 231, 232, 10, 9, 0, 0, 232, 233, 5, 53, 0, 0, 233, 256, 3, 24, 12, 9, 234, 235, 10, 7, 0, 0, 235, 236, 7, 1, 0, 0, 236, 256, 3, 24, 12, 8, 237, 238, 10, 6, 0, 0, 238, 239, 7, 2, 0, 0, 239, 256, 3, 24, 12, 7, 240, 241, 10, 5, 0, 0, 241, 242, 5, 51, 0, 0, 242, 256, 3, 24, 12, 5, 243, 244, 10, 4, 0, 0, 244, 245, 7, 3, 0, 0, 245, 256, 3, 24, 12, 5, 246, 247, 10, 3, 0, 0, 247, 248, 5, 42, 0, 0, 248, 256, 3, 24, 12, 4, 249, 250, 10, 2, 0, 0, 250, 251, 5, 43, 0, 0, 251, 256, 3, 24, 12, 3, 252, 253, 10, 1, 0, 0, 253, 254, 7, 4, 0, 0, 254, 256, 3, 24, 12, 2, 255, 231, 1, 0, 0, 0, 255, 234, 1, 0, 0, 0, 255, 237, 1, 0, 0, 0, 255, 240, 1, 0, 0, 0, 255, 243, 1, 0, 0, 0, 255, 246, 1, 0, 0, 0, 255, 249, 1, 0, 0, 0, 255, 252, 1, 0, 0, 0, 256, 259, 1, 0, 0, 0, 257, 255, 1, 0, 0, 0, 257, 258, 1, 0, 0, 0, 258, 25, 1, 0, 0, 0, 259, 257, 1, 0, 0, 0, 260, 271, 5, 57, 0, 0, 261, 268, 3, 28, 14, 0, 262, 263, 5, 48, 0, 0, 263, 264, 3, 24, 12, 0, 264, 265, 5, 49, 0, 0, 265, 269, 1, 0, 0, 0, 266, 267, 5, 27, 0, 0, 267, 269, 5, 57, 0, 0, 268, 262, 1, 0, 0, 0, 268, 266, 1, 0, 0, 0, 269, 271, 1, 0, 0, 0, 270, 260, 1, 0, 0, 0, 270, 261, 1, 0, 0, 0, 271, 27, 1, 0, 0, 0, 272, 281, 5, 57, 0, 0, 273, 274, 5, 48, 0, 0, 274, 275, 3, 24, 12, 0, 275, 276, 5, 49, 0, 0, 276, 280, 1, 0, 0, 0, 277, 278, 5, 27, 0, 0, 278, 280, 5, 57, 0, 0, 279, 273, 1, 0, 0, 0, 279, 277, 1, 0, 0, 0, 280, 283, 1, 0, 0, 0, 281, 279, 1, 0, 0, 0, 281, 282, 1, 0, 0, 0, 282, 311, 1, 0, 0, 0, 283, 281, 1, 0, 0, 0, 284, 293, 3, 30, 15, 0, 285, 286, 5, 48, 0, 0, 286, 287, 3, 24, 12, 0, 287, 288, 5, 49, 0, 0, 288, 292, 1, 0, 0, 0, 289, 290, 5, 27, 0, 0, 290, 292, 5, 57, 0, 0, 291, 285, 1, 0, 0, 0, 291, 289, 1, 0, 0, 0, 292, 295, 1, 0, 0, 0, 293, 291, 1, 0, 0, 0, 293, 294, 1, 0, 0, 0, 294, 311, 1, 0, 0, 0, 295, 293, 1, 0, 0, 0, 296, 297, 5, 31, 0, 0, 297, 298, 3, 24, 12, 0, 298, 307, 5, 32, 0, 0, 299, 300, 5, 48, 0, 0, 300, 301, 3, 24, 12, 0, 301, 302, 5, 49, 0, 0, 302, 306, 1, 0, 0, 0, 303, 304, 5, 27, 0, 0, 304, 306, 5, 57, 0, 0, 305, 299, 1, 0, 0, 0, 305, 303, 1, 0, 0, 0, 306, 309, 1, 0, 0, 0, 307, 305, 1, 0, 0, 0, 307, 308, 1, 0, 0, 0, 308, 311, 1, 0, 0, 0, 309, 307, 1, 0, 0, 0, 310, 272, 1, 0, 0, 0, 310, 284, 1, 0, 0, 0, 310, 296, 1, 0, 0, 0, 311, 29, 1, 0, 0, 0, 312, 313, 6, 15, -1, 0, 313, 322, 5, 57, 0, 0, 314, 315, 5, 48, 0, 0, 315, 316, 3, 24, 12, 0, 316, 317, 5, 49, 0, 0, 317, 321, 1, 0, 0, 0, 318, 319, 5, 27, 0, 0, 319, 321, 5, 57, 0, 0, 320, 314, 1, 0, 0, 0, 320, 318, 1, 0, 0, 0, 321, 324, 1, 0, 0, 0, 322, 320, 1, 0, 0, 0, 322, 323, 1, 0, 0, 0, 323, 325, 1, 0, 0, 0, 324, 322, 1, 0, 0, 0, 325, 376, 3, 32, 16, 0, 326, 327, 5, 31, 0, 0, 327, 328, 3, 24, 12, 0, 328, 337, 5, 32, 0, 0, 329, 330, 5, 48, 0, 0, 330, 331, 3, 24, 12, 0, 331, 332, 5, 49, 0, 0, 332, 336, 1, 0, 0, 0, 333, 334, 5, 27, 0, 0, 334, 336, 5, 57, 0, 0, 335, 329, 1, 0, 0, 0, 335, 333, 1, 0, 0, 0, 336, 339, 1, 0, 0, 0, 337, 335, 1, 0, 0, 0, 337, 338, 1, 0, 0, 0, 338, 340, 1, 0, 0, 0, 339, 337, 1, 0, 0, 0, 340, 341, 3, 32, 16, 0, 341, 376, 1, 0, 0, 0, 342, 351, 5, 57, 0, 0, 343, 344, 5, 48, 0, 0, 344, 345, 3, 24, 12, 0, 345, 346, 5, 49, 0, 0, 346, 350, 1, 0, 0, 0, 347, 348, 5, 27, 0, 0, 348, 350, 5, 57, 0, 0, 349, 343, 1, 0, 0, 0, 349, 347, 1, 0, 0, 0, 350, 353, 1, 0, 0, 0, 351, 349, 1, 0, 0, 0, 351, 352, 1, 0, 0, 0, 352, 354, 1, 0, 0, 0, 353, 351, 1, 0, 0, 0, 354, 355, 5, 39, 0, 0, 355, 356, 5, 57, 0, 0, 356, 376, 3, 32, 16, 0, 357, 358, 5, 31, 0, 0, 358, 359, 3, 24, 12, 0, 359, 368, 5, 32, 0, 0, 360, 361, 5, 48, 0, 0, 361, 362, 3, 24, 12, 0, 362, 363, 5, 49, 0, 0, 363, 367, 1, 0, 0, 0, 364, 365, 5, 27, 0, 0, 365, 367, 5, 57, 0, 0, 366, 360, 1, 0, 0, 0, 366, 364, 1, 0, 0, 0, 367, 370, 1, 0, 0, 0, 368, 366, 1, 0, 0, 0, 368, 369, 1, 0, 0, 0, 369, 371, 1, 0, 0, 0, 370, 368, 1, 0, 0, 0, 371, 372, 5, 39, 0, 0, 372, 373, 5, 57, 0, 0, 373, 374, 3, 32, 16, 0, 374, 376, 1, 0, 0, 0, 375, 312, 1, 0, 0, 0, 375, 326, 1, 0, 0, 0, 375, 342, 1, 0, 0, 0, 375, 357, 1, 0, 0, 0, 376, 407, 1, 0, 0, 0, 377, 386, 10, 5, 0, 0, 378, 379, 5, 48, 0, 0, 379, 380, 3, 24, 12, 0, 380, 381, 5, 49, 0, 0, 381, 385, 1, 0, 0, 0, 382, 383, 5, 27, 0, 0, 383, 385, 5, 57, 0, 0, 384, 378, 1, 0, 0, 0, 384, 382, 1, 0, 0, 0, 385, 388, 1, 0, 0, 0, 386, 384, 1, 0, 0, 0, 386, 387, 1, 0, 0, 0, 387, 389, 1, 0, 0, 0, 388, 386, 1, 0, 0, 0, 389, 406, 3, 32, 16, 0, 390, 399, 10, 2, 0, 0, 391, 392, 5, 48, 0, 0, 392, 393, 3, 24, 12, 0, 393, 394, 5, 49, 0, 0, 394, 398, 1, 0, 0, 0, 395, 396, 5, 27, 0, 0, 396, 398, 5, 57, 0, 0, 397, 391, 1, 0, 0, 0, 397, 395, 1, 0, 0, 0, 398, 401, 1, 0, 0, 0, 399, 397, 1, 0, 0, 0, 399, 400, 1, 0, 0, 0, 400, 402, 1, 0, 0, 0, 401, 399, 1, 0, 0, 0, 402, 403, 5, 39, 0, 0, 403, 404, 5, 57, 0, 0, 404, 406, 3, 32, 16, 0, 405, 377, 1, 0, 0, 0, 405, 390, 1, 0, 0, 0, 406, 409, 1, 0, 0, 0, 407, 405, 1, 0, 0, 0, 407, 408, 1, 0, 0, 0, 408, 31, 1, 0, 0, 0, 409, 407, 1, 0, 0, 0, 410, 412, 5, 31, 0, 0, 411, 413, 3, 22, 11, 0, 412, 411, 1, 0, 0, 0, 412, 413, 1, 0, 0, 0, 413, 414, 1, 0, 0, 0, 414, 418, 5, 32, 0, 0, 415, 418, 3, 42, 21, 0, 416, 418, 3, 52, 26, 0, 417, 410, 1, 0, 0, 0, 417, 415, 1, 0, 0, 0, 417, 416, 1, 0, 0, 0, 418, 33, 1, 0, 0, 0, 419, 420, 5, 17, 0, 0, 420, 421, 3, 38, 19, 0, 421, 35, 1, 0, 0, 0, 422, 423, 5, 39, 0, 0, 423, 424, 7, 5, 0, 0, 424, 37, 1, 0, 0, 0, 425, 426, 5, 31, 0, 0, 426, 427, 3, 40, 20, 0, 427, 429, 5, 32, 0, 0, 428, 430, 3, 36, 18, 0, 429, 428, 1, 0, 0, 0, 429, 430, 1, 0, 0, 0, 430, 431, 1, 0, 0, 0, 431, 432, 3, 4, 2, 0, 432, 433, 5, 6, 0, 0, 433, 39, 1, 0, 0, 0, 434, 437, 3, 20, 10, 0, 435, 436, 5, 15, 0, 0, 436, 438, 5, 55, 0, 0, 437, 435, 1, 0, 0, 0, 437, 438, 1, 0, 0, 0, 438, 442, 1, 0, 0, 0, 439, 442, 5, 55, 0, 0, 440, 442, 1, 0, 0, 0, 441, 434, 1, 0, 0, 0, 441, 439, 1, 0, 0, 0, 441, 440, 1, 0, 0, 0, 442, 41, 1, 0, 0, 0, 443, 445, 5, 46, 0, 0, 444, 446, 3, 44, 22, 0, 445, 444, 1, 0, 0, 0, 445, 446, 1, 0, 0, 0, 446, 447, 1, 0, 0, 0, 447, 448, 5, 47, 0, 0, 448, 43, 1, 0, 0, 0, 449, 455, 3, 46, 23, 0, 450, 451, 3, 48, 24, 0, 451, 452, 3, 46, 23, 0, 452, 454, 1, 0, 0, 0, 453, 450, 1, 0, 0, 0, 454, 457, 1, 0, 0, 0, 455, 453, 1, 0, 0, 0, 455, 456, 1, 0, 0, 0, 456, 459, 1, 0, 0, 0, 457, 455, 1, 0, 0, 0, 458, 460, 3, 48, 24, 0, 459, 458, 1, 0, 0, 0, 459, 460, 1, 0, 0, 0, 460, 45, 1, 0, 0, 0, 461, 462, 5, 48, 0, 0, 462, 463, 3, 24, 12, 0, 463, 464, 5, 49, 0, 0, 464, 465, 5, 2, 0, 0, 465, 466, 3, 24, 12, 0, 466, 472, 1, 0, 0, 0, 467, 468, 5, 57, 0, 0, 468, 469, 5, 2, 0, 0, 469, 472, 3, 24, 12, 0, 470, 472, 3, 24, 12, 0, 471, 461, 1, 0, 0, 0, 471, 467, 1, 0, 0, 0, 471, 470, 1, 0, 0, 0, 472, 47, 1, 0, 0, 0, 473, 474, 7, 6, 0, 0, 474, 49, 1, 0, 0, 0, 475, 476, 7, 7, 0, 0, 476, 51, 1, 0, 0, 0, 477, 478, 7, 8, 0, 0, 478, 53, 1, 0, 0, 0, 53, 62, 66, 104, 109, 121, 147, 149, 158, 164, 168, 172, 175, 186, 191, 198, 206, 214, 229, 255, 257, 268, 270, 279, 281, 291, 293, 305, 307, 310, 320, 322, 335, 337, 349, 351, 366, 368, 375, 384, 386, 397, 399, 405, 407, 412, 417, 429, 437, 441, 445, 455, 459, 471];
const atn = new _antlr.default.atn.ATNDeserializer().deserialize(serializedATN);
const decisionsToDFA = atn.decisionToState.map((ds, index) => new _antlr.default.dfa.DFA(ds, index));
const sharedContextCache = new _antlr.default.atn.PredictionContextCache();
class LuaParser extends _antlr.default.Parser {
  static grammarFileName = "LuaParser.g4";
  static literalNames = [null, "';'", "'='", "'break'", "'goto'", "'do'", "'end'", "'while'", "'repeat'", "'until'", "'if'", "'then'", "'elseif'", "'else'", "'for'", "','", "'in'", "'function'", "'local'", "'<'", "'>'", "'return'", "'continue'", "'::'", "'nil'", "'false'", "'true'", "'.'", "'~'", "'-'", "'#'", "'('", "')'", "'not'", "'<<'", "'>>'", "'&'", "'//'", "'%'", "':'", "'<='", "'>='", "'and'", "'or'", "'+'", "'*'", "'{'", "'}'", "'['", "']'", "'=='", "'..'", "'|'", "'^'", "'/'", "'...'", "'~='", null, null, null, null, null, null, null, null, null, null, null, null, "'string'", "'number'", "'boolean'"];
  static symbolicNames = [null, "SEMI", "EQ", "BREAK", "GOTO", "DO", "END", "WHILE", "REPEAT", "UNTIL", "IF", "THEN", "ELSEIF", "ELSE", "FOR", "COMMA", "IN", "FUNCTION", "LOCAL", "LT", "GT", "RETURN", "CONTINUE", "CC", "NIL", "FALSE", "TRUE", "DOT", "SQUIG", "MINUS", "POUND", "OP", "CP", "NOT", "LL", "GG", "AMP", "SS", "PER", "COL", "LE", "GE", "AND", "OR", "PLUS", "STAR", "OCU", "CCU", "OB", "CB", "EE", "DD", "PIPE", "CARET", "SLASH", "DDD", "SQEQ", "NAME", "NORMALSTRING", "CHARSTRING", "LONGSTRING", "INT", "HEX", "FLOAT", "HEX_FLOAT", "COMMENT", "WS", "NL", "SHEBANG", "STRINGTYPE", "NUMBERTYPE", "BOOLEANTYPE"];
  static ruleNames = ["start_", "chunk", "block", "statement", "attnamelist", "attrib", "retstatement", "label", "funcname", "varlist", "namelist", "explist", "exp", "var", "prefixexp", "functioncall", "args", "functiondef", "returntype", "funcbody", "parlist", "tableconstructor", "fieldlist", "field", "fieldsep", "number", "string"];
  constructor(input) {
    super(input);
    this._interp = new _antlr.default.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = LuaParser.ruleNames;
    this.literalNames = LuaParser.literalNames;
    this.symbolicNames = LuaParser.symbolicNames;
  }
  sempred(localctx, ruleIndex, predIndex) {
    switch (ruleIndex) {
      case 12:
        return this.exp_sempred(localctx, predIndex);
      case 15:
        return this.functioncall_sempred(localctx, predIndex);
      default:
        throw "No predicate with index:" + ruleIndex;
    }
  }
  exp_sempred(localctx, predIndex) {
    switch (predIndex) {
      case 0:
        return this.precpred(this._ctx, 9);
      case 1:
        return this.precpred(this._ctx, 7);
      case 2:
        return this.precpred(this._ctx, 6);
      case 3:
        return this.precpred(this._ctx, 5);
      case 4:
        return this.precpred(this._ctx, 4);
      case 5:
        return this.precpred(this._ctx, 3);
      case 6:
        return this.precpred(this._ctx, 2);
      case 7:
        return this.precpred(this._ctx, 1);
      default:
        throw "No predicate with index:" + predIndex;
    }
  }
  functioncall_sempred(localctx, predIndex) {
    switch (predIndex) {
      case 8:
        return this.precpred(this._ctx, 5);
      case 9:
        return this.precpred(this._ctx, 2);
      default:
        throw "No predicate with index:" + predIndex;
    }
  }
  start_() {
    let localctx = new Start_Context(this, this._ctx, this.state);
    this.enterRule(localctx, 0, LuaParser.RULE_start_);
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 54;
      this.chunk();
      this.state = 55;
      this.match(LuaParser.EOF);
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
  chunk() {
    let localctx = new ChunkContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, LuaParser.RULE_chunk);
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 57;
      this.block();
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
    this.enterRule(localctx, 4, LuaParser.RULE_block);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 62;
      this._errHandler.sync(this);
      var _alt = this._interp.adaptivePredict(this._input, 0, this._ctx);
      while (_alt != 2 && _alt != _antlr.default.atn.ATN.INVALID_ALT_NUMBER) {
        if (_alt === 1) {
          this.state = 59;
          this.statement();
        }
        this.state = 64;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 0, this._ctx);
      }
      this.state = 66;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if ((_la & ~0x1f) === 0 && (1 << _la & 6291464) !== 0) {
        this.state = 65;
        this.retstatement();
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
    this.enterRule(localctx, 6, LuaParser.RULE_statement);
    var _la = 0;
    try {
      this.state = 149;
      this._errHandler.sync(this);
      var la_ = this._interp.adaptivePredict(this._input, 6, this._ctx);
      switch (la_) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          this.state = 68;
          this.match(LuaParser.SEMI);
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          this.state = 69;
          this.varlist();
          this.state = 70;
          this.match(LuaParser.EQ);
          this.state = 71;
          this.explist();
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          this.state = 73;
          this.functioncall(0);
          break;
        case 4:
          this.enterOuterAlt(localctx, 4);
          this.state = 74;
          this.label();
          break;
        case 5:
          this.enterOuterAlt(localctx, 5);
          this.state = 75;
          this.match(LuaParser.BREAK);
          break;
        case 6:
          this.enterOuterAlt(localctx, 6);
          this.state = 76;
          this.match(LuaParser.GOTO);
          this.state = 77;
          this.match(LuaParser.NAME);
          break;
        case 7:
          this.enterOuterAlt(localctx, 7);
          this.state = 78;
          this.match(LuaParser.DO);
          this.state = 79;
          this.block();
          this.state = 80;
          this.match(LuaParser.END);
          break;
        case 8:
          this.enterOuterAlt(localctx, 8);
          this.state = 82;
          this.match(LuaParser.WHILE);
          this.state = 83;
          this.exp(0);
          this.state = 84;
          this.match(LuaParser.DO);
          this.state = 85;
          this.block();
          this.state = 86;
          this.match(LuaParser.END);
          break;
        case 9:
          this.enterOuterAlt(localctx, 9);
          this.state = 88;
          this.match(LuaParser.REPEAT);
          this.state = 89;
          this.block();
          this.state = 90;
          this.match(LuaParser.UNTIL);
          this.state = 91;
          this.exp(0);
          break;
        case 10:
          this.enterOuterAlt(localctx, 10);
          this.state = 93;
          this.match(LuaParser.IF);
          this.state = 94;
          this.exp(0);
          this.state = 95;
          this.match(LuaParser.THEN);
          this.state = 96;
          this.block();
          this.state = 104;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          while (_la === 12) {
            this.state = 97;
            this.match(LuaParser.ELSEIF);
            this.state = 98;
            this.exp(0);
            this.state = 99;
            this.match(LuaParser.THEN);
            this.state = 100;
            this.block();
            this.state = 106;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
          }
          this.state = 109;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if (_la === 13) {
            this.state = 107;
            this.match(LuaParser.ELSE);
            this.state = 108;
            this.block();
          }
          this.state = 111;
          this.match(LuaParser.END);
          break;
        case 11:
          this.enterOuterAlt(localctx, 11);
          this.state = 113;
          this.match(LuaParser.FOR);
          this.state = 114;
          this.match(LuaParser.NAME);
          this.state = 115;
          this.match(LuaParser.EQ);
          this.state = 116;
          this.exp(0);
          this.state = 117;
          this.match(LuaParser.COMMA);
          this.state = 118;
          this.exp(0);
          this.state = 121;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if (_la === 15) {
            this.state = 119;
            this.match(LuaParser.COMMA);
            this.state = 120;
            this.exp(0);
          }
          this.state = 123;
          this.match(LuaParser.DO);
          this.state = 124;
          this.block();
          this.state = 125;
          this.match(LuaParser.END);
          break;
        case 12:
          this.enterOuterAlt(localctx, 12);
          this.state = 127;
          this.match(LuaParser.FOR);
          this.state = 128;
          this.namelist();
          this.state = 129;
          this.match(LuaParser.IN);
          this.state = 130;
          this.explist();
          this.state = 131;
          this.match(LuaParser.DO);
          this.state = 132;
          this.block();
          this.state = 133;
          this.match(LuaParser.END);
          break;
        case 13:
          this.enterOuterAlt(localctx, 13);
          this.state = 135;
          this.match(LuaParser.FUNCTION);
          this.state = 136;
          this.funcname();
          this.state = 137;
          this.funcbody();
          break;
        case 14:
          this.enterOuterAlt(localctx, 14);
          this.state = 139;
          this.match(LuaParser.LOCAL);
          this.state = 140;
          this.match(LuaParser.FUNCTION);
          this.state = 141;
          this.match(LuaParser.NAME);
          this.state = 142;
          this.funcbody();
          break;
        case 15:
          this.enterOuterAlt(localctx, 15);
          this.state = 143;
          this.match(LuaParser.LOCAL);
          this.state = 144;
          this.attnamelist();
          this.state = 147;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if (_la === 2) {
            this.state = 145;
            this.match(LuaParser.EQ);
            this.state = 146;
            this.explist();
          }
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
  attnamelist() {
    let localctx = new AttnamelistContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, LuaParser.RULE_attnamelist);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 151;
      this.match(LuaParser.NAME);
      this.state = 152;
      this.attrib();
      this.state = 158;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      while (_la === 15) {
        this.state = 153;
        this.match(LuaParser.COMMA);
        this.state = 154;
        this.match(LuaParser.NAME);
        this.state = 155;
        this.attrib();
        this.state = 160;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
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
  attrib() {
    let localctx = new AttribContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, LuaParser.RULE_attrib);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 164;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if (_la === 19) {
        this.state = 161;
        this.match(LuaParser.LT);
        this.state = 162;
        this.match(LuaParser.NAME);
        this.state = 163;
        this.match(LuaParser.GT);
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
  retstatement() {
    let localctx = new RetstatementContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, LuaParser.RULE_retstatement);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 172;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 21:
          this.state = 166;
          this.match(LuaParser.RETURN);
          this.state = 168;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if ((_la & ~0x1f) === 0 && (1 << _la & 4144103424) !== 0 || (_la - 33 & ~0x1f) === 0 && (1 << _la - 33 & 4282392577) !== 0) {
            this.state = 167;
            this.explist();
          }
          break;
        case 3:
          this.state = 170;
          this.match(LuaParser.BREAK);
          break;
        case 22:
          this.state = 171;
          this.match(LuaParser.CONTINUE);
          break;
        default:
          throw new _antlr.default.error.NoViableAltException(this);
      }
      this.state = 175;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if (_la === 1) {
        this.state = 174;
        this.match(LuaParser.SEMI);
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
  label() {
    let localctx = new LabelContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, LuaParser.RULE_label);
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 177;
      this.match(LuaParser.CC);
      this.state = 178;
      this.match(LuaParser.NAME);
      this.state = 179;
      this.match(LuaParser.CC);
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
  funcname() {
    let localctx = new FuncnameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, LuaParser.RULE_funcname);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 181;
      this.match(LuaParser.NAME);
      this.state = 186;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      while (_la === 27) {
        this.state = 182;
        this.match(LuaParser.DOT);
        this.state = 183;
        this.match(LuaParser.NAME);
        this.state = 188;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
      }
      this.state = 191;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if (_la === 39) {
        this.state = 189;
        this.match(LuaParser.COL);
        this.state = 190;
        this.match(LuaParser.NAME);
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
  varlist() {
    let localctx = new VarlistContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, LuaParser.RULE_varlist);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 193;
      this.var_();
      this.state = 198;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      while (_la === 15) {
        this.state = 194;
        this.match(LuaParser.COMMA);
        this.state = 195;
        this.var_();
        this.state = 200;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
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
  namelist() {
    let localctx = new NamelistContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, LuaParser.RULE_namelist);
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 201;
      this.match(LuaParser.NAME);
      this.state = 206;
      this._errHandler.sync(this);
      var _alt = this._interp.adaptivePredict(this._input, 15, this._ctx);
      while (_alt != 2 && _alt != _antlr.default.atn.ATN.INVALID_ALT_NUMBER) {
        if (_alt === 1) {
          this.state = 202;
          this.match(LuaParser.COMMA);
          this.state = 203;
          this.match(LuaParser.NAME);
        }
        this.state = 208;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 15, this._ctx);
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
  explist() {
    let localctx = new ExplistContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, LuaParser.RULE_explist);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 209;
      this.exp(0);
      this.state = 214;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      while (_la === 15) {
        this.state = 210;
        this.match(LuaParser.COMMA);
        this.state = 211;
        this.exp(0);
        this.state = 216;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
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
  exp(_p) {
    if (_p === undefined) {
      _p = 0;
    }
    const _parentctx = this._ctx;
    const _parentState = this.state;
    let localctx = new ExpContext(this, this._ctx, _parentState);
    let _prevctx = localctx;
    const _startState = 24;
    this.enterRecursionRule(localctx, 24, LuaParser.RULE_exp, _p);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 229;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 24:
          this.state = 218;
          this.match(LuaParser.NIL);
          break;
        case 25:
          this.state = 219;
          this.match(LuaParser.FALSE);
          break;
        case 26:
          this.state = 220;
          this.match(LuaParser.TRUE);
          break;
        case 61:
        case 62:
        case 63:
        case 64:
          this.state = 221;
          this.number();
          break;
        case 58:
        case 59:
        case 60:
          this.state = 222;
          this.string();
          break;
        case 55:
          this.state = 223;
          this.match(LuaParser.DDD);
          break;
        case 17:
          this.state = 224;
          this.functiondef();
          break;
        case 31:
        case 57:
          this.state = 225;
          this.prefixexp();
          break;
        case 46:
          this.state = 226;
          this.tableconstructor();
          break;
        case 28:
        case 29:
        case 30:
        case 33:
          this.state = 227;
          _la = this._input.LA(1);
          if (!((_la - 28 & ~0x1f) === 0 && (1 << _la - 28 & 39) !== 0)) {
            this._errHandler.recoverInline(this);
          } else {
            this._errHandler.reportMatch(this);
            this.consume();
          }
          this.state = 228;
          this.exp(8);
          break;
        default:
          throw new _antlr.default.error.NoViableAltException(this);
      }
      this._ctx.stop = this._input.LT(-1);
      this.state = 257;
      this._errHandler.sync(this);
      var _alt = this._interp.adaptivePredict(this._input, 19, this._ctx);
      while (_alt != 2 && _alt != _antlr.default.atn.ATN.INVALID_ALT_NUMBER) {
        if (_alt === 1) {
          if (this._parseListeners !== null) {
            this.triggerExitRuleEvent();
          }
          _prevctx = localctx;
          this.state = 255;
          this._errHandler.sync(this);
          var la_ = this._interp.adaptivePredict(this._input, 18, this._ctx);
          switch (la_) {
            case 1:
              localctx = new ExpContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, LuaParser.RULE_exp);
              this.state = 231;
              if (!this.precpred(this._ctx, 9)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 9)");
              }
              this.state = 232;
              this.match(LuaParser.CARET);
              this.state = 233;
              this.exp(9);
              break;
            case 2:
              localctx = new ExpContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, LuaParser.RULE_exp);
              this.state = 234;
              if (!this.precpred(this._ctx, 7)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 7)");
              }
              this.state = 235;
              _la = this._input.LA(1);
              if (!((_la - 37 & ~0x1f) === 0 && (1 << _la - 37 & 131331) !== 0)) {
                this._errHandler.recoverInline(this);
              } else {
                this._errHandler.reportMatch(this);
                this.consume();
              }
              this.state = 236;
              this.exp(8);
              break;
            case 3:
              localctx = new ExpContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, LuaParser.RULE_exp);
              this.state = 237;
              if (!this.precpred(this._ctx, 6)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
              }
              this.state = 238;
              _la = this._input.LA(1);
              if (!(_la === 29 || _la === 44)) {
                this._errHandler.recoverInline(this);
              } else {
                this._errHandler.reportMatch(this);
                this.consume();
              }
              this.state = 239;
              this.exp(7);
              break;
            case 4:
              localctx = new ExpContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, LuaParser.RULE_exp);
              this.state = 240;
              if (!this.precpred(this._ctx, 5)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
              }
              this.state = 241;
              this.match(LuaParser.DD);
              this.state = 242;
              this.exp(5);
              break;
            case 5:
              localctx = new ExpContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, LuaParser.RULE_exp);
              this.state = 243;
              if (!this.precpred(this._ctx, 4)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
              }
              this.state = 244;
              _la = this._input.LA(1);
              if (!(_la === 19 || _la === 20 || (_la - 40 & ~0x1f) === 0 && (1 << _la - 40 & 66563) !== 0)) {
                this._errHandler.recoverInline(this);
              } else {
                this._errHandler.reportMatch(this);
                this.consume();
              }
              this.state = 245;
              this.exp(5);
              break;
            case 6:
              localctx = new ExpContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, LuaParser.RULE_exp);
              this.state = 246;
              if (!this.precpred(this._ctx, 3)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
              }
              this.state = 247;
              this.match(LuaParser.AND);
              this.state = 248;
              this.exp(4);
              break;
            case 7:
              localctx = new ExpContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, LuaParser.RULE_exp);
              this.state = 249;
              if (!this.precpred(this._ctx, 2)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
              }
              this.state = 250;
              this.match(LuaParser.OR);
              this.state = 251;
              this.exp(3);
              break;
            case 8:
              localctx = new ExpContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, LuaParser.RULE_exp);
              this.state = 252;
              if (!this.precpred(this._ctx, 1)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
              }
              this.state = 253;
              _la = this._input.LA(1);
              if (!((_la - 28 & ~0x1f) === 0 && (1 << _la - 28 & 16777665) !== 0)) {
                this._errHandler.recoverInline(this);
              } else {
                this._errHandler.reportMatch(this);
                this.consume();
              }
              this.state = 254;
              this.exp(2);
              break;
          }
        }
        this.state = 259;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 19, this._ctx);
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
  var_() {
    let localctx = new VarContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, LuaParser.RULE_var);
    try {
      this.state = 270;
      this._errHandler.sync(this);
      var la_ = this._interp.adaptivePredict(this._input, 21, this._ctx);
      switch (la_) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          this.state = 260;
          this.match(LuaParser.NAME);
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          this.state = 261;
          this.prefixexp();
          this.state = 268;
          this._errHandler.sync(this);
          switch (this._input.LA(1)) {
            case 48:
              this.state = 262;
              this.match(LuaParser.OB);
              this.state = 263;
              this.exp(0);
              this.state = 264;
              this.match(LuaParser.CB);
              break;
            case 27:
              this.state = 266;
              this.match(LuaParser.DOT);
              this.state = 267;
              this.match(LuaParser.NAME);
              break;
            default:
              throw new _antlr.default.error.NoViableAltException(this);
          }
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
  prefixexp() {
    let localctx = new PrefixexpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, LuaParser.RULE_prefixexp);
    try {
      this.state = 310;
      this._errHandler.sync(this);
      var la_ = this._interp.adaptivePredict(this._input, 28, this._ctx);
      switch (la_) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          this.state = 272;
          this.match(LuaParser.NAME);
          this.state = 281;
          this._errHandler.sync(this);
          var _alt = this._interp.adaptivePredict(this._input, 23, this._ctx);
          while (_alt != 2 && _alt != _antlr.default.atn.ATN.INVALID_ALT_NUMBER) {
            if (_alt === 1) {
              this.state = 279;
              this._errHandler.sync(this);
              switch (this._input.LA(1)) {
                case 48:
                  this.state = 273;
                  this.match(LuaParser.OB);
                  this.state = 274;
                  this.exp(0);
                  this.state = 275;
                  this.match(LuaParser.CB);
                  break;
                case 27:
                  this.state = 277;
                  this.match(LuaParser.DOT);
                  this.state = 278;
                  this.match(LuaParser.NAME);
                  break;
                default:
                  throw new _antlr.default.error.NoViableAltException(this);
              }
            }
            this.state = 283;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input, 23, this._ctx);
          }
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          this.state = 284;
          this.functioncall(0);
          this.state = 293;
          this._errHandler.sync(this);
          var _alt = this._interp.adaptivePredict(this._input, 25, this._ctx);
          while (_alt != 2 && _alt != _antlr.default.atn.ATN.INVALID_ALT_NUMBER) {
            if (_alt === 1) {
              this.state = 291;
              this._errHandler.sync(this);
              switch (this._input.LA(1)) {
                case 48:
                  this.state = 285;
                  this.match(LuaParser.OB);
                  this.state = 286;
                  this.exp(0);
                  this.state = 287;
                  this.match(LuaParser.CB);
                  break;
                case 27:
                  this.state = 289;
                  this.match(LuaParser.DOT);
                  this.state = 290;
                  this.match(LuaParser.NAME);
                  break;
                default:
                  throw new _antlr.default.error.NoViableAltException(this);
              }
            }
            this.state = 295;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input, 25, this._ctx);
          }
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          this.state = 296;
          this.match(LuaParser.OP);
          this.state = 297;
          this.exp(0);
          this.state = 298;
          this.match(LuaParser.CP);
          this.state = 307;
          this._errHandler.sync(this);
          var _alt = this._interp.adaptivePredict(this._input, 27, this._ctx);
          while (_alt != 2 && _alt != _antlr.default.atn.ATN.INVALID_ALT_NUMBER) {
            if (_alt === 1) {
              this.state = 305;
              this._errHandler.sync(this);
              switch (this._input.LA(1)) {
                case 48:
                  this.state = 299;
                  this.match(LuaParser.OB);
                  this.state = 300;
                  this.exp(0);
                  this.state = 301;
                  this.match(LuaParser.CB);
                  break;
                case 27:
                  this.state = 303;
                  this.match(LuaParser.DOT);
                  this.state = 304;
                  this.match(LuaParser.NAME);
                  break;
                default:
                  throw new _antlr.default.error.NoViableAltException(this);
              }
            }
            this.state = 309;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input, 27, this._ctx);
          }
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
  functioncall(_p) {
    if (_p === undefined) {
      _p = 0;
    }
    const _parentctx = this._ctx;
    const _parentState = this.state;
    let localctx = new FunctioncallContext(this, this._ctx, _parentState);
    let _prevctx = localctx;
    const _startState = 30;
    this.enterRecursionRule(localctx, 30, LuaParser.RULE_functioncall, _p);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 375;
      this._errHandler.sync(this);
      var la_ = this._interp.adaptivePredict(this._input, 37, this._ctx);
      switch (la_) {
        case 1:
          this.state = 313;
          this.match(LuaParser.NAME);
          this.state = 322;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          while (_la === 27 || _la === 48) {
            this.state = 320;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
              case 48:
                this.state = 314;
                this.match(LuaParser.OB);
                this.state = 315;
                this.exp(0);
                this.state = 316;
                this.match(LuaParser.CB);
                break;
              case 27:
                this.state = 318;
                this.match(LuaParser.DOT);
                this.state = 319;
                this.match(LuaParser.NAME);
                break;
              default:
                throw new _antlr.default.error.NoViableAltException(this);
            }
            this.state = 324;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
          }
          this.state = 325;
          this.args();
          break;
        case 2:
          this.state = 326;
          this.match(LuaParser.OP);
          this.state = 327;
          this.exp(0);
          this.state = 328;
          this.match(LuaParser.CP);
          this.state = 337;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          while (_la === 27 || _la === 48) {
            this.state = 335;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
              case 48:
                this.state = 329;
                this.match(LuaParser.OB);
                this.state = 330;
                this.exp(0);
                this.state = 331;
                this.match(LuaParser.CB);
                break;
              case 27:
                this.state = 333;
                this.match(LuaParser.DOT);
                this.state = 334;
                this.match(LuaParser.NAME);
                break;
              default:
                throw new _antlr.default.error.NoViableAltException(this);
            }
            this.state = 339;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
          }
          this.state = 340;
          this.args();
          break;
        case 3:
          this.state = 342;
          this.match(LuaParser.NAME);
          this.state = 351;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          while (_la === 27 || _la === 48) {
            this.state = 349;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
              case 48:
                this.state = 343;
                this.match(LuaParser.OB);
                this.state = 344;
                this.exp(0);
                this.state = 345;
                this.match(LuaParser.CB);
                break;
              case 27:
                this.state = 347;
                this.match(LuaParser.DOT);
                this.state = 348;
                this.match(LuaParser.NAME);
                break;
              default:
                throw new _antlr.default.error.NoViableAltException(this);
            }
            this.state = 353;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
          }
          this.state = 354;
          this.match(LuaParser.COL);
          this.state = 355;
          this.match(LuaParser.NAME);
          this.state = 356;
          this.args();
          break;
        case 4:
          this.state = 357;
          this.match(LuaParser.OP);
          this.state = 358;
          this.exp(0);
          this.state = 359;
          this.match(LuaParser.CP);
          this.state = 368;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          while (_la === 27 || _la === 48) {
            this.state = 366;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
              case 48:
                this.state = 360;
                this.match(LuaParser.OB);
                this.state = 361;
                this.exp(0);
                this.state = 362;
                this.match(LuaParser.CB);
                break;
              case 27:
                this.state = 364;
                this.match(LuaParser.DOT);
                this.state = 365;
                this.match(LuaParser.NAME);
                break;
              default:
                throw new _antlr.default.error.NoViableAltException(this);
            }
            this.state = 370;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
          }
          this.state = 371;
          this.match(LuaParser.COL);
          this.state = 372;
          this.match(LuaParser.NAME);
          this.state = 373;
          this.args();
          break;
      }
      this._ctx.stop = this._input.LT(-1);
      this.state = 407;
      this._errHandler.sync(this);
      var _alt = this._interp.adaptivePredict(this._input, 43, this._ctx);
      while (_alt != 2 && _alt != _antlr.default.atn.ATN.INVALID_ALT_NUMBER) {
        if (_alt === 1) {
          if (this._parseListeners !== null) {
            this.triggerExitRuleEvent();
          }
          _prevctx = localctx;
          this.state = 405;
          this._errHandler.sync(this);
          var la_ = this._interp.adaptivePredict(this._input, 42, this._ctx);
          switch (la_) {
            case 1:
              localctx = new FunctioncallContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, LuaParser.RULE_functioncall);
              this.state = 377;
              if (!this.precpred(this._ctx, 5)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
              }
              this.state = 386;
              this._errHandler.sync(this);
              _la = this._input.LA(1);
              while (_la === 27 || _la === 48) {
                this.state = 384;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                  case 48:
                    this.state = 378;
                    this.match(LuaParser.OB);
                    this.state = 379;
                    this.exp(0);
                    this.state = 380;
                    this.match(LuaParser.CB);
                    break;
                  case 27:
                    this.state = 382;
                    this.match(LuaParser.DOT);
                    this.state = 383;
                    this.match(LuaParser.NAME);
                    break;
                  default:
                    throw new _antlr.default.error.NoViableAltException(this);
                }
                this.state = 388;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
              }
              this.state = 389;
              this.args();
              break;
            case 2:
              localctx = new FunctioncallContext(this, _parentctx, _parentState);
              this.pushNewRecursionContext(localctx, _startState, LuaParser.RULE_functioncall);
              this.state = 390;
              if (!this.precpred(this._ctx, 2)) {
                throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
              }
              this.state = 399;
              this._errHandler.sync(this);
              _la = this._input.LA(1);
              while (_la === 27 || _la === 48) {
                this.state = 397;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                  case 48:
                    this.state = 391;
                    this.match(LuaParser.OB);
                    this.state = 392;
                    this.exp(0);
                    this.state = 393;
                    this.match(LuaParser.CB);
                    break;
                  case 27:
                    this.state = 395;
                    this.match(LuaParser.DOT);
                    this.state = 396;
                    this.match(LuaParser.NAME);
                    break;
                  default:
                    throw new _antlr.default.error.NoViableAltException(this);
                }
                this.state = 401;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
              }
              this.state = 402;
              this.match(LuaParser.COL);
              this.state = 403;
              this.match(LuaParser.NAME);
              this.state = 404;
              this.args();
              break;
          }
        }
        this.state = 409;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 43, this._ctx);
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
  args() {
    let localctx = new ArgsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 32, LuaParser.RULE_args);
    var _la = 0;
    try {
      this.state = 417;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 31:
          this.enterOuterAlt(localctx, 1);
          this.state = 410;
          this.match(LuaParser.OP);
          this.state = 412;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if ((_la & ~0x1f) === 0 && (1 << _la & 4144103424) !== 0 || (_la - 33 & ~0x1f) === 0 && (1 << _la - 33 & 4282392577) !== 0) {
            this.state = 411;
            this.explist();
          }
          this.state = 414;
          this.match(LuaParser.CP);
          break;
        case 46:
          this.enterOuterAlt(localctx, 2);
          this.state = 415;
          this.tableconstructor();
          break;
        case 58:
        case 59:
        case 60:
          this.enterOuterAlt(localctx, 3);
          this.state = 416;
          this.string();
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
  functiondef() {
    let localctx = new FunctiondefContext(this, this._ctx, this.state);
    this.enterRule(localctx, 34, LuaParser.RULE_functiondef);
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 419;
      this.match(LuaParser.FUNCTION);
      this.state = 420;
      this.funcbody();
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
  returntype() {
    let localctx = new ReturntypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 36, LuaParser.RULE_returntype);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 422;
      this.match(LuaParser.COL);
      this.state = 423;
      _la = this._input.LA(1);
      if (!(_la === 24 || (_la - 69 & ~0x1f) === 0 && (1 << _la - 69 & 7) !== 0)) {
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
  funcbody() {
    let localctx = new FuncbodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 38, LuaParser.RULE_funcbody);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 425;
      this.match(LuaParser.OP);
      this.state = 426;
      this.parlist();
      this.state = 427;
      this.match(LuaParser.CP);
      this.state = 429;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if (_la === 39) {
        this.state = 428;
        this.returntype();
      }
      this.state = 431;
      this.block();
      this.state = 432;
      this.match(LuaParser.END);
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
  parlist() {
    let localctx = new ParlistContext(this, this._ctx, this.state);
    this.enterRule(localctx, 40, LuaParser.RULE_parlist);
    var _la = 0;
    try {
      this.state = 441;
      this._errHandler.sync(this);
      switch (this._input.LA(1)) {
        case 57:
          this.enterOuterAlt(localctx, 1);
          this.state = 434;
          this.namelist();
          this.state = 437;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if (_la === 15) {
            this.state = 435;
            this.match(LuaParser.COMMA);
            this.state = 436;
            this.match(LuaParser.DDD);
          }
          break;
        case 55:
          this.enterOuterAlt(localctx, 2);
          this.state = 439;
          this.match(LuaParser.DDD);
          break;
        case 32:
          this.enterOuterAlt(localctx, 3);
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
  tableconstructor() {
    let localctx = new TableconstructorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 42, LuaParser.RULE_tableconstructor);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 443;
      this.match(LuaParser.OCU);
      this.state = 445;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if ((_la & ~0x1f) === 0 && (1 << _la & 4144103424) !== 0 || (_la - 33 & ~0x1f) === 0 && (1 << _la - 33 & 4282425345) !== 0) {
        this.state = 444;
        this.fieldlist();
      }
      this.state = 447;
      this.match(LuaParser.CCU);
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
  fieldlist() {
    let localctx = new FieldlistContext(this, this._ctx, this.state);
    this.enterRule(localctx, 44, LuaParser.RULE_fieldlist);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 449;
      this.field();
      this.state = 455;
      this._errHandler.sync(this);
      var _alt = this._interp.adaptivePredict(this._input, 50, this._ctx);
      while (_alt != 2 && _alt != _antlr.default.atn.ATN.INVALID_ALT_NUMBER) {
        if (_alt === 1) {
          this.state = 450;
          this.fieldsep();
          this.state = 451;
          this.field();
        }
        this.state = 457;
        this._errHandler.sync(this);
        _alt = this._interp.adaptivePredict(this._input, 50, this._ctx);
      }
      this.state = 459;
      this._errHandler.sync(this);
      _la = this._input.LA(1);
      if (_la === 1 || _la === 15) {
        this.state = 458;
        this.fieldsep();
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
  field() {
    let localctx = new FieldContext(this, this._ctx, this.state);
    this.enterRule(localctx, 46, LuaParser.RULE_field);
    try {
      this.state = 471;
      this._errHandler.sync(this);
      var la_ = this._interp.adaptivePredict(this._input, 52, this._ctx);
      switch (la_) {
        case 1:
          this.enterOuterAlt(localctx, 1);
          this.state = 461;
          this.match(LuaParser.OB);
          this.state = 462;
          this.exp(0);
          this.state = 463;
          this.match(LuaParser.CB);
          this.state = 464;
          this.match(LuaParser.EQ);
          this.state = 465;
          this.exp(0);
          break;
        case 2:
          this.enterOuterAlt(localctx, 2);
          this.state = 467;
          this.match(LuaParser.NAME);
          this.state = 468;
          this.match(LuaParser.EQ);
          this.state = 469;
          this.exp(0);
          break;
        case 3:
          this.enterOuterAlt(localctx, 3);
          this.state = 470;
          this.exp(0);
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
  fieldsep() {
    let localctx = new FieldsepContext(this, this._ctx, this.state);
    this.enterRule(localctx, 48, LuaParser.RULE_fieldsep);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 473;
      _la = this._input.LA(1);
      if (!(_la === 1 || _la === 15)) {
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
  number() {
    let localctx = new NumberContext(this, this._ctx, this.state);
    this.enterRule(localctx, 50, LuaParser.RULE_number);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 475;
      _la = this._input.LA(1);
      if (!((_la - 61 & ~0x1f) === 0 && (1 << _la - 61 & 15) !== 0)) {
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
  string() {
    let localctx = new StringContext(this, this._ctx, this.state);
    this.enterRule(localctx, 52, LuaParser.RULE_string);
    var _la = 0;
    try {
      this.enterOuterAlt(localctx, 1);
      this.state = 477;
      _la = this._input.LA(1);
      if (!((_la - 58 & ~0x1f) === 0 && (1 << _la - 58 & 7) !== 0)) {
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
}
exports.default = LuaParser;
LuaParser.EOF = _antlr.default.Token.EOF;
LuaParser.SEMI = 1;
LuaParser.EQ = 2;
LuaParser.BREAK = 3;
LuaParser.GOTO = 4;
LuaParser.DO = 5;
LuaParser.END = 6;
LuaParser.WHILE = 7;
LuaParser.REPEAT = 8;
LuaParser.UNTIL = 9;
LuaParser.IF = 10;
LuaParser.THEN = 11;
LuaParser.ELSEIF = 12;
LuaParser.ELSE = 13;
LuaParser.FOR = 14;
LuaParser.COMMA = 15;
LuaParser.IN = 16;
LuaParser.FUNCTION = 17;
LuaParser.LOCAL = 18;
LuaParser.LT = 19;
LuaParser.GT = 20;
LuaParser.RETURN = 21;
LuaParser.CONTINUE = 22;
LuaParser.CC = 23;
LuaParser.NIL = 24;
LuaParser.FALSE = 25;
LuaParser.TRUE = 26;
LuaParser.DOT = 27;
LuaParser.SQUIG = 28;
LuaParser.MINUS = 29;
LuaParser.POUND = 30;
LuaParser.OP = 31;
LuaParser.CP = 32;
LuaParser.NOT = 33;
LuaParser.LL = 34;
LuaParser.GG = 35;
LuaParser.AMP = 36;
LuaParser.SS = 37;
LuaParser.PER = 38;
LuaParser.COL = 39;
LuaParser.LE = 40;
LuaParser.GE = 41;
LuaParser.AND = 42;
LuaParser.OR = 43;
LuaParser.PLUS = 44;
LuaParser.STAR = 45;
LuaParser.OCU = 46;
LuaParser.CCU = 47;
LuaParser.OB = 48;
LuaParser.CB = 49;
LuaParser.EE = 50;
LuaParser.DD = 51;
LuaParser.PIPE = 52;
LuaParser.CARET = 53;
LuaParser.SLASH = 54;
LuaParser.DDD = 55;
LuaParser.SQEQ = 56;
LuaParser.NAME = 57;
LuaParser.NORMALSTRING = 58;
LuaParser.CHARSTRING = 59;
LuaParser.LONGSTRING = 60;
LuaParser.INT = 61;
LuaParser.HEX = 62;
LuaParser.FLOAT = 63;
LuaParser.HEX_FLOAT = 64;
LuaParser.COMMENT = 65;
LuaParser.WS = 66;
LuaParser.NL = 67;
LuaParser.SHEBANG = 68;
LuaParser.STRINGTYPE = 69;
LuaParser.NUMBERTYPE = 70;
LuaParser.BOOLEANTYPE = 71;
LuaParser.RULE_start_ = 0;
LuaParser.RULE_chunk = 1;
LuaParser.RULE_block = 2;
LuaParser.RULE_statement = 3;
LuaParser.RULE_attnamelist = 4;
LuaParser.RULE_attrib = 5;
LuaParser.RULE_retstatement = 6;
LuaParser.RULE_label = 7;
LuaParser.RULE_funcname = 8;
LuaParser.RULE_varlist = 9;
LuaParser.RULE_namelist = 10;
LuaParser.RULE_explist = 11;
LuaParser.RULE_exp = 12;
LuaParser.RULE_var = 13;
LuaParser.RULE_prefixexp = 14;
LuaParser.RULE_functioncall = 15;
LuaParser.RULE_args = 16;
LuaParser.RULE_functiondef = 17;
LuaParser.RULE_returntype = 18;
LuaParser.RULE_funcbody = 19;
LuaParser.RULE_parlist = 20;
LuaParser.RULE_tableconstructor = 21;
LuaParser.RULE_fieldlist = 22;
LuaParser.RULE_field = 23;
LuaParser.RULE_fieldsep = 24;
LuaParser.RULE_number = 25;
LuaParser.RULE_string = 26;
class Start_Context extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_start_;
  }
  chunk() {
    return this.getTypedRuleContext(ChunkContext, 0);
  }
  EOF() {
    return this.getToken(LuaParser.EOF, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterStart_(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitStart_(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitStart_(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class ChunkContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_chunk;
  }
  block() {
    return this.getTypedRuleContext(BlockContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterChunk(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitChunk(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitChunk(this);
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
    this.ruleIndex = LuaParser.RULE_block;
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
  retstatement() {
    return this.getTypedRuleContext(RetstatementContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterBlock(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitBlock(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitBlock(this);
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
    this.ruleIndex = LuaParser.RULE_statement;
  }
  SEMI() {
    return this.getToken(LuaParser.SEMI, 0);
  }
  varlist() {
    return this.getTypedRuleContext(VarlistContext, 0);
  }
  EQ() {
    return this.getToken(LuaParser.EQ, 0);
  }
  explist() {
    return this.getTypedRuleContext(ExplistContext, 0);
  }
  functioncall() {
    return this.getTypedRuleContext(FunctioncallContext, 0);
  }
  label() {
    return this.getTypedRuleContext(LabelContext, 0);
  }
  BREAK() {
    return this.getToken(LuaParser.BREAK, 0);
  }
  GOTO() {
    return this.getToken(LuaParser.GOTO, 0);
  }
  NAME() {
    return this.getToken(LuaParser.NAME, 0);
  }
  DO() {
    return this.getToken(LuaParser.DO, 0);
  }
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
  END() {
    return this.getToken(LuaParser.END, 0);
  }
  WHILE() {
    return this.getToken(LuaParser.WHILE, 0);
  }
  exp = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(ExpContext);
    } else {
      return this.getTypedRuleContext(ExpContext, i);
    }
  };
  REPEAT() {
    return this.getToken(LuaParser.REPEAT, 0);
  }
  UNTIL() {
    return this.getToken(LuaParser.UNTIL, 0);
  }
  IF() {
    return this.getToken(LuaParser.IF, 0);
  }
  THEN = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.THEN);
    } else {
      return this.getToken(LuaParser.THEN, i);
    }
  };
  ELSEIF = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.ELSEIF);
    } else {
      return this.getToken(LuaParser.ELSEIF, i);
    }
  };
  ELSE() {
    return this.getToken(LuaParser.ELSE, 0);
  }
  FOR() {
    return this.getToken(LuaParser.FOR, 0);
  }
  COMMA = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.COMMA);
    } else {
      return this.getToken(LuaParser.COMMA, i);
    }
  };
  namelist() {
    return this.getTypedRuleContext(NamelistContext, 0);
  }
  IN() {
    return this.getToken(LuaParser.IN, 0);
  }
  FUNCTION() {
    return this.getToken(LuaParser.FUNCTION, 0);
  }
  funcname() {
    return this.getTypedRuleContext(FuncnameContext, 0);
  }
  funcbody() {
    return this.getTypedRuleContext(FuncbodyContext, 0);
  }
  LOCAL() {
    return this.getToken(LuaParser.LOCAL, 0);
  }
  attnamelist() {
    return this.getTypedRuleContext(AttnamelistContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterStatement(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitStatement(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitStatement(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class AttnamelistContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_attnamelist;
  }
  NAME = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.NAME);
    } else {
      return this.getToken(LuaParser.NAME, i);
    }
  };
  attrib = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(AttribContext);
    } else {
      return this.getTypedRuleContext(AttribContext, i);
    }
  };
  COMMA = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.COMMA);
    } else {
      return this.getToken(LuaParser.COMMA, i);
    }
  };
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterAttnamelist(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitAttnamelist(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitAttnamelist(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class AttribContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_attrib;
  }
  LT() {
    return this.getToken(LuaParser.LT, 0);
  }
  NAME() {
    return this.getToken(LuaParser.NAME, 0);
  }
  GT() {
    return this.getToken(LuaParser.GT, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterAttrib(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitAttrib(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitAttrib(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class RetstatementContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_retstatement;
  }
  RETURN() {
    return this.getToken(LuaParser.RETURN, 0);
  }
  BREAK() {
    return this.getToken(LuaParser.BREAK, 0);
  }
  CONTINUE() {
    return this.getToken(LuaParser.CONTINUE, 0);
  }
  SEMI() {
    return this.getToken(LuaParser.SEMI, 0);
  }
  explist() {
    return this.getTypedRuleContext(ExplistContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterRetstatement(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitRetstatement(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitRetstatement(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class LabelContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_label;
  }
  CC = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.CC);
    } else {
      return this.getToken(LuaParser.CC, i);
    }
  };
  NAME() {
    return this.getToken(LuaParser.NAME, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterLabel(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitLabel(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitLabel(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class FuncnameContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_funcname;
  }
  NAME = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.NAME);
    } else {
      return this.getToken(LuaParser.NAME, i);
    }
  };
  DOT = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.DOT);
    } else {
      return this.getToken(LuaParser.DOT, i);
    }
  };
  COL() {
    return this.getToken(LuaParser.COL, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterFuncname(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitFuncname(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitFuncname(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class VarlistContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_varlist;
  }
  var_ = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(VarContext);
    } else {
      return this.getTypedRuleContext(VarContext, i);
    }
  };
  COMMA = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.COMMA);
    } else {
      return this.getToken(LuaParser.COMMA, i);
    }
  };
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterVarlist(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitVarlist(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitVarlist(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class NamelistContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_namelist;
  }
  NAME = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.NAME);
    } else {
      return this.getToken(LuaParser.NAME, i);
    }
  };
  COMMA = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.COMMA);
    } else {
      return this.getToken(LuaParser.COMMA, i);
    }
  };
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterNamelist(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitNamelist(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitNamelist(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class ExplistContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_explist;
  }
  exp = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(ExpContext);
    } else {
      return this.getTypedRuleContext(ExpContext, i);
    }
  };
  COMMA = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.COMMA);
    } else {
      return this.getToken(LuaParser.COMMA, i);
    }
  };
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterExplist(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitExplist(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitExplist(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class ExpContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_exp;
  }
  NIL() {
    return this.getToken(LuaParser.NIL, 0);
  }
  FALSE() {
    return this.getToken(LuaParser.FALSE, 0);
  }
  TRUE() {
    return this.getToken(LuaParser.TRUE, 0);
  }
  number() {
    return this.getTypedRuleContext(NumberContext, 0);
  }
  string() {
    return this.getTypedRuleContext(StringContext, 0);
  }
  DDD() {
    return this.getToken(LuaParser.DDD, 0);
  }
  functiondef() {
    return this.getTypedRuleContext(FunctiondefContext, 0);
  }
  prefixexp() {
    return this.getTypedRuleContext(PrefixexpContext, 0);
  }
  tableconstructor() {
    return this.getTypedRuleContext(TableconstructorContext, 0);
  }
  exp = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(ExpContext);
    } else {
      return this.getTypedRuleContext(ExpContext, i);
    }
  };
  NOT() {
    return this.getToken(LuaParser.NOT, 0);
  }
  POUND() {
    return this.getToken(LuaParser.POUND, 0);
  }
  MINUS() {
    return this.getToken(LuaParser.MINUS, 0);
  }
  SQUIG() {
    return this.getToken(LuaParser.SQUIG, 0);
  }
  CARET() {
    return this.getToken(LuaParser.CARET, 0);
  }
  STAR() {
    return this.getToken(LuaParser.STAR, 0);
  }
  SLASH() {
    return this.getToken(LuaParser.SLASH, 0);
  }
  PER() {
    return this.getToken(LuaParser.PER, 0);
  }
  SS() {
    return this.getToken(LuaParser.SS, 0);
  }
  PLUS() {
    return this.getToken(LuaParser.PLUS, 0);
  }
  DD() {
    return this.getToken(LuaParser.DD, 0);
  }
  LT() {
    return this.getToken(LuaParser.LT, 0);
  }
  GT() {
    return this.getToken(LuaParser.GT, 0);
  }
  LE() {
    return this.getToken(LuaParser.LE, 0);
  }
  GE() {
    return this.getToken(LuaParser.GE, 0);
  }
  SQEQ() {
    return this.getToken(LuaParser.SQEQ, 0);
  }
  EE() {
    return this.getToken(LuaParser.EE, 0);
  }
  AND() {
    return this.getToken(LuaParser.AND, 0);
  }
  OR() {
    return this.getToken(LuaParser.OR, 0);
  }
  AMP() {
    return this.getToken(LuaParser.AMP, 0);
  }
  PIPE() {
    return this.getToken(LuaParser.PIPE, 0);
  }
  LL() {
    return this.getToken(LuaParser.LL, 0);
  }
  GG() {
    return this.getToken(LuaParser.GG, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterExp(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitExp(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitExp(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class VarContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_var;
  }
  NAME() {
    return this.getToken(LuaParser.NAME, 0);
  }
  prefixexp() {
    return this.getTypedRuleContext(PrefixexpContext, 0);
  }
  OB() {
    return this.getToken(LuaParser.OB, 0);
  }
  exp() {
    return this.getTypedRuleContext(ExpContext, 0);
  }
  CB() {
    return this.getToken(LuaParser.CB, 0);
  }
  DOT() {
    return this.getToken(LuaParser.DOT, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterVar(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitVar(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitVar(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class PrefixexpContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_prefixexp;
  }
  NAME = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.NAME);
    } else {
      return this.getToken(LuaParser.NAME, i);
    }
  };
  OB = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.OB);
    } else {
      return this.getToken(LuaParser.OB, i);
    }
  };
  exp = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(ExpContext);
    } else {
      return this.getTypedRuleContext(ExpContext, i);
    }
  };
  CB = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.CB);
    } else {
      return this.getToken(LuaParser.CB, i);
    }
  };
  DOT = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.DOT);
    } else {
      return this.getToken(LuaParser.DOT, i);
    }
  };
  functioncall() {
    return this.getTypedRuleContext(FunctioncallContext, 0);
  }
  OP() {
    return this.getToken(LuaParser.OP, 0);
  }
  CP() {
    return this.getToken(LuaParser.CP, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterPrefixexp(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitPrefixexp(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitPrefixexp(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class FunctioncallContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_functioncall;
  }
  NAME = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.NAME);
    } else {
      return this.getToken(LuaParser.NAME, i);
    }
  };
  args() {
    return this.getTypedRuleContext(ArgsContext, 0);
  }
  OB = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.OB);
    } else {
      return this.getToken(LuaParser.OB, i);
    }
  };
  exp = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(ExpContext);
    } else {
      return this.getTypedRuleContext(ExpContext, i);
    }
  };
  CB = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.CB);
    } else {
      return this.getToken(LuaParser.CB, i);
    }
  };
  DOT = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTokens(LuaParser.DOT);
    } else {
      return this.getToken(LuaParser.DOT, i);
    }
  };
  OP() {
    return this.getToken(LuaParser.OP, 0);
  }
  CP() {
    return this.getToken(LuaParser.CP, 0);
  }
  COL() {
    return this.getToken(LuaParser.COL, 0);
  }
  functioncall() {
    return this.getTypedRuleContext(FunctioncallContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterFunctioncall(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitFunctioncall(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitFunctioncall(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class ArgsContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_args;
  }
  OP() {
    return this.getToken(LuaParser.OP, 0);
  }
  CP() {
    return this.getToken(LuaParser.CP, 0);
  }
  explist() {
    return this.getTypedRuleContext(ExplistContext, 0);
  }
  tableconstructor() {
    return this.getTypedRuleContext(TableconstructorContext, 0);
  }
  string() {
    return this.getTypedRuleContext(StringContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterArgs(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitArgs(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitArgs(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class FunctiondefContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_functiondef;
  }
  FUNCTION() {
    return this.getToken(LuaParser.FUNCTION, 0);
  }
  funcbody() {
    return this.getTypedRuleContext(FuncbodyContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterFunctiondef(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitFunctiondef(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitFunctiondef(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class ReturntypeContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_returntype;
  }
  COL() {
    return this.getToken(LuaParser.COL, 0);
  }
  NIL() {
    return this.getToken(LuaParser.NIL, 0);
  }
  STRINGTYPE() {
    return this.getToken(LuaParser.STRINGTYPE, 0);
  }
  NUMBERTYPE() {
    return this.getToken(LuaParser.NUMBERTYPE, 0);
  }
  BOOLEANTYPE() {
    return this.getToken(LuaParser.BOOLEANTYPE, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterReturntype(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitReturntype(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitReturntype(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class FuncbodyContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_funcbody;
  }
  OP() {
    return this.getToken(LuaParser.OP, 0);
  }
  parlist() {
    return this.getTypedRuleContext(ParlistContext, 0);
  }
  CP() {
    return this.getToken(LuaParser.CP, 0);
  }
  block() {
    return this.getTypedRuleContext(BlockContext, 0);
  }
  END() {
    return this.getToken(LuaParser.END, 0);
  }
  returntype() {
    return this.getTypedRuleContext(ReturntypeContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterFuncbody(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitFuncbody(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitFuncbody(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class ParlistContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_parlist;
  }
  namelist() {
    return this.getTypedRuleContext(NamelistContext, 0);
  }
  COMMA() {
    return this.getToken(LuaParser.COMMA, 0);
  }
  DDD() {
    return this.getToken(LuaParser.DDD, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterParlist(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitParlist(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitParlist(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class TableconstructorContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_tableconstructor;
  }
  OCU() {
    return this.getToken(LuaParser.OCU, 0);
  }
  CCU() {
    return this.getToken(LuaParser.CCU, 0);
  }
  fieldlist() {
    return this.getTypedRuleContext(FieldlistContext, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterTableconstructor(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitTableconstructor(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitTableconstructor(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class FieldlistContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_fieldlist;
  }
  field = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(FieldContext);
    } else {
      return this.getTypedRuleContext(FieldContext, i);
    }
  };
  fieldsep = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(FieldsepContext);
    } else {
      return this.getTypedRuleContext(FieldsepContext, i);
    }
  };
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterFieldlist(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitFieldlist(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitFieldlist(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class FieldContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_field;
  }
  OB() {
    return this.getToken(LuaParser.OB, 0);
  }
  exp = function (i) {
    if (i === undefined) {
      i = null;
    }
    if (i === null) {
      return this.getTypedRuleContexts(ExpContext);
    } else {
      return this.getTypedRuleContext(ExpContext, i);
    }
  };
  CB() {
    return this.getToken(LuaParser.CB, 0);
  }
  EQ() {
    return this.getToken(LuaParser.EQ, 0);
  }
  NAME() {
    return this.getToken(LuaParser.NAME, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterField(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitField(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitField(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class FieldsepContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_fieldsep;
  }
  COMMA() {
    return this.getToken(LuaParser.COMMA, 0);
  }
  SEMI() {
    return this.getToken(LuaParser.SEMI, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterFieldsep(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitFieldsep(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitFieldsep(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class NumberContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_number;
  }
  INT() {
    return this.getToken(LuaParser.INT, 0);
  }
  HEX() {
    return this.getToken(LuaParser.HEX, 0);
  }
  FLOAT() {
    return this.getToken(LuaParser.FLOAT, 0);
  }
  HEX_FLOAT() {
    return this.getToken(LuaParser.HEX_FLOAT, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterNumber(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitNumber(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitNumber(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
class StringContext extends _antlr.default.ParserRuleContext {
  constructor(parser, parent, invokingState) {
    if (parent === undefined) {
      parent = null;
    }
    if (invokingState === undefined || invokingState === null) {
      invokingState = -1;
    }
    super(parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LuaParser.RULE_string;
  }
  NORMALSTRING() {
    return this.getToken(LuaParser.NORMALSTRING, 0);
  }
  CHARSTRING() {
    return this.getToken(LuaParser.CHARSTRING, 0);
  }
  LONGSTRING() {
    return this.getToken(LuaParser.LONGSTRING, 0);
  }
  enterRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.enterString(this);
    }
  }
  exitRule(listener) {
    if (listener instanceof _LuaParserListener.default) {
      listener.exitString(this);
    }
  }
  accept(visitor) {
    if (visitor instanceof _LuaParserVisitor.default) {
      return visitor.visitString(this);
    } else {
      return visitor.visitChildren(this);
    }
  }
}
LuaParser.Start_Context = Start_Context;
LuaParser.ChunkContext = ChunkContext;
LuaParser.BlockContext = BlockContext;
LuaParser.StatementContext = StatementContext;
LuaParser.AttnamelistContext = AttnamelistContext;
LuaParser.AttribContext = AttribContext;
LuaParser.RetstatementContext = RetstatementContext;
LuaParser.LabelContext = LabelContext;
LuaParser.FuncnameContext = FuncnameContext;
LuaParser.VarlistContext = VarlistContext;
LuaParser.NamelistContext = NamelistContext;
LuaParser.ExplistContext = ExplistContext;
LuaParser.ExpContext = ExpContext;
LuaParser.VarContext = VarContext;
LuaParser.PrefixexpContext = PrefixexpContext;
LuaParser.FunctioncallContext = FunctioncallContext;
LuaParser.ArgsContext = ArgsContext;
LuaParser.FunctiondefContext = FunctiondefContext;
LuaParser.ReturntypeContext = ReturntypeContext;
LuaParser.FuncbodyContext = FuncbodyContext;
LuaParser.ParlistContext = ParlistContext;
LuaParser.TableconstructorContext = TableconstructorContext;
LuaParser.FieldlistContext = FieldlistContext;
LuaParser.FieldContext = FieldContext;
LuaParser.FieldsepContext = FieldsepContext;
LuaParser.NumberContext = NumberContext;
LuaParser.StringContext = StringContext;