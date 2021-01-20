const React = require("react");
const DEFAULT_SIZE = 15;

const createBlankGrid = (size = DEFAULT_SIZE) => {
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

// const PuzzleCell = (props) => {
//   let classes = ["puzzle-cell"];
//   if (!props.value) {
//     classes.push("puzzle-cell-x");
//   }
//   return (
//     <div class={classes.join(" ")}>
//       {props.value}
//     </div>
//   )
// }
//{props.row.map(cell => <PuzzleCell value={cell} />)}

const PuzzleRow = (props) => {
  console.log("Row props", props.row)
  return (
    <div class="puzzle-row">
      {props.row.map((cell, i) => <PuzzleCell key={`cell-${i}`} value={cell} />)}
    </div>
  );
}

const Puzzle = (props) => {
  console.log("Puzzle props", props.grid);
  return (
    <div class="puzzle-grid">
      <div>Test</div>
      {props.grid.map((row, i) => <PuzzleRow key={`row-${i}`} row={row} />)}
    </div>
  );
}

const Builder = function() {
  return (
    <div>
      <h1>Puzzle Builder ABC</h1>
      <h2>Title by Author</h2>
      <Puzzle grid={createBlankGrid()} />
    </div>
  );
};

module.exports = Builder;
