let React = require('react'),
    ReplLine = require('./ReplLine');

/**
 * Represents a block of output written to stdout from evaluating an expression
 */
class ReplOutputLine extends React.Component {
    render() {
        return (
            <ReplLine>
                {this.props.children}
            </ReplLine>
        );
    }
}

module.exports = ReplOutputLine;