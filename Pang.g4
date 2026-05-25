grammar Pang;

program
    : statement* EOF
    ;

// a reusable small unit for statement-like items that end with a semicolon
statementItem
    : onCall
    | printCall
    | functionCall
    | classDecl
    | varDecl
    | assignStmt
    | returnStmt
    | breakStmt
    | continueStmt
    | yieldStmt
    ;

// statements require semicolons by default (most statements end with ';')
statement
    : statementItem ';'?
    | ifStmt ';'?    // keep semicolon at top-level if desired; we'll accept both in visitors
    | forStmt ';'?
    | whileStmt ';'?
    ;

onCall
    : 'on' '(' STRING ',' (arrowFunction | inlineBlock | block) ')'
    ;

// inline blocks allow a slightly different statement set where some
// constructs (like `ifStmt`) may appear without a trailing semicolon.
inlineBlock
    : '*' inlineBlockBody
    ;

inlineBlockBody
    : '{' inlineStatement* '}'
    ;

// Inline statements reuse statementItem but allow control-structures without a trailing semicolon.
inlineStatement
    : statementItem ';'?
    | ifStmt ';'?    // allow if statements without semicolons in inline blocks
    | forStmt ';'?   // allow for statements without semicolons in inline blocks
    | whileStmt ';'? // allow while statements without semicolons in inline blocks
    ;

// return statement — optional expression value
returnStmt
    : 'return' expr?
    ;

block
    : '{' statement* '}'
    ;

printCall
    : 'print' '(' expr (',' options_)? ')'
    ;

// Variable declaration: let or const
varDecl
    : ('let' | 'const')? IDENT ('=' expr)?
    ;

// Assignment statement (implicit let if variable not declared)
assignStmt
    : memberExpr '=' expr
    ;

ifStmt
        : 'if' '(' expr ')' (block | statement) ';'?
            ( 'else' 'if' '(' expr ')' (block | statement) )* ';'?
            ( 'else' (block | statement) )? ';'?
        ;

forStmt
    : 'for' '(' (varDecl | assignStmt)? ';' expr? ';' (assignStmt | functionCall | expr)? ')' (block | statement)
    ;

whileStmt
    : 'while' '(' expr ')' (block | statement)
    ;

breakStmt
    : 'break'
    ;

yieldStmt
    : 'yield' expr?
    ;

continueStmt
    : 'continue'
    ;

primary
    : atom
      (INCR | DECR)? // optional post-increment/decrement
    ;

expr
    : THIS
    | primary
    | 'new' functionCall
    | '!' expr
    | '~' expr
    | ('+' | '-') expr
    | INCR expr
    | DECR expr
    // power (right-associative)
    | <assoc=right> expr POWER expr
    // multiplicative
    | expr ('*' | '/' | '%') expr
    // additive
    | expr ('+' | '-') expr
    // shifts
    | expr ('<<' | '>>' | '>>>') expr
    // concatenation (Lua-style)
    | expr CONCAT expr
    // comparisons
    | expr ('<' | '<=' | '>' | '>=') expr
    // equality
    | expr ('==' | '!=' | '===' | '!==') expr
    // bitwise
    | expr '&' expr
    | expr '^' expr
    | expr '|' expr
    // logical
    | expr '&&' expr
    | expr '||' expr
    // ternary conditional: cond ? then : else
    | expr '?' expr ':' expr
    ;

atom
    : NUMBER
    | STRING
    | 'true'
    | 'false'
    | inlineBlock
    | arrowFunction
    | IDENT
    | printCall
    | functionCall
    | memberExpr
    | arrayLiteral
    | '(' expr ')'
    ;

arrayLiteral
    : '[' (expr (',' expr)*)? ','? ']'
    ;
// have to use options_ since options is a reserved word in ANTLR
// options_ accepts a simple JSON-like object with string keys (quoted or unquoted)
// and scalar values (STRING, NUMBER, true, false). Arrays and nested objects are not allowed.
options_
    : '{' WS? optionPair (',' WS? optionPair)* WS? '}'
    ;

optionPair
    : optionKey WS? ':' WS? optionValue
    ;

optionKey
    : STRING
    | IDENT
    ;

optionValue
    : STRING
    | NUMBER
    | 'true'
    | 'false'
    | expr
    ;

functionCall
    : memberExpr
      ('.' IDENT)*
      '(' (expr (',' expr)*)? ')'
      ( '(' (expr (',' expr)*)? ')' | '.' IDENT )*
    ;

arrowFunction
    : '(' (IDENT (',' IDENT)*)? ')' '=>' (block | inlineBlock)
    | IDENT '=>' (block | inlineBlock)
    ;

memberExpr
    : (IDENT | THIS) ('.' IDENT)*
    ;

classDecl
    : 'class' IDENT ( 'extends' IDENT )? '{' (classMember | statementItem)* '}'
    ;

classMember
    : ('static')? (IDENT)? '*'? IDENT '(' (IDENT (',' IDENT)*)? ')' block
    | 'constructor' '(' (IDENT (',' IDENT)*)? ')' block
    ;

IDENT
    : [a-zA-Z_][a-zA-Z0-9_]*
    ;

// POWER token for exponentiation operator (**)
POWER
    : '*' '*'
    ;

// CONCAT token for Lua-style concatenation operator (..)
CONCAT
    : '.' '.'
    ;

// increment / decrement
INCR
    : '+' '+'
    ;

DECR
    : '-' '-'
    ;

THIS
    : 'this'
    ;
// --- lexer rules ---
STRING
    : '"' ( '\\' . | ~["\\\r\n] )* '"'
    ;

NUMBER
    : '0' [xX] [0-9a-fA-F]+      // hex
    | [0-9]+ ('.' [0-9]+)?       // decimal / float
    ;

WS
    : [ \t\r\n]+ -> skip
    ;

LINE_COMMENT
    : '//' ~[\r\n]* -> skip
    ;

BLOCK_COMMENT
    : '/*' .*? '*/' -> skip
    ;

// symbols are literal chars in parser rules
