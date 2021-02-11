module.exports = {
  getNextAcrossCellCoords,
  getNextAcrossClueStart,
  getPrevAcrossCellCoords,
  getPrevAcrossClueStart,
  getNextDownCellCoords,
  getNextDownClueStart,
  getPrevDownCellCoords,
  getPrevDownClueStart,
  findClueStartCell,
};

// find the last row index and last column index, or in
// other words, the coords of the bottom right cell
function getBottomRightCoords(grid) {
  return [grid.length - 1, grid[0].length - 1];
}

function isBottomRightCell(row, column, grid) {
  const [lastRow, lastColumn] = getBottomRightCoords(grid);
  return row === lastRow && column === lastColumn;
}

// Given a cell and the cells in that row, find the starting
// column number for the given cell's across clue number
function findClueStartColumn(currentCell, cellsInRow) {
  if (!currentCell.clue.acrossClueNumber) {
    throw new Error("Trying to find a a clue start for a black square");
  }
  const startCell = cellsInRow.reduce(
    (state, cell) => {
      if (state.found !== false) {
        return state;
      }
      if (
        cell.clue &&
        cell.clue.acrossClueNumber === currentCell.clue.acrossClueNumber
      ) {
        return { ...state, found: true };
      }
      state.index++;
      return state;
    },
    { found: false, index: 0 }
  );

  return startCell.index;
}

// Given a cell, a column index, and the grid, find the starting
// row number for the given cell's down clue number
function findClueStartRow(currentCell, column, grid) {
  if (currentCell.isBlackSquare) {
    throw new Error("Trying to find a a clue start for a black square");
  }
  const columnCells = grid.map((row) => row[column]);
  const startCell = columnCells.reduce(
    (state, cell) => {
      if (state.found !== false) {
        return state;
      }
      if (
        cell.clue &&
        cell.clue.downClueNumber === currentCell.clue.downClueNumber
      ) {
        return { ...state, found: true };
      }
      state.index++;
      return state;
    },
    { found: false, index: 0 }
  );

  if (startCell.index >= columnCells.length) {
    throw new Error(
      `No start cell found for ${currentCell.clue.downClueNumber} down`
    );
  }

  return startCell.index;
}

function getNextAcrossCellCoords(row, column, grid) {
  const [lastRow, lastColumn] = getBottomRightCoords(grid);
  if (row === lastRow && column === lastColumn) {
    // we are in the bottom right cell, restart at top left
    return [0, 0];
  }
  column++;
  if (column > lastColumn) {
    // too far right, go to next row
    row++;
    column = 0;
  }
  return [row, column];
}

function getNextAcrossClueStart(row, column, grid) {
  const activeCell = grid[row][column];
  while (true) {
    const [nextRow, nextColumn] = getNextAcrossCellCoords(row, column, grid);
    const nextCell = grid[nextRow][nextColumn];
    row = nextRow;
    column = nextColumn;
    if (
      nextCell.clue &&
      (!activeCell.clue ||
        activeCell.clue.acrossClueNumber !== nextCell.clue.acrossClueNumber) &&
      nextCell.clue.acrossClueNumber &&
      nextCell.clue.isAcrossStart
    ) {
      // we found the next down clue
      break;
    }
  }
  return [row, column];
}

function getPrevAcrossCellCoords(row, column, grid) {
  const [lastRow, lastColumn] = getBottomRightCoords(grid);
  if (row === 0 && column === 0) {
    // we are in the top left cell, do nothing
    return [lastRow, lastColumn];
  }
  column--;
  if (column < 0) {
    // too far left, go to prev row's last column
    row--;
    column = lastColumn;
  }
  return [row, column];
}

function getPrevAcrossClueStart(row, column, grid) {
  const activeCell = grid[row][column];
  while (true) {
    const [prevRow, prevColumn] = getPrevAcrossCellCoords(row, column, grid);
    const prevCell = grid[prevRow][prevColumn];
    row = prevRow;
    column = prevColumn;
    if (
      prevCell.clue &&
      (!activeCell.clue ||
        activeCell.clue.acrossClueNumber !== prevCell.clue.acrossClueNumber) &&
      prevCell.clue.acrossClueNumber &&
      prevCell.clue.isAcrossStart
    ) {
      // we found the next down clue
      break;
    }
  }
  return [row, column];
}

function getNextDownCellCoords(row, column, grid) {
  const [lastRow, lastColumn] = getBottomRightCoords(grid);
  if (row === lastRow && column === lastColumn) {
    // we are in the bottom right cell, return top left
    return [0, 0];
  }
  row++;
  if (row > lastRow) {
    // too far down, go to next column top cell
    column++;
    row = 0;
  }
  return [row, column];
}

function getNextDownClueStart(row, column, grid) {
  if (
    grid[row][column].clue.downClueNumber &&
    !grid[row][column].clue.isDownStart
  ) {
    [row, column] = findClueStartCell(
      grid,
      grid[row][column].clue.downClueNumber,
      "down"
    );
  }
  const activeCell = grid[row][column];
  while (true) {
    const [nextRow, nextColumn] = getNextAcrossCellCoords(row, column, grid);
    const nextCell = grid[nextRow][nextColumn];
    row = nextRow;
    column = nextColumn;
    if (
      nextCell.clue &&
      (!activeCell.clue ||
        activeCell.clue.downClueNumber !== nextCell.clue.downClueNumber) &&
      nextCell.clue.downClueNumber &&
      nextCell.clue.isDownStart
    ) {
      // we found the next down clue
      break;
    }
  }
  return [row, column];
}

function getPrevDownCellCoords(row, column, grid) {
  const [lastRow] = getBottomRightCoords(grid);
  if (row === 0 && column === 0) {
    const [lastRow, lastColumn] = getBottomRightCoords(grid);
    // we are in the top left cell, do nothing
    return [lastRow, lastColumn];
  }
  row--;
  if (row < 0) {
    // too far up, go to prev column bottom cell
    column--;
    row = lastRow;
  }
  return [row, column];
}

function getPrevDownClueStart(row, column, grid) {
  if (
    grid[row][column].clue.downClueNumber &&
    !grid[row][column].clue.isDownStart
  ) {
    [row, column] = findClueStartCell(
      grid,
      grid[row][column].clue.downClueNumber,
      "down"
    );
  }
  const activeCell = grid[row][column];
  while (true) {
    const [prevRow, prevColumn] = getPrevAcrossCellCoords(row, column, grid);
    const prevCell = grid[prevRow][prevColumn];
    row = prevRow;
    column = prevColumn;
    if (
      prevCell.clue &&
      (!activeCell.clue ||
        activeCell.clue.downClueNumber !== prevCell.clue.downClueNumber) &&
      prevCell.clue.downClueNumber &&
      prevCell.clue.isDownStart
    ) {
      // we found the next down clue
      break;
    }
  }
  return [row, column];
}

function findClueStartCell(grid, number, direction) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (
        direction === "across" &&
        grid[row][col].clue.isAcrossStart &&
        grid[row][col].clue.acrossClueNumber === parseInt(number)
      ) {
        return [row, col];
      } else if (
        direction === "down" &&
        grid[row][col].clue.isDownStart &&
        grid[row][col].clue.downClueNumber === parseInt(number)
      ) {
        return [row, col];
      }
    }
  }
  return [];
}
