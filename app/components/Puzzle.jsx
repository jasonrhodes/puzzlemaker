const React = require("react");
const PuzzleRow = require("./PuzzleRow");

const Puzzle = props => {
  let clue = 0;
  const getNextClueNumber = () => {
    return clue += 1;
  };
  return (
    <div class="puzzle-grid">
      {props.puzzle.grid.map((row, i) => (
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