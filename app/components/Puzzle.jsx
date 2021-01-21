const React = require("react");
const PuzzleRow = require("./PuzzleRow");

const PuzzleContext = React.createContext();

const PuzzleContextProvider = ({ grid, children }) => {
  const [puzzleState, setPuzzleState] = React.useState({
    activeCell: [],
    direction: "across",
    word: [],
    grid: props.grid
  });
  const setActiveCell = (row, column) => setPuzzleState({ ...puzzleState, activeCell: [row, column] });
  let clue = 0;
  const getNextClueNumber = () => {
    return clue += 1;
  };
  
  return (
    <Puzzle
  )
}

const Puzzle = ({ grid }) => {
  return (
    <PuzzleContextProvider grid={grid}></PuzzleContextProvider>
    <div class="puzzle-grid">
      {props.grid.map((columns, i) => (
        <PuzzleRow
          key={`row-${i}`}
          row={i}
          columns={columns}
        />
      ))}
    </div>
  );
};

module.exports = Puzzle;