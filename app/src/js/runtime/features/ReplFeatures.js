let Features = require('./Features');

class ReplFeatures extends Features {
    constructor(hooks) {
        this._hooks = hooks;
    }

    install(env) {
        this.defineFunction(env, "help", this._help.bind(this));
        this.defineFunction(env, "clear", this._clear.bind(this));
        this.defineFunction(env, "reset", this._reset.bind(this));
        this.defineFunction(env, "github", this._github.bind(this));
    }

    _help(context, env, ...args) {
        if (args.length > 0) {
            throw this.badNumberOfArguments(context.name, 0);
        }

        env.println("(help)        - shows this information");
        env.println("(github)      - open github page for this project");
        env.println("(clear)       - clears output");
        env.println("(reset)       - reset everything");
        env.println("(names)       - prints a list of all defined names");
        env.println("(eval [expr]) - evaluate expr");

        return "";
    }

    _clear(context, env, ...args) {
        if (args.length > 0) {
            throw this.badNumberOfArguments(context.name, 0);
        }

        this._hooks.clear();
        return "";
    }

    _reset(context, env, ...args) {
        if (args.length > 0) {
            throw this.badNumberOfArguments(context.name, 0);
        }

        this._hooks.reset();
        return "";
    }

    _github(context, env, ...args) {
        if (args.length > 0) {
            throw this.badNumberOfArguments(context.name, 0);
        }

        window.open("https://github.com/legendary-code/micro-lisp", "_blank");
        return "";
    }
}

module.exports = ReplFeatures;