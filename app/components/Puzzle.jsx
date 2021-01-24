const React = require("react");
const PuzzleRow = require("./PuzzleRow");
const { PuzzleContextProvider, PuzzleContext } = require("./PuzzleContext");

const Puzzle = ({ initialGrid }) => {
  const [title, setTitle] = React.useState("Title");
  const [author, setAuthor] = React.useState("Author");
  const handleTitleChange = e => setTitle(e.target.value);
  const handleAuthorChange = e => setAuthor(e.target.value);
  return (
    <PuzzleContextProvider initialGrid={initialGrid}>
      <div class="puzzle-info">
        <span class="inline-content-editable" contenteditable={true} onInput={handleTitleChange}>
          {title}
        </span>
        by
        <span class="inline-content-editable" contenteditable={true} onInput={handleAuthorChange}>
          {author}
        </span>
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