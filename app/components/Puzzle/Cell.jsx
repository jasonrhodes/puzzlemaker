const React = require("react");
const classnames = require("classnames");
const { getCellClue } = require("../../utils/clues");

const PuzzleCell = ({ cell, row, column, puzzle }) => {
  const [activeRow, activeColumn] = puzzle.activeCell;

  const classes = classnames({
    "puzzle-cell": true,
    "puzzle-cell-x": cell.isBlackSquare,
    active: activeRow === row && activeColumn === column,
    highlighted: !cell.isBlackSquare && puzzle.isCellInActiveWord(row, column),
    marked: cell.style === 'marked',
    circled: cell.style === 'circled',
    "disable-select": true
  });
  
  const { grid, getNextClueNumber } = puzzle;
  const currentCell = grid[row][column];
  const clue = currentCell.clue || {};
  const label = (clue.isAcrossStart && clue.acrossClueNumber) || (clue.isDownStart && clue.downClueNumber);

  const handleClick = e => {
    const [activeRow, activeColumn] = puzzle.activeCell;
    if (row === activeRow && column === activeColumn) {
      puzzle.toggleDirection();
    } else {
      puzzle.setActiveCell([row, column]);
    }
    if (e.metaKey || e.ctrlKey) {
      puzzle.toggleBlackSquare(row, column);
    }
    if (e.altKey ) {
      puzzle.toggleCircle(row, column);
    }
    if (e.shiftKey ) {
      puzzle.toggleShaded(row, column);
    }
    e.stopPropagation();
  };

  const handleKeyDown = e => {
    console.log("KeyDown", e.key);
    const [activeRow, activeColumn] = puzzle.activeCell;
    e.preventDefault();
    if (e.key === ".") {
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
    if (/^[a-zA-Z0-9]$/.test(e.key)) {
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
      <input class="puzzlefocus" />
      <div class={"input"}>{cell.value.toUpperCase()}</div>
      {cell.style === 'circled' ? <div class="circle"/>: null}
      {cell.pencil ? <div class="pencil">{cell.pencil}</div>: null}
      {!cell.isBlackSquare && label ? <div class="label">{label}</div> : null}
    </div>
  );
};

module.exports = PuzzleCell;
