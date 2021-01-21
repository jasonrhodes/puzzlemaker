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
};

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
};

const getCellLabel = ({ grid, row, column, getNextClueNumber }) => {
  const currentCell = grid[row][column];
  if (!currentCell) {
    return false;
  }
  if (row === 0) {
    return getNextClueNumber();
  }
  if (column === 0) {
    return getNextClueNumber();
  }
  if (grid[row][column - 1] === false) {
    return getNextClueNumber();
  }
  if (grid[row - 1][column] === false) {
    return getNextClueNumber();
  }
  return false;
};

const PuzzleCell = ({ value, row, column, grid, getNextClueNumber }) => {
  let classes = ["puzzle-cell"];
  if (!value) {
    classes.push("puzzle-cell-x");
  }
  const label = getCellLabel({ row, column, grid, getNextClueNumber });
  return (
    <div class={classes.join(" ")}>
      {value}
      {value && label ? <div class="label">{label}</div> : null}
    </div>
  );
};

const PuzzleRow = props => {
  return (
    <div class="puzzle-row">
      {props.row.map((cell, i) => (
        <PuzzleCell
          row={props.row_id}
          column={i}
          value={cell}
          grid={props.grid}
          getNextClueNumber={props.getNextClueNumber}
        />
      ))}
    </div>
  );
};

const Puzzle = props => {
  let clue = 0;
  const getNextClueNumber = () => {
    return clue += 1;
  };
  return (
    <div class="puzzle-grid">
      {props.puzzle.grid.map((row, i) => (
        <PuzzleRow
          key={`row-${i}`}
          row_id={i}
          row={row}
          grid={props.grid}
          getNextClueNumber={getNextClueNumber}
        />
      ))}
    </div>
  );
};

const Builder = function() {
  const [grid, setGrid] = React.useState(initGrid());
  return (
    <div>
      <h1>p u z z l e m a k e r</h1>
      <p>[Title] by [Author]</p>
      <Puzzle grid={grid} setGrid={setGrid} />
    </div>
  );
};

module.exports = Builder;
