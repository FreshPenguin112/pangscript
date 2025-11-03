grammar Pang;

program
    : statement* EOF
    ;

statement
    : ( onCall | printCall | ifStmt ) ';'
    ;

onCall
    : 'on' '(' STRING ',' inlineBlock ')'
    ;

inlineBlock
    : '*' block
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
options_
    : '{' 'seconds' ':' NUMBER '}'
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
