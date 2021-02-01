const React = require("react");
const { Link } = require("react-router-dom");
const Puzzle = require("./Puzzle");
const { PuzzleContextProvider, PuzzleContext } = require("./Puzzle/Context");
const initGrid = require("../utils/initGrid");

const Builder = function({ location, match }) {
  const { rows, columns } = location.state || {};
  const grid = initGrid({ rows: rows || 15, columns: columns || 15 });
  
  const handleClick = (puzzle) => {
    puzzle.setActiveCell([]); // TODO: this also makes the clues on the right go away, do we want that?
  }
  
  return (
    <PuzzleContextProvider initialGrid={grid} puzzleId={match.params.puzzleId}>
      <PuzzleContext.Consumer>
        {puzzle => (
          <div class="container" onClick={()=>handleClick(puzzle)}>
            <h1 class="title"><Link to="/">Puzzle<span class="accent-text">maker</span></Link></h1>
            <Puzzle initialGrid={grid} />
          </div>
        )}
      </PuzzleContext.Consumer>
    </PuzzleContextProvider>
  );
};

module.exports = Builder;
