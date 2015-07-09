let ParseError = require('./ParseError'),
    TokenType = require('../lexer/TokenType'),
    Program = require('./ast/Program'),
    NumberExpression = require('./ast/NumberExpression'),
    StringExpression = require('./ast/StringExpression'),
    BooleanExpression = require('./ast/BooleanExpression'),
    Invocation = require('./ast/Invocation'),
    FunctionDefinition = require('./ast/FunctionDefinition'),
    NameExpression = require('./ast/NameExpression'),
    LetExpression = require('./ast/LetExpression');

/**
 * Represents a parser that is capable of parsing various expressions
 */
class Parser {
    constructor(stream) {
        this._stream = stream;
    }

    _expect(tokenType) {
        let token = this._stream.curr();
        if (!token) {
            throw new ParseError("unexpected end of input", null);
        }

        if (token.type != tokenType) {
            throw new ParseError(
                "unexpected token type, expected " + TokenType.toString(tokenType) +
                ", was " + TokenType.toString(token.type),
                token.location
            );
        }

        this._stream.next();
        return token;
    }

    _expectName(name) {
        let nameToken = this._expect(TokenType.NAME);

        if (nameToken.value != name) {
            throw new ParseError(
                "expected NAME token with value '" + name + "', but was '" + nameToken.value + "'",
                nameToken.location
            );
        }

        return nameToken;
    }

    _test(tokenType) {
        let token = this._curr();
        return token && token.type == tokenType;
    }

    _next() {
        let token = this._curr();
        this._stream.next();
        return token;
    }

    _curr() {
        let token = this._stream.curr();

        if (!token) {
            throw new ParseError("unexpected end of input", null);
        }

        return token;
    }

    _peek() {
        let token = this._stream.peek();

        if (!token) {
            throw new ParseError("unexpected end of input", null);
        }

        return token;
    }

    static parseProgram(stream) {
        let parser = new Parser(stream);
        return parser._parseProgram();
    }

    static parseExpression(stream) {
        let parser = new Parser(stream);
        return parser._parseExpression();
    }

    _parseProgram() {
        let location = this._expect(TokenType.LEFT_PAREN).location;
        this._expectName("program");
        let expressions = [];

        while (!this._test(TokenType.RIGHT_PAREN)) {
            expressions.push(this._parseExpression());
        }

        this._expect(TokenType.RIGHT_PAREN);

        return new Program(location, expressions);
    }

    _parseExpression() {
        let token = this._curr();

        switch (token.type) {
            case TokenType.NUMBER:
                this._next();
                return new NumberExpression(token.location, Number(token.value));

            case TokenType.STRING:
                this._next();
                return new StringExpression(token.location, token.value);

            case TokenType.LEFT_PAREN:
                if (this._peek().value == "defn") {
                    return this._parseFunctionDefinition();
                }

                return this._parseInvocation();

            case TokenType.NAME:
                this._next();
                return this._parseName(token.location, token.value);
        }

        throw new ParseError(
            "unexpected token '" + TokenType.toString(token.type) + "' while parsing expression",
            token.location
        );
    }

    _parseName(location, name) {
        if (name === "true" || name === "false") {
            return new BooleanExpression(location, name === "true");
        }

        return new NameExpression(location, name);
    }

    _parseInvocation() {
        let location = this._expect(TokenType.LEFT_PAREN).location;
        let nameToken = this._expect(TokenType.NAME);
        let expressions = [];

        while (!this._test(TokenType.RIGHT_PAREN)) {
            expressions.push(this._parseExpression());
        }

        this._expect(TokenType.RIGHT_PAREN);

        return new Invocation(location, nameToken.value, expressions);
    }

    _parseFunctionDefinition() {
        let location = this._expect(TokenType.LEFT_PAREN).location;
        this._expectName("defn");
        let nameToken = this._expect(TokenType.NAME);
        this._expect(TokenType.LEFT_PAREN);

        let args = [];

        while (!this._test(TokenType.RIGHT_PAREN)) {
            args.push(this._expect(TokenType.NAME).value);
        }

        this._expect(TokenType.RIGHT_PAREN);

        let expression = this._parseExpression();

        this._expect(TokenType.RIGHT_PAREN);

        return new FunctionDefinition(location, nameToken.value, args, expression);
    }
}

module.exports = Parser;