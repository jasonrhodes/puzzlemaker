module.exports = {
  clearWhiteCells,
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
