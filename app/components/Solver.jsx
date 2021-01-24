const React = require("react");
const { Link } = require("react-router-dom");

const Solver = ({ initialGrid }) => {
  const [title] = React.useState("Untitled");
  const [author] = React.useState("Author");

  return (
    <div class="puzzle-info">
      <span>{title} by {author}</span>
    </div>
    <div>A puzzle</div>
  );
};


module.exports = Solver;