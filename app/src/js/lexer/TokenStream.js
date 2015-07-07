class TokenStream {
    constructor(tokens) {
        this._tokens = tokens;
        this._index = 0;
    }

    curr() {
        return this._index < this._tokens.length ? this._tokens[this._index] : null;
    }

    next() {
        this._index++;
        return this.curr();
    }

    peek() {
        return this._index + 1 < this._tokens.length ? this._tokens[this._index + 1] : null;
    }

    reset() {
        this._index = 0;
    }
}

module.exports = TokenStream;