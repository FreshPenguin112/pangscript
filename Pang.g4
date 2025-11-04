grammar Pang;

program
    : statement* EOF
    ;

// a reusable small unit for statement-like items that end with a semicolon
statementItem
    : onCall
    | printCall
    | functionCall
    | varDecl
    | assignStmt
    ;

// statements require semicolons by default (most statements end with ';')
statement
    : statementItem ';'
    | ifStmt ';'    // keep semicolon at top-level if desired; we'll accept both in visitors
    ;

onCall
    : 'on' '(' STRING ',' inlineBlock ')'
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
    : statementItem ';'
    | ifStmt
    ;

block
    : '{' statement* '}'
    ;

printCall
    : 'print' '(' expr (',' options_)? ')'
    ;

// Variable declaration: let or const
varDecl
    : ('let' | 'const') IDENT ('=' expr)?
    ;

// Assignment statement (implicit let if variable not declared)
assignStmt
    : IDENT '=' expr
    ;

ifStmt
    : 'if' '(' expr ')' block ( 'else' 'if' '(' expr ')' block )* ( 'else' block )?
    ;

expr
    : primary
    | '!' expr
    // power (right-associative)
    | expr POWER expr
    // multiplicative
    | expr ('*' | '/') expr
    // additive
    | expr ('+' | '-') expr
    // concatenation (Lua-style)
    | expr CONCAT expr
    // comparisons
    | expr ('<' | '<=' | '>' | '>=') expr
    // equality
    | expr ('==' | '!=' | '===' | '!==') expr
    // logical
    | expr '&&' expr
    | expr '||' expr
    // ternary conditional: cond ? then : else
    | expr '?' expr ':' expr
    ;

primary
    : NUMBER
    | STRING
    | 'true'
    | 'false'
    | IDENT
    | printCall
    | functionCall
    | '(' expr ')'
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
    : IDENT '(' (expr (',' expr)*)? ')'
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

// --- lexer rules ---

STRING
    : '"' ( ESC | ~["\\] )* '"'
    ;

fragment ESC
    : '\\' .
    ;

NUMBER
    : [0-9]+ ('.' [0-9]+)?
    ;

WS
    : [ \t\r\n]+ -> skip
    ;

// symbols are literal chars in parser rules
