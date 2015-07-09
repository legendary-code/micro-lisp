let Features = require('./Features'),
    BooleanExpression = require('../../parser/ast/BooleanExpression'),
    NumberExpression = require('../../parser/ast/NumberExpression'),
    LiteralExpression = require('../../parser/ast/LiteralExpression'),
    RuntimeError = require('../../runtime/RuntimeError');

/**
 * Basic comparison operations
 */
class ComparisonFeatures extends Features {
    install(env) {
        this.defineFunction(env, ">", this._greaterThan.bind(this));
        this.defineFunction(env, "<", this._lessThan.bind(this));
        this.defineFunction(env, ">=", this._greaterThanEqual.bind(this));
        this.defineFunction(env, "<=", this._lessThanEqual.bind(this));
        this.defineFunction(env, "=", this._equal.bind(this));
        this.defineFunction(env, "!=", this._notEqual.bind(this));
        this.defineFunction(env, "<>", this._notEqual.bind(this));
    }

    _lessThan(context, env, ...args) {
        return this._comparison(context, env, (l,r) => l < r, args);
    }

    _greaterThan(context, env, ...args) {
        return this._comparison(context, env, (l,r) => l > r, args);
    }

    _lessThanEqual(context, env, ...args) {
        return this._comparison(context, env, (l,r) => l <= r, args);
    }

    _greaterThanEqual(context, env, ...args) {
        return this._comparison(context, env, (l,r) => l >= r, args);
    }

    _equal(context, env, ...args) {
        return this._comparison(context, env, (l,r) => l === r, args);
    }

    _notEqual(context, env, ...args) {
        return this._comparison(context, env, (l,r) => l !== r, args);
    }

    _comparison(context, env, comparison, args) {
        if (args.length != 2) {
            throw this.badNumberOfArguments(context.name, 2, args.length);
        }

        let evaluatedArgs = [];
        args.forEach(v => evaluatedArgs.push(v.eval(context, env)));
        evaluatedArgs.forEach(v => this.checkType(v, LiteralExpression));

        if (evaluatedArgs[0].type != evaluatedArgs[1].type) {
            throw new RuntimeError("comparison error, values must be same type", context.location);
        }

        return new BooleanExpression(context.location, comparison(evaluatedArgs[0].value, evaluatedArgs[1].value));
    }
}

module.exports = ComparisonFeatures;