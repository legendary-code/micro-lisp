let React = require('react');

/**
 * Represents a single block of output or input inside REPL box, along with a margin which may optionally
 * contain a symbol
 */
class ReplLine extends React.Component {
    render() {
        let marginClass = "margin";
        let contentClass = "content";

        if (this.props.marginClassName) {
            marginClass += " " + this.props.marginClassName;
        }

        if (this.props.contentClassName) {
            contentClass += " " + this.props.contentClassName;
        }

        return (
            <div className="repl-line">
                <div className={marginClass}>
                    {this.props.marginSymbol}
                </div>
                <div className={contentClass}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    static get propTypes() {
        return {
            marginSymbol: React.PropTypes.string,
            marginClassName: React.PropTypes.string,
            contentClassName: React.PropTypes.string
        };
    }

    static get defaultProps() {
        return {
            marginSymbol: ""
        }
    }
}

module.exports = ReplLine;