let Node = require('./Node'),
    RuntimeError = require('../../runtime/RuntimeError');

/**
 * Represents a name expression
 */
class NameExpression extends Node {
    constructor(location, name) {
        super(location);
        this._name = name;
    }

    get name() {
        return this._name;
    }

    eval(caller, env) {
        let value = env.find(this._name);

        if (!value) {
            throw new RuntimeError("could not find name '" + this._name +"'", this.location);
        }

        return value;
    }

    toString() {
        return "[Name " + this._name + "]";
    }
}

module.exports = NameExpression;