let TokenStream = require('./TokenStream'),
    Token = require('./Token'),
    Location = require('./Location'),
    TokenType = require('./TokenType'),
    State = require('./State'),
    TokenizationError = require('./TokenizationError');

/**
 * A utility class that implements a tokenize method to create a TokenStream from text input
 */
class Tokenizer {
    constructor(text) {
        this._text = text;
        this._index = 0;
        this._row = 1;
        this._column = 1;
        this._tokens = [];
        this._value = "";
        this._state = State.SCANNING_ANY;
    }

    static tokenize(text) {
        let tokenizer = new Tokenizer(text);
        return tokenizer._tokenize();
    }

    _mark() {
        this._loc = new Location(this._row, this._column);
    }

    _location() {
        return this._loc;
    }

    _peek() {
        return this._text && this._index + 1 < this._text.length ? this._text[this._index + 1] : null;
    }

    _curr() {
        return this._text && this._index < this._text.length ? this._text[this._index] : null;
    }

    _next() {
        this._index++;

        let ch = this._curr();

        if (ch == "\n") {
            this._row++;
            this._column = 0;
        } else {
            this._column++;
        }

        return ch;
    }

    _error(message) {
        throw new TokenizationError(message, this._location());
    }

    _tokenize() {
        while (this._curr()) {
            let advance;

            switch (this._state) {
                case State.SCANNING_ANY:
                    advance = this._tokenizeAny();
                    break;

                case State.SCANNING_NAME:
                    advance = this._tokenizeName();
                    break;

                case State.SCANNING_NUMBER:
                    advance = this._tokenizeNumber();
                    break;

                case State.SCANNING_STRING:
                    advance = this._tokenizeString();
                    break;

                default:
                    // should never reach this code
                    this._mark();
                    this._error("unknown state " + this._state);
            }

            if (advance) {
                this._next();
            }
        }

        if (this._value) {
            this._guessToken();
        }

        return new TokenStream(this._tokens);
    }

    _guessToken() {
        switch (this._state) {
            case State.SCANNING_NAME:
                this._token(TokenType.NAME);
                break;

            case State.SCANNING_NUMBER:
                this._token(TokenType.NUMBER);
                break;

            case State.SCANNING_STRING:
                this._token(TokenType.STRING);
                break;
        }
    }

    _token(type) {
        this._tokens.push(new Token(type, this._value, this._location()));
        this._value = "";
    }

    _append(ch) {
        this._value += ch;
    }

    _tokenizeAny() {
        let ch = this._curr();

        if (this._isWhitespace(ch)) {
            return true;
        }

        this._mark();

        switch (ch) {
            case "(":
                this._append(ch);
                this._token(TokenType.LEFT_PAREN);
                return true;

            case ")":
                this._append(ch);
                this._token(TokenType.RIGHT_PAREN);
                return true;

            case "\"":
                this._state = State.SCANNING_STRING;
                return true;

            case "-":
                this._append(ch);
                if (this._isNumber(this._peek())) {
                    this._state = State.SCANNING_NUMBER;
                } else {
                    this._state = State.SCANNING_NAME;
                }

                return true;
        }

        if (this._isNumber(ch)) {
            this._append(ch);
            this._state = State.SCANNING_NUMBER;
            return true;
        }

        this._append(ch);
        this._state = State.SCANNING_NAME;
        return true;
    }

    _tokenizeName() {
        let ch = this._curr();

        if (this._isWhitespace(ch)) {
            this._state = State.SCANNING_ANY;
            this._token(TokenType.NAME);
            return true;
        }

        switch (ch) {
            case "\"":
            case "(":
            case ")":
                this._state = State.SCANNING_ANY;
                this._token(TokenType.NAME);
                return false;
        }

        this._append(ch);
        return true;
    }

    _tokenizeNumber() {
        let ch = this._curr();

        if (this._isWhitespace(ch)) {
            this._state = State.SCANNING_ANY;
            this._token(TokenType.NUMBER);
            return true;
        }

        if (!this._isNumber(ch)) {
            this._state = State.SCANNING_ANY;
            this._token(TokenType.NUMBER);
            return false;
        }

        this._append(ch);
        return true;
    }

    _tokenizeString() {
        let ch = this._curr();

        switch (ch) {
            case "\\":

                switch (this._peek()) {
                    case "n":
                        this._append("\n");
                        this._next();
                        return true;

                    case "\"":
                        this._append("\"");
                        this._next();
                        return true;
                }

                this._append(ch);
                return true;

            case "\"":
                this._state = State.SCANNING_ANY;
                this._token(TokenType.STRING);
                return true;
        }

        this._append(ch);
        return true;
    }

    _isNumber(value) {
        return !isNaN(parseInt(value));
    }

    _isWhitespace(value) {
        return /\s/.test(value);
    }
}

module.exports = Tokenizer;