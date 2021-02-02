const React = require("react");
const Puzzle = require("./Puzzle");
const { PuzzleContextProvider, PuzzleContext } = require("./Puzzle/Context");
const initGrid = require("../utils/initGrid");

const Solver = function({ location, match }) {
  const { rows, columns } = location.state || {};
  const grid = initGrid({ rows: rows || 15, columns: columns || 15 });

  return (
    <PuzzleContextProvider initialGrid={grid} puzzleId={match.params.puzzleId}>
      <PuzzleContext.Consumer>
        {puzzle => (
          <div class="container">
            <h1 class="title">Puzzle<span class="accent-text-alt">solver</span></h1>
            <div class="page">
              <Puzzle initialGrid={grid} />
            </div>
          </div>
        )}
      </PuzzleContext.Consumer>
    </PuzzleContextProvider>
  );
};

module.exports = Solver;
