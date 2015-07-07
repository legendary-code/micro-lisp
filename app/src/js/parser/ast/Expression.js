let Node = require('./Node');

/**
 * Abstract representation for an expression
 */
class Expression extends Node {
    constructor(location) {
        super(location);
    }
}

module.exports = Expression;