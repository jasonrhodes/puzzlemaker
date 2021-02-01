const React = require("react");
const PuzzleContext = React.createContext();
const { assignClueNumbersToGrid } = require("../../utils/clues");
const getSymmetricalCell = require("../../utils/getSymmetricalCell");
const { findAcross, findDown } = require("../../utils/currentWordFinders");

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
  const numberedInitialGrid = assignClueNumbersToGrid(initialGrid);
  const [grid, setGrid] = React.useState(numberedInitialGrid);
  const [symmetry, setSymmetry] = React.useState(true);
  const [title, setTitle] = React.useState("Untitled");
  const [author, setAuthor] = React.useState("Author");
  const [clues, setClues] = React.useState({ across: {}, down: {} });
  
  const setClue = (number, direction, clue) => {
    setClues({ ...clues, [direction]: { ...clues[direction], [number]: clue }});
  }

  React.useEffect(() => {
    setWords(calculateCurrentWords());
  }, [grid, setWords, activeCell]);
  
  // auto save the whole puzzle when main parts change
  React.useEffect(() => {
    savedPuzzleId && savePuzzle(savedPuzzleId);
  }, [grid, words, author, title, clues, savedPuzzleId]);
  
  // Update clues when the grid changes
  React.useEffect(() => {
    const newClues = grid
      .reduce((acc, row) => acc.concat(row), [])
      .reduce(
        (c, { clue }) => {
          if (clue && clue.isAcrossStart) {
            c.across[clue.acrossClueNumber] =
              clues.across[clue.acrossClueNumber] || "";
          }
          if (clue && clue.isDownStart) {
            c.down[clue.downClueNumber] = clues.down[clue.downClueNumber] || "";
          }
          return c;
        },
        { across: {}, down: {} }
      );

    setClues(newClues);
  }, [grid, setClues]);

  // Initial instantiation of the saved puzzle and/or the saved puzzle
  // id used to save the puzzle going forward
  React.useEffect(() => {
    const savedPuzzle = getSavedPuzzle(puzzleId);
    if (savedPuzzle) {
      setTitle(savedPuzzle.title);
      setAuthor(savedPuzzle.author);
      const numberedGrid = assignClueNumbersToGrid(savedPuzzle.grid);
      setGrid(numberedGrid);
      setClues(savedPuzzle.clues);
      setActiveCell(savedPuzzle.activeCell);
      setDirection(savedPuzzle.direction);
      setWords(savedPuzzle.words);
      setSymmetry(savedPuzzle.symmetry);
      setSavedPuzzleId(puzzleId);
    } else {
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

    // TODO: findAcross and findDown can be simplified now that
    // clue number state is saved in the grid for each cell
    const across = findAcross(grid[row], column);
    const down = findDown(grid, row, column);

    return { across, down };
  };

  const getCluesForCell = (row, column) => {
    if (! grid || row === undefined || column === undefined || (!row && row !== 0) || (!column && column !== 0)) {
      return { acrossNumber: "-", downNumber: "-" };
    } else {
      const { clue } = grid[row][column];
      return {
        downNumber: clue.downClueNumber || "-",
        acrossNumber: clue.acrossClueNumber || "-"
      };
    }
  };

  const updateCellValue = (row, column, value) => {
    if (!grid[row][column].isBlackSquare) {
      const newGrid = [...grid];
      newGrid[row][column].value = value;
      setGrid(newGrid);
    }
  };

  const updateCellClue = (row, column, clue) => {};

  const toggleBlackSquare = (row, column) => {
    const currentValue = grid[row][column].isBlackSquare;
    const newGrid = [...grid];
    newGrid[row][column].isBlackSquare = !currentValue;
    newGrid[row][column].value = "";
    newGrid[row][column].style = null;
    if (symmetry) {
      const [symRow, symCol] = getSymmetricalCell(grid, row, column);
      newGrid[symRow][symCol].isBlackSquare = !currentValue;
      newGrid[symRow][symCol].value = "";
      newGrid[symRow][symCol].style = null;
    }
    const numberedGrid = assignClueNumbersToGrid(newGrid);
    setGrid(numberedGrid);
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

  const nextAcrossCell = () => {
    let [activeRow, activeColumn] = activeCell;
    // const nextColumn = Math.min(activeColumn + 1, grid[0].length - 1);
    let nextColumn = activeColumn + 1;
    if (nextColumn === grid[0].length) {
      activeRow++;
      nextColumn = 0;
    }
    setActiveCell([activeRow, nextColumn]);
  };
  
  // const nextAcrossClue = () => {
  //   const [activeRow, activeColumn] = activeCell;
  //   const { clue } = grid[activeRow][activeColumn];
  // }

  const prevAcrossCell = () => {
    let [activeRow, activeColumn] = activeCell;
    let prevColumn = activeColumn - 1;
    if (prevColumn < 0) {
      activeRow = activeRow - 1;
      if (activeRow < 0) {
        activeRow = 0;
        prevColumn = 0;
      } else {
        prevColumn = grid[0].length - 1;
      } 
    }
    setActiveCell([activeRow, prevColumn]);
  };

  const nextDownCell = () => {
    const [activeRow, activeColumn] = activeCell;
    const nextRow = Math.min(activeRow + 1, grid.length - 1);
    setActiveCell([nextRow, activeColumn]);
  };

  const prevDownCell = () => {
    const [activeRow, activeColumn] = activeCell;
    const prevRow = Math.max(activeRow - 1, 0);
    setActiveCell([prevRow, activeColumn]);
  };

  const advanceActiveCell = () => {
    direction === "across" ? nextAcrossCell() : nextDownCell();
  };

  const rewindActiveCell = () => {
    direction === "across" ? prevAcrossCell() : prevDownCell();
  };

  let clueNumber = 0;
  const getNextClueNumber = () => {
    return (clueNumber += 1);
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

  const savePuzzle = id => {
    window.localStorage.setItem(puzzleId, JSON.stringify(value));
  };

  const value = {
    activeCell,
    direction,
    words,
    grid,
    clues,
    symmetry,
    title,
    author,
    setActiveCell,
    setGrid,
    toggleDirection,
    getNextClueNumber,
    getCluesForCell,
    isCellInActiveWord,
    savePuzzle,
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
    setAuthor,
    setClue
  };

  return (
    <PuzzleContext.Provider value={value}>
      {children}
      <br />
      <br />
      <pre>
        <code>
          {JSON.stringify(getCluesForCell(activeCell[0], activeCell[1]))}
        </code>
        <br />
        <code>{JSON.stringify({ clues })}</code>
        <br />
        <code>{JSON.stringify(value, null, 2)}</code>
      </pre>
    </PuzzleContext.Provider>
  );
};

module.exports = {
  PuzzleContext,
  PuzzleContextProvider
};
