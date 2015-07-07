/**
 * Represents a single token
 */
class Token {
    constructor(type, value, location) {
        this._type = type;
        this._value = value;
        this._location = location;
    }

    get type() {
        return this._type;
    }

    get value() {
        return this._value;
    }

    get location() {
        return this._location;
    }
}

module.exports = Token;