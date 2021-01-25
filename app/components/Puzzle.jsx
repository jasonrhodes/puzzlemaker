const React = require("react");
const PuzzleRow = require("./PuzzleRow");
const PuzzleMenu = require("./PuzzleMenu");
const { PuzzleContext } = require("./PuzzleContext");
const PuzzleTitle = require("./PuzzleTitle");

const convertAnswerToSquares = (clue) => {
  var chars = clue.split('');
  return chars.map((char, i) => (
    <span class={char == '-' ? 'emptycell' : ''}>{char}</span>
  ))
};

const CurrentClues = ({ puzzle }) => {
  
}

const Puzzle = ({ initialGrid }) => {
  
  
  return (
    <PuzzleContext.Consumer>
      {puzzle => (
        <div>
          <PuzzleTitle />
          <div class="puzzle-container">
            <PuzzleMenu puzzle={puzzle}/>
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
              <div id="across">
                <h3>1 Across:</h3>
                <div class="current">{clueBreaker(puzzle.words.across.word.toUpperCase())}</div>
                <div class="suggestions"></div>
              </div>
              <div id="down">
                <h3>1 Down:</h3>
                <div class="current">{clueBreaker(puzzle.words.down.word.toUpperCase())}</div>
                <div class="suggestions"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PuzzleContext.Consumer>
  );
};

module.exports = Puzzle;