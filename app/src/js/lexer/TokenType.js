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

    static toString(type) {
        switch (type) {
            case 1:
                return "LEFT_PAREN";

            case 2:
                return "RIGHT_PAREN";

            case 3:
                return "NUMBER";

            case 4:
                return "STRING";

            case 5:
                return "NAME";
        }

        return "UNKNOWN";
    }
}

module.exports = TokenType;
