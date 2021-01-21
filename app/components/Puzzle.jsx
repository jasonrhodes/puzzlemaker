const React = require("react");
const PuzzleRow = require("./PuzzleRow");

const PuzzleContext = React.createContext();

const PuzzleContextProvider = ({ grid, children }) => {
  const [puzzleState, setPuzzleState] = React.useState({
    activeCell: [],
    direction: "across",
    word: [],
    grid
  });
  const setActiveCell = (row, column) => setPuzzleState({ ...puzzleState, activeCell: [row, column] });
  let clue = 0;
  const getNextClueNumber = () => {
    return clue += 1;
  };
  
  const value = {
    ...puzzleState,
    setActiveCell,
    getNextClueNumber
  }
  
  return (
    <PuzzleContext.Provider value={value}>
      {children}
    </PuzzleContext.Provider>
  )
}

const Puzzle = ({ grid }) => {
  return (
    <PuzzleContextProvider grid={grid}>
      <div class="puzzle-grid">
        {grid.map((columns, i) => (
          <PuzzleRow
            key={`row-${i}`}
            row={i}
            columns={columns}
          />
        ))}
      </div>
    </PuzzleContextProvider>
  );
};

module.exports = Puzzle;