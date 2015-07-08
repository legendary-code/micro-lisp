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
        return this._eval(code, this._env);
    }

    _eval(code, env) {
        let stream;
        let expr;

        try {
            stream = Tokenizer.tokenize(code);
        } catch (error) {
            return new RunResult(null, env, error);
        }

        try {
            expr = Parser.parseExpression(stream);
        } catch (error) {
            return new RunResult(null, env, error);
        }

        try {
            return new RunResult(expr.eval(env), env, null);
        } catch (error) {
            return new RunResult(expr, env, error);
        }
    }

    /**
     * Poor man's check for whether a code block is a fully formed expression.
     * As an exercise, this will be later implemented using a PDA (Push Down Automata) that can test
     * whether a given program is valid.
     */
    canEval(code) {
        let stream;

        try {
            stream = Tokenizer.tokenize(code);
        } catch (error) {
            return false;
        }

        try {
            Parser.parseExpression(stream);
        } catch (error) {
            return false;
        }

        return true;
    }

    get env() {
        return this._env;
    }
}

module.exports = Repl;
