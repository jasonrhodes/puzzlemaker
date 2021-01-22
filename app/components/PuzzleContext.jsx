const React = require("react");
const PuzzleContext = React.createContext();

function findAcross(cellsInActiveRow, activeColumn) {
  const range = cellsInActiveRow.reduce(
    (range, cellValue) => {
      const isBlackSquare = !cellValue;

      if (range.start !== false && range.end && range.found) {
        range.count++;
        return range;
      }
      if (!range.found && range.start === false) {
        range.start = range.count;
        range.word = "";
      }
      if (!isBlackSquare) {
        range.word += typeof cellValue === "string" ? cellValue : "_";
      }
      if (isBlackSquare && range.found) {
        range.end = range.count - 1;
      }
      if (range.count === activeColumn) {
        range.found = true;
      }
      if (isBlackSquare && !range.found) {
        range.start = false;
      }
      if (!range.end && range.count === cellsInActiveRow.length - 1) {
        range.end = range.count;
      }

      range.count++;
      return range;
    },
    { count: 0, start: false, end: false, found: false, word: "" }
  );

  return { range: [range.start, range.end], word: range.word };
}

function findDown(rows, activeRow, activeColumn) {
  const range = rows.reduce(
    (range, row) => {
      const cellValue = row[activeColumn];
      const isBlackSquare = !cellValue;

      if (range.start !== false && range.end && range.found) {
        range.count++;
        return range;
      }
      if (!range.found && range.start === false) {
        range.start = range.count;
        range.word = "";
      }
      if (!isBlackSquare) {
        range.word += typeof cellValue === "string" ? cellValue : "_";
      }
      if (isBlackSquare && range.found) {
        range.end = range.count - 1;
      }
      if (range.count === activeRow) {
        range.found = true;
      }
      if (isBlackSquare && !range.found) {
        range.start = false;
      }
      if (!range.end && range.count === rows.length - 1) {
        range.end = range.count;
      }

      range.count++;
      return range;
    },
    { count: 0, start: false, end: false, found: false, word: "" }
  );

  return { range: [range.start, range.end], word: range.word };
}

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
    if (grid[row][column]){
      setPuzzleState({
        ...puzzleState,
        activeCell: [row, column],
        words: calculateCurrentWords(row, column)
      });
    }
  };

  const toggleCell = (row, column) => {
    if (grid[row][column]){
      let new_grid = grid;
      new_grid[row][column] = false;
      setPuzzleState({
        ...puzzleState,
        grid: new_grid
      });
    } else {
      let new_grid = grid;
      new_grid[row][column] = "A";
      setPuzzleState({
        ...puzzleState,
        grid: new_grid
      });
    }
  }
  
  const toggleDirection = () =>
    setPuzzleState({
      ...puzzleState,
      direction: puzzleState.direction === "across" ? "down" : "across"
    });

  const calculateCurrentWords = (row, column) => {
    /*if (!row || !column) {
      return emptyWord;
    }*/   // this gave an error for row/column 0

    if (!puzzleState.grid[row][column]) {
      return emptyWord;
    }

    const across = findAcross(puzzleState.grid[row], column);
    const down = findDown(puzzleState.grid, row, column);

    return { across, down };
  };

  let clue = 0;
  const getNextClueNumber = () => {
    return (clue += 1);
  };

  const isCellInActiveWord = (row, column) => {
    /*console.log("checking if cell is in an active word", {
      row,
      column,
      puzzle: puzzleState
    });*/
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
