const React = require("react");
const PuzzleContext = React.createContext();

function findAcross(row, activeColumn) {
  const range = row.reduce((range, column) => {
    if (range.start !== false && range.end && range.found) {
      return range;
    }
    if (!range.found && !range.start) {
      range.start = column;
    }
    if (column === activeColumn) {
      range.found = true;
    }
    if (!row[column] && range.found) {
      range.end = column - 1;
    }
    if (!row[column] && !range.found) {
      range.start = false;
    }
  }, { start: false, end: false, found: false });
  
  return [range.start, range.end];
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
    setPuzzleState({ ...puzzleState, activeCell: [row, column], words: calculateWords(row, column) });

  const toggleDirection = () =>
    setPuzzleState({
      ...puzzleState,
      direction: puzzleState.direction === "across" ? "down" : "across"
    });
  
  const calculateWords = (row, column) => {
    console.log('words!!');
    if (!row || !column) {
      return { across: [], down: [] };
    }
    
    if (!puzzleState.grid[row][column]) {
      return { across: [], down: [] };
    }
    
    const across = findAcross(puzzleState.grid[row], column);
    const down = [];
    
    console.log('calculated some werds', { across, down });
    
    return { across, down };
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
