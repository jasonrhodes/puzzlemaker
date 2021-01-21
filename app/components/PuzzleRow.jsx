const React = require("react");
const PuzzleCell = require("./PuzzleCell");

const PuzzleRow = ({ row, columns, ...rest }) => {
  return (
    <div class="puzzle-row">
      {columns.map((cell, i) => (
        <PuzzleCell
          row={row}
          column={i}
          {...rest}
        />
      ))}
    </div>
  );
};

module.exports = PuzzleRow;