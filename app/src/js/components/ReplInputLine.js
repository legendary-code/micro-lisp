let React = require('react'),
    ReplLine = require('./ReplLine');

/**
 * Represents the input box in a REPL box \u00bb
 */
class ReplInputLine extends React.Component {
    render() {
        let content =
            this.props.editable ?
            (<textarea
                ref="code"
                rows="1"
                spellcheck="false"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                onKeyDown={this._keyDown.bind(this)}
                onKeyUp={this._keyUp.bind(this)}>
            </textarea>) :
            this.props.children;

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
            return false;
        } else if (e.keyCode === 13) { // enter was pressed
            // possibly need to evaluate
            if (this.props.onSubmit(ref.value)) {
                // handled upstream
                ref.value = "";
                return false;
            }
        }

        return true;
    }

    _keyUp() {
        let ref = React.findDOMNode(this.refs.code);
        ref.rows = ref.value.split("\n").length;

        return true;
    }

    static get propTypes() {
        return {
            editable: React.PropTypes.bool,
            onSubmit: React.PropTypes.func.isRequired
        }
    }

    static get defaultProps() {
        return {
            editable: true
        };
    }
}

module.exports = ReplInputLine;