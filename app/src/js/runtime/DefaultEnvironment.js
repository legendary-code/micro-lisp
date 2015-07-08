let Environment = require('./Environment'),
    NativeFunctionDefinition = require('../parser/ast/NativeFunctionDefinition'),
    RuntimeError = require('./RuntimeError'),
    NameExpression = require('../parser/ast/NameExpression'),
    NumberExpression = require('../parser/ast/NumberExpression'),
    LiteralExpression = require('../parser/ast/LiteralExpression'),
    StringExpression = require('../parser/ast/StringExpression');

/**
 * Provides an environment with built-in names and functionality
 */
class DefaultEnvironment extends Environment {
    constructor() {
        super();
        this._defineFunction("+", this._add.bind(this));
        this._defineFunction("print", this._print.bind(this));
        this._defineFunction("let", this._let.bind(this));
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
        if (!expression || !(expression instanceof expectedType)) {
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

    _print(env, ...args) {
        args.forEach(v => this._checkType(v, LiteralExpression));

        let output = "";
        args.forEach(v => output += v.value);
        let stdout = env.findGlobal("$stdout") || "";
        stdout += output;
        env.defineGlobal("$stdout", stdout);

        return new StringExpression(null, output);
    }

    _let(env, name, value) {
        this._checkType(name, NameExpression);
        this._checkType(value, LiteralExpression);

        env.define(name, value);

        return value;
    }
}

module.exports = DefaultEnvironment;