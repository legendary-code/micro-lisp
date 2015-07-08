let Expression = require('./Expression');

/**
 * Represents an expression whose value and evaluation results in a simple value, such as a string, number or boolean
 */
class LiteralExpression extends Expression {
    constructor(location, value) {
        super(location);
        this._value = value;
    }

    eval(caller, env) {
        return this;
    }

    get value() {
        return this._value;
    }

    toString() {
        return String(this.value);
    }
}

module.exports = LiteralExpression;