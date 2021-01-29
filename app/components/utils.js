module.exports.applyBlocks = applyBlocks;
module.exports.getSymmetricalCell = getSymmetricalCell;
module.exports.initGrid = initGrid;
module.exports.findAcross = findAcross;
module.exports.findDown = findDown;
module.exports.getCellClue = getCellClue;
module.exports.measureMyInputText = measureMyInputText;
module.exports.calculateAllClueNumbers = calculateAllClueNumbers;
module.exports.assignClueNumbersToGrid = assignClueNumbersToGrid;
module.exports.convertPuzzleToJSON = convertPuzzleToJSON;
module.exports.toPuz = toPuz;
module.exports.PuzWriter = PuzWriter;

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
      row.push({ value: '', isBlackSquare: false, clue: null, style: null });
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

      if (range.start !== false && range.end !== false && range.found) {
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

// function getCellClue({ grid, getNextClueNumber, row, column }) {
//   const currentCell = grid[row][column];
//   const prevAcrossCell = column > 0 ? grid[row][column - 1] : {};
//   const prevDownCell = row > 0 ? grid[row - 1][column] : {};
//   const nextAcrossCell = column < grid[0].length - 1 ? grid[row][column + 1] : {};
//   const nextDownCell = row < grid.length - 1 ? grid[row + 1][column] : {};
  
//   if (currentCell.isBlackSquare) {
//     return false;
//   }
//   if (row === 0 && !nextDownCell.isBlackSquare) {
//     return getNextClueNumber();
//   }
//   if (column === 0 && !nextAcrossCell.isBlackSquare) {
//     return getNextClueNumber();
//   }
//   if (prevAcrossCell.isBlackSquare && column < grid[0].length - 1 && !nextAcrossCell.isBlackSquare) {
//     return getNextClueNumber();
//   }
//   if (prevDownCell.isBlackSquare && row < grid.length - 1 && !nextDownCell.isBlackSquare) {
//     return getNextClueNumber();
//   }
//   return false;
// };

function isStart({ index, prevCell, nextCell }) {
  if (index === 0 && !nextCell.isBlackSquare) {
    return true;
  }
  if (prevCell.isBlackSquare && !nextCell.isBlackSquare) {
    return true;
  }
}

function getCellClue({ grid, getNextClueNumber, row, column }) {
  if (row === undefined || column === undefined || !grid || !grid[row] || !grid[row][column]) {
    return {};
  }
  const currentCell = grid[row][column];
  const prevAcrossCell = column > 0 ? grid[row][column - 1] : {};
  const prevDownCell = row > 0 ? grid[row - 1][column] : {};
  const nextAcrossCell =
    column < grid[0].length - 1 ? grid[row][column + 1] : {};
  const nextDownCell = row < grid.length - 1 ? grid[row + 1][column] : {};

  if (currentCell.isBlackSquare) {
    return false;
  }

  const clue = {
    isDownStart: isStart({
      index: row,
      prevCell: prevAcrossCell,
      nextCell: nextAcrossCell,
    }),
    isAcrossStart: isStart({
      index: column,
      prevCell: prevDownCell,
      nextCell: nextDownCell,
    }),
  };

  const newClueNumber =
    clue.isDownStart || clue.isAcrossStart ? getNextClueNumber() : null;
  clue.downClueNumber = clue.isDownStart
    ? newClueNumber
    : (prevDownCell.clue && prevDownCell.clue.downClueNumber);
  clue.acrossClueNumber = clue.isAcrossStart
    ? newClueNumber
    : (prevAcrossCell.clue && prevAcrossCell.clue.acrossClueNumber);

  return clue;
}

function assignClueNumbersToGrid(grid) {
  let clue = 0;
  const getNextClueNumber = () => clue++;
  const newGrid = [...grid];

  for (let row = 0; row < newGrid.length; row++) {
    for (let column = 0; column < newGrid[row].length; column++) {
      const clue = getCellClue({
        grid: newGrid,
        getNextClueNumber,
        row,
        column,
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

function calculateAllClueNumbers(grid) {
    const inDownWord = grid[0].map(() => false);
    const labelGrid = [];
    let inAcrossWord = false;
    let count = 1;
    let doubleClueChance = false;
    const acrossClues = [];
    const downClues = [];
    for (let r = 0; r < grid[0].length; r++){
      labelGrid.push([]);
      for (let c = 0; c < grid.length; c++){
        if (!inAcrossWord && !grid[r][c].isBlackSquare && c < grid[0].length - 1 && !grid[r][c+1].isBlackSquare) {
          acrossClues.push(count++);
          labelGrid[r].push(count - 1);
          doubleClueChance = true;
          inAcrossWord = true;
        } else if (grid[r][c].isBlackSquare) {
          inAcrossWord = false;
          labelGrid[r].push('X');
        } 
        if (!inDownWord[c] && !grid[r][c].isBlackSquare && r < grid.length - 1 && !grid[r+1][c].isBlackSquare) {
          downClues.push(doubleClueChance ? count - 1 : count++);
          !doubleClueChance ? labelGrid[r].push(count -1) : null;
          inDownWord[c] = true;
        } else if (grid[r][c].isBlackSquare) {
          inDownWord[c] = false;
        } else if (!doubleClueChance) {
          labelGrid[r].push('O')
        }
        doubleClueChance = false;
      }
      inAcrossWord = false;
    }
    return { acrossClues, downClues, labelGrid } ;
  }

function convertPuzzleToJSON(puzzle) {
  let puz = {};
  puz["author"] = puzzle.author;
  puz["title"] = puzzle.title;
  puz["size"] = {
    "rows": puzzle.grid.length,
    "cols": puzzle.grid[0].length
  };
  // Translate clues to standard JSON puzzle format
  puz["clues"] = {
    "across": [],
    "down": []
  };
  
  const { acrossClues, downClues, labelGrid } = calculateAllClueNumbers(puzzle.grid);
  for (let x in acrossClues) {
    puz.clues.across.push(x + "|| " + "(blank clue)");
  }
  for (let x in downClues) {
    puz.clues.down.push(x + "|| " + "(blank clue)");
  }
  
  // Read grid
  puz["grid"] = [];
  for (let i = 0; i < puzzle.grid.length; i++) {
    for (let j = 0; j < puzzle.grid[0].length; j++) {
      puz.grid.push(puzzle.grid[i][j].isBlackSquare ? '.' : puzzle.grid[i][j].value ? puzzle.grid[i][j].value.toUpperCase() : " " );
    }
  }
  console.log(puz);
  return puz;
}

function pad(buf2, n) {
  let buf = buf2;
  for (var i = 0; i < n; i++) {
    buf.push(0);
    return buf;
  }
}

function writeShort(buf2, x) {
  let buf = buf2;
  buf.push(x & 0xff, (x >> 8) & 0xff);
  return buf;
}

function setShort(buf2, ix, x) {
  let buf = buf2;
  buf[ix] = x & 0xff;
  buf[ix + 1] = (x >> 8) & 0xff;
  return buf;
}

function writeString(buf2, s) {
  let buf = buf2;
  if (s === undefined) s = '';
  for (var i = 0; i < s.length; i++) {
    var cp = s.codePointAt(i);
    if (cp < 0x100 && cp > 0) {
      buf.push(cp);
    } else {
      // TODO: expose this warning through the UI
      console.log('string "' + s + '" has non-ISO-8859-1 codepoint at offset ' + i);
      buf.push('?'.codePointAt(0));
    }
    if (cp >= 0x10000) i++;   // advance by one codepoint
  }
  buf.push(0);
  return buf;
}

function writeHeader(buf2, json) {
  let buf = buf2;
  buf = pad(buf, 2); // placeholder for checksum
  buf = writeString(buf, 'ACROSS&DOWN');
  buf = pad(buf, 2); // placeholder for cib checksum
  buf = pad(buf, 8); // placeholder for masked checksum
  // version = '1.3';
  buf = writeString(buf, '1.3'); // version
  buf = pad(buf, 2); // probably extra space for version string
  buf = writeShort(buf, 0);  // scrambled checksum
  buf = pad(buf, 12);  // reserved
  const w = json.size.cols;
  const h = json.size.rows;
  buf.push(w);
  buf.push(h);
  const numClues = json.clues.across.length + json.clues.down.length;
  buf = writeShort(buf, numClues);
  buf = writeShort(buf, 1);  // puzzle type
  buf = writeShort(buf, 0);  // scrambled tag
return [buf, w, h, numClues];
}

function writeFill(buf2, json) {
  let buf = buf2;
  const grid = json.grid;
  const BLACK_CP = '.'.codePointAt(0);
  const solution = buf.length;
  for (var i = 0; i < grid.length; i++) {
    buf.push(grid[i].codePointAt(0));  // Note: assumes grid is ISO-8859-1
  }
  const grid2 = buf.length;
  for (var i = 0; i < grid.length; i++) {
    var cp = grid[i].codePointAt(0);
    if (cp != BLACK_CP) cp = '-'.codePointAt(0);
    buf.push(cp);
  }
  return [buf, solution, grid2];
}

function writeStrings(buf2, json) {
  let buf = buf2;
  const stringStart = buf.length;
  buf = writeString(buf, json.title);
  buf = writeString(buf, json.author);
  buf = writeString(buf, json.copyright);
  const across = json.clues.across;
  const down = json.clues.down;
  var clues = [];
  for (var i = 0; i < across.length; i++) {
    const sp = across[i].split('|| ');
    clues.push([2 * parseInt(sp[0]), sp[1]]);
  }
  for (var i = 0; i < down.length; i++) {
    const sp = down[i].split('|| ');
    clues.push([2 * parseInt(sp[0]) + 1, sp[1]]);
  }
  clues.sort((a, b) => a[0] - b[0]);
  for (var i = 0; i < clues.length; i++) {
    buf = writeString(buf, clues[i][1]);
  }
  buf = writeString(buf, json.notepad);
  return [buf, stringStart];
}

function checksumRegion(buf2, base, len, cksum) {
  let buf = buf2;
  for (var i = 0; i < len; i++) {
    cksum = (cksum >> 1) | ((cksum & 1) << 15);
    cksum = (cksum + buf[base + i]) & 0xffff;
  }
  return cksum;
}

function strlen(buf2, ix) {
  let buf = buf2;
  var i = 0;
  while (buf[ix + i]) i++;
  return i;
}

function checksumStrings(buf2, stringStart, numClues, cksum) {
  let buf = buf2;
  let ix = stringStart;
  const version = "1.3";
  for (var i = 0; i < 3; i++) {
    const len = strlen(buf, ix);
    if (len) {
      cksum = checksumRegion(buf, ix, len + 1, cksum);
    }
    ix += len + 1;
  }
  for (var i = 0; i < numClues; i++) {
    const len = strlen(buf, ix);
    cksum = checksumRegion(buf, ix, len, cksum);
    ix += len + 1;
  }
  if (version == '1.3') {
    const len = strlen(buf, ix);
    if (len) {
      cksum = checksumRegion(buf, ix, len + 1, cksum);
    }
    ix += len + 1;
  }
  return cksum;
}

function setMaskedChecksum(buf2, i, maskLow, maskHigh, cksum) {
  let buf = buf2;
  buf[0x10 + i] = maskLow ^ (cksum & 0xff);
  buf[0x14 + i] = maskHigh ^ (cksum >> 8);
  return buf;
}

function computeChecksums(buf2, solution, w, h, grid, numClues, stringStart) {
  let buf = buf2;
  var c_cib = checksumRegion(buf, 0x2c, 8, 0);
  buf = setShort(buf, 0xe, c_cib);
  var cksum = checksumRegion(buf, solution, w * h, c_cib);
  var cksum = checksumRegion(buf, grid, w * h, cksum);
  cksum = checksumStrings(buf, stringStart, numClues, cksum);
  buf = setShort(buf, 0x0, cksum);
  buf = setMaskedChecksum(buf, 0, 0x49, 0x41, c_cib);
  var c_sol = checksumRegion(buf, solution, w * h, 0);
  buf = setMaskedChecksum(buf, 1, 0x43, 0x54, c_sol);
  var c_grid = checksumRegion(buf, grid, w * h, 0);
  buf = setMaskedChecksum(buf, 2, 0x48, 0x45, c_grid);
  var c_part = checksumStrings(buf, stringStart, numClues, 0);
  buf = setMaskedChecksum(buf, 3, 0x45, 0x44, c_part);
  return buf;
}

function toPuz(bufx, json) {
  let buf = bufx;
  const [buf2, w, h, numClues] = writeHeader(buf, json);
  const [buf3, solution, grid2] = writeFill(buf2, json);
  const [buf4, stringStart] = writeStrings(buf3, json);
  const buf5 = computeChecksums(buf4, solution, w, h, grid2, numClues, stringStart);
  return new Uint8Array(buf5);
}


class PuzWriter {
  constructor() {
    this.buf = []
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
    if (s === undefined) s = '';
    for (var i = 0; i < s.length; i++) {
      var cp = s.codePointAt(i);
      if (cp < 0x100 && cp > 0) {
        this.buf.push(cp);
      } else {
        // TODO: expose this warning through the UI
        console.log('string "' + s + '" has non-ISO-8859-1 codepoint at offset ' + i);
        this.buf.push('?'.codePointAt(0));
      }
      if (cp >= 0x10000) i++;   // advance by one codepoint
    }
    this.buf.push(0);
  }

  writeHeader(json) {
    this.pad(2); // placeholder for checksum
    this.writeString('ACROSS&DOWN');
    this.pad(2); // placeholder for cib checksum
    this.pad(8); // placeholder for masked checksum
    this.version = '1.3';
    this.writeString(this.version);
    this.pad(2); // probably extra space for version string
    this.writeShort(0);  // scrambled checksum
    this.pad(12);  // reserved
    this.w = json.size.cols;
    this.h = json.size.rows;
    this.buf.push(this.w);
    this.buf.push(this.h);
    this.numClues = json.clues.across.length + json.clues.down.length;
    this.writeShort(this.numClues);
    this.writeShort(1);  // puzzle type
    this.writeShort(0);  // scrambled tag
  }

  writeFill(json) {
    const grid = json.grid;
    const BLACK_CP = '.'.codePointAt(0);
    this.solution = this.buf.length;
    for (var i = 0; i < grid.length; i++) {
      this.buf.push(grid[i].codePointAt(0));  // Note: assumes grid is ISO-8859-1
    }
    this.grid = this.buf.length;
    for (var i = 0; i < grid.length; i++) {
      var cp = grid[i].codePointAt(0);
      if (cp != BLACK_CP) cp = '-'.codePointAt(0);
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
      const sp = across[i].split('. ');
      clues.push([2 * parseInt(sp[0]), sp[1]]);
    }
    for (var i = 0; i < down.length; i++) {
      const sp = down[i].split('. ');
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
    if (this.version == '1.3') {
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