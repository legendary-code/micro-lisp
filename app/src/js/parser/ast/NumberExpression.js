let LiteralExpression = require('./LiteralExpression');

class NumberExpression extends LiteralExpression {
    constructor(location, value) {
        super(location, value);
    }
}

module.exports = NumberExpression;