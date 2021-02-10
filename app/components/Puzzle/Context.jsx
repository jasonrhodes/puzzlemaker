const React = require("react");
const PuzzleContext = React.createContext();
const { assignClueNumbersToGrid } = require("../../utils/clues");
const getSymmetricalCell = require("../../utils/getSymmetricalCell");
const { findAcross, findDown } = require("../../utils/currentWordFinders");
const {
  getNextAcrossCellCoords,
  getNextAcrossClueStart,
  getPrevAcrossCellCoords,
  getPrevAcrossClueStart,
  getNextDownCellCoords,
  getNextDownClueStart,
  getPrevDownCellCoords,
  getPrevDownClueStart
} = require("../../utils/cellNavigation");

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
  const [activeCell, _setActiveCell] = React.useState([]);
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
  const [zoomed, setZoomed] = React.useState("");
  const [clues, setClues] = React.useState({ across: {}, down: {} });
  const [downFilter, setDownFilter] = React.useState([]);
  const [acrossFilter, setAcrossFilter] = React.useState([]);

  const setActiveCell = ([row, column]) => {
    if (row >= grid.length) {
      throw new Error(`Cannot set active cell row (${row}) larger than max (${grid.length - 1})`);
    }
    if (column >= grid[0].length) {
      throw new Error(`Cannot set active cell column (${column}) larger than max (${grid[0].length - 1})`);
    }
    return _setActiveCell([row, column]);
  }
  
  const setClue = (number, direction, clue) => {
    setClues({ ...clues, [direction]: { ...clues[direction], [number]: clue }});
  }

  function usePrevious(value) {
      const ref = React.useRef();
      React.useEffect(() => {
        ref.current = value;
      });
  return ref.current;
  } 
  
  const prevCell = usePrevious(activeCell);
  
  // all pencil/locked suggestions are updated after a change to the activeCell
  React.useEffect(() => {
    if (activeCell.length && prevCell.length && activeCell[0] !== undefined && prevCell[0] !== undefined && activeCell !== prevCell) {
      if (activeCell[0] === prevCell[0]){
        if (grid[activeCell[0]][activeCell[1]].clue.acrossClueNumber !== grid[prevCell[0]][prevCell[1]].clue.acrossClueNumber){
            clearAll(true);
        } else {
            if (downFilter && downFilter[0] !== null && downFilter[0] !== undefined){
              setDownFilter([downFilter[0],downFilter[0][activeCell[1]-words.across.range[0]]]);
            }
            pencilHandling(prevCell[1], "across", activeCell[1] > prevCell[1]);
        }
      } else if (activeCell[1] === prevCell[1]){
        if (grid[activeCell[0]][activeCell[1]].clue.downClueNumber !== grid[prevCell[0]][prevCell[1]].clue.downClueNumber){
            clearAll(true);
        } else {
            if (acrossFilter && acrossFilter[0] !== null && acrossFilter[0] !== undefined){
              setAcrossFilter([acrossFilter[0],acrossFilter[0][activeCell[0]-words.down.range[0]]]);
            }
            pencilHandling(prevCell[0], "down", activeCell[0] > prevCell[0]);
        }
      } else {
        clearAll(true);
      }
      if (prevCell[0] && prevCell[0] !== undefined && grid[prevCell[0]][prevCell[1]].isRebus && grid[prevCell[0]][prevCell[1]].value.length <= 1){
		grid[prevCell[0]][prevCell[1]].isRebus = false;
	  }
    } else if (prevCell && prevCell.length && prevCell[0] !== undefined) {
	  if (grid[prevCell[0]][prevCell[1]].isRebus && grid[prevCell[0]][prevCell[1]].value.length <= 1){
		grid[prevCell[0]][prevCell[1]].isRebus = false;
	  }
	}
	
  }, [activeCell]);
  
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
  
  const toggleZoom = () => {
    if (zoomed == 'zoomed') { 
      setZoomed("");
      document.body.classList.remove("zoomed");
    } else {
      setZoomed("zoomed");
      window.scrollTo(0,0);
      document.body.classList.add("zoomed");
    }
    return;
  }

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
      if (!grid[row] || !grid[row][column]) {
        throw new Error(`No cell for row: ${row} and column ${column}`);
      }
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
      newGrid[row][column].value = value.toUpperCase();
      
      // new block for proper pencil behaviour during typing/deleting letters 
      if (newGrid[row][column].pencil === value.toUpperCase()){
        newGrid[row][column].pencil = "";
      } else if (newGrid[row][column].pencil) {
        clearAll(false);
      }
      if (!value && downFilter.length) {
        newGrid[row][column].pencil = downFilter[0][activeCell[1] - words.across.range[0]];
      } else if (!value && acrossFilter.length) {
        newGrid[row][column].pencil = acrossFilter[0][activeCell[0] - words.down.range[0]];
      }
        
      setGrid(newGrid);
    }
  };

  const toggleBlackSquare = (row, column) => {
    const currentValue = grid[row][column].isBlackSquare;
    const newGrid = [...grid];
    newGrid[row][column].isBlackSquare = !currentValue;
    newGrid[row][column].value = "";
    newGrid[row][column].style = null;
    newGrid[row][column].pencil = "";
    newGrid[row][column].isRebus = false;
    if (symmetry) {
      const [symRow, symCol] = getSymmetricalCell(grid, row, column);
      newGrid[symRow][symCol].isBlackSquare = !currentValue;
      newGrid[symRow][symCol].value = "";
      newGrid[symRow][symCol].style = null;
      newGrid[symRow][symCol].pencil = "";
      newGrid[symRow][symCol].isRebus = false;
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

  const toggleRebus = (row, column) => {
    const newGrid = [...grid];
    newGrid[row][column].isRebus = !newGrid[row][column].isRebus;
    setGrid(newGrid);
  }

  const nextAcrossCell = () => {
    const [row, column] = activeCell;
    setActiveCell(getNextAcrossCellCoords(row, column, grid));
  };
  
  const nextAcrossClue = () => {
    const [row, column] = activeCell;
    const [nextRow, nextColumn] = getNextAcrossClueStart(row, column, grid);
    if (nextRow < row && nextColumn < column) {
      toggleDirection();
    }
    setActiveCell([nextRow, nextColumn]);
  }

  const prevAcrossCell = () => {
    const [row, column] = activeCell;
    setActiveCell(getPrevAcrossCellCoords(row, column, grid));
  };

  const prevAcrossClue = () => {
    const [row, column] = activeCell;
    let [prevRow, prevColumn] = getPrevAcrossClueStart(row, column, grid);
    if (prevRow > row && prevColumn > column) {
      toggleDirection();
      [prevRow, prevColumn] = getPrevDownClueStart(row, column, grid);
    }
    setActiveCell([prevRow, prevColumn]);
  };

  const nextDownCell = () => {
    const [row, column] = activeCell;
    setActiveCell(getNextDownCellCoords(row, column, grid));
  };

  const nextDownClue = () => {
    const [row, column] = activeCell;
    const [nextRow, nextColumn] = getNextDownClueStart(row, column, grid);
    if (nextRow < row && nextColumn < column) {
      toggleDirection();
    }
    setActiveCell([nextRow, nextColumn]);
  };

  const prevDownCell = () => {
    const [row, column] = activeCell;
    setActiveCell(getPrevDownCellCoords(row, column, grid));
  };

  const prevDownClue = () => {
    const [row, column] = activeCell;
    let [prevRow, prevColumn] = getPrevDownClueStart(row, column, grid);
    if (prevRow > row && prevColumn > column) {
      toggleDirection();
      [prevRow, prevColumn] = getPrevAcrossClueStart(row, column, grid);
    }
    setActiveCell([prevRow, prevColumn]);
  };

  const advanceActiveCell = () => {
    direction === "across" ? nextAcrossCell() : nextDownCell();
  };

  const rewindActiveCell = () => {
    direction === "across" ? prevAcrossCell() : prevDownCell();
  };
  
  const advanceActiveClue = () => {
    direction === "across" ? nextAcrossClue() : nextDownClue();
  }
  
  const rewindActiveClue = () => {
    direction === "across" ? prevAcrossClue() : prevDownClue();
  }
  
  const pencilHandling = (field, dir, forward) => {
    let otherDir;
    let filter;
    let setFilter;
    let otherFilter;
    let setOtherFilter;
    const index = (forward ? 1 : 0);
    if (dir === "down") {
      otherDir = "across";
      filter = downFilter;
      setFilter = setDownFilter;
      otherFilter = acrossFilter;
      setOtherFilter = setAcrossFilter;
    } else {
      otherDir = "down";
      filter = acrossFilter;
      setFilter = setAcrossFilter;
      otherFilter = downFilter;
      setOtherFilter = setDownFilter;
    }
    pencilOut(otherDir, otherFilter.length > 0, true);
    setFilter([]);
    if (field === words[dir].range[index]){
      pencilOut(dir, false, true);
      setOtherFilter([]);
    }
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
    window.localStorage.setItem(id, JSON.stringify(value));
  };
  
  const clearAll = (prev_flag) => {
    pencilOut("down", false, prev_flag);
    pencilOut("across", false, prev_flag);
    setDownFilter([]);
    setAcrossFilter([]);
  }
  
  const pencilOut = (direction, skip_flag, prev_flag) => { 
    const cell = (prev_flag ? prevCell : activeCell);
    if (cell.length){
        const newGrid = [...grid];
        for (let i = words[direction].range[0]; i <= words[direction].range[1]; i++) {
          if (direction == "down") {
            if (skip_flag && i === cell[0]) continue;
            newGrid[i][cell[1]].pencil = "";
          } else {
            if (skip_flag && i === cell[1]) continue;
            newGrid[cell[0]][i].pencil = "";
          }
        }
        setGrid(newGrid);
    }
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
    toggleZoom,
    getNextClueNumber,
    getCluesForCell,
    isCellInActiveWord,
    savePuzzle,
    updateCellValue,
    toggleSymmetry,
    toggleBlackSquare,
    toggleCircle,
    toggleShaded,
    toggleRebus,
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
    savedPuzzleId,
    prevCell,
    clearAll,
    zoomed,
    setZoomed,
    setDirection
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