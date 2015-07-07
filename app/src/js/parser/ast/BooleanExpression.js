let LiteralExpression = require('./LiteralExpression');

class BooleanExpression extends LiteralExpression {
    constructor(location, value) {
        super(location, value);
    }
}

module.exports = BooleanExpression;