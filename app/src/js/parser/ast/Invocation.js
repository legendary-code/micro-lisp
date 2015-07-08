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

    eval(caller, env) {
        let funcDef = env.find(this._name);

        if (!funcDef) {
            throw new RuntimeError("function with name '" + this._name + "' not found", this.location)
        }

        if (funcDef.type == FunctionDefinition && funcDef.args.length != this._args.length) {
            throw new RuntimeError(
                "wrong number of arguments while invoking function '" + this._name +"', "+
                "expected " + funcDef.args.length +", was " + this._args.length,
                this.location
            );
        }

        let evaluatedArgs = [];
        for (let i = 0; i < this._args.length; ++i) {
            evaluatedArgs.push(this._args[i].eval(caller, env));
        }

        if (funcDef.constructor == FunctionDefinition) {
            return this._evalFunction(funcDef, env, evaluatedArgs);
        }

        if (funcDef.constructor == NativeFunctionDefinition) {
            return this._evalNativeFunction(funcDef, env, evaluatedArgs);
        }

        throw new RuntimeError(
            "name '" + this._name + "' is of wrong type for invocation, " +
            "expected FunctionDefinition, was " + funcDef.constructor.name,
            this.location
        );
    }

    _evalFunction(funcDef, env, args) {
        env.enterScope();

        for (let i = 0; i < this._args.length; ++i) {
            env.define(funcDef.args[i], args[i]);
        }

        let value = funcDef.expression.eval(funcDef, env);

        env.exitScope();

        return value;
    }

    _evalNativeFunction(funcDef, env, args) {
        return funcDef.evalFunc(funcDef, env, args);
    }

    toString() {
        return "[Invocation " + this._name + "]";
    }
}

module.exports = Invocation;