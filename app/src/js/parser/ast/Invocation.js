let Node = require('./Node'),
    RuntimeError = require('../../runtime/RuntimeError'),
    FunctionDefinition = require('./FunctionDefinition'),
    NativeFunctionDefinition = require('./NativeFunctionDefinition');

/**
 * Represents an invocation of a function
 */
class Invocation extends Node {
    constructor(location, name, args) {
        super(location);
        this._name = name;
        this._args = args;
    }

    get name() {
        return this._name;
    }

    get args() {
        return this._args;
    }

    eval(context, env) {
        let funcDef = env.find(this._name);

        if (!funcDef) {
            throw new RuntimeError("function with name '" + this._name + "' not found", this.location)
        }

        switch (funcDef.type) {
            case FunctionDefinition:
                return this._evalFunction(funcDef, env);

            case NativeFunctionDefinition:
                return this._evalNativeFunction(funcDef, env);
        }

        throw new RuntimeError(
            "name '" + this._name + "' is of wrong type for invocation, " +
            "expected FunctionDefinition, was " + funcDef.constructor.name,
            this.location
        );
    }

    _evalFunction(funcDef, env) {
        if (funcDef.args.length != this._args.length) {
            throw new RuntimeError(
                "wrong number of arguments while invoking function '" + this._name +"', "+
                "expected " + funcDef.args.length +", was " + this._args.length,
                this.location
            );
        }

        let evaluatedArgs = [];
        for (let i = 0; i < this._args.length; ++i) {
            evaluatedArgs.push(this._args[i].eval(this, env));
        }

        env.enterScope();

        for (let i = 0; i < this._args.length; ++i) {
            env.define(funcDef.args[i], evaluatedArgs[i]);
        }

        let value = funcDef.expression.eval(this, env);

        env.exitScope();

        return value;
    }

    _evalNativeFunction(funcDef, env) {
        // We don't evaluate arguments: we allow the native function to decide when and how to evaluate them
        return funcDef.evalFunc(this, env, this._args);
    }

    toString() {
        return "[Invocation " + this._name + "]";
    }
}

module.exports = Invocation;