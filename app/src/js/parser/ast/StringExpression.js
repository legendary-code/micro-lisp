let LiteralExpression = require('./LiteralExpression');

class StringExpression extends LiteralExpression {
    constructor(location, value) {
        super(location, value);
    }

    toString() {
        return "\"" + this.value + "\"";
    }
}

module.exports = StringExpression;