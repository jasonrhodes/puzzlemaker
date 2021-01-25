const React = require("react");
const PuzzleRow = require("./PuzzleRow");
const PuzzleMenu = require("./PuzzleMenu");
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
    console.log(e)
  }
  return (
    <PuzzleContextProvider initialGrid={initialGrid}>
      <div class="puzzle-info">
        <input id="title" class="inline-content-editable" style={{ width: '6ch' }} value={title} type="text" onChange={handleTitleChange} />
        <span> by </span>
        <input id="author" class="inline-content-editable" style={{ width: '57px' }} value={author} type="text" onChange={handleAuthorChange} />
      </div>
      <PuzzleContext.Consumer>
        {puzzle => (
          <div class="puzzle-container">
            <PuzzleMenu puzzle={puzzle} />
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
              <div id="across"><h3>1 Across:</h3><span class="current">{puzzle.words.across.word.toUpperCase()}</span></div>
              <div id="down"><h3>1 Down:</h3><span class="current">{puzzle.words.down.word.toUpperCase()}</span></div>
            </div>
          </div>
        )}
      </PuzzleContext.Consumer>
    </PuzzleContextProvider>
  );
};

module.exports = Puzzle;