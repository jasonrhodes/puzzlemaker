const React = require("react");
const Puzzle = require("./Puzzle");
const ClueList = require("./ClueList");
const { PuzzleContextProvider, PuzzleContext } = require("./Puzzle/Context");
const initGrid = require("../utils/initGrid");

const AltPrint = function({ location, match }) {
  const { rows, columns } = location.state || {};
  const grid = initGrid({ rows: rows || 15, columns: columns || 15 });
  
  
  
  return (
    <PuzzleContextProvider initialGrid={grid} puzzleId={match.params.puzzleId}>
      <PuzzleContext.Consumer>
        {puzzle => (
          <div class="page">
            <div class="container">
              <h1 class="title">Puzzle<span class="accent-text">maker</span></h1>
              <Puzzle initialGrid={grid} />
            </div>
            <Puzzle initialGrid={grid} />
          </div>
        )}
      </PuzzleContext.Consumer>
    </PuzzleContextProvider>
  );
};

module.exports = AltPrint;
