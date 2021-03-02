const initGrid = require("./initGrid.js");
const getSymmetricalCell = require("./getSymmetricalCell");
const { assignClueNumbersToGrid } = require("./clues");

module.exports = {
  gridScore,
  generateGrid,
};

function gridScore(grid, fullOutput = false) {
  let words = {};
  let maxLength = Math.max(grid.length, grid[0].length);
  const numCells = grid.length * grid[0].length;

  for (let i = 1; i <= maxLength; i++) {
    words[i] = 0;
  }

  let inWord;
  let letter;
  let freeLetters = 0;
  let total = 0;
  let blackCells = 0;

  // ACROSS
  for (let row = 0; row < grid.length; row++) {
    inWord = false;
    letter = 0;

    for (let col = 0; col < grid[0].length; col++) {
      if (!grid[row][col].isBlackSquare) {
        inWord = true;
        letter += 1;
      } else {
        blackCells++;
        if (inWord) {
          inWord = false;
          words[letter] += 1;
          total += letter;
          letter = 0;
        }
      }
    }
    if (inWord) {
      words[letter] += 1;
      total += letter;
    }
  }

  // DOWN
  for (let col = 0; col < grid[0].length; col++) {
    inWord = false;
    letter = 0;

    for (let row = 0; row < grid[0].length; row++) {
      if (!grid[row][col].isBlackSquare) {
        inWord = true;
        letter += 1;
      } else {
        if (inWord) {
          inWord = false;
          words[letter] += 1;
          total += letter;
          letter = 0;
        }
      }
    }
    if (inWord) {
      words[letter] += 1;
      total += letter;
    }
  }

  // Count white squares that don't border any black cells/edges
  for (let col = 1; col < grid[0].length - 1; col++) {
    for (let row = 1; row < grid[0].length - 1; row++) {
      if (!grid[row][col].isBlackSquare) {
        if (
          !grid[row - 1][col].isBlackSquare &&
          !grid[row + 1][col].isBlackSquare &&
          !grid[row][col - 1].isBlackSquare &&
          !grid[row][col + 1].isBlackSquare
        ) {
          freeLetters++;
        }
      }
    }
  }

  const numWords = Object.keys(words).reduce(
    (sum, key) => sum + parseFloat(words[key] || 0),
    0
  );
  const avgLength = total / numWords;
  // console.log(words, numWords);

  let score = 0;
  let change = 0;

  // Magic number stuff for word length distribution that "feels right"
  for (const [length, num] of Object.entries(words)) {
    if (parseInt(length) === 1) {
      change = -(num * 1000);
    } else if (parseInt(length) === 2) {
      change = -(num * 75);
    } else if (parseInt(length) <= 5) {
      change =
        (1 - Math.abs(parseInt(length) / maxLength - num / numWords)) * 100;
    } else if (parseInt(length) <= 8) {
      change =
        (1 -
          4 *
            Math.abs(
              (maxLength - parseInt(length)) / (0.5 * maxLength * maxLength) -
                num / numWords
            )) *
        100;
    } else if (parseInt(length) <= maxLength) {
      change =
        (1 -
          10 *
            Math.abs(
              (maxLength - parseInt(length)) / (0.67 * maxLength * maxLength) -
                num / numWords
            )) *
        100;
    }
    score += change;
    //console.log(parseInt(length), Math.round(100*num/numWords), Math.round(change), Math.round(score));
  }

  // Punish too many free letters
  score -= freeLetters * 8;

  // Try to force approximate averages based on NYT statistics
  score -= (Math.abs(3 * numWords - numCells) / numCells) * 50;
  score -= (Math.abs(3.25 * freeLetters - numCells) / numCells) * 50;
  score -= (Math.abs(6 * blackCells - numCells) / numCells) * 100;

  // Make it a bit more likely for full-width words to show up
  words[maxLength - 1] === 0 ? (score -= 75) : null;

  if (fullOutput) {
    return [score, numWords, freeLetters, avgLength, blackCells];
  } else {
    return score;
  }
}

function generateGrid(puzzle) {
  let rowNum = puzzle.grid.length;
  let colNum = puzzle.grid[0].length;

  const grid = initGrid({ rows: rowNum, columns: colNum });

  let noImprovementCounter = 0;
  let score = gridScore(grid);
  let newScore = 0;
  let symRow;
  let symCol;
  //console.log(score, noImprovementCounter);

  while (noImprovementCounter < Math.min(rowNum * colNum, 500)) {
    let randomRow = getRandomInt(0, rowNum);
    let randomCol = getRandomInt(0, colNum);
    grid[randomRow][randomCol].isBlackSquare = !grid[randomRow][randomCol]
      .isBlackSquare;
    if (puzzle.symmetry) {
      [symRow, symCol] = getSymmetricalCell(grid, randomRow, randomCol);
      grid[symRow][symCol].isBlackSquare = !grid[symRow][symCol].isBlackSquare;
    }
    newScore = gridScore(grid);
    if (newScore < score) {
      grid[randomRow][randomCol].isBlackSquare = !grid[randomRow][randomCol]
        .isBlackSquare;
      if (puzzle.symmetry) {
        grid[symRow][symCol].isBlackSquare = !grid[symRow][symCol]
          .isBlackSquare;
      }
      noImprovementCounter++;
    } else {
      noImprovementCounter = 0;
      score = newScore;
    }
    //console.log(score, noImprovementCounter, randomRow, randomCol, grid[randomRow][randomCol].isBlackSquare);
  }

  const [final_score, numWords, freeLetters, avgLength, blackCells] = gridScore(
    grid,
    true
  );
  console.log(
    "DEBUG gridScore:",
    final_score,
    "#Words:",
    numWords,
    "#FreeCells:",
    freeLetters,
    "Avg. length:",
    avgLength,
    "#BlackCells:",
    blackCells
  );

  puzzle.setGrid(assignClueNumbersToGrid(grid));

  const newClues = puzzle.clues;
  Object.keys(newClues.across).forEach((v) => (newClues.across[v] = ""));
  Object.keys(newClues.down).forEach((v) => (newClues.down[v] = ""));
  puzzle.setAcrossFilter([]);
  puzzle.setDownFilter([]);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
