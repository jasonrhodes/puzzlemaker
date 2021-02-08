const React = require("react");
const Puzzle = require("./Puzzle");
const ClueList = require("./Puzzle/ClueList");
const { PuzzleContextProvider, PuzzleContext } = require("./Puzzle/Context");
const initGrid = require("../utils/initGrid");

const AltPrint = function({ location, match }) {
  const { rows, columns } = location.state || {};
  const grid = initGrid({ rows: rows || 15, columns: columns || 15 });



  return (
    <PuzzleContextProvider initialGrid={grid} puzzleId={match.params.puzzleId}>
      <PuzzleContext.Consumer>
        {puzzle => (
          <div className="container">
            <h1 className="title">Puzzle<span className="accent-text">maker</span></h1>
            <div className="page">
              <Puzzle initialGrid={grid} />
              <ClueList clues={puzzle.clues} />
            </div>
          </div>
        )}
      </PuzzleContext.Consumer>
    </PuzzleContextProvider>
  );
};

module.exports = AltPrint;
