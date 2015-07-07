let Environment = require('./Environment'),
    NativeFunctionDefinition = require('../parser/ast/NativeFunctionDefinition'),
    RuntimeError = require('./RuntimeError'),
    NumberExpression = require('../parser/ast/NumberExpression');

/**
 * Provides an environment with built-in names and functionality
 */
class DefaultEnvironment extends Environment {
    constructor() {
        super();
        this._defineFunction("+", this._add.bind(this));
    }

    _defineFunction(name, evalFunc) {
        this.define(name, new NativeFunctionDefinition(name, evalFunc));
    }

    _badNumberOfArguments(name, expected, given) {
        return new RuntimeError(
            "bad number of arguments while calling '" + name + "', expected " + expected + ", was " + given,
            null
        );
    }

    _checkType(expression, expectedType) {
        if (!expression || expression.type != expectedType) {
            throw new RuntimeError(
                "unexpected type, expected " + expectedType.name + ", was " + (!expression ? "undefined" : expression.constructor.name),
                null
            );
        }
    }

    _add(env, left, right) {
        if (arguments.length != 3) {
            throw this._badNumberOfArguments("+", 2, arguments.length - 1);
        }

        this._checkType(left, NumberExpression);
        this._checkType(right, NumberExpression);

        return new NumberExpression(null, left.value + right.value);
    }
}

module.exports = DefaultEnvironment;