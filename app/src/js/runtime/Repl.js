let Tokenizer = require('../lexer/Tokenizer'),
    Parser = require('../parser/Parser'),
    RunResult = require('./RunResult'),
    DefaultEnvironment = require('./DefaultEnvironment');

/**
 * Implements a read-evaluate-print-loop capable of evaluating expressions
 */
class Repl {
    constructor() {
        this._env = new DefaultEnvironment();
    }

    eval(code) {
        let stream;
        let expr;

        try {
            stream = Tokenizer.tokenize(code);
        } catch (error) {
            return new RunResult(null, this._env, error);
        }

        try {
            expr = Parser.parseExpression(stream);
        } catch (error) {
            return new RunResult(null, this._env, error);
        }

        try {
            return new RunResult(expr.eval(this._env), this._env, null);
        } catch (error) {
            return new RunResult(expr, this._env, error);
        }
    }

    get env() {
        return this._env;
    }
}

module.exports = Repl;
