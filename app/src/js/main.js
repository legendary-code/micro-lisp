window.__DEV__ = true;

require('babel/polyfill');

/* Debugging Exports */
window.Tokenizer = require('./lexer/Tokenizer');
window.Environment = require('./runtime/Environment');
window.Program = require('./parser/ast/Program');
window.Interpreter = require('./runtime/Interpreter');
window.Repl = require('./runtime/Repl');

let $ = require('jquery'),
    React = require('react'),
    Page = require('./components/Page');

React.render(<Page />, $("#app")[0]);
