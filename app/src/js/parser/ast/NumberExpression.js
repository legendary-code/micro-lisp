let LiteralExpression = require('./LiteralExpression');

/**
 * Represents a number value
 */
class NumberExpression extends LiteralExpression {
    constructor(location, value) {
        super(location, value);
    }
}

module.exports = NumberExpression;