let Features = require('./Features'),
    LiteralExpression = require('../../parser/ast/LiteralExpression'),
    StringExpression = require('../../parser/ast/StringExpression');

/**
 * Basic output features
 */
class OutputFeatures extends Features {
    install(env) {
        this.defineFunction(env, "print", this._print.bind(this));
        this.defineFunction(env, "println", this._println.bind(this));
    }

    _gatherOutput(context, env, args) {
        let evaluatedArgs = [];
        args.forEach(v => evaluatedArgs.push(v.eval(context, env)));
        evaluatedArgs.forEach(v => this.checkType(v, LiteralExpression));

        let output = "";
        evaluatedArgs.forEach(v => output += v.value);
        return output;
    }

    _print(context, env, ...args) {
        let output = this._gatherOutput(context, env, args);
        env.print(output);
        return new StringExpression(null, output);
    }

    _println(context, env, ...args) {
        let output = this._gatherOutput(context, env, args);
        env.println(output);
        return new StringExpression(null, output);
    }
}

module.exports = OutputFeatures;