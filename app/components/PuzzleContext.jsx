const React = require("react");
const PuzzleContext = React.createContext();

const PuzzleContextProvider = ({ grid, children }) => {
  const [puzzleState, setPuzzleState] = React.useState({
    activeCell: [],
    direction: "across",
    words: {
      across: [], // range of columns
      down: []
    }
    grid
  });

  const setActiveCell = (row, column) =>
    setPuzzleState({ ...puzzleState, activeCell: [row, column] });

  const toggleDirection = () =>
    setPuzzleState({
      ...puzzleState,
      direction: puzzleState.direction === "across" ? "down" : "across"
    });

  let clue = 0;
  const getNextClueNumber = () => {
    return (clue += 1);
  };

  const value = {
    ...puzzleState,
    setActiveCell,
    toggleDirection,
    getNextClueNumber
  };

  return (
    <PuzzleContext.Provider value={value}>{children}</PuzzleContext.Provider>
  );
};

module.exports = {
  PuzzleContext,
  PuzzleContextProvider
};
