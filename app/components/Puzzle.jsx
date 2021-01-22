const React = require("react");
const PuzzleRow = require("./PuzzleRow");
const { PuzzleContextProvider, PuzzleContext } = require("./PuzzleContext");

const Puzzle = ({ initialGrid, editMode }) => {
  return (
    <PuzzleContextProvider initialGrid={grid} editMode={editMode}>
      <PuzzleContext.Consumer>
        {value => }
      <div class="puzzle-grid">
        {grid.map((columns, i) => (
          <PuzzleRow
            key={`row-${i}`}
            row={i}
            columns={columns}
          />
        ))}
      </div>
      </PuzzleContext.Consumer>
    </PuzzleContextProvider>
  );
};

module.exports = Puzzle;