let Features = require('./Features'),
    NumberExpression = require('../../parser/ast/NumberExpression');

/**
 * Basic math operation features
 */
class MathFeatures extends Features {
    install(env) {
        this.defineFunction(env, "+", this._add.bind(this));
        this.defineFunction(env, "-", this._subtract.bind(this));
        this.defineFunction(env, "*", this._multiply.bind(this));
        this.defineFunction(env, "/", this._divide.bind(this));
        this.defineFunction(env, "%", this._modulo.bind(this));
    }

    _add(context, env, ...args) {
        return this._nnaryOp(context, env, (l,r) => l + r, args);
    }

    _subtract(context, env, ...args) {
        return this._nnaryOp(context, env, (l,r) => l - r, args);
    }

    _multiply(context, env, ...args) {
        return this._nnaryOp(context, env, (l,r) => l * r, args);
    }

    _divide(context, env, ...args) {
        return this._binaryOp(context, env, (l,r) => Math.floor(l / r), args);
    }

    _modulo(context, env, ...args) {
        return this._binaryOp(context, env, (l,r) => l % r, args);
    }

    _binaryOp(context, env, operator, args) {
        if (args.length != 2) {
            throw this.badNumberOfArguments(context.name, 2, args.length);
        }

        return this._nnaryOp(context, env, operator, args);
    }

    _nnaryOp(context, env, operator, args) {
        if (args.length < 2) {
            throw this.badNumberOfArguments(context.name, ">=2", args.length);
        }

        let evaluatedArgs = [];
        args.forEach(v => evaluatedArgs.push(v.eval(context, env)));
        evaluatedArgs.forEach(v => this.checkType(v, NumberExpression));

        let result = operator(evaluatedArgs[0].value, evaluatedArgs[1].value);
        evaluatedArgs = evaluatedArgs.slice(2);

        while (evaluatedArgs.length > 0) {
            result = operator(result, evaluatedArgs[0].value);
            evaluatedArgs = evaluatedArgs.slice(1);
        }

        return new NumberExpression(context.location, result);
    }
}

module.exports = MathFeatures;