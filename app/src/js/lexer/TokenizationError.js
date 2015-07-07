let GeneralError = require('../common/GeneralError');

/**
 * Represents an error thrown during tokenization with contextual information
 */
class TokenizationError extends GeneralError {
    constructor(message, location) {
        super(message, location);
    }
}

module.exports = TokenizationError;