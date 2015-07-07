let GeneralError = require('../common/GeneralError');

/**
 * Represents an error that occurred during execution
 */
class RuntimeError extends GeneralError {
    constructor(message, location) {
        super(message, location);
    }
}

module.exports = RuntimeError;