let LiteralExpression = require('./LiteralExpression');

/**
 * Represents a true or false value
 */
class BooleanExpression extends LiteralExpression {
    constructor(location, value) {
        super(location, value);
    }
}

module.exports = BooleanExpression;