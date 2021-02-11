const React = require("react");
const { findClueStartCell } = require("../../../utils/cellNavigation");
//const OneLookLink = require("./OneLookLink");
//const { Filter } = require("react-feather");
//const ClueInput = require("./ClueInput");

function ClueListAll({ ad, puzzle }) {
  const [row, column] = puzzle.activeCell;
  const { acrossNumber, downNumber } = puzzle.getCluesForCell(row, column);
  const number = ad === "across" ? acrossNumber : downNumber;

  const handleMouseEnter = (e, clue) => {
    null;
  };

  const handleMouseOut = (e) => {
    null;
  };

  const jumpToClue = (e, clue) => {
    puzzle.setActiveCell(findClueStartCell(puzzle.grid, clue, ad));
    puzzle.setDirection(ad);
    e.stopPropagation();
  };

  return (
    <div className="suggestions">
      {Object.entries(puzzle.clues[ad]).map((pair, i) => (
        <div key={i} className="inline">
          <div
            onMouseEnter={(e) => handleMouseEnter(e, pair[0])}
            onMouseLeave={(e) => handleMouseOut(e)}
            className={
              parseInt(pair[0]) === number && puzzle.direction === ad
                ? "suggestion highlighted"
                : "suggestion"
            }
            onClick={(e) => jumpToClue(e, pair[0], ad)}
          >
            {pair[0]}: {pair[1]}
          </div>
        </div>
      ))}
    </div>
  );
}

module.exports = ClueListAll;
