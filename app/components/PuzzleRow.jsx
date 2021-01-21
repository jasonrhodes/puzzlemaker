const React = require("react");
const PuzzleCell = require("./PuzzleCell");

const PuzzleRow = props => {
  return (
    <div class="puzzle-row">
      {props.row.map((cell, i) => (
        <PuzzleCell
          row={props.row_id}
          column={i}
          value={cell}
          grid={props.grid}
          getNextClueNumber={props.getNextClueNumber}
        />
      ))}
    </div>
  );
};

module.exports = PuzzleRow;