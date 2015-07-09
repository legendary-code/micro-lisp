let Expression = require('./Expression'),
    RuntimeError = require('../../runtime/RuntimeError');

/**
 * Represents a name expression
 */
class NameExpression extends Expression {
    constructor(location, name) {
        super(location);
        this._name = name;
    }

    get name() {
        return this._name;
    }

    eval(context, env) {
        let value = env.find(this._name);

        if (!value) {
            throw new RuntimeError("could not find name '" + this._name +"'", this.location);
        }

        return value;
    }

    toString() {
        return "[NameExpression " + this._name + "]";
    }
}

module.exports = NameExpression;