/**
 * Represents an error throw during tokenization with contextual information
 */
class TokenizationError {
    constructor(message, location) {
        this._message = message;
        this._location = location;
    }

    toString() {
        return this._message + " at " + this._location.toString();
    }
}

module.exports = TokenizationError;