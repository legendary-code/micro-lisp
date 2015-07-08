let Node = require('./Node');

/**
 * Represents a name definition
 */
class LetDefinition extends Node {
    constructor(location, name, expression) {
        super(location);
        this._name = name;
        this._expression = expression;
    }

    // For now, define globally, because of scoping issues
    eval(env) {
        env.defineGlobal(this._name, this._expression);
        return this._expression;
    }

    get name() {
        return this._name;
    }

    get expression() {
        return this._expression;
    }

    toString() {
        return "[Let " + this._name + "]";
    }
}

module.exports = LetDefinition;