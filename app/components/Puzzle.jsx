const React = require("react");
const PuzzleRow = require("./PuzzleRow");
const { PuzzleContextProvider, PuzzleContext } = require("./PuzzleContext");
const { measureMyInputText } = require("./utils");

const Puzzle = ({ initialGrid }) => {
  const [title, setTitle] = React.useState("Untitled");
  const [author, setAuthor] = React.useState("Author");
  const handleTitleChange = e => {
    e.preventDefault();
    var tid = e.target.id;
    console.log(measureMyInputText(tid));
    e.target.style.width = measureMyInputText(tid) + 'px';
    
    setTitle(e.target.value);
  }
  const handleAuthorChange = e => {
    e.preventDefault();
    var aid = e.target.id;
    e.target.style.width = measureMyInputText(aid) + 'px';
    setAuthor(e.target.value);
  }
  return (
    <PuzzleContextProvider initialGrid={initialGrid}>
      <div class="puzzle-info">
        <input id="title" class="inline-content-editable" style={{ width: '8ch' }} value={title} type="text" onChange={handleTitleChange} />
        <span> by </span>
        <input id="author" class="inline-content-editable" value={author} type="text" onChange={handleAuthorChange} />
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