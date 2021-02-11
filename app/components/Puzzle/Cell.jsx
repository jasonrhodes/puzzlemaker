const React = require("react");
const classnames = require("classnames");

const PuzzleCell = ({ cell, row, column, puzzle }) => {
  const [activeRow, activeColumn] = puzzle.activeCell;

  const classes = classnames({
    "puzzle-cell": true,
    "puzzle-cell-x": cell.isBlackSquare,
    active: activeRow === row && activeColumn === column,
    highlighted: !cell.isBlackSquare && puzzle.isCellInActiveWord(row, column),
    marked: cell.style === "marked",
    circled: cell.style === "circled",
    "disable-select": true,
  });

  const { grid, getNextClueNumber } = puzzle;
  const currentCell = grid[row][column];
  const clue = currentCell.clue || {};
  const label =
    (clue.isAcrossStart && clue.acrossClueNumber) ||
    (clue.isDownStart && clue.downClueNumber);

  const handleClick = (e) => {
    const [activeRow, activeColumn] = puzzle.activeCell;
    if (row === activeRow && column === activeColumn) {
      puzzle.toggleDirection();
    } else {
      puzzle.setActiveCell([row, column]);
    }
    if (e.metaKey || e.ctrlKey) {
      puzzle.clearAll(false);
      puzzle.toggleBlackSquare(row, column);
    }
    if (e.altKey) {
      puzzle.toggleCircle(row, column);
    }
    if (e.shiftKey) {
      puzzle.toggleShaded(row, column);
    }
    e.stopPropagation();
  };

  const inputClasses = classnames({
    input: true,
    rebus: currentCell.isRebus,
  });

  const handleKeyDown = (e) => {
    const [activeRow, activeColumn] = puzzle.activeCell;
    const currentCell = puzzle.grid[activeRow][activeColumn];
    e.preventDefault();
    if (e.key === ".") {
      puzzle.clearAll(false);
      puzzle.toggleBlackSquare(activeRow, activeColumn);
      return;
    }
    if (e.key === ";" || e.key === ",") {
      puzzle.toggleCircle(activeRow, activeColumn);
      return;
    }
    if (e.key === "/" || e.key === "-") {
      puzzle.toggleShaded(activeRow, activeColumn);
      return;
    }
    if (e.key === "Enter") {
      puzzle.toggleDirection();
      return;
    }
    if (e.key === "ArrowRight") {
      puzzle.nextAcrossCell();
    }
    if (e.key === "ArrowLeft") {
      puzzle.prevAcrossCell();
    }
    if (e.key === "ArrowDown") {
      puzzle.nextDownCell();
    }
    if (e.key === "ArrowUp") {
      puzzle.prevDownCell();
    }
    if (e.key === "Tab") {
      if (e.shiftKey) {
        puzzle.rewindActiveClue();
      } else {
        puzzle.advanceActiveClue();
      }
    }
    if (e.key === "Backspace") {
      if (currentCell.isRebus) {
        puzzle.updateCellValue(
          activeRow,
          activeColumn,
          currentCell.value.slice(0, -1)
        );
        return;
      }

      if (currentCell.isBlackSquare) {
        puzzle.toggleBlackSquare(activeRow, activeColumn);
      } else {
        puzzle.updateCellValue(activeRow, activeColumn, "");
      }
      puzzle.rewindActiveCell();
    }
    if (e.key === "Delete") {
      if (currentCell.isRebus) {
        puzzle.updateCellValue(
          activeRow,
          activeColumn,
          currentCell.value.slice(1)
        );
        return;
      }
      if (currentCell.isBlackSquare) {
        puzzle.toggleBlackSquare(activeRow, activeColumn);
        return;
      }
      // what to do when the current cell is a rebus?
    }
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      if (currentCell.isRebus) {
        puzzle.updateCellValue(activeRow, activeColumn, "");
      }
      puzzle.toggleRebus(activeRow, activeColumn);
      return;
    }
    if (/^[a-zA-Z0-9]$/.test(e.key)) {
      if (currentCell.isRebus) {
        puzzle.updateCellValue(
          activeRow,
          activeColumn,
          `${currentCell.value}${e.key}`
        );
      } else {
        puzzle.updateCellValue(activeRow, activeColumn, e.key);
        puzzle.advanceActiveCell();
      }
    }
  };

  return (
    <div
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      <input className="puzzlefocus" readOnly="readonly" />
      <div className={inputClasses}>{cell.value.toUpperCase()}</div>
      {cell.style === "circled" ? <div className="circle" /> : null}
      {cell.pencil ? <div className="input pencil">{cell.pencil}</div> : null}
      {!cell.isBlackSquare && label ? (
        <div className="label">{label}</div>
      ) : null}
    </div>
  );
};

module.exports = PuzzleCell;
