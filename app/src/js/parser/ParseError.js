let GeneralError = require('../common/GeneralError');

/**
 * Represents an error that occurred while parsing
 */
class ParseError extends GeneralError {
    constructor(message, location) {
        super(message, location);
    }
}

module.exports = ParseError;