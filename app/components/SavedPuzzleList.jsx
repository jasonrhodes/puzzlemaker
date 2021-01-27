const React = require("react");
const { Link } = require("react-router-dom");
const { TrashIcon } = require("@primer/octicons-react");

module.exports = function SavedPuzzleList() {
  const [puzzles, setPuzzles] = React.useState([]);
  React.useEffect(() => {
    setPuzzles(Object.keys(window.localStorage).map(id => {
      const puzzle = JSON.parse(window.localStorage.getItem(id));
      return {
        id,
        title: puzzle.title || "Untitled",
        author: puzzle.author || "Nobody"
      }
    }));
  }, []);
  
  return (
    <ul className="saved-puzzle-list">
      {puzzles.map(({ id, title, author }) => (
        <li key={id}>
          <Link to={"/edit/" + id}>{title} by {author}</Link><TrashIcon />
        </li>
      ))}
    </ul>
  )
}