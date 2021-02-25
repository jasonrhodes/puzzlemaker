const React = require("react");
const { SquareFillIcon } = require("@primer/octicons-react");
const {
  RefreshCw,
  Circle,
  Lock,
  Unlock,
  Rewind,
  Zap,
} = require("react-feather");
const { focusOnActive } = require("../../utils/style");
const { clearWhiteCells, checkEmpty } = require("../../utils/clearWhiteCells");
const { generateGrid } = require("../../utils/gridScore");

const InfoTab = ({ puzzle }) => {
  const [activeRow, activeColumn] = puzzle.activeCell;
  const [confirmClear, setConfirmClear] = React.useState(false);
  const [confirmGenerate, setConfirmGenerate] = React.useState(false);

  function hitKey(e, key) {
    setConfirmClear(false);
    setConfirmGenerate(false);
    e.stopPropagation();
    if (!activeRow && !activeColumn) {
      return false;
    }
    const currentCell = puzzle.grid[activeRow][activeColumn];
    if (key == "square") {
      puzzle.clearActiveCellPencils();
      puzzle.toggleBlackSquare(activeRow, activeColumn);
    } else if (key == "circle") {
      puzzle.toggleCircle(activeRow, activeColumn);
    } else if (key == "shaded") {
      puzzle.toggleShaded(activeRow, activeColumn);
    } else if (key == "rebus") {
      e.preventDefault();
      if (currentCell.isRebus) {
        puzzle.updateCellValue(activeRow, activeColumn, "");
      }
      puzzle.toggleRebus(activeRow, activeColumn);
    } else if (key == "rotate") {
      puzzle.toggleDirection();
    }
    focusOnActive();
    return;
  }

  function generalControl(e, key) {
    e.stopPropagation();
    if (key == "lockGrid") {
      setConfirmClear(false);
      setConfirmGenerate(false);
      puzzle.toggleGridLock();
    } else if (key == "clear") {
      if (!confirmClear && !checkEmpty(puzzle)) {
        setConfirmClear(true);
      } else {
        clearWhiteCells(puzzle);
        setConfirmClear(false);
      }
    } else if (key == "generate" && !puzzle.gridLock) {
      if (!confirmGenerate && !checkEmpty(puzzle)) {
        setConfirmGenerate(true);
      } else {
        generateGrid(puzzle);
        setConfirmGenerate(false);
      }
    }
    if (activeRow && activeColumn) {
      focusOnActive();
    }
    return;
  }

  return (
    <div className="current-clues info-tab">
      <a className="key toolkey" onClick={(e) => hitKey(e, "square")}>
        <SquareFillIcon size={24} />
      </a>
      <i>Ctrl+click or press &quot;.&quot;</i>
      <br />
      <a className="key" onClick={(e) => hitKey(e, "circle")}>
        <Circle size={18} />
      </a>
      <i>Alt+click or press &quot;;&quot; or &quot;,&quot;</i>
      <br />
      <a className="key shadekey" onClick={(e) => hitKey(e, "shaded")}>
        <SquareFillIcon style={{ opacity: 0.5 }} size={24} />
      </a>
      <i>Shift+click or press &quot;/&quot; or &quot;-&quot;</i>
      <br />
      <a className="key" onClick={(e) => hitKey(e, "rotate")}>
        <RefreshCw size={18} />
      </a>
      <i>Click or press Enter</i>
      <br />
      <a className="key" onClick={(e) => hitKey(e, "rebus")}>
        <span className="rebustext">REBUS</span>
      </a>
      <i>Press &quot;+&quot; or &quot;=&quot;</i>
      <br />
      <br />
      <i>Tab</i> to move to next clue
      <br />
      <i>Shift+Tab</i> to move to previous clue
      <br />
      <br />
      <a className="key" onClick={(e) => generalControl(e, "lockGrid")}>
        {puzzle.gridLock ? (
          <Lock size={18} style={{ color: "red" }} />
        ) : (
          <Unlock size={18} style={{ color: "green" }} />
        )}
      </a>
      <i>
        {puzzle.gridLock
          ? "Grid locked (cannot change black cells)"
          : "Grid unlocked (black cells editable)"}
      </i>
      <br />
      <a className="key" onClick={(e) => generalControl(e, "clear")}>
        <Rewind size={18} />
      </a>
      <i>
        {!confirmClear ? (
          <span>
            Clear <b>all</b> white cells and clues
          </span>
        ) : (
          <React.Fragment>
            <span style={{ color: "red" }}>Confirm deletion </span>
            <a onClick={() => setConfirmClear(false)}>(Abort)</a>
          </React.Fragment>
        )}
      </i>
      <br />
      <a className="key" onClick={(e) => generalControl(e, "generate")}>
        <Zap size={18} />
      </a>
      <i>
        {!confirmGenerate ? (
          <span>Generate random grid</span>
        ) : (
          <React.Fragment>
            <span style={{ color: "red" }}>Confirm grid generation </span>
            <a onClick={() => setConfirmGenerate(false)}>(Abort)</a>
          </React.Fragment>
        )}
      </i>
    </div>
  );
};

module.exports = InfoTab;
