let Features = require('./Features'),
    Expression = require('../../parser/ast/Expression'),
    BooleanExpression = require('../../parser/ast/BooleanExpression'),
    Name = require('../../parser/ast/NameExpression');

class LanguageFeatures extends Features {
    install(env) {
        this.defineFunction(env,"if", this._if.bind(this));
        this.defineFunction(env,"let", this._let.bind(this));
    }

    _if(context, env, cond, trueCase, falseCase, ...args) {
        if (args.length > 0) {
            throw this.badNumberOfArguments(context.name, 3);
        }

        let result = cond.eval(context, env);
        this.checkType(result, BooleanExpression);

        if (result.value) {
            return trueCase.eval(context, env);
        } else {
            return falseCase.eval(context, env);
        }
    }

    _let(context, env, name, expression, ...args) {
        if (args.length > 0) {
            throw this.badNumberOfArguments(context.name, 2);
        }

        this.checkType(name, Name);
        let value = expression.eval(context, env);
        env.define(name.name, value);
        return value;
    }
}

module.exports = LanguageFeatures;