const React = require("react");
const PuzzleCell = require("./PuzzleCell");

const PuzzleRow = ({ row, columns, puzzleState, setPuzzleState, getNextClueNumber }) => {
  return (
    <div class="puzzle-row">
      {columns.map((cell, i) => (
        <PuzzleCell
          row={row}
          column={i}
          value={cell}
          getNextClueNumber={getNextClueNumber}
          puzzleState={puzzleState}
          setPuzzleState={setPuzzleState}
        />
      ))}
    </div>
  );
};

module.exports = PuzzleRow;