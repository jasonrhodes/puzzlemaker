const React = require("react");
const PuzzleContext = React.createContext();
const { findAcross, findDown } = require("./utils");

const PuzzleContextProvider = ({ initialGrid, editMode, children }) => {
  const emptyWord = { range: [], word: "" };
  // const [puzzleState, setPuzzleState] = React.useState({
  //   activeCell: [],
  //   direction: "across",
  //   words: {
  //     across: emptyWord, // range of columns for the currently active across word
  //     down: emptyWord // range of rows for the currently active down word
  //   },
  //   grid,
  //   editMode
  // });
  
  const [activeCell, _setActiveCell] = React.useState([]);
  const [direction, setDirection] = React.useState("across");
  const [words, setWords] = React.useState({
    across: emptyWord,
    down: emptyWord
  });
  const [grid, setGrid] = React.useState(grid);

  const setActiveCell = (row, column) => {
    // console.log("Clicked on:", { row, column });
    // console.log("Value:", grid[row][column]);
    if (grid[row][column]) {
      _setActiveCell([row, column]);
      setWords(calculateCurrentWords(row, column));
    }
  };

  const toggleCell = (row, column) => {
    if (grid[row][column]) {
      let new_grid = grid;
      new_grid[row][column] = false;
      const size = grid[0].length;
      new_grid[size - (row + 1)][size - (column + 1)] = false;
      setGrid(new_grid);
    } else {
      let new_grid = grid;
      new_grid[row][column] = "A";
      const size = grid[0].length;
      new_grid[size - (row + 1)][size - (column + 1)] = "A";
      setGrid(new_grid);
    }
  };

  const toggleDirection = () =>
    setDirection(direction === "across" ? "down" : "across");

  const calculateCurrentWords = (row, column) => {
    if ((!row && row !== 0) || (!column && column !== 0)) {
      return emptyWord;
    }

    if (!grid[row][column]) {
      return emptyWord;
    }

    const across = findAcross(grid[row], column);
    const down = findDown(grid, row, column);

    return { across, down };
  };
  
  const updateCellValue = (row, column, value) => {
    setGrid()
  }

  let clue = 0;
  const getNextClueNumber = () => {
    return (clue += 1);
  };

  const isCellInActiveWord = (row, column) => {
    const [activeRow, activeColumn] = activeCell;
    if (direction === "across" && row !== activeRow) {
      return false;
    }
    if (direction === "down" && column !== activeColumn) {
      return false;
    }
    const { range } = words[direction];
    const [min, max] = range;
    if (direction === "across") {
      return column >= min && column <= max;
    }
    return row >= min && row <= max;
  };

  const value = {
    activeCell,
    direction,
    words,
    grid,
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
        <code>{JSON.stringify(value, null, 2)}</code>
      </pre>
    </PuzzleContext.Provider>
  );
};

module.exports = {
  PuzzleContext,
  PuzzleContextProvider
};
