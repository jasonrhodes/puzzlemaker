const React = require("react");
const PuzzleRow = require("./PuzzleRow");

const Puzzle = props => {
  const [puzzleState, setPuzzleState] = React.useState({
    activeCell: [],
    grid: props.grid
  }); // set via local storage at some point, for saved puzzles?
  
  const setActiveCell = (row, column) => setPuzzleState({ ...puzzleState, activeCell: [row, column] });
  let clue = 0;
  const getNextClueNumber = () => {
    return clue += 1;
  };
  return (
    <div class="puzzle-grid">
      {props.grid.map((columns, i) => (
        <PuzzleRow
          key={`row-${i}`}
          row={i}
          columns={columns}
          getNextClueNumber={getNextClueNumber}
          puzzleState={puzzleState}
          setPuzzleState={setPuzzleState}
          setActiveCell={setActiveCell}
        />
      ))}
    </div>
  );
};

module.exports = Puzzle;