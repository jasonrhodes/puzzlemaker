const React = require("react");
const { hitKey } = require("../../utils/style");

const KeyBoard = ({ mobileView }) => {
  const row1 = ['Q','W','E','R','T','Y','U','I','O','P'];
  const row2 = ['A','S','D','F','G','H','J','K','L'];
  const row3 = ['Z','X','C','V','B','N','M'];
  
  return (
    <div id="keyboard" class={mobileView == 'keyboard' ? 'activemobile' : ''}>
      <div class="row1 inline">{row1.map((key, i) => 
        <a class="key" onClick={(e) => hitKey(e,key)}>{key}</a>
      )}
      </div>
      <div class="row2 inline">{row2.map((key, i) => 
        <a class="key" onClick={(e) => hitKey(e,key)}>{key}</a>
      )}
      </div>
      <div class="row3 inline">{row3.map((key, i) => 
        <a class="key" onClick={(e) => hitKey(e,key)}>{key}</a>
      )}
      </div>
    </div>
  );
}

module.exports = KeyBoard;