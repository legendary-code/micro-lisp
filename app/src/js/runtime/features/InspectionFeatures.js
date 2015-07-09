let Features = require('./Features'),
    Expression = require('../../parser/ast/Expression'),
    StringExpression = require('../../parser/ast/StringExpression'),
    Tokenizer = require('../../lexer/Tokenizer'),
    Parser = require('../../parser/Parser');

    class InspectionFeatures extends Features {
    install(env) {
        this.defineFunction(env,"names", this._names.bind(this));
        this.defineFunction(env,"eval", this._eval.bind(this));
    }

    _names(context, env, ...args) {
        if (args.length > 0) {
            throw this.badNumberOfArguments(context.name, 0);
        }

        let names = env.names;

        for (let name in names) {
            if (names.hasOwnProperty(name)) {
                env.println(name + " = " + names[name].toString());
            }
        }

        return "";
    }

    _eval(context, env, expression, ...args) {
        if (args.length > 0) {
            throw this.badNumberOfArguments(context.name, 0);
        }

        this.checkType(expression, Expression);
        let code = expression.eval(context, env);

        this.checkType(code, StringExpression);

        let stream = Tokenizer.tokenize(code.value);
        let expr = Parser.parseExpression(stream);

        return expr.eval(context, env);
    }
}

module.exports = InspectionFeatures;