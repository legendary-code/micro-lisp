/**
 * Represents a line and column location in a blob of text
 */
class Location {
    constructor(line, column) {
        this._line = line;
        this._column = column;
    }

    get line() {
        return this._line;
    }

    get column() {
        return this._column;
    }

    toString() {
        return this._line + ":" + this._column;
    }
}

module.exports = Location;