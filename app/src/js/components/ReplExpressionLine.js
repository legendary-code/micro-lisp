let React = require('react'),
    ReplLine = require('./ReplLine');

/**
 * Represents the return expression in textual form
 */
class ReplExpressionLine extends React.Component {
    render() {
        return (
            <ReplLine
                marginSymbol={"\u00ab"}
                contentClassName="repl-expression-line-content">
                {this.props.children}
            </ReplLine>
        );
    }
}

module.exports = ReplExpressionLine;