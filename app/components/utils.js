const applyBlocks = (_grid, blocks) => {
  const grid = [..._grid];
  blocks.forEach(([row, column]) => {
    grid[row][column] = false;
    const size = grid[0].length;
    grid[size - (row + 1)][size - (column + 1)] = false;
  });

  return grid;
};

module.exports.initGrid = ({ size, blocks }) => {
  const grid = [];
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      row.push(true);
    }
    grid.push(row);
  }
  return applyBlocks(grid, blocks);
};