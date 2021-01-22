const React = require("react");
const PuzzleContext = React.createContext();
const { findAcross, findDown } = require("./utils");

const PuzzleContextProvider = ({ grid, editMode, children }) => {
  const emptyWord = { range: [], word: "" };
  const [puzzleState, setPuzzleState] = React.useState({
    activeCell: [],
    direction: "across",
    words: {
      across: emptyWord, // range of columns for the currently active across word
      down: emptyWord // range of rows for the currently active down word
    },
    grid,
    editMode
  });

  const setActiveCell = (row, column) => {
    console.log("Clicked on:", { row, column });
    console.log("Value:", grid[row][column]);
    if (grid[row][column]) {
      setPuzzleState({
        ...puzzleState,
        activeCell: [row, column],
        words: calculateCurrentWords(row, column)
      });
    }
  };

  const toggleCell = (row, column) => {
    if (grid[row][column]) {
      let new_grid = grid;
      new_grid[row][column] = false;
      const size = grid[0].length;
      new_grid[size - (row + 1)][size - (column + 1)] = false;
      setPuzzleState({
        ...puzzleState,
        grid: new_grid
      });
    } else {
      let new_grid = grid;
      new_grid[row][column] = "A";
      const size = grid[0].length;
      new_grid[size - (row + 1)][size - (column + 1)] = "A";
      setPuzzleState({
        ...puzzleState,
        grid: new_grid
      });
    }
  };

  const toggleDirection = () =>
    setPuzzleState({
      ...puzzleState,
      direction: puzzleState.direction === "across" ? "down" : "across"
    });

  const calculateCurrentWords = (row, column) => {
    if ((!row && row !== 0) || (!column && column !== 0)) {
      return emptyWord;
    }

    if (!puzzleState.grid[row][column]) {
      return emptyWord;
    }

    const across = findAcross(puzzleState.grid[row], column);
    const down = findDown(puzzleState.grid, row, column);

    return { across, down };
  };
  
  const updateCellValue(row, column, value) {
    
  }

  let clue = 0;
  const getNextClueNumber = () => {
    return (clue += 1);
  };

  const isCellInActiveWord = (row, column) => {
    const [activeRow, activeColumn] = puzzleState.activeCell;
    if (puzzleState.direction === "across" && row !== activeRow) {
      return false;
    }
    if (puzzleState.direction === "down" && column !== activeColumn) {
      return false;
    }
    const { range } = puzzleState.words[puzzleState.direction];
    const [min, max] = range;
    if (puzzleState.direction === "across") {
      return column >= min && column <= max;
    }
    return row >= min && row <= max;
  };

  const value = {
    ...puzzleState,
    setActiveCell,
    toggleDirection,
    toggleCell,
    getNextClueNumber,
    isCellInActiveWord
  };

  return (
    <PuzzleContext.Provider value={value}>
      {children}
      <br />
      <br />
      <pre>
        <code>{JSON.stringify(puzzleState, null, 2)}</code>
      </pre>
    </PuzzleContext.Provider>
  );
};

module.exports = {
  PuzzleContext,
  PuzzleContextProvider
};
