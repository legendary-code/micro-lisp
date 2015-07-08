let React = require('react'),
    ReplLine = require('./ReplLine');

/**
 * Represents an error that occurred during evaluation
 */
class ReplErrorLine extends React.Component {
    render() {
        return (
            <ReplLine
                marginSymbol="!"
                marginClassName="repl-error-line-margin"
                contentClassName="repl-error-line-content">
                {this.props.children}
            </ReplLine>
        );
    }
}

module.exports = ReplErrorLine;