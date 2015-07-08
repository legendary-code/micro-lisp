let React = require('react'),
    ReplBox = require('./ReplBox');

/**
 * Represents the main page of the site
 */
class Page extends React.Component {
    render() {
        return (
          <div className="page">
              <ReplBox />
          </div>
        );
    }
}

module.exports = Page;