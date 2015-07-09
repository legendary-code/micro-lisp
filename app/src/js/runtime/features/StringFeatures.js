let Features = require('./Features'),
    LiteralExpression = require('../../parser/ast/LiteralExpression'),
    StringExpression = require('../../parser/ast/StringExpression');

class StringFeatures extends Features {
    install(env) {
        this.defineFunction(env, "concat", this._concat.bind(this));
    }

    _concat(context, env, ...args) {
        if (args.length < 1) {
            throw this.badNumberOfArguments(context.name, ">=1", args.length);
        }

        let evaluatedArgs = [];
        args.forEach(v => evaluatedArgs.push(v.eval(context, env)));
        evaluatedArgs.forEach(v => this.checkType(v, LiteralExpression));

        let result = "";
        evaluatedArgs.forEach(v => result += v.value);

        return new StringExpression(context.location, result);
    }
}

module.exports = StringFeatures;