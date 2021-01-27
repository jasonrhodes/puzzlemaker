const React = require("react");
const PuzzleContext = React.createContext();
const {
  findAcross,
  findDown,
  getSymmetricalCell,
  calculateAllClueNumbers
} = require("./utils");

function getSavedPuzzle(id) {
  if (!id) {
    return undefined;
  }
  const str = window.localStorage.getItem(id);
  if (str && typeof str === "string") {
    return JSON.parse(str);
  }
  return undefined;
}

const PuzzleContextProvider = ({ initialGrid, puzzleId, children }) => {
  const emptyWord = { range: [], word: "" };
  const [savedPuzzleId, setSavedPuzzleId] = React.useState(null);
  const [activeCell, setActiveCell] = React.useState([]);
  const [direction, setDirection] = React.useState("across");
  const [words, setWords] = React.useState({
    across: emptyWord,
    down: emptyWord
  });
  const [grid, setGrid] = React.useState(initialGrid);
  const [symmetry, setSymmetry] = React.useState(true);
  const [labelGrid, setLabelGrid] = React.useState([]);
  const [title, setTitle] = React.useState("Untitled");
  const [author, setAuthor] = React.useState("Author")
  
  React.useEffect(() => {
    console.log("grid updated, calculating clue numbers");
    const { labelGrid } = calculateAllClueNumbers(grid);
    console.log("label grid", labelGrid);
    setLabelGrid(labelGrid);
  }, [grid]);
  
  React.useEffect(() => {
    setWords(calculateCurrentWords());
  }, [grid, setWords, activeCell]);
  
  React.useEffect(() => {
    console.log("possibly saving the puzzle?", !!savedPuzzleId);
    savedPuzzleId && savePuzzle(savedPuzzleId);
  }, [grid, words, savedPuzzleId]);
  
  // Initial instantiation of the saved puzzle and/or the saved puzzle 
  // id used to save the puzzle going forward
  React.useEffect(() => {
    const savedPuzzle = getSavedPuzzle(puzzleId);
    if (savedPuzzle) {
      console.log("loading saved puzzle", { savedPuzzle });
      setTitle(savedPuzzle.title);
      setAuthor(savedPuzzle.author);
      setGrid(savedPuzzle.grid);
      setActiveCell(savedPuzzle.activeCell);
      setDirection(savedPuzzle.direction);
      setWords(savedPuzzle.words);
      setSymmetry(savedPuzzle.symmetry);
      setSavedPuzzleId(puzzleId)
    } else {
      console.log("no saved puzzle");
      setSavedPuzzleId(puzzleId);
    }
  }, [puzzleId]);

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

  const getCluesForCell = (row, column) => {
    console.log("getting clues for cell", row, column);
    let acrossNumber = 0;
    let downNumber = 0;

    if (!labelGrid.length || (!row && !column && row !== 0) || grid[row][column].isBlackSquare) {
      acrossNumber = "-";
      downNumber = "-";
      return { acrossNumber, downNumber };
    }

    for (let i = column; i >= 0; i--) {
      if (i === 0 || grid[row][i - 1].isBlackSquare) {
        acrossNumber = labelGrid[row][i] !== 'O' ? labelGrid[row][i] : '-';
        break;
      }
    }

    for (let j = row; j >= 0; j--) {
      if (j === 0 || grid[j - 1][column].isBlackSquare) {
        downNumber = labelGrid[j][column] !== 'O' ? labelGrid[j][column] : '-';
        break;
      }
    }

    return { acrossNumber, downNumber };
  };

  const updateCellValue = (row, column, value) => {
    const newGrid = [...grid];
    newGrid[row][column].value = value;
    setGrid(newGrid);
  };

  const updateCellClue = (row, column, clue) => {};

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
  };

  const toggleCircle = (row, column) => {
    const currentValue = grid[row][column].style;
    const newGrid = [...grid];
    if (!currentValue) {
      newGrid[row][column].style = "circled";
    } else {
      newGrid[row][column].style = null;
    }
    setGrid(newGrid);
  };

  const toggleShaded = (row, column) => {
    const currentValue = grid[row][column].style;
    const newGrid = [...grid];
    if (!currentValue) {
      newGrid[row][column].style = "marked";
    } else {
      newGrid[row][column].style = null;
    }
    setGrid(newGrid);
  };

  const nextAcross = () => {
    const [activeRow, activeColumn] = activeCell;
    const nextColumn = Math.min(activeColumn + 1, grid[0].length - 1);
    setActiveCell([activeRow, nextColumn]);
  };

  const prevAcross = () => {
    const [activeRow, activeColumn] = activeCell;
    const prevColumn = Math.max(activeColumn - 1, 0);
    setActiveCell([activeRow, prevColumn]);
  };

  const nextDown = () => {
    const [activeRow, activeColumn] = activeCell;
    const nextRow = Math.min(activeRow + 1, grid.length - 1);
    setActiveCell([nextRow, activeColumn]);
  };

  const prevDown = () => {
    const [activeRow, activeColumn] = activeCell;
    const prevRow = Math.max(activeRow - 1, 0);
    setActiveCell([prevRow, activeColumn]);
  };

  const advanceActiveCell = () => {
    direction === "across" ? nextAcross() : nextDown();
  };

  const rewindActiveCell = () => {
    direction === "across" ? prevAcross() : prevDown();
  };

  let clue = 0;
  const getNextClueNumber = () => {
    return (clue += 1);
  };

  const resetClue = () => {
    clue = 0;
  };

  const isCellInActiveWord = (row, column) => {
    if (!direction || !words[direction]) {
      console.error("Error with checking cell in active word", {
        direction,
        words
      });
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
    title,
    author,
    setActiveCell,
    setGrid,
    toggleDirection,
    getNextClueNumber,
    getCluesForCell,
    isCellInActiveWord,
    updateCellValue,
    toggleSymmetry,
    toggleBlackSquare,
    toggleCircle,
    toggleShaded,
    nextAcross,
    prevAcross,
    nextDown,
    prevDown,
    advanceActiveCell,
    rewindActiveCell,
    setTitle,
    setAuthor
  };
  
  const savePuzzle = (id) => {
    window.localStorage.setItem(puzzleId, JSON.stringify(value));
  }
  
  value.savePuzzle = savePuzzle;

  return (
    <PuzzleContext.Provider value={value}>
      {children}
      <br />
      <br />
      <pre>
        <code>
          {JSON.stringify(getCluesForCell(activeCell[0], activeCell[1]), null, 2)}
        </code>
        <code>{JSON.stringify(calculateAllClueNumbers(grid), null, 2)}</code>
        <code>{JSON.stringify(value, null, 2)}</code>
      </pre>
    </PuzzleContext.Provider>
  );
};

module.exports = {
  PuzzleContext,
  PuzzleContextProvider
};
