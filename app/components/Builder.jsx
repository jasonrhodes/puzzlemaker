const React = require("react");
const DEFAULT_SIZE = 15;

const createBlankGrid = (size = DEFAULT_GRID) => {
  const grid = [];
  for (let i = 0; i <= size; i++) {
    let row = [];
    for let (j = 0; j <= size; j++) {
      row.push('o');
    }
    grid.push(row);
  }
  
  return grid;
}

const Puzzle = (props) => {
  return (
  
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
