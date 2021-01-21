const React = require("react");
const classnames = require("classnames");
                      
const getCellLabel = ({ puzzleState, row, column, getNextClueNumber }) => {
  const { grid } = puzzleState;
  const currentCell = grid[row][column];
  if (!currentCell) {
    return false;
  }
  if (row === 0) {
    return getNextClueNumber();
  }
  if (column === 0) {
    return getNextClueNumber();
  }
  if (grid[row][column - 1] === false) {
    return getNextClueNumber();
  }
  if (grid[row - 1][column] === false) {
    return getNextClueNumber();
  }
  return false;
};

// onClick={(e) => setPuzzleState({ ...puzzleState, activeCell: [row, column] })}

const PuzzleCell = ({ value, row, column, getNextClueNumber, puzzleState, setPuzzleState }) => {
  let classes = ["puzzle-cell"];
  if (!value) {
    classes.push("puzzle-cell-x");
  }
  const [activeRow, activeColumn] = puzzleState.activeCell;
  if (activeRow === row && activeColumn === column) {
    classes.push("active");
  }
  const label = getCellLabel({ row, column, puzzleState, getNextClueNumber });
  return (
    <div class={classes.join(" ")}>
      {value}
      {value && label ? <div class="label">{label}</div> : null}
    </div>
  );
};

module.exports = PuzzleCell;