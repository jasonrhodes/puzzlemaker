const React = require("react");
const PuzzleContext = React.createContext();

function findAcross(row, startColumn) {
  return row.reduce((cell, ))
}

const PuzzleContextProvider = ({ grid, children }) => {
  const [puzzleState, setPuzzleState] = React.useState({
    activeCell: [],
    direction: "across",
    words: {
      across: [], // range of columns for the currently active across word
      down: [] // range of rows for the currently active down word
    },
    grid
  });

  const setActiveCell = (row, column) =>
    setPuzzleState({ ...puzzleState, activeCell: [row, column] });

  const toggleDirection = () =>
    setPuzzleState({
      ...puzzleState,
      direction: puzzleState.direction === "across" ? "down" : "across"
    });
  
  const calculateWords = () => {
    const [row, column] = puzzleState.activeCell;
    if (!row || !column) {
      return { across: [], down: [] };
    }
    
    if (!puzzleState.grid[row][column]) {
      return { across: [], down: [] };
    }
    
    
  }

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
