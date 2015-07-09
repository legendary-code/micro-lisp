/**
 * Represents a table of names mapped to expressions, with scoping support
 */
class Environment {
    /**
     * @return {string}
     */
    static get STDOUT() {
        return "$stdout";
    }

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

    print(value) {
        this._env[0][Environment.STDOUT] = this.getStdout() + value;
    }

    println(value) {
        this.print(value + "\n");
    }

    getStdout() {
        return this._env[0][Environment.STDOUT] || "";
    }

    clearStdout() {
        delete this._env[0][Environment.STDOUT];
    }

    get names() {
        let allNames = {};

        this._env.forEach(names => {
            for (let name in names) {
                if (names.hasOwnProperty(name)) {
                    allNames[name] = names[name];
                }
            }
        });

        return allNames;
    }
}

module.exports = Environment;