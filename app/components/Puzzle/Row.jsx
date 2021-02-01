const React = require("react");
const Cell = require("./Cell");
const { PuzzleContext } = require("./Context");

const PuzzleRow = ({
  row,
  columns
}) => {
  return (
    <div class="puzzle-row">
      <PuzzleContext.Consumer>
        {puzzle => columns.map((cell, i) => (
          <Cell
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
