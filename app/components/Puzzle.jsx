const React = require("react");
const PuzzleRow = require("./PuzzleRow");
const { PuzzleContextProvider, PuzzleContext } = require("./PuzzleContext");
const { measureMyInputText } = require("./utils");

const Puzzle = ({ initialGrid }) => {
  const [title, setTitle] = React.useState("Untitled");
  const [author, setAuthor] = React.useState("Author");
  const handleTitleChange = e => {
    e.preventDefault();
    e.target.style.width = measureMyInputText(e.target.id) + 'px';
    setTitle(e.target.value);
  }
  const handleAuthorChange = e => {
    e.preventDefault();
    e.target.style.width = measureMyInputText(e.target.id) + 'px';
    setAuthor(e.target.value);
  }
  const handleClick = e => {
    console.log("Click")
    console.log("Click")
  }
  return (
    <PuzzleContextProvider initialGrid={initialGrid}>
      <div class="puzzle-info">
        <input id="title" class="inline-content-editable" style={{ width: '5ch' }} value={title} type="text" onChange={handleTitleChange} />
        <span> by </span>
        <input id="author" class="inline-content-editable" style={{ width: '6ch' }} value={author} type="text" onChange={handleAuthorChange} />
      </div>
      
      <PuzzleContext.Consumer>
        {puzzle => (
          <div class="puzzle-container">
            <div class="puzzle-grid">
              {puzzle.grid.map((columns, i) => (
                <PuzzleRow
                  key={`row-${i}`}
                  row={i}
                  columns={columns}
                />
              ))}
            </div>
            <div class="current-clues">
              <p>Across: {puzzle.words.across.word.toUpperCase()}</p>
              <p>Down: {puzzle.words.down.word.toUpperCase()}</p>
            </div>
          </div>
        )}
      </PuzzleContext.Consumer>
    </PuzzleContextProvider>
  );
};

module.exports = Puzzle;