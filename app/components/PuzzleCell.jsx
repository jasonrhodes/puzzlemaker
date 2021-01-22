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
    active: activeRow === row && activeColumn === column,
    highlighted: value && puzzle.isCellInActiveWord(row, column)
  });

  const label = getCellLabel({ row, column, puzzle });

  const handleClick = e => {
    const [currentRow, currentColumn] = puzzle.activeCell;
    if (row === currentRow && column === currentColumn) {
      puzzle.toggleDirection();
    } else {
      puzzle.setActiveCell([row, column]);
    }
  };
  
  const handleKeyDown = e => {
    const [activeRow, activeColumn] = puzzle.activeCell;
    if (e.key === ".") {
      puzzle.updateCellValue(activeRow, activeColumn, !puzzle.grid[activeRow][activeColumn]);
      return;
    }
    if (e.key === "ArrowRight") {
      const nextColumn = Math.min(activeColumn + 1, puzzle.grid[0].length - 1);
      puzzle.setActiveCell([activeRow, nextColumn])
    }
    if (e.key === "ArrowLeft") {
      const prevColumn = Math.max(activeColumn - 1, 0);
      puzzle.setActiveCell([activeRow, prevColumn]);
    }
    if (e.key === "ArrowDown") {
      const nextRow = Math.min(activeRow + 1, puzzle.grid.length - 1);
      puzzle.setActiveCell([nextRow, activeColumn]);
    }
    if (e.key === "ArrowUp") {
      const prevRow = Math.max(activeRow - 1, 0);
      puzzle.setActiveCell([prevRow, activeColumn]);
    }
    if (/^[a-z0-9]$/.test(e.key)) {
      puzzle.updateCellValue(activeRow, activeColumn, e.key);
    }
  }
  
  return (
    <div class={classes} onClick={handleClick} onKeyDown={handleKeyDown} tabIndex="0">
      <div class="input">{typeof value === "string" ? value.toUpperCase() : value}</div>
      {value && label ? <div class="label">{label}</div> : null}
    </div>
  );
};

module.exports = PuzzleCell;
