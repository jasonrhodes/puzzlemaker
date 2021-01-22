const React = require("react");
const PuzzleRow = require("./PuzzleRow");
const { PuzzleContextProvider } = require("./PuzzleContext");

const Puzzle = ({ grid, editMode }) => {
  return (
    <PuzzleContextProvider grid={grid} editMode={editMode}>
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