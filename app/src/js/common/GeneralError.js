/**
 * Represents any error that has location information
 */
class GeneralError {
    constructor(message, location) {
        this._message = message;
        this._location = location;
    }

    get message() {
        return this._message;
    }

    get location() {
        return this._location;
    }

    toString() {
        return this.constructor.name + ": " + this._message + (this._location ? " at " + this._location.toString() : "");
    }
}

module.exports = GeneralError;