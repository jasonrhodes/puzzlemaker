const React = require("react");
const WordCache = new Map();

const convertAnswerToSquares = (clue) => {
  if (clue.length < 2) {
    return "";    
  } 
  var chars = clue.split('');
  return chars.map((char, i) => (
    <span class={char == '-' ? 'emptycell' : ''}>{char}</span>
  ))
};

const CurrentClues = ({ across, down, puzzle }) => {
  const [row, column] = puzzle.activeCell
  const { acrossNumber, downNumber } = puzzle.getCluesForCell(row, column)
  
  const [acrossSuggestions, setAcrossSuggestions] = React.useState([]);
  const [downSuggestions, setDownSuggestions] = React.useState([]);
  React.useEffect(async () => {
    console.log("USE EFFECT 3 (A SUGGESTIONS)")
    const aSug = await getSuggestions(across.word.toLowerCase(), setAcrossSuggestions);
    const dSug = await getSuggestions(down.word.toLowerCase(), setDownSuggestions);
    console.log(puzzle.activeCell);
    if (puzzle.activeCell.length > 0 && aSug !== [] && dSug !== []) {
      console.log(puzzle.activeCell[0]);
      console.log(puzzle.activeCell[1]);
      console.log(aSug);
      console.log(dSug);
      if (!puzzle.grid[puzzle.activeCell[0]][puzzle.activeCell[1]]){
        let acrossIndex = puzzle.activeCell[1] - across.range[0];
        let acrossLetter = aSug[0][acrossIndex];
        console.log("Letter: ", acrossLetter);
        let downIndex = puzzle.activeCell[0] - down.range[0];
        setDownSuggestions(dSug.map((sug) => sug[downIndex]===acrossLetter ? sug+'*' : sug))
      }
    }
  }, [across, down])
  
  const hasDash = char => char === "-";
  const getSuggestions = async (clue, setFunc) => {
    const chars = clue.split("");
    const hasNoDashes = !chars.some(hasDash);
    const hasAllDashes = chars.every(hasDash);
    if (hasNoDashes || hasAllDashes) {  // if the word is all blank or all filled in, no suggestions needed
      setFunc([]);
      return [];
    }
    const cached = WordCache.get(clue);
    if (cached) {
      setFunc(cached); // don't re-call API for clue pattern we already cached
      return cached;
    }
    const apiString = 'https://api.datamuse.com/words?sp=' + clue.replace(/-/g,'?') + '&max=50';
    console.log(apiString);
    const response = await fetch(apiString);
    const myJson = await response.json(); 
    const matches = getMatches(myJson, clue.length);
    WordCache.set(clue, matches);
    setFunc(matches);
    return matches;
  } 
  
  const getMatches = (response, len) => {
    let result = [];
    for (let entry of response){
      let word = entry.word.replace(/-/g,'').replace(/ /g,'')
      if (word.length === len) {
        result.push(word.toUpperCase());
      }
      if (result.length === 50) {
        break;
      }
    }
    return result;
  }
  
  const fillWithSuggestion = (e, suggestion, direction) => {
    const newGrid = [...puzzle.grid];
    if (direction === 'across') {
      for (let i = across.range[0]; i <= across.range[1]; i++){
        newGrid[puzzle.activeCell[0]][i].value = suggestion[i - across.range[0]]; 
      }
    } else if (direction === 'down') {
      for (let i = down.range[0]; i <= down.range[1]; i++){
        newGrid[i][puzzle.activeCell[1]].value = suggestion[i - down.range[0]];  
      }
    }
    puzzle.setGrid(newGrid);
    e.stopPropagation();
  }
  
  return (
    <div class="current-clues">
      <div id="across">
        <h3>{acrossNumber} Across:</h3>
        <div class="current">{convertAnswerToSquares(across.word.toUpperCase())}</div>
        <div class="suggestions">{acrossSuggestions.map(
            (x) => <div class="suggestion" onClick={(e) => fillWithSuggestion(e, x, 'across')}>{convertAnswerToSquares(x)}</div>
          )}
        </div>
      </div>
      <div id="down">
        <h3>{downNumber} Down:</h3>
        <div class="current">{convertAnswerToSquares(down.word.toUpperCase())}</div>
        <div class="suggestions">{downSuggestions.map(
            (x) => <div class="suggestion" onClick={(e) => fillWithSuggestion(e, x, 'down')}>{convertAnswerToSquares(x)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

module.exports = CurrentClues;