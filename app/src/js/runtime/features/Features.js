let NativeFunctionDefinition = require('../../parser/ast/NativeFunctionDefinition'),
    RuntimeError = require('../RuntimeError');

/**
 * Represents a base class for supporting the injection of features into an environment, such as native functions
 */
class Features {
    install(env) {
        throw "install() must be implemented for type " + this.constructor.name;
    }

    defineFunction(env, name, evalFunc) {
        env.define(name, new NativeFunctionDefinition(name, evalFunc));
    }

    badNumberOfArguments(name, expected, given) {
        return new RuntimeError(
            "bad number of arguments while calling '" + name + "', expected " + expected + (given ? ", was " + given : ""),
            null
        );
    }

    checkType(expression, expectedType) {
        if (!expression.isOfType(expectedType)) {
            throw new RuntimeError(
                "unexpected type, expected " + expectedType.name + ", was " + (!expression ? "undefined" : expression.constructor.name),
                null
            );
        }
    }
}

module.exports = Features;