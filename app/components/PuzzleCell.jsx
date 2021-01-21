const React = require("react");
const classnames = require("classnames");
                      
const getCellLabel = ({ puzzle, row, column }) => {
  const { grid, getNextClueNumber } = puzzle;
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

const PuzzleCell = ({ value, row, column, puzzle }) => {
  const [activeRow, activeColumn] = puzzle.activeCell;
  const classes = classnames({
    "puzzle-cell": true,
    "puzzle-cell-x": !value,
    "active": (activeRow === row && activeColumn === column)
  });
  
  const label = getCellLabel({ row, column, puzzle });
  
  const handleClick = (e) => {
    console.log("I got clicked!", e);
    puzzle.setActiveCell(row, column);
  }
  return (
    <div class={classes} onClick={handleClick}>
      {value}
      {value && label ? <div class="label">{label}</div> : null}
    </div>
  );
};

module.exports = PuzzleCell;