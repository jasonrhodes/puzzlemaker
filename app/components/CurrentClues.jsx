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
  
  const [acrossSuggestions,setAcrossSuggestions] = React.useState([]);
  const [downSuggestions,setDownSuggestions] = React.useState([]);
  React.useEffect(() => {
    console.log("USE EFFECT 3 (A SUGGESTIONS)")
    getSuggestions(across.word.toLowerCase(), setAcrossSuggestions);
    getSuggestions(down.word.toLowerCase(), setDownSuggestions);
  }, [across, down])
  
  const getSuggestions = async (clue, setFunc) => {
    if (!clue.includes('-')) {  // if the word is already filled out, we don't need to make an API request
      setFunc([clue.toUpperCase()]);
      return;
    }
    const apiString = 'https://api.datamuse.com/words?sp=' + clue.replace(/-/g,'?') + '&max=50';
    console.log(apiString);
    const response = await fetch(apiString);
    const myJson = await response.json(); 
    setFunc(getMatches(myJson, clue.length));
  } 
  
  const getMatches = (response, len) => {
    let result = [];
    for (let entry of response){
      let word = entry.word.replace(/-/g,'').replace(/ /g,'')
      if (word.length === len) {
        result.push(word.toUpperCase());
      }
      if (result.length === 10) {
        break;
      }
    }
    return result;
  }
  
  return (
    <div class="current-clues">
      <div id="across">
        <h3>{acrossNumber} Across:</h3>
        <div class="current">{convertAnswerToSquares(across.word.toUpperCase())}</div>
        <div>{acrossSuggestions.map(
            (x) => <div class="suggestions">{x}</div>
          )}
        </div>
      </div>
      <div id="down">
        <h3>{downNumber} Down:</h3>
        <div class="current">{convertAnswerToSquares(down.word.toUpperCase())}</div>
        <div>{downSuggestions.map(
            (x) => <div class="suggestions">{x}</div>
          )}
        </div>
      </div>
    </div>
  );
}

module.exports = CurrentClues;