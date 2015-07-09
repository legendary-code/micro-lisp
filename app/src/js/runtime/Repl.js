let Tokenizer = require('../lexer/Tokenizer'),
    Parser = require('../parser/Parser'),
    RunResult = require('./RunResult'),
    DefaultEnvironment = require('./DefaultEnvironment'),
    TokenType = require('../lexer/TokenType');

/**
 * Implements a read-evaluate-print-loop capable of evaluating expressions
 */
class Repl {
    constructor() {
        this._env = new DefaultEnvironment();
    }

    eval(code) {
        return this.evalWithEnv(code, this._env);
    }

    evalWithEnv(code, env) {
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
            return new RunResult(expr.eval(expr, env), env, null);
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

    canParse(code) {
        let stream;
        let parens = 0;

        try {
            stream = Tokenizer.tokenize(code);
        } catch (error) {
            return false;
        }

        // expect it to at least start with a left paren
        if (!stream.curr() || stream.curr().type != TokenType.LEFT_PAREN) {
            return false;
        }

        // see if parens are balanced
        while (stream.curr()) {
            switch (stream.curr().type) {
                case TokenType.LEFT_PAREN:
                    parens++;
                    break;
                case TokenType.RIGHT_PAREN:
                    parens--;
                    break;
            }

            if (parens < 0) {
                return false;
            }

            stream.next();
        }

        return parens == 0;
    }

    get env() {
        return this._env;
    }
}

module.exports = Repl;
