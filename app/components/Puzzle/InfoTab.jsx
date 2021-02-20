const React = require("react");
const { SquareFillIcon } = require("@primer/octicons-react");
const { RefreshCw, Circle } = require("react-feather");

const InfoTab = ({ puzzle }) => {
  const [activeRow, activeColumn] = puzzle.activeCell;

  function hitKey(e, key) {
    e.stopPropagation();
    if (!activeRow && !activeColumn) {
      return false;
    }
    const currentCell = puzzle.grid[activeRow][activeColumn];
    if (key == "square") {
      puzzle.clearActiveCellPencils();
      puzzle.toggleBlackSquare(activeRow, activeColumn);
      return;
    } else if (key == "circle") {
      puzzle.toggleCircle(activeRow, activeColumn);
      return;
    } else if (key == "shaded") {
      puzzle.toggleShaded(activeRow, activeColumn);
      return;
    } else if (key == "rebus") {
      e.preventDefault();
      if (currentCell.isRebus) {
        puzzle.updateCellValue(activeRow, activeColumn, "");
      }
      puzzle.toggleRebus(activeRow, activeColumn);
      return;
    } else if (key == "rotate") {
      puzzle.toggleDirection();
      return;
    }
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
      <i>Tab</i> to move to next clue
      <br />
      <i>Shift+Tab</i> to move to previous clue
      <br />
    </div>
  );
};

module.exports = InfoTab;
