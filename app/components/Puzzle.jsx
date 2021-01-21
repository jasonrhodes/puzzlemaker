const React = require("react");
const PuzzleRow = require("./PuzzleRow");

const Puzzle = props => {
  const [puzzleState, setPuzzleState] = {
    activeCell: false,
    grid: props.grid
  }; // set via local storage at some point, for saved puzzles?
  let clue = 0;
  const getNextClueNumber = () => {
    return clue += 1;
  };
  return (
    <div class="puzzle-grid">
      {props.grid.map((columns, i) => (
        <PuzzleRow
          key={`row-${i}`}
          row={i}
          columns={columns}
          getNextClueNumber={getNextClueNumber}
          puzzleState={puzzleState}
          setPuzzleState={setPuzzleState}
        />
      ))}
    </div>
  );
};

module.exports = Puzzle;