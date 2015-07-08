let Environment = require('./Environment'),
    NativeFunctionDefinition = require('../parser/ast/NativeFunctionDefinition'),
    RuntimeError = require('./RuntimeError'),
    Expression = require('../parser/ast/Expression'),
    NameExpression = require('../parser/ast/NameExpression'),
    NumberExpression = require('../parser/ast/NumberExpression'),
    LiteralExpression = require('../parser/ast/LiteralExpression'),
    BooleanExpression = require('../parser/ast/BooleanExpression'),
    StringExpression = require('../parser/ast/StringExpression');

/**
 * Provides an environment with built-in names and functionality
 */
class DefaultEnvironment extends Environment {
    constructor() {
        super();
        this._defineFunction("+", this._add.bind(this));
        this._defineFunction("-", this._subtract.bind(this));
        this._defineFunction("*", this._multiply.bind(this));
        this._defineFunction("/", this._divide.bind(this));
        this._defineFunction("%", this._modulo.bind(this));
        this._defineFunction("print", this._print.bind(this));
        this._defineFunction("if", this._if.bind(this));
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

    _add(caller, env, ...args) {
        return this._nnaryOp(caller, (l,r) => l + r, args);
    }

    _subtract(caller, env, ...args) {
        return this._nnaryOp(caller, (l,r) => l - r, args);
    }

    _multiply(caller, env, ...args) {
        return this._nnaryOp(caller, (l,r) => l * r, args);
    }

    _divide(caller, env, ...args) {
        return this._binaryOp(caller, (l,r) => Math.floor(l / r), args);
    }

    _modulo(caller, env, ...args) {
        return this._binaryOp(caller, (l,r) => l % r, args);
    }

    _binaryOp(caller, operator, args) {
        if (args.length != 2) {
            throw this._badNumberOfArguments(caller.name, 2, args.length);
        }

        this._checkType(args[0], NumberExpression);
        this._checkType(args[1], NumberExpression);

        return new NumberExpression(null, operator(args[0].value, args[1].value));
    }

    _nnaryOp(caller, operator, args) {
        if (args.length < 2) {
            throw this._badNumberOfArguments(caller.name, ">=2", args.length);
        }

        args.forEach(v => this._checkType(v, NumberExpression));

        let result = this._binaryOp(caller, operator, [args[0], args[1]]);
        args = args.slice(2);

        while (args.length > 0) {
            result = this._binaryOp(caller, operator, [result, args[0]]);
            args = args.slice(1);
        }

        return new NumberExpression(null, result);
    }

    _print(caller, env, ...args) {
        args.forEach(v => this._checkType(v, LiteralExpression));

        let output = "";
        args.forEach(v => output += v.value);
        let stdout = env.findGlobal("$stdout") || "";
        stdout += output;
        env.defineGlobal("$stdout", stdout);

        return new StringExpression(null, output);
    }

    // TODO: If needs to be handled as part of grammer as well, otherwise, both case expressions get evaluated
    _if(caller, env, cond, trueCase, falseCase) {
        this._checkType(cond, Expression);
        this._checkType(trueCase, Expression);
        this._checkType(falseCase, Expression);

        let result = cond.eval(caller, env);
        this._checkType(result, BooleanExpression);

        if (result.value) {
            return trueCase.eval(caller, env);
        } else {
            return falseCase.eval(caller, env);
        }
    }
}

module.exports = DefaultEnvironment;