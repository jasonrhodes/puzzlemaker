const React = require("react");
const DEFAULT_SIZE = 15;

const createBlankGrid = (size = DEFAULT_GRID) => {
  const grid = [];
  for (let i = 0; i <= size; i++) {
    let row = [];
    for (let j = 0; j <= size; j++) {
      row.push(true);
    }
    grid.push(row);
  }
  return grid;
}

const PuzzleCell = (props) => {
  let classes = ["puzzle-cell"];
  if (!props.value) {
    classes.push("puzzle-cell-x");
  }
  return (
    <div class={classes.join(" ")}>
      {props.value}
    </div>
  )
}

const PuzzleRow = (props) => {
  return (
    <div class="puzzle-row">
      {props.row.forEach(cell => <PuzzleCell value={cell} />)}
    </div>
  );
}

const Puzzle = (props) => {
  return (
    <div class="puzzle-grid">
      {props.grid.forEach(row => <PuzzleRow row={row} />)}
    </div>
  );
}

const Builder = function() {
  return (
    <div>
      <h1>Puzzle Builder</h1>
      <h2>Title by Author</h2>
      <Puzzle grid={createBlankGrid()} />
    </div>
  );
};

module.exports = Builder;
