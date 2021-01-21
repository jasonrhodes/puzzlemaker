const React = require("react");
const DEFAULT_SIZE = 15;
const DEFAULT_BLOCKS = [
  [0, 4], // should trigger 14, 10 (if size is 15) -- for rotational symmetry
  [1, 4],
  [2, 4],
  [3, 4],
  [0, 10],
  [1, 10],
  [2, 10],
  [6, 0],
  [6, 1],
  [6, 2],
  [6, 3]
];

const applyBlocks = (_grid, blocks) => {
  const grid = [..._grid];
  blocks.forEach(([row, column]) => {
    grid[row][column] = false;
    const size = grid[0].length;
    grid[size - (row + 1)][size - (column + 1)] = false;
  });
  
  return grid;
}

const initGrid = ({ size = DEFAULT_SIZE, blocks = DEFAULT_BLOCKS }) => {
  const grid = [];
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      row.push(true);
    }
    grid.push(row);
  }
  return applyBlocks(grid, blocks);
}

const getCellLabel = ({ row, column }) => {
  if (row === 0) {
    return column + 1;
  }
  if (column === 0) {
    return row + 1;
  }
  return false;
}

const PuzzleCell = (props) => {
  let classes = ["puzzle-cell"];
  if (!props.value) {
    classes.push("puzzle-cell-x");
  }
  return (
    <div class={classes.join(" ")}>
      {props.value}
      {props.value && props.label ? <div class="label">{props.label}</div> : null}
    </div>
  )
}

const PuzzleRow = (props) => {
  console.log("Row props", props.row)
  return (
    <div class="puzzle-row">
      {props.row.map((cell, i) => <PuzzleCell label={getCellLabel({ row: props.row_id, column: i })} value={cell} />)}
    </div>
  );
}

const Puzzle = (props) => {
  console.log("Puzzle props", props.grid);
  return (
    <div class="puzzle-grid">
      {props.grid.map((row, i) => <PuzzleRow key={`row-${i}`} row_id={i} row={row} />)}
    </div>
  );
}

const Builder = function() {
  const grid = initGrid();
  return (
    <div>
      <h1>p u z z l e m a k e r</h1>
      <p>[Title] by [Author]</p>
      <Puzzle grid={grid} />
    </div>
  );
};

module.exports = Builder;
