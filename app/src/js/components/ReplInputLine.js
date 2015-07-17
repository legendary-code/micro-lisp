let React = require('react'),
    ReplLine = require('./ReplLine');

/**
 * Represents the input box in a REPL box
 */
class ReplInputLine extends React.Component {
    constructor() {
        this.resetHistory();
    }

    render() {
        let content = (
                <textarea
                    ref="code"
                    rows={this.props.rows}
                    spellCheck="false"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    onKeyDown={this._keyDown.bind(this)}
                    onInput={this._onInput.bind(this)}
                    readOnly={this.props.readOnly}
                    value={this.props.children}>
                </textarea>
            );

        return (
            <ReplLine marginSymbol={"\u00bb"} contentClassName="repl-input-line-content">
                {content}
            </ReplLine>
        );
    }

    _keyDown(e) {
        let ref = React.findDOMNode(this.refs.code);

        if (e.keyCode === 9) { // tab was pressed

            // get caret position/selection
            var val = ref.value,
                start = ref.selectionStart,
                end = ref.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            ref.value = val.substring(0, start) + "  " + val.substring(end);

            // put caret at right position again
            ref.selectionStart = ref.selectionEnd = start + 2;

            // prevent the focus lose
            e.preventDefault();
        } else if (e.keyCode === 13) { // enter was pressed
            let submitResult = this.props.onSubmit(ref.value);

            // possibly need to evaluate
            if (submitResult == ReplInputLine.ACCEPTED || submitResult == ReplInputLine.ACCEPTED_NO_HISTORY) {
                // handled upstream
                if (submitResult == ReplInputLine.ACCEPTED) {
                    this.state.history[this.state.history.length - 1] = ref.value;
                    this.state.history.push("");
                    this.state.historyIndex = this.state.history.length - 1;
                }

                ref.value = "";
                this._adjustTextAreaSize();
                e.preventDefault();
            }
        } else if (e.keyCode === 38) { // up arrow
            if (this.state.historyIndex > 0) {
                this.state.historyIndex--;
                ref.value = this.state.history[this.state.historyIndex];
                this._adjustTextAreaSize();
            }
            e.preventDefault();
        } else if (e.keyCode === 40) { // down arrow
            if (this.state.historyIndex < this.state.history.length - 1) {
                this.state.historyIndex++;
                ref.value = this.state.history[this.state.historyIndex];
                this._adjustTextAreaSize();
            }
            e.preventDefault();
        }
    }

    _onInput() {
        let ref = React.findDOMNode(this.refs.code);
        this._adjustTextAreaSize();
        this.state.historyIndex = this.state.history.length - 1;
        this.state.history[this.state.historyIndex] = ref.value;
    }

    _adjustTextAreaSize() {
        let ref = React.findDOMNode(this.refs.code);
        ref.rows = ref.value.split("\n").length;
    }

    focus() {
        React.findDOMNode(this.refs.code).focus();
    }

    resetHistory() {
        this.state = {
            history: [""],
            historyIndex: 0
        };
    }

    static get propTypes() {
        return {
            readOnly: React.PropTypes.bool,
            rows: React.PropTypes.number,
            onSubmit: React.PropTypes.func
        }
    }

    static get defaultProps() {
        return {
            readOnly: false,
            rows: 1
        };
    }
}

ReplInputLine.CONTINUE = 0;
ReplInputLine.ACCEPTED = 1;
ReplInputLine.ACCEPTED_NO_HISTORY = 2;

module.exports = ReplInputLine;