const React = require("react");
const { SquareFillIcon } = require("@primer/octicons-react");
const { Delete, RefreshCw, Circle, ZoomIn, ZoomOut, MinusSquare } = require("react-feather");

const KeyBoard = ({ puzzle, mobileView }) => {
  const row1 = ['Q','W','E','R','T','Y','U','I','O','P'];
  const row2 = ['A','S','D','F','G','H','J','K','L'];
  const row3 = ['Z','X','C','V','B','N','M'];
  
  const [activeRow, activeColumn] = puzzle.activeCell;
  
  function hitKey(e,key) {
    e.stopPropagation();
    if (key == 'square') {
      puzzle.toggleBlackSquare(activeRow, activeColumn);
      return;
    } else if (key == 'circle') {
      puzzle.toggleCircle(activeRow, activeColumn);
      return;
    } else if (key == 'shaded') {
      puzzle.toggleShaded(activeRow, activeColumn);
      return;
    } else if (key == 'rebus') {
      // Rebus support here
      return;
    } else if (key == 'rotate') {
      puzzle.toggleDirection();
      return;
    } else if (key == 'zoom') {
      puzzle.toggleZoom();
    } else if (key == 'backspace') {
      if (puzzle.grid[activeRow][activeColumn].isBlackSquare === false) {
        puzzle.updateCellValue(activeRow, activeColumn, '');
      }
      puzzle.rewindActiveCell();
      return;
    } else {
      puzzle.updateCellValue(activeRow, activeColumn, key);
      puzzle.advanceActiveCell();
      return;
    }
  }
  
  return (
    <div id="keyboard" class={mobileView == 'keyboard' ? 'activemobile' : ''}>
      <div class="row1 keyrow">{row1.map((key, i) => 
        <a class="key" onClick={(e) => hitKey(e,key)}>{key}</a>
      )}
      </div>
      <div class="row2 keyrow">{row2.map((key, i) => 
        <a class="key" onClick={(e) => hitKey(e,key)}>{key}</a>
      )}
      </div>
      <div class="row3 keyrow">
        <a class="key toolkey" onClick={(e) => hitKey(e,'square')}><SquareFillIcon size={24} /></a>
        {row3.map((key, i) => 
          <a class="key" onClick={(e) => hitKey(e,key)}>{key}</a>
        )}
        <a class="key toolkey" onClick={(e) => hitKey(e,'backspace')}><Delete size={24} /></a>
      </div>
      <div class="row4 keyrow">
    
        <a class="key toolkey shadekey" onClick={(e) => hitKey(e,'shaded')}><SquareFillIcon style={{opacity: 0.5}} size={24} /></a>
        <a class="key toolkey" onClick={(e) => hitKey(e,'circle')}><Circle size={24} /></a>
        <a class="key toolkey" onClick={(e) => hitKey(e,'rotate')}><RefreshCw size={24} /></a>
        <a class="key toolkey" onClick={(e) => hitKey(e,'rebus')}><MinusSquare size={24} /></a>
        <a class="key toolkey" onClick={(e) => hitKey(e,'zoom')}>{puzzle.zoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} /> }</a>
        <a class="keyspacer"></a>
      </div>
    </div>
  );
}

module.exports = KeyBoard;