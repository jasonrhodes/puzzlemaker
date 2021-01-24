const React = require("react");
const classnames = require("classnames");
const { getCellClue } = require("./utils");

const PuzzleCell = ({ cell, row, column, puzzle }) => {
  const [activeRow, activeColumn] = puzzle.activeCell;

  const classes = classnames({
    "puzzle-cell": true,
    "puzzle-cell-x": cell.isBlackSquare,
    active: activeRow === row && activeColumn === column,
    highlighted: !cell.isBlackSquare && puzzle.isCellInActiveWord(row, column)
  });

  const label = getCellClue({ row, column, puzzle });

  const handleClick = e => {
    const [activeRow, activeColumn] = puzzle.activeCell;
    if (row === activeRow && column === activeColumn) {
      puzzle.toggleDirection();
    } else {
      puzzle.setActiveCell([row, column]);
    }
    if (e.metaKey) {
      puzzle.toggleBlackSquare(row, column);
    }
  };

  const handleKeyDown = e => {
    console.log("KeyDown", e.key);
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
      if (e.shiftKey) {
        puzzle.rewindActiveCell();
      } else {
        puzzle.advanceActiveCell();
      }
    }
    if (e.key === "Backspace") {
      if (puzzle.grid[activeRow][activeColumn].isBlackSquare === false) {
        puzzle.updateCellValue(activeRow, activeColumn, '');
      }
      puzzle.rewindActiveCell();
    }
    if (e.key === "Delete") {
      if (puzzle.grid[activeRow][activeColumn].isBlackSquare === false) {
        puzzle.updateCellValue(activeRow, activeColumn, '');
      }
    }
    if (/^[a-z0-9]$/.test(e.key)) {
      puzzle.updateCellValue(activeRow, activeColumn, e.key);
      puzzle.advanceActiveCell();
    }
  };

  return (
    <div
      class={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      <div class="input">
        {cell.value.toUpperCase()}
      </div>
      {!cell.isBlackSquare && label ? <div class="label">{label}</div> : null}
    </div>
  );
};

module.exports = PuzzleCell;
