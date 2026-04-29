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
    | breakStmt
    ;

// statements require semicolons by default (most statements end with ';')
statement
    : statementItem ';'?
    | ifStmt ';'?    // keep semicolon at top-level if desired; we'll accept both in visitors
    | forStmt ';'?
    | whileStmt ';'?
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
    : statementItem ';'?
    | ifStmt ';'?    // allow if statements without semicolons in inline blocks
    | forStmt ';'?   // allow for statements without semicolons in inline blocks
    | whileStmt ';'? // allow while statements without semicolons in inline blocks
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

forStmt
    : 'for' '(' (varDecl | assignStmt)? ';' expr? ';' (assignStmt | functionCall | expr)? ')' block
    ;

whileStmt
    : 'while' '(' expr ')' block
    ;

breakStmt
    : 'break'
    ;

expr
    : primary
    | 'new' functionCall
    | '!' expr
    | '~' expr
    | ('+' | '-') expr
    // power (right-associative)
    | <assoc=right> expr POWER expr
    // multiplicative
    | expr ('*' | '/') expr
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
    : memberExpr '(' (expr (',' expr)*)? ')'
    ;

memberExpr
    : IDENT ('.' IDENT)*
    ;

classDecl
    : 'class' IDENT ( 'extends' IDENT )? '{' classMember* '}'
    ;

classMember
    : IDENT '(' (IDENT (',' IDENT)*)? ')' block
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
    : '"' ( '\\' . | ~["\\\r\n] )* '"'
    ;

NUMBER
    : [0-9]+ ('.' [0-9]+)?
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
