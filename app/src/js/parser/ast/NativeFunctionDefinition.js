let Node = require('./Node');

/**
 * Represents a built-in function whose implementation is defined using native javascript
 */
class NativeFunctionDefinition extends Node {
    constructor(name, evalFunc) {
        super(null);
        this._name = name;
        this._evalFunc = evalFunc;
    }

    evalFunc(caller, env, args) {
        let evalFunc = this._evalFunc;
        return evalFunc(caller, env, ...args);
    }

    toString() {
        return "[NativeFunction " + this._name + "]";
    }
}

module.exports = NativeFunctionDefinition;