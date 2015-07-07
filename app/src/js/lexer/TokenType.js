/**
 * Implements a set of supported token types
 */
class TokenType {
    /**
     * @return {number}
     */
    static get LEFT_PAREN() {
        return 1;
    }

    /**
     * @return {number}
     */
    static get RIGHT_PAREN() {
        return 2;
    }

    /**
     * @return {number}
     */
    static get NUMBER() {
        return 3;
    }

    /**
     * @return {number}
     */
    static get STRING() {
        return 4;
    }

    /**
     * @return {number}
     */
    static get NAME() {
        return 5;
    }
}

module.exports = TokenType;
