let GeneralError = require('../common/GeneralError');

/**
 * Represents an error that occurred during evaluation
 */
class RuntimeError extends GeneralError {
    constructor(message, location) {
        super(message, location);
    }
}

module.exports = RuntimeError;