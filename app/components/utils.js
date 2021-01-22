module.exports.applyBlocks = applyBlocks;
module.exports.initGrid = initGrid;
module.exports.findAcross = findAcross;
module.exports.findDown = findDown;

function applyBlocks(_grid, blocks) {
  const grid = [..._grid];
  blocks.forEach(([row, column]) => {
    grid[row][column] = false;
    const size = grid[0].length;
    grid[size - (row + 1)][size - (column + 1)] = false;
  });

  return grid;
}

function initGrid({ size, blocks }) {
  const grid = [];
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      row.push('A');
    }
    grid.push(row);
  }
  return applyBlocks(grid, blocks);
}

function findAcross(cellsInActiveRow, activeColumn) {
  const range = cellsInActiveRow.reduce(
    (range, cellValue) => {
      const isBlackSquare = !cellValue;

      if (range.start !== false && range.end && range.found) {
        range.count++;
        return range;
      }
      if (!range.found && range.start === false) {
        range.start = range.count;
        range.word = "";
      }
      if (!isBlackSquare) {
        range.word += typeof cellValue === "string" ? cellValue : "_";
      }
      if (isBlackSquare && range.found) {
        range.end = range.count - 1;
      }
      if (range.count === activeColumn) {
        range.found = true;
      }
      if (isBlackSquare && !range.found) {
        range.start = false;
      }
      if (!range.end && range.count === cellsInActiveRow.length - 1) {
        range.end = range.count;
      }

      range.count++;
      return range;
    },
    { count: 0, start: false, end: false, found: false, word: "" }
  );

  return { range: [range.start, range.end], word: range.word };
}

function findDown(rows, activeRow, activeColumn) {
  const range = rows.reduce(
    (range, row) => {
      const cellValue = row[activeColumn];
      const isBlackSquare = !cellValue;

      if (range.start !== false && range.end && range.found) {
        range.count++;
        return range;
      }
      if (!range.found && range.start === false) {
        range.start = range.count;
        range.word = "";
      }
      if (!isBlackSquare) {
        range.word += typeof cellValue === "string" ? cellValue : "_";
      }
      if (isBlackSquare && range.found) {
        range.end = range.count - 1;
      }
      if (range.count === activeRow) {
        range.found = true;
      }
      if (isBlackSquare && !range.found) {
        range.start = false;
      }
      if (!range.end && range.count === rows.length - 1) {
        range.end = range.count;
      }

      range.count++;
      return range;
    },
    { count: 0, start: false, end: false, found: false, word: "" }
  );

  return { range: [range.start, range.end], word: range.word };
}