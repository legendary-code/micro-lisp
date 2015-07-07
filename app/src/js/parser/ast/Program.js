let Node = require('./Node');

class Program extends Node {
    constructor(location, expressions) {
        super(location);
        this._expressions = expressions;
    }

    eval(env) {
        let lastExpr = null;

        this._expressions.forEach(e => {
            lastExpr = e.eval(env);
        });

        return lastExpr;
    }

    get expressions() {
        return this._expressions;
    }

    toString() {
        return "[Program]";
    }
}

module.exports = Program;