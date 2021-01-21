const React = require("react");
const PuzzleRow = require("./PuzzleRow");
const { PuzzleContextProvider } = require("./PuzzleContext");

const Puzzle = ({ grid }) => {
  return (
    <PuzzleContextProvider grid={grid}>
      <div class="puzzle-grid">
        {grid.map((columns, i) => (
          <PuzzleRow
            key={`row-${i}`}
            row={i}
            columns={columns}
          />
        ))}
      </div>
    </PuzzleContextProvider>
  );
};

module.exports = Puzzle;