module.exports.applyBlocks = applyBlocks;
module.exports.getSymmetricalCell = getSymmetricalCell;
module.exports.initGrid = initGrid;
module.exports.findAcross = findAcross;
module.exports.findDown = findDown;
module.exports.getCellClue = getCellClue;
module.exports.getClueLabel = getClueLabel;
module.exports.measureMyInputText = measureMyInputText;

function applyBlocks(_grid, blocks) {
  const grid = [..._grid];
  blocks.forEach(([row, column]) => {
    grid[row][column] = false;
    const [symRow, symCol] = getSymmetricalCell(grid, row, column);
    grid[symRow][symCol] = false;
  });

  return grid;
}

function getSymmetricalCell(grid, row, column) {
  const height = grid.length;
  const width = grid[0].length;
  return [width - (row + 1), height - (column + 1)];
}

function initGrid({ rows, columns }) {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < columns; j++) {
      row.push({ value: '', isBlackSquare: false, clue: null });
    }
    grid.push(row);
  }
  return grid;
}

function findAcross(cellsInActiveRow, activeColumn) {
  // console.log("finding across", { cellsInActiveRow, activeColumn });
  const range = cellsInActiveRow.reduce(
    (range, cell) => {
      // console.log("cell", { range, cell });
      if (range.start !== false && range.end && range.found) {
        range.count++;
        return range;
      }
      if (!range.found && range.start === false) {
        range.start = range.count;
        range.word = "";
      }
      if (!cell.isBlackSquare) {
        range.word += (cell.value.length > 0 ? cell.value : "-");
      }
      if (cell.isBlackSquare && range.found) {
        range.end = range.count - 1;
      }
      if (range.count === activeColumn) {
        range.found = true;
      }
      if (cell.isBlackSquare && !range.found) {
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
      const cell = row[activeColumn];

      if (range.start !== false && range.end && range.found) {
        range.count++;
        return range;
      }
      if (!range.found && range.start === false) {
        range.start = range.count;
        range.word = "";
      }
      if (!cell.isBlackSquare) {
        range.word += (cell.value.length > 0 ? cell.value : "-");
      }
      if (cell.isBlackSquare && range.found) {
        range.end = range.count - 1;
      }
      if (range.count === activeRow) {
        range.found = true;
      }
      if (cell.isBlackSquare && !range.found) {
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

function getClueLabel(puzzle) {
  let [row, column] = puzzle.activeCell;
  if (!row || !column){
    row = 0;
    column = 0;
  }
  if (puzzle.direction === 'across'){
    while (column > 0){
      column -= 1;
      if (puzzle.grid[row][column].isBlackSquare){
        column += 1;
        return getCellClue({puzzle, row, column});
      }
    }
    return getCellClue({puzzle, row, column});
  }
  else {
    while (row > 0){
      row -= 1;
      if (puzzle.grid[row][column].isBlackSquare){
        row += 1;
        return getCellClue({puzzle, row, column});
      }
    }
    return getCellClue({puzzle, row, column});
  }
  return "neither";  
}

function getCellClue({ puzzle, row, column }) {
  const { grid, getNextClueNumber } = puzzle;
  const currentCell = grid[row][column];
  const prevAcrossCell = column > 0 ? grid[row][column - 1] : {};
  const prevDownCell = row > 0 ? grid[row - 1][column] : {};
  
  if (currentCell.isBlackSquare) {
    return false;
  }
  if (row === 0) {
    return getNextClueNumber();
  }
  if (column === 0) {
    return getNextClueNumber();
  }
  if (prevAcrossCell.isBlackSquare) {
    return getNextClueNumber();
  }
  if (prevDownCell.isBlackSquare) {
    return getNextClueNumber();
  }
  return false;
};

function measureMyInputText(id) {
    var input = document.getElementById(id);
    var tmp = document.createElement("span");
    tmp.className = "fakeinput noopacity";
    tmp.innerHTML = input.value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    document.body.appendChild(tmp);
    var theWidth = tmp.getBoundingClientRect().width;
    document.body.removeChild(tmp);
    return theWidth;
}