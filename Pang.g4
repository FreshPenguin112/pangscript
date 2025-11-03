grammar Pang;

program
    : statement* EOF
    ;

// a reusable small unit for statement-like items that end with a semicolon
statementItem
    : onCall
    | printCall
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

ifStmt
    : 'if' '(' expr ')' block 'else' block
    ;

expr
    : primary ( '>' primary )?
    ;

primary
    : NUMBER
    | STRING
    | 'true'
    | 'false'
    | printCall
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
    ;

IDENT
    : [a-zA-Z_][a-zA-Z0-9_]*
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
