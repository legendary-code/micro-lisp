let React = require('react'),
    ReplLine = require('./ReplLine');

/**
 * Represents the input box in a REPL box \u00bb
 */
class ReplInputLine extends React.Component {
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
            // possibly need to evaluate
            if (this.props.onSubmit(ref.value)) {
                // handled upstream
                ref.value = "";
                e.preventDefault();
            }
        }
    }

    _onInput() {
        let ref = React.findDOMNode(this.refs.code);
        ref.rows = ref.value.split("\n").length;
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

module.exports = ReplInputLine;