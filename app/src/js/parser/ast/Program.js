let Node = require('./Node');

/**
 * Represents an entire program
 */
class Program extends Node {
    constructor(location, expressions) {
        super(location);
        this._expressions = expressions;
    }

    eval(context, env) {
        let lastExpr = null;

        // enter extra scope, so we can't clobber names in global namespace
        // that may have special meaning, like $stdout
        env.enterScope();

        this._expressions.forEach(e => {
            lastExpr = e.eval(context, env);
        });

        env.exitScope();

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