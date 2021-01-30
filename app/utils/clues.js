module.exports = {
  getCellClue,
  assignClueNumbersToGrid
};

function isStart({ index, prevCell, nextCell }) {
  if (index === 0 && nextCell && !nextCell.isBlackSquare) {
    return true;
  }
  if (prevCell.isBlackSquare && nextCell && !nextCell.isBlackSquare) {
    return true;
  }
}

function getCellClue({ grid, getNextClueNumber, row, column }) {
  if (
    row === undefined ||
    column === undefined ||
    !grid ||
    !grid[row] ||
    !grid[row][column]
  ) {
    return {};
  }
  const currentCell = grid[row][column];
  const prevAcrossCell = column > 0 ? grid[row][column - 1] : false;
  const prevDownCell = row > 0 ? grid[row - 1][column] : false;
  const nextAcrossCell =
    column < grid[0].length - 1 ? grid[row][column + 1] : false;
  const nextDownCell = row < grid.length - 1 ? grid[row + 1][column] : false;

  if (currentCell.isBlackSquare) {
    return false;
  }

  const clue = {
    isAcrossStart: isStart({
      index: column,
      prevCell: prevAcrossCell,
      nextCell: nextAcrossCell
    }),
    isDownStart: isStart({
      index: row,
      prevCell: prevDownCell,
      nextCell: nextDownCell
    })
  };

  const newClueNumber =
    clue.isDownStart || clue.isAcrossStart ? getNextClueNumber() : null;
  clue.downClueNumber = clue.isDownStart
    ? newClueNumber
    : prevDownCell && prevDownCell.clue && prevDownCell.clue.downClueNumber;
  clue.acrossClueNumber = clue.isAcrossStart
    ? newClueNumber
    : prevAcrossCell &&
      prevAcrossCell.clue &&
      prevAcrossCell.clue.acrossClueNumber;

  return clue;
}

function assignClueNumbersToGrid(grid) {
  let clue = 1;
  const getNextClueNumber = () => clue++;
  const newGrid = [...grid];

  for (let row = 0; row < newGrid.length; row++) {
    for (let column = 0; column < newGrid[row].length; column++) {
      const clue = getCellClue({
        grid: newGrid,
        getNextClueNumber,
        row,
        column
      });
      newGrid[row][column].clue = clue;
    }
  }

  return newGrid;
}