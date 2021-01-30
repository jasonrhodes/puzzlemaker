module.exports.applyBlocks = applyBlocks;
module.exports.getSymmetricalCell = getSymmetricalCell;
module.exports.initGrid = initGrid;
module.exports.findAcross = findAcross;
module.exports.findDown = findDown;
module.exports.getCellClue = getCellClue;
module.exports.measureMyInputText = measureMyInputText;
module.exports.assignClueNumbersToGrid = assignClueNumbersToGrid;
module.exports.convertPuzzleToJSON = convertPuzzleToJSON;
module.exports.PuzWriter = PuzWriter;
// module.exports.calculateAllClueNumbers = calculateAllClueNumbers;

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
      row.push({ value: "", isBlackSquare: false, clue: null, style: null });
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
      if (range.start !== false && range.end !== false && range.found) {
        range.count++;
        return range;
      }
      if (!range.found && range.start === false) {
        range.start = range.count;
        range.word = "";
      }
      if (!cell.isBlackSquare) {
        range.word += cell.value.length > 0 ? cell.value : "-";
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

      if (range.start !== false && range.end !== false && range.found) {
        range.count++;
        return range;
      }
      if (!range.found && range.start === false) {
        range.start = range.count;
        range.word = "";
      }
      if (!cell.isBlackSquare) {
        range.word += cell.value.length > 0 ? cell.value : "-";
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

function measureMyInputText(value) {
  var tmp = document.createElement("span");
  tmp.className = "fakeinput noopacity";
  tmp.innerHTML = value;
  document.body.appendChild(tmp);
  var theWidth = tmp.getBoundingClientRect().width;
  document.body.removeChild(tmp);
  return theWidth;
}

// function calculateAllClueNumbers(grid) {
//   const inDownWord = grid[0].map(() => false);
//   const labelGrid = [];
//   let inAcrossWord = false;
//   let count = 1;
//   let doubleClueChance = false;
//   const acrossClues = [];
//   const downClues = [];
//   for (let r = 0; r < grid[0].length; r++) {
//     labelGrid.push([]);
//     for (let c = 0; c < grid.length; c++) {
//       if (
//         !inAcrossWord &&
//         !grid[r][c].isBlackSquare &&
//         c < grid[0].length - 1 &&
//         !grid[r][c + 1].isBlackSquare
//       ) {
//         acrossClues.push(count++);
//         labelGrid[r].push(count - 1);
//         doubleClueChance = true;
//         inAcrossWord = true;
//       } else if (grid[r][c].isBlackSquare) {
//         inAcrossWord = false;
//         labelGrid[r].push("X");
//       }
//       if (
//         !inDownWord[c] &&
//         !grid[r][c].isBlackSquare &&
//         r < grid.length - 1 &&
//         !grid[r + 1][c].isBlackSquare
//       ) {
//         downClues.push(doubleClueChance ? count - 1 : count++);
//         !doubleClueChance ? labelGrid[r].push(count - 1) : null;
//         inDownWord[c] = true;
//       } else if (grid[r][c].isBlackSquare) {
//         inDownWord[c] = false;
//       } else if (!doubleClueChance) {
//         labelGrid[r].push("O");
//       }
//       doubleClueChance = false;
//     }
//     inAcrossWord = false;
//   }
//   return { acrossClues, downClues, labelGrid };
// }

function convertPuzzleToJSON(puzzle) {
  let puz = {
    author: puzzle.author,
    title: puzzle.title,
    size: {
      rows: puzzle.grid.length,
      cols: puzzle.grid[0].length
    },
    clues: {
      across: Object.keys(puzzle.clues.across).map(key => key + "|| " + "(blank clue)"),
      down: Object.keys(puzzle.clues.down).map(key => key + "|| " + "(blank clue)")
    },
    grid: []
  };

  for (let i = 0; i < puzzle.grid.length; i++) {
    for (let j = 0; j < puzzle.grid[0].length; j++) {
      puz.grid.push(
        puzzle.grid[i][j].isBlackSquare
          ? "."
          : puzzle.grid[i][j].value
          ? puzzle.grid[i][j].value.toUpperCase()
          : " "
      );
    }
  }
  console.log(puz);
  return puz;
}

class PuzWriter {
  constructor() {
    this.buf = [];
  }

  pad(n) {
    for (var i = 0; i < n; i++) {
      this.buf.push(0);
    }
  }

  writeShort(x) {
    this.buf.push(x & 0xff, (x >> 8) & 0xff);
  }

  setShort(ix, x) {
    this.buf[ix] = x & 0xff;
    this.buf[ix + 1] = (x >> 8) & 0xff;
  }

  writeString(s) {
    if (s === undefined) s = "";
    for (var i = 0; i < s.length; i++) {
      var cp = s.codePointAt(i);
      if (cp < 0x100 && cp > 0) {
        this.buf.push(cp);
      } else {
        // TODO: expose this warning through the UI
        console.log(
          'string "' + s + '" has non-ISO-8859-1 codepoint at offset ' + i
        );
        this.buf.push("?".codePointAt(0));
      }
      if (cp >= 0x10000) i++; // advance by one codepoint
    }
    this.buf.push(0);
  }

  writeHeader(json) {
    this.pad(2); // placeholder for checksum
    this.writeString("ACROSS&DOWN");
    this.pad(2); // placeholder for cib checksum
    this.pad(8); // placeholder for masked checksum
    this.version = "1.3";
    this.writeString(this.version);
    this.pad(2); // probably extra space for version string
    this.writeShort(0); // scrambled checksum
    this.pad(12); // reserved
    this.w = json.size.cols;
    this.h = json.size.rows;
    this.buf.push(this.w);
    this.buf.push(this.h);
    this.numClues = json.clues.across.length + json.clues.down.length;
    this.writeShort(this.numClues);
    this.writeShort(1); // puzzle type
    this.writeShort(0); // scrambled tag
  }

  writeFill(json) {
    const grid = json.grid;
    const BLACK_CP = ".".codePointAt(0);
    this.solution = this.buf.length;
    for (var i = 0; i < grid.length; i++) {
      this.buf.push(grid[i].codePointAt(0)); // Note: assumes grid is ISO-8859-1
    }
    this.grid = this.buf.length;
    for (var i = 0; i < grid.length; i++) {
      var cp = grid[i].codePointAt(0);
      if (cp != BLACK_CP) cp = "-".codePointAt(0);
      this.buf.push(cp);
    }
  }

  writeStrings(json) {
    this.stringStart = this.buf.length;
    this.writeString(json.title);
    this.writeString(json.author);
    this.writeString(json.copyright);
    const across = json.clues.across;
    const down = json.clues.down;
    var clues = [];
    for (var i = 0; i < across.length; i++) {
      const sp = across[i].split("|| ");
      clues.push([2 * parseInt(sp[0]), sp[1]]);
    }
    for (var i = 0; i < down.length; i++) {
      const sp = down[i].split("|| ");
      clues.push([2 * parseInt(sp[0]) + 1, sp[1]]);
    }
    clues.sort((a, b) => a[0] - b[0]);
    for (var i = 0; i < clues.length; i++) {
      this.writeString(clues[i][1]);
    }
    this.writeString(json.notepad);
  }

  checksumRegion(base, len, cksum) {
    for (var i = 0; i < len; i++) {
      cksum = (cksum >> 1) | ((cksum & 1) << 15);
      cksum = (cksum + this.buf[base + i]) & 0xffff;
    }
    return cksum;
  }

  strlen(ix) {
    var i = 0;
    while (this.buf[ix + i]) i++;
    return i;
  }

  checksumStrings(cksum) {
    let ix = this.stringStart;
    for (var i = 0; i < 3; i++) {
      const len = this.strlen(ix);
      if (len) {
        cksum = this.checksumRegion(ix, len + 1, cksum);
      }
      ix += len + 1;
    }
    for (var i = 0; i < this.numClues; i++) {
      const len = this.strlen(ix);
      cksum = this.checksumRegion(ix, len, cksum);
      ix += len + 1;
    }
    if (this.version == "1.3") {
      const len = this.strlen(ix);
      if (len) {
        cksum = this.checksumRegion(ix, len + 1, cksum);
      }
      ix += len + 1;
    }
    return cksum;
  }

  setMaskedChecksum(i, maskLow, maskHigh, cksum) {
    this.buf[0x10 + i] = maskLow ^ (cksum & 0xff);
    this.buf[0x14 + i] = maskHigh ^ (cksum >> 8);
  }

  computeChecksums() {
    var c_cib = this.checksumRegion(0x2c, 8, 0);
    this.setShort(0xe, c_cib);
    var cksum = this.checksumRegion(this.solution, this.w * this.h, c_cib);
    var cksum = this.checksumRegion(this.grid, this.w * this.h, cksum);
    cksum = this.checksumStrings(cksum);
    this.setShort(0x0, cksum);
    this.setMaskedChecksum(0, 0x49, 0x41, c_cib);
    var c_sol = this.checksumRegion(this.solution, this.w * this.h, 0);
    this.setMaskedChecksum(1, 0x43, 0x54, c_sol);
    var c_grid = this.checksumRegion(this.grid, this.w * this.h, 0);
    this.setMaskedChecksum(2, 0x48, 0x45, c_grid);
    var c_part = this.checksumStrings(0);
    this.setMaskedChecksum(3, 0x45, 0x44, c_part);
  }

  toPuz(json) {
    this.writeHeader(json);
    this.writeFill(json);
    this.writeStrings(json);
    this.computeChecksums();
    return new Uint8Array(this.buf);
  }
}
