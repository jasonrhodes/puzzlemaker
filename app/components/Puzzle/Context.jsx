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
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [titleWidth, setTitleWidth] = React.useState("");
  const [authorWidth, setAuthorWidth] = React.useState("");
  const [clues, setClues] = React.useState({ across: {}, down: {} });
  const [downFilter, setDownFilter] = React.useState([]);
  const [acrossFilter, setAcrossFilter] = React.useState([]);
  
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
      if (newGrid[row][column].pencil === value){
        newGrid[row][column].pencil = "";
      } else if (newGrid[row][column].pencil) {
        if (direction === "across"){
          pencilOut("across", false);
          setDownFilter([]);
        }
      }
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
  
  const getNextAcrossCoords = (row, column) => {
    if (row === grid.length - 1 && column === grid[0].length - 1) {
      // we are in the bottom right cell, do nothing
      return [row, column];
    }
    column++;
    if (column === grid[0].length) {
      // too far right, go to next row
      pencilOut("across", false);
      setDownFilter([]);
      row++;
      column = 0;
    }
    return [row, column];
  }

  const nextAcrossCell = () => {
    const [row, column] = activeCell;
    pencilOut("down", downFilter.length > 0);
    setAcrossFilter([]);
    setActiveCell(getNextAcrossCoords(row, column));
  };
  
  const nextAcrossClue = () => {
    let [row, column] = activeCell;
    const currentCell = grid[row][column];
    while (true) {
      console.log("checking cell", { row, column });
      const [nextRow, nextColumn] = getNextAcrossCoords(row, column);
      if (nextRow === row && nextColumn === column) {
        console.log("at the end of the puzzle");
        break;
      }
      const nextCell = grid[nextRow][nextColumn];
      if (nextCell.isBlackSquare) {
        console.log("another black square");
        row = nextRow;
        column = nextColumn;
        continue;
      }
      if (currentCell.isBlackSquare) {
        console.log("found next clue after black square");
        break;
      }
      if (currentCell.clue.acrossClueNumber !== nextCell.clue.acrossClueNumber) {
        console.log("found the next clue");
        break;
      }
      console.log("moving to next", { row, column, nextRow, nextColumn });
      row = nextRow;
      column = nextColumn;
    }
    setActiveCell([row, column]);
  }
  
  const getPrevAcrossCoords = (row, column) => {
    if (row === 0 && column === 0) {
      // we are in the top left cell, do nothing
      return [row, column];
    }
    column--;
    if (column < 0) {
      // too far left, go to prev row
      pencilOut("across", false);
      setDownFilter([]);
      row--;
      column = grid[0].length - 1;
    }
    return [row, column];
  }

  const prevAcrossCell = () => {
    const [row, column] = activeCell;
    pencilOut("down", downFilter.length > 0);
    setAcrossFilter([]);
    setActiveCell(getPrevAcrossCoords(row, column));
  };
  
  const getNextDownCellCoords = (row, column) => {
    if (row === grid.length - 1 && column === grid[0].length - 1) {
      // we are in the bottom right cell, do nothing
      return [row, column];
    }
    row++;
    if (row === grid.length) {
      // too far down, go to next column top cell
      pencilOut("down", false);
      setAcrossFilter([]);
      column++;
      row = 0;
    }
    return [row, column];
  }

  const nextDownCell = () => {
    const [row, column] = activeCell;
    pencilOut("across", acrossFilter.length > 0);
    setDownFilter([]);
    setActiveCell(getNextDownCellCoords(row, column));
  };
  
  const getPrevDownCellCoords = (row, column) => {
    if (row === 0 && column === 0) {
      // we are in the top left cell, do nothing
      return [row, column];
    }
    row--;
    if (row < 0) {
      // too far up, go to prev column bottom cell
      pencilOut("down", false);
      setAcrossFilter([]);
      column--;
      row = grid.length - 1;
    }
    return [row, column];
  }

  const prevDownCell = () => {
    const [row, column] = activeCell;
    pencilOut("across", acrossFilter.length > 0);
    setDownFilter([]);
    setActiveCell(getPrevDownCellCoords(row, column));
  };

  const advanceActiveCell = () => {
    direction === "across" ? nextAcrossCell() : nextDownCell();
  };

  const rewindActiveCell = () => {
    direction === "across" ? prevAcrossCell() : prevDownCell();
  };
  
  const advanceActiveClue = () => {
    // TODO: replace nextDownCell with new nextDownClue
    direction === "across" ? nextAcrossClue() : nextDownCell();
  }
  
  const rewindActiveClue = () => {
    // TODO: replace prevAcrossCell and prevDownCell with prevAcrossClue and prevDownClue
    direction === "across" ? prevAcrossCell() : prevDownCell();
  }

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
  
  const pencilOut = (direction, skip_flag) => { 
    const newGrid = [...grid];
    for (let i = words[direction].range[0]; i <= words[direction].range[1]; i++) {
      if (direction == "down") {
        if (skip_flag && i === activeCell[0]) continue;
        newGrid[i][activeCell[1]].pencil = "";
      } else {
        if (skip_flag && i === activeCell[1]) continue;
        newGrid[activeCell[0]][i].pencil = "";
      }
    }
    setGrid(newGrid);
  }

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
    nextAcrossCell,
    nextAcrossClue,
    prevAcrossCell,
    nextDownCell,
    prevDownCell,
    advanceActiveCell,
    advanceActiveClue,
    rewindActiveCell,
    rewindActiveClue,
    setTitle,
    setAuthor,
    setClue,
    pencilOut,
    downFilter, 
    setDownFilter,
    acrossFilter,
    setAcrossFilter,
    savedPuzzleId
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
