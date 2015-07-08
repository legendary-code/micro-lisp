let React = require('react'),
    ReplOutputLine = require('./ReplOutputLine'),
    ReplExpressionLine = require('./ReplExpressionLine'),
    ReplInputLine = require('./ReplInputLine'),
    ReplErrorLine = require('./ReplErrorLine'),
    Repl = require('../runtime/Repl'),
    Invocation = require('../parser/ast/Invocation');

/**
 * Represents a REPL component with input box and scrolling output
 */
class ReplBox extends React.Component {
    constructor() {
        this.state = {
            lines: [
                <ReplOutputLine>
                    Welcome to the Micro-Lisp REPL!<br />
                    Type '(help)' for a list of commands
                </ReplOutputLine>
            ]
        };

        this._repl = new Repl();
        this._repl.eval("(defn help () (let $replCommand \"help\"))");
        this._repl.eval("(defn clear () (let $replCommand \"clear\"))");
    }

    render() {
        return (
            <div className="repl-box">
                <div className="inner-box">
                    {this.state.lines}
                    <ReplInputLine onSubmit={this._onSubmit.bind(this)}/>
                </div>
            </div>
        );
    }

    _onSubmit(code) {
        if (!this._repl.canEval(code)) {
            return false;
        }

        let result = this._repl.eval(code);
        let lines = this.state.lines;
        let stdout = this._repl.env.findGlobal("$stdout");
        let cmd = this._repl.env.findGlobal("$replCommand");

        this._repl.env.defineGlobal("$stdout", null);
        this._repl.env.defineGlobal("$replCommand", null);

        lines.push(
            <ReplInputLine editable={false}>{code}</ReplInputLine>
        );

        // repl commands
        if (cmd) {
            switch (cmd.value) {
                case "help":
                    lines.push(
                        <ReplOutputLine>
                            (help)  - shows this information<br/>
                            (clear) - clears output
                        </ReplOutputLine>
                    );
                    break;

                case "clear":
                    lines = [];
                    break;
            }

            this.setState({lines: lines});
            return true;
        }

        if (stdout) {
            lines.push(
                <ReplOutputLine>{stdout}</ReplOutputLine>
            );
        }

        if (result.expression) {
            lines.push(
                <ReplExpressionLine>{result.expression.toString()}</ReplExpressionLine>
            );
        }

        if (result.error) {
            lines.push(
                <ReplErrorLine>{result.error.toString()}</ReplErrorLine>
            );
        }

        this.setState({lines: lines});

        return true;
    }
}

module.exports = ReplBox;