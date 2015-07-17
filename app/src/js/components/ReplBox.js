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
    RuntimeError = require('../runtime/RuntimeError'),
    ReplFeatures = require('../runtime/features/ReplFeatures');

/**
 * Represents a REPL component with input box and scrolling output
 */
class ReplBox extends React.Component {
    constructor() {
        this._reset();
        this.state = {
            lines: this._lines
        };
    }

    componentDidMount() {
        this.refs.inputLine.focus();
    }

    _updateLines() {
        this.setState({lines: this._lines});
    }

    _reset() {
        this._lines = [
            <ReplOutputLine>
                Welcome to the Micro-Lisp REPL!<br />
                Type '(help)' for a list of commands
            </ReplOutputLine>
        ];

        this._repl = new Repl();
        new ReplFeatures({
            clear: this._clearCommand.bind(this),
            reset: this._resetCommand.bind(this)
        }).install(this._repl.env);
    }

    render() {
        return (
            <div className="repl-box">
                <div className="inner-box">
                    {this.state.lines}
                    <ReplInputLine ref="inputLine" onSubmit={this._onSubmit.bind(this)}/>
                </div>
            </div>
        );
    }

    _onSubmit(code) {
        if (!this._repl.canParse(code)) {
            return ReplInputLine.CONTINUE;
        }

        this._lines.push(
            <ReplInputLine readOnly={true} rows={code.split("\n").length}>{code}</ReplInputLine>
        );

        let result = this._repl.eval(code);
        let stdout = this._repl.env.getStdout();
        this._repl.env.clearStdout();

        if (stdout) {
            this._lines.push(
                <ReplOutputLine>{stdout}</ReplOutputLine>
            );
        }

        if (result.expression) {
            this._lines.push(
                <ReplExpressionLine>{result.expression.toString()}</ReplExpressionLine>
            );
        }

        if (result.error) {
            this._lines.push(
                <ReplErrorLine>{result.error.toString()}</ReplErrorLine>
            );
        }

        this._updateLines();

        let action = this._preventHistory ? ReplInputLine.ACCEPTED_NO_HISTORY : ReplInputLine.ACCEPTED;
        this._preventHistory = false;
        return action;
    }

    _clearCommand() {
        this._lines = [];
        this._updateLines();
    }

    _resetCommand() {
        this._reset();
        this._updateLines();
        this.refs.inputLine.resetHistory();
        this._preventHistory = true;
    }
}

module.exports = ReplBox;