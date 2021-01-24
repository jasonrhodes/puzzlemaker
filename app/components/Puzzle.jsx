const React = require("react");
const PuzzleRow = require("./PuzzleRow");
const { PuzzleContextProvider, PuzzleContext } = require("./PuzzleContext");

const Puzzle = ({ initialGrid }) => {
  const [title, setTitle] = React.useState("Title");
  const [author, setAuthor] = React.useState("Author");
  const handleTitleChange = e => setTitle
  return (
    <PuzzleContextProvider initialGrid={initialGrid}>
      <div class="puzzle-info">
        <input type="text" value={title} onChange={handleTitleChange} /> by <input type="text" value={author} onChange={handleAuthorChange} />
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