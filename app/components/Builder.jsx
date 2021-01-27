const React = require("react");
const { Link, useParams } = require("react-router-dom");
const Puzzle = require("./Puzzle");
const { PuzzleContextProvider, PuzzleContext } = require("./PuzzleContext");

const { initGrid } = require("./utils");

const Builder = function({ location, match }) {
  const { rows, columns } = location.state || {};
  const grid = initGrid({ rows: rows || 15, columns: columns || 15 });
  // const { puzzleId } = useParams();
  console.log('route', { location, match });
  
  const handleClick = (puzzle) => {
    puzzle.setActiveCell([]);
  }
  
  return (
    <PuzzleContextProvider initialGrid={grid} puzzleId={match.params.puzzleId}>
      <PuzzleContext.Consumer>
        {puzzle => (
          <div class="container" onClick={()=>handleClick(puzzle)}>
            <h1 class="title">Puzzle<span class="accent-text">maker</span></h1>
            <Puzzle initialGrid={grid} />
          </div>
        )}
      </PuzzleContext.Consumer>
    </PuzzleContextProvider>
  );
};

module.exports = Builder;
