const React = require("react");
const { hitKey } = require("../../utils/style");

const KeyBoard = ({ puzzle, mobileView }) => {
  const row1 = ['Q','W','E','R','T','Y','U','I','O','P'];
  const row2 = ['A','S','D','F','G','H','J','K','L'];
  const row3 = ['Z','X','C','V','B','N','M'];
  
  
        puzzle.updateCellValue(activeRow, activeColumn, e.key);
      puzzle.advanceActiveCell();
  
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
      <div class="row3 keyrow">{row3.map((key, i) => 
        <a class="key" onClick={(e) => hitKey(e,key)}>{key}</a>
      )}
      </div>
    </div>
  );
}

module.exports = KeyBoard;