let React = require('react'),
    ReplOutputLine = require('./ReplOutputLine'),
    ReplExpressionLine = require('./ReplExpressionLine'),
    ReplInputLine = require('./ReplInputLine'),
    ReplErrorLine = require('./ReplErrorLine'),
    Repl = require('../runtime/Repl'),
    NativeFunctionDefinition = require('../parser/ast/NativeFunctionDefinition'),
    FunctionDefinition = require('../parser/ast/FunctionDefinition'),
    Invocation = require('../parser/ast/Invocation'),
    StringExpression = require('../parser/ast/StringExpression'),
    RuntimeError = require('../runtime/RuntimeError');

/**
 * Represents a REPL component with input box and scrolling output
 */
class ReplBox extends React.Component {
    constructor() {
        this.state = {
            lines: []
        };

        this._reset();
    }

    _reset() {
        this.state.lines = [
            <ReplOutputLine>
                Welcome to the Micro-Lisp REPL!<br />
                Type '(help)' for a list of commands
            </ReplOutputLine>
        ];

        this._repl = new Repl();
        this._installCommand("help");
        this._installCommand("clear");
        this._installCommand("reset");
    }

    _installCommand(command) {
        this._repl.env.defineGlobal(
            command,
            new NativeFunctionDefinition(
                null,
                v => this._replCommand.apply(this, [command])
            )
        );
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
        if (!this._repl.canParse(code)) {
            return false;
        }

        let lines = this.state.lines;
        lines.push(
            <ReplInputLine editable={false}>{code}</ReplInputLine>
        );

        let result = this._repl.eval(code);
        let stdout = this._repl.env.findGlobal("$stdout");
        this._repl.env.defineGlobal("$stdout", null);

        if (this.state.replCommandExecuted) {
            this.setState({lines: this.state.lines, replCommandExecuted: false});
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

    _replCommand(command) {
        this.state.replCommandExecuted = true;

        switch (command) {
            case "help":
                this.state.lines.push(
                    <ReplOutputLine>
                        (help)  - shows this information<br/>
                        (clear) - clears output<br />
                        (reset) - reset everything
                    </ReplOutputLine>
                );
                break;

            case "clear":
                this.state.lines = [];
                break;

            case "reset":
                this._reset();
                break;
        }

        return true;
    }
}

module.exports = ReplBox;