function convertPuzzleToJSON(puzzle) {
  let puz = {
    author: puzzle.author,
    title: puzzle.title,
    size: {
      rows: puzzle.grid.length,
      cols: puzzle.grid[0].length,
    },
    clues: {
      across: Object.entries(puzzle.clues.across).map(
        (pair) => pair[0] + "|| " + (pair[1] ? pair[1] : "(blank clue)")
      ),
      down: Object.entries(puzzle.clues.down).map(
        (pair) => pair[0] + "|| " + (pair[1] ? pair[1] : "(blank clue)")
      ),
    },
    grid: [],
  };

  console.log(puz.clues);

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

module.exports = {
  convertPuzzleToJSON,
  PuzWriter,
};
