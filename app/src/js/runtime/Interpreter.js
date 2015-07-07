let Tokenizer = require('../lexer/Tokenizer'),
    Parser = require('../parser/Parser'),
    RunResult = require('./RunResult'),
    DefaultEnvironment = require('./DefaultEnvironment');

class Interpreter {
    static run(code) {
        let env = new DefaultEnvironment();
        let stream;
        let program;

        try {
            stream = Tokenizer.tokenize(code);
        } catch (error) {
            return new RunResult(null, env, error);
        }

        try {
            program = Parser.parseProgram(stream);
        } catch (error) {
            return new RunResult(null, env, error);
        }

        try {
            return new RunResult(program.eval(env), env, null);
        } catch (error) {
            return new RunResult(program, env, error);
        }
    }
}

module.exports = Interpreter;