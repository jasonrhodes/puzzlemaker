const React = require("react");
const PuzzleContext = React.createContext();
const { findAcross, findDown, getSymmetricalCell } = require("./utils");

const PuzzleContextProvider = ({ initialGrid, children }) => {
  const emptyWord = { range: [], word: "" };
  const [activeCell, setActiveCell] = React.useState([]);
  const [direction, setDirection] = React.useState("across");
  const [words, setWords] = React.useState({
    across: emptyWord,
    down: emptyWord
  });
  const [grid, setGrid] = React.useState(initialGrid);
  const [symmetry, setSymmetry] = React.useState(true);

  const toggleDirection = () =>
    setDirection(direction === "across" ? "down" : "across");
  
  const toggleSymmetry = () => setSymmetry(!symmetry);

  const calculateCurrentWords = () => {
    const [row, column] = activeCell;
    if ((!row && row !== 0) || (!column && column !== 0)) {
      return { across: emptyWord, down: emptyWord };
    }

    if (grid[row][column].isBlackSquare) {
      return { across: emptyWord, down: emptyWord };
    }

    const across = findAcross(grid[row], column);
    const down = findDown(grid, row, column);

    return { across, down };
  };
  
  const calculateAllClues = () => {
    let inWord = false;
    const AcrossClues = [];
    const DownClues = [];
    for (let r of grid){
      for (let cell of r){
        if (!inWord) {
          AcrossClues.push("X ");
          inWord = true;
        } else if (cell.isBlackSquare) {
          inWord = false;
        }
      }
      inWord = false;
    }
    inWord = false;
    for (let c = 0; c < grid[0].length; c++){
      for (let r = 0; r < grid.length; r++){
        if (!inWord) {
          AcrossClues.push("X ");
          inWord = true;
        } else if (cell.isBlackSquare) {
          inWord = false;
        }
      }
      inWord = false;
    }
    return 'Across: ' + AcrossClues + ', Down: ' + DownClues ;
  }
  
  const updateCellValue = (row, column, value) => {
    const newGrid = [...grid];
    newGrid[row][column].value = value;
    setGrid(newGrid);
  }
  
  const updateCellClue = (row, column, clue) => {
    
  }
  
  const toggleBlackSquare = (row, column) => {
    const currentValue = grid[row][column].isBlackSquare;
    const newGrid = [...grid];
    newGrid[row][column].isBlackSquare = !currentValue;
    newGrid[row][column].style = null;
    if (symmetry) {
      const [symRow, symCol] = getSymmetricalCell(grid, row, column);
      newGrid[symRow][symCol].isBlackSquare = !currentValue;
      newGrid[symRow][symCol].style = null;
    }
    setGrid(newGrid);
  }
  
  const rotateStyle = (row, column) => {
    const currentValue = grid[row][column].style;
    const newGrid = [...grid];
    if (!currentValue) {
      newGrid[row][column].style = 'circled';
    } else if (currentValue === 'circled') {
      newGrid[row][column].style = 'marked';
    } else {
      newGrid[row][column].style = null;
    }
    setGrid(newGrid);
  }
  
  const nextAcross = () => {
    const [activeRow, activeColumn] = activeCell;
    const nextColumn = Math.min(activeColumn + 1, grid[0].length - 1);
    setActiveCell([activeRow, nextColumn])
  }
  
  const prevAcross = () => {
    const [activeRow, activeColumn] = activeCell;
    const prevColumn = Math.max(activeColumn - 1, 0);
    setActiveCell([activeRow, prevColumn]);
  }
  
  const nextDown = () => {
    const [activeRow, activeColumn] = activeCell;
    const nextRow = Math.min(activeRow + 1, grid.length - 1);
    setActiveCell([nextRow, activeColumn]);
  }
  
  const prevDown = () => {
    const [activeRow, activeColumn] = activeCell;
    const prevRow = Math.max(activeRow - 1, 0);
    setActiveCell([prevRow, activeColumn]);
  }
  
  const advanceActiveCell = () => {
    direction === "across" ? nextAcross() : nextDown();
  }
  
  const rewindActiveCell = () => {
    direction === "across" ? prevAcross() : prevDown();
  }
  
  React.useEffect(() => {
    console.log("USE EFFECT 1 (GRID)")
    setWords(calculateCurrentWords());
  }, [grid, setWords])
  
  React.useEffect(() => {
    console.log("USE EFFECT 2 (activeCell)")
    setWords(calculateCurrentWords());
  }, [activeCell, setWords])

  let clue = 0;
  const getNextClueNumber = () => {
    return (clue += 1);
  };
  
  const resetClue = () => {
    clue = 0;
  }

  const isCellInActiveWord = (row, column) => {
    if (!direction || !words[direction]) {
      console.error("Error with checking cell in active word", { direction, words });
      return false;
    }
    if (grid[row][column].isBlackSquare) {
      return false;
    }
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
    clue,
    resetClue,
    symmetry,
    setActiveCell,
    toggleDirection,
    getNextClueNumber,
    isCellInActiveWord,
    updateCellValue,
    toggleSymmetry,
    toggleBlackSquare,
    rotateStyle,
    nextAcross,
    prevAcross,
    nextDown,
    prevDown,
    advanceActiveCell,
    rewindActiveCell
  };

  return (
    <PuzzleContext.Provider value={value}>
      {children}
      <br />
      <br />
      <pre>
        <code>{calculateAllClues()}</code>
        <code>{JSON.stringify(value, null, 2)}</code>
      </pre>
    </PuzzleContext.Provider>
  );
};

module.exports = {
  PuzzleContext,
  PuzzleContextProvider
};
