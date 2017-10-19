const React = require('react');
const Link = require('react-router-dom').Link

class About extends React.Component {

  render() {
    return (
      <div>
        <h1>About</h1>
        
        <p>This is a starter react app using react-router-dom to add routes!</p>
        
        <Link to='/home'>Go home</Link>
      </div>
    );
  }
}

module.exports = About;