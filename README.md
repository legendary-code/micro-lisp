# micro-lisp
A proof-of-concept implementation of a tokenizer and parser for a toy language

Interactive REPL hosted at: http://legendary-code.github.io/micro-lisp/

To run locally:

1. Check out the source
2. npm install
3. npm --global install gulp
4. gulp serve

### Language Specification

#### Tokens

    LEFT_PAREN := ‘(‘
    RIGHT_PAREN := ‘)’
    NUMBER := /(-?)[0-9]+/
    STRING := /”[^”]*”/
    NAME := /[^0-9”][^”\(\)\s]+/

#### Grammar
lowercase represents abstract syntax tree nodes, UPPERCASE represents tokens, strings in 'single quotes' represent their respective tokens as well.

    program := ‘(‘ ‘program’ expression* ‘)’
    boolean := ‘true’ | ‘false’
    number := NUMBER
    string := STRING
    name := NAME
    expression := name |
                  number | 
                  string |
                  boolean |
                  invocation |
                  function_definition |
                  native_function_definition
    invocation := ‘(‘ name expression* ‘)’
    function_definition := ‘(‘ ‘defn’ name ‘(‘ name* ‘)’ expression ‘)’
    native_function_definition := {native impl of a function, not parsed}

#### Supported Native Functions (Features)
##### Comparisons
    >   greater than
    <   less than
    >=  greater than or equal
    <=  less than or equal
    =   equal
    !=  not equal
    <>  not equal

##### Inspection
    names   prints out all names (functions and vars)
    eval    evaluates a given string using the micro-lisp parser against the current environment

##### Language
    if    conditional branching
    let   assigns name to an expressions evaluated value
    
##### Math
    +     add (n-ary)
    -     subtract (n-ary)
    *     multiply (n-nary)
    /     divinde (binary)
    %     modulo (binary)
    
##### Output
    print      prints evaluated expressions (n-ary)
    println    prints evaluated expressions and a newline (n-ary)

##### Repl
    help       prints out list of basic repl commands
    fizzbuzz   prints a smaple fizzbuzz program that can be copied/pasted back into the repl
    github     opens this project page in github
    clear      clears the repl buffer
    reset      resets the repl environment and buffer to its original state

##### String
    concat     concatenate a set of evaluated expressions
    
