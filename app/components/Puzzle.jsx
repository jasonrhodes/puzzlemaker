const React = require("react");
const PuzzleRow = require("./PuzzleRow");
const { PuzzleContextProvider, PuzzleContext } = require("./PuzzleContext");

const Puzzle = ({ initialGrid }) => {
  const [title, setTitle] = React.useState("Title");
  const [author, setAuthor] = React.useState("Author");
  const handleTitleChange = e => {
    e.preventDefault();
    console.log("title change", { title, author, e, value: e.target.value, length: e.target.value.length });
    e.target.style.width = `${e.target.value.length}ch`;
    setTitle(e.target.value);
  }
  const handleAuthorChange = e => setAuthor(e.target.value);
  return (
    <PuzzleContextProvider initialGrid={initialGrid}>
      <div class="puzzle-info">
        <input class="inline-content-editable" value={title} type="text" onChange={handleTitleChange} />
        <span> by </span>
        <input class="inline-content-editable" value={author} type="text" onChange={handleAuthorChange} />
      </div>
      <PuzzleContext.Consumer>
        {puzzle => (
          <div class="puzzle-grid">
            {puzzle.grid.map((columns, i) => (
              <PuzzleRow
                key={`row-${i}`}
                row={i}
                columns={columns}
              />
            ))}
          </div>
        )}
      </PuzzleContext.Consumer>
    </PuzzleContextProvider>
  );
};

module.exports = Puzzle;