const React = require("react");

const convertAnswerToSquares = (clue) => {
  var chars = clue.split('');
  return chars.map((char, i) => (
    <span class={char == '-' ? 'emptycell' : ''}>{char}</span>
  ))
};

const CurrentClues = ({ across, down }) => {
  return (
    <div class="current-clues">
      <div id="across">
        <h3>1 Across:</h3>
        <div class="current">{convertAnswerToSquares(across.word.toUpperCase())}</div>
        <div class="suggestions"></div>
      </div>
      <div id="down">
        <h3>1 Down:</h3>
        <div class="current">{convertAnswerToSquares(down.word.toUpperCase())}</div>
        <div class="suggestions"></div>
      </div>
    </div>
  );
}

module.exports = CurrentClues;