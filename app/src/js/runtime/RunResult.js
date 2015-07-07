/**
 * Represents the result of evaluating a program or expression
 */
class RunResult {
    constructor(expression, environment, error) {
        this._expression = expression;
        this._environment = environment;
        this._error = error;
    }

    get expression() {
        return this._expression;
    }

    get environment() {
        return this._environment;
    }

    get error() {
        return this._error;
    }
}

module.exports = RunResult;