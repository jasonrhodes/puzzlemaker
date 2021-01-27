const React = require("react");
const { Link } = require("react-router-dom");

module.exports = function SavedPuzzleList() {
  const [puzzles, setPuzzles] = React.useState([]);
  React.useEffect(() => {
    setPuzzles(Object.keys(window.localStorage).map(id => {
      const puzzle = JSON.parse(window.localStorage.getItem(id));
      return {
        id,
        title: puzzle.title,
        author: puzzle.author
      }
    }));
  }, []);
  
  return (
    <ul className="saved-puzzle-list">
      {puzzles.map(({ id, title = "Untitled", author = "Unknown" }) => (
        <li key={id}>
          <Link to={"/edit/" + id}>{title} by {author}</Link>
        </li>
      ))}
    </ul>
  )
}