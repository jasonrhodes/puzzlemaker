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
        author: puzzle.author || "Author"
      }
    }));
  }, []);
  
  const storageDelete = (e) => {
    e.preventDefault();
    window.localStorage.removeItem(e.currentTarget.id.replace('del',''));
    location.reload();
  }
  if (puzzles.length) {
    return (
      <ul className="saved-puzzle-list">
        {puzzles.map(({ id, title, author }) => (
          <li key={id}>
            <Link to={"/edit/" + id}>{title} by {author}</Link> <a id={'del' + id} onClick={(e) => storageDelete(e) }><TrashIcon /></a>
          </li>
        ))}
      </ul>
    )
  } else {
    return (
      <div><i>No puzzles found...</i></div>
    )
  }
}