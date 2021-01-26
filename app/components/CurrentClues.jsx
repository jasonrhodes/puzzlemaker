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
  React.useEffect(() => {
    console.log("USE EFFECT 3 (SUGGESTIONS)")
    getSuggestions(across.word.toLowerCase());
  }, [across])
  
  
  const getSuggestions = async (clue) => {
    const apiString = 'https://api.datamuse.com/words?sp=' + clue.replace(/-/g,'?') + '&max=10';
    console.log(apiString);
    const response = await fetch('https://api.datamuse.com/words?ml=ringing+in+the+ears');
    const myJson = await response.json(); //extract JSON from the http response

    setASuggestions(myJson.map(x => x.word.toUpperCase()));
    // do something with myJson
  } 
  
  return (
    <div class="current-clues">
      <div id="across">
        <h3>{acrossNumber} Across:</h3>
        <div class="current">{convertAnswerToSquares(across.word.toUpperCase())}</div>
        <div class="suggestions">{aSuggestions}</div>
      </div>
      <div id="down">
        <h3>{downNumber} Down:</h3>
        <div class="current">{convertAnswerToSquares(down.word.toUpperCase())}</div>
        <div class="suggestions"></div>
      </div>
    </div>
  );
}

module.exports = CurrentClues;