const React = require("react");
const PuzzleCell = require("./PuzzleCell");
const { PuzzleContext } = require("./PuzzleContext");

const PuzzleRow = ({
  row,
  columns
}) => {
  return (
    <div class="puzzle-row">
      <PuzzleContext.Consumer>
        {puzzle => columns.map((cell, i) => (
          <PuzzleCell
            key={`cell-${row}-${i}`}
            row={row}
            column={i}
            cell={cell}
            puzzle={puzzle}
          />
        ))}
      </PuzzleContext.Consumer>
    </div>
  );
};

module.exports = PuzzleRow;
