let Node = require('./Node');

/**
 * Represents a function definition
 */
class FunctionDefinition extends Node {
    constructor(location, name, args, expression) {
        super(location);
        this._name = name;
        this._args = args;
        this._expression = expression;
    }

    eval(context, env) {
        env.define(this._name, this);
        return this;
    }

    get name() {
        return this._name;
    }

    get args() {
        return this._args;
    }

    get expression() {
        return this._expression;
    }

    toString() {
        return "[Function " + this._name + "]";
    }
}

module.exports = FunctionDefinition;