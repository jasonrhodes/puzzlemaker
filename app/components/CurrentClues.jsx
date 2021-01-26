const React = require("react");

const convertAnswerToSquares = (clue) => {
  var chars = clue.split('');
  return chars.map((char, i) => (
    <span class={char == '-' ? 'emptycell' : ''}>{char}</span>
  ))
};

const CurrentClues = ({ across, down, puzzle }) => {
  const [row, column] = puzzle.activeCell
  const {acrossNumber, downNumber} = puzzle.getCluesForCell(row, column)
  
  const [aSuggestions,setASuggestions] = React.useState([]);
  const [dSuggestions,setDSuggestions] = React.useState([]);
  React.useEffect(() => {
    console.log("USE EFFECT 3 (A SUGGESTIONS)")
    getSuggestions(across.word.toLowerCase(), setASuggestions);
  }, [across])
  React.useEffect(() => {
    console.log("USE EFFECT 4 (D SUGGESTIONS)")
    getSuggestions(down.word.toLowerCase(), setDSuggestions);
  }, [down])
  
  
  const getSuggestions = async (clue, setFunc) => {
    const apiString = 'https://api.datamuse.com/words?sp=' + clue.replace(/-/g,'?') + '&max=10';
    console.log(apiString);
    const response = await fetch(apiString);
    const myJson = await response.json(); 

    setFunc(myJson.map(x => x.word.toUpperCase()));
  } 
  
  return (
    <div class="current-clues">
      <div id="across">
        <h3>{acrossNumber} Across:</h3>
        <div class="current">{convertAnswerToSquares(across.word.toUpperCase())}</div>
        <div>{aSuggestions.map((x) => <div class="suggestions">{x}</div>)}</div>
      </div>
      <div id="down">
        <h3>{downNumber} Down:</h3>
        <div class="current">{convertAnswerToSquares(down.word.toUpperCase())}</div>
        <div class="suggestions">{dSuggestions.map((x) => <div>{x}</div>)}</div>
      </div>
    </div>
  );
}

module.exports = CurrentClues;