const React = require("react");
const PuzzleRow = require("./PuzzleRow");

const Puzzle = props => {
  const [puzzleState, setPuzzleState] = {
    activeCell: false
  }; // set via local storage at some point, for saved puzzles?
  let clue = 0;
  const getNextClueNumber = () => {
    return clue += 1;
  };
  return (
    <div class="puzzle-grid">
      {props.grid.map((row, i) => (
        <PuzzleRow
          key={`row-${i}`}
          row_id={i}
          row={row}
          grid={props.grid}
          getNextClueNumber={getNextClueNumber}
        />
      ))}
    </div>
  );
};

module.exports = Puzzle;