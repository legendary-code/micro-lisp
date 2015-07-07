/**
 * Represents the possible states of Tokenizer
 */
class State {
    /**
     * @return {number}
     */
    static get SCANNING_ANY() {
        return 1;
    }

    /**
     * @return {number}
     */
    static get SCANNING_STRING() {
        return 2;
    }

    /**
     * @return {number}
     */
    static get SCANNING_NUMBER() {
        return 3;
    }

    /**
     * @return {number}
     */
    static get SCANNING_NAME() {
        return 4;
    }
}

module.exports = State;