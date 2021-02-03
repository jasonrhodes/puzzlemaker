const React = require("react");
const { XIcon, ArrowLeftIcon, SquareFillIcon, SyncIcon, CircleIcon, EyeIcon } = require("@primer/octicons-react");

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
    } else if (key == 'circle') {
      puzzle.toggleBlackSquare(activeRow, activeColumn);
      return;
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
        <a class="key toolkey" onClick={(e) => hitKey(e,'backspace')}><ArrowLeftIcon size={16} /><XIcon size={16} /></a>
      </div>
      <div class="row4 keyrow">
        <a class="key toolkey" onClick={(e) => hitKey(e,'square')}><SquareFillIcon style={{opacity: 0.5}} size={24} /></a>
        <a class="key toolkey" onClick={(e) => hitKey(e,'circle')}><CircleIcon size={24} /></a>
        <a class="key toolkey" onClick={(e) => hitKey(e,'rotate')}><SyncIcon size={24} /></a>
        <a class="key toolkey" onClick={(e) => hitKey(e,'zoom')}><EyeIcon size={24} /></a>
        <a class="keyspacer"></a>
      </div>
    </div>
  );
}

module.exports = KeyBoard;