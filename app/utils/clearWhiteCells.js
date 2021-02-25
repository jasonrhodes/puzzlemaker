module.exports = {
  clearWhiteCells,
  checkEmpty,
};

function clearWhiteCells(puzzle) {
  const newGrid = [...puzzle.grid];
  const newClues = puzzle.clues;

  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[0].length; col++) {
      newGrid[row][col].value = "";
      newGrid[row][col].isRebus = false;
      newGrid[row][col].pencil = "";
    }
  }

  Object.keys(newClues.across).forEach((v) => (newClues.across[v] = ""));
  Object.keys(newClues.down).forEach((v) => (newClues.down[v] = ""));

  puzzle.setGrid(newGrid);
  puzzle.setClues(newClues);
  puzzle.setAcrossFilter([]);
  puzzle.setDownFilter([]);
}

function checkEmpty(puzzle) {
  const newGrid = [...puzzle.grid];
  const newClues = puzzle.clues;

  let notEmpty = false;

  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[0].length; col++) {
      if (!newGrid[row][col].isBlackSquare && newGrid[row][col].value != "") {
        notEmpty = true;
      }
    }
  }

  Object.keys(newClues.across).forEach((v) =>
    newClues.across[v] != "" ? (notEmpty = true) : null
  );
  Object.keys(newClues.down).forEach((v) =>
    newClues.down[v] != "" ? (notEmpty = true) : null
  );

  return !notEmpty;
}
