module.exports = {
  getNextAcrossCellCoords,
  getNextAcrossClueStart,
  getPrevAcrossCellCoords,
  getPrevAcrossClueStart,
  getNextDownCellCoords,
  getNextDownClueStart,
  getPrevDownCellCoords,
  getPrevDownClueStart,
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
  console.log("returning next across coords", row, column);
  return [row, column];
}

function getNextAcrossClueStart(row, column, grid) {
  const currentCell = grid[row][column];
  let lastCellBlack = currentCell.isBlackSquare;
  while (true) {
    const [nextRow, nextColumn] = getNextAcrossCellCoords(row, column, grid);
    const nextCell = grid[nextRow][nextColumn];
    if (nextRow === row && nextColumn === column) {
      // next cell is the same as the current cell
      break;
    }
    if (
      nextRow !== row &&
      !nextCell.isBlackSquare &&
      nextCell.clue.acrossClueNumber
    ) {
      // we dropped to the next row and the first cell isn't a
      // black square, we found the next clue
      row = nextRow;
      column = nextColumn;
      break;
    }
    // change cell
    row = nextRow;
    column = nextColumn;
    if (
      !nextCell.isBlackSquare &&
      lastCellBlack &&
      nextCell.clue.acrossClueNumber
    ) {
      // previous cell was a black square, new cell is not, we found our clue start cell
      break;
    }
    lastCellBlack = nextCell.isBlackSquare;
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
  const currentCell = grid[row][column];
  let lastCellBlack = currentCell.isBlackSquare;
  while (true) {
    const [prevRow, prevColumn] = getPrevAcrossCellCoords(row, column, grid);
    if (prevRow === row && prevColumn === column) {
      // next cell is the same as the current cell
      break;
    }
    const prevCell = grid[prevRow][prevColumn];
    if (
      prevRow < row &&
      !prevCell.isBlackSquare &&
      prevCell.clue.acrossClueNumber
    ) {
      // we moved up to the prev row and it's not a black square,
      // so we found a new clue, so we need to get the starting cell
      column = findClueStartColumn(prevCell, grid[prevRow]);
      row = prevRow;
      break;
    }
    // change cell
    row = prevRow;
    column = prevColumn;
    if (
      !prevCell.isBlackSquare &&
      lastCellBlack &&
      prevCell.clue.acrossClueNumber
    ) {
      // if the cell we are evaluationg is not a black square but
      // the last cell we evaluated was a black square, we have
      // a new clue and we need the start of that clue
      column = findClueStartColumn(prevCell, grid[row]);
      break;
    }
    lastCellBlack = prevCell.isBlackSquare;
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
    // we are in the top left cell, do nothing
    return [row, column];
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
