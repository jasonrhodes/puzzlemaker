const React = require("react");
const PuzzleCell = require("./PuzzleCell");

const PuzzleRow = ({
  row,
  columns
}) => {
  return (
    <div class="puzzle-row">
      {columns.map((cell, i) => (
        <PuzzleCell
          row={row}
          column={i}
          value={cell}
        />
      ))}
    </div>
  );
};

module.exports = PuzzleRow;
