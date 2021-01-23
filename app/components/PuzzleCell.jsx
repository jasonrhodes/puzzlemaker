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
  
  let keysDown = [];
  
  const handleKeyUp = e => {
    console.log('KeyUp', e.key);
    keysDown = keysDown.filter(key => key !== e.key);
  }
  
  const handleKeyDown = e => {
    console.log('KeyDown', e.key);
    keysDown.push(e.key);
    console.log('keys down:', keysDown.join(", "));
    const [activeRow, activeColumn] = puzzle.activeCell;
    e.preventDefault();
    if (e.key === ".") {
      puzzle.toggleBlackSquare(activeRow, activeColumn);
      return;
    }
    if (e.key === "Enter") {
      puzzle.toggleDirection();
      return;
    }
    if (e.key === "ArrowRight") {
      puzzle.nextAcross();
    }
    if (e.key === "ArrowLeft") {
      puzzle.prevAcross();
    }
    if (e.key === "ArrowDown") {
      puzzle.nextDown();
    }
    if (e.key === "ArrowUp") {
      puzzle.prevDown();
    }
    if (e.key === "Tab") {
      console.log({ keysDown });
      if (keysDown.includes("Shift")) {
        puzzle.rewindActiveCell();
      } else {
        puzzle.advanceActiveCell();
      }
    }
    if (e.key === "Backspace") {
      if (puzzle.grid[activeRow][activeColumn] !== false) {
        puzzle.updateCellValue(activeRow, activeColumn, true);
      }
      puzzle.rewindActiveCell();
    }
    if (/^[a-z0-9]$/.test(e.key)) {
      puzzle.updateCellValue(activeRow, activeColumn, e.key);
      puzzle.advanceActiveCell();
    }
  }
  
  return (
    <div class={classes} onClick={handleClick} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex="0">
      <div class="input">{typeof value === "string" ? value.toUpperCase() : value}</div>
      {value && label ? <div class="label">{label}</div> : null}
    </div>
  );
};

module.exports = PuzzleCell;
