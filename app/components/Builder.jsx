const React = require("react");
const { Link } = require("react-router-dom");
const Puzzle = require("./Puzzle");
const { PuzzleContextProvider, PuzzleContext } = require("./PuzzleContext");

const { initGrid } = require("./utils");

const Builder = function({ location }) {
  const { rows, columns } = location.state || {};
  const symmetry = location.symmetry || true;
  const grid = initGrid({ rows: rows || 15, columns: columns || 15 });
  const handleClick = (puzzle) => {
    console.log("click!");
    puzzle.setActiveCell([]);
  }
  
  return (
    <PuzzleContext.Consumer>
      {puzzle => (
        <div class="container" onClick={()=>handleClick(puzzle)}>
          <h1 class="title">Puzzle<span class="accent-text">maker</span></h1>
          <Puzzle initialGrid={grid} />
        </div>
      )}
    </PuzzleContext.Consumer>
  );
};

module.exports = Builder;
