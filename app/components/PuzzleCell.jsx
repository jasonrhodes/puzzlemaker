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

const PuzzleCell = ({ value, row, column, getNextClueNumber, puzzleState, setActiveCell }) => {
  const [activeRow, activeColumn] = puzzleState.activeCell;
  const classes = ["puzzle-cell", {
    "puzzle-cell-x": !value,
    active: (activeRow === row && activeColumn === column)
  }];
  const label = getCellLabel({ row, column, puzzleState, getNextClueNumber });
  return (
    <div class={classes} onClick={e => setActiveCell(row, column)}>
      {value}
      {value && label ? <div class="label">{label}</div> : null}
    </div>
  );
};

module.exports = PuzzleCell;