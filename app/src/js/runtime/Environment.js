/**
 * Represents a table of names mapped to expressions, with scoping support
 */
class Environment {
    constructor() {
        this._env = [{}];
    }

    enterScope() {
        this._env.push({});
    }

    exitScope() {
        this._env.pop();
    }

    _currentScope() {
        return this._env[this._env.length - 1];
    }

    define(name, expression) {
        this._currentScope()[name] = expression;
    }

    find(name) {
        for (let i = this._env.length - 1; i >= 0; --i) {
            let env = this._env[i];

            if (env.hasOwnProperty(name)) {
                return env[name];
            }
        }

        return null;
    }

    defineGlobal(name, expression) {
        this._env[0][name] = expression;
    }

    findGlobal(name) {
        if (this._env[0].hasOwnProperty(name)) {
            return this._env[0][name];
        }

        return null;
    }
}

module.exports = Environment;