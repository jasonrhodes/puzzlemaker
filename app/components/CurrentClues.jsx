const React = require("react");
const WordCache = new Map();
const { measureMyInputText } = require("./utils");
const { Link } = require("react-router-dom");
const { ArrowDownIcon, ArrowRightIcon, EyeIcon } = require("@primer/octicons-react");

const CurrentClues = ({ across, down, puzzle }) => {
  const [row, column] = puzzle.activeCell
  const { acrossNumber, downNumber } = puzzle.getCluesForCell(row, column)
  
  const [acrossSuggestions, setAcrossSuggestions] = React.useState([]);
  const [downSuggestions, setDownSuggestions] = React.useState([]);
  //const [acrossStyles, setAcrossStyles] = React.useState([]);
  //const [downStyles, setDownStyles] = React.useState([]);
  const [downFilter, setDownFilter] = React.useState([]);
  const [acrossFilter, setAcrossFilter] = React.useState([]);
  const [downHighlight, setDownHighlight] = React.useState(null);
  const [acrossHighlight, setAcrossHighlight] = React.useState(null);
   React.useEffect(() => {
     getSuggestions(across.word.toLowerCase(), setAcrossSuggestions);
     getSuggestions(down.word.toLowerCase(), setDownSuggestions);
   }, [across, down]);
  
//   const matchSuggestions = async () => {
//     const colors = ['darkblue', 'lightred', 'nicegreen', 'whatyellow', 'dougviolet', 'circlebrown',
//                     'chartreuse', 'chocolate', 'cyancosling', 'bourntorange', 'darkslategray', 'deeppink',
//                     'foolsgold', 'nicecolour', 'indigogirls', 'lightgray', 'lightseagreen', 'mediumaquamarine',
//                     'navajowhite', 'oliveoyl', 'peruvian', 'royalblue', 'seagreen', 'silverfox',
//                     'springgreen', 'artoftheteal'];
//     const letters = [];
//     const [accs, downs] = await Promise.all([
//       getSuggestions(across.word.toLowerCase(), setAcrossSuggestions),
//       getSuggestions(down.word.toLowerCase(), setDownSuggestions)
//       ]);
//     setAcrossStyles(accs.map(() => 'black'));           
//     setDownStyles(downs.map(() => 'black'));
//     if (puzzle.activeCell.length > 0 && accs.length && downs.length) {
//       if (!puzzle.grid[puzzle.activeCell[0]][puzzle.activeCell[1]].value){
//         let acrossIndex = puzzle.activeCell[1] - across.range[0];
//         let downIndex = puzzle.activeCell[0] - down.range[0];
//         let aStyles = accs.map(() => 'black');
//         let dStyles = downs.map(() => 'black');
//         try {
//           let acrossLetter = '';
//           for (let i = 0; i < accs.length; i++) {
//             acrossLetter = accs[i][acrossIndex];
//             let x = letters.indexOf(acrossLetter);
//             x < 0 ? (letters.push(acrossLetter), x = letters.length - 1) : null;
//             aStyles[i] = colors[x];
//             dStyles = dStyles.map((ds, ind) => {
//               //console.log(ds, ind, downs[ind]);
//               return downs[ind][downIndex]===acrossLetter ? aStyles[i] : ds;
//             });
//           }
//           //console.log(aStyles)
//           //console.log(dStyles)
//           setAcrossStyles(aStyles)            
//           setDownStyles(dStyles)            

//         } catch(error) {
//             console.log(error);
//         }  
//       }
//     }
//   }
  
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
    //console.log(apiString);
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
    e.stopPropagation();
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
    setAcrossFilter([]);
    setDownFilter([]);
    setAcrossHighlight(null);
    setDownHighlight(null);
  }
  
  const highlightCrosses = (e, ad) => {
    if (ad == 'down') {
      setAcrossHighlight(e.currentTarget.textContent[puzzle.activeCell[0] - down.range[0]]);
    } else {
      setDownHighlight(e.currentTarget.textContent[puzzle.activeCell[1] - across.range[0]]);
    }
  }
  
  const unHighlightCrosses = (e) => {
    setAcrossHighlight(null);
    setDownHighlight(null);
  }
  
  const hideNonCrosses = (e, ad) => {
    e.stopPropagation();
    if (ad == 'down') {
      if (acrossFilter[0] == e.currentTarget.previousSibling.textContent) {
        setAcrossFilter([]);
      } else {
        setAcrossFilter([e.currentTarget.previousSibling.textContent,e.currentTarget.previousSibling.textContent[puzzle.activeCell[0] - down.range[0]]]);
      }
    } else {
      if (downFilter[0] == e.currentTarget.previousSibling.textContent) {
        setDownFilter([]);
      } else {
        setDownFilter([e.currentTarget.previousSibling.textContent,e.currentTarget.previousSibling.textContent[puzzle.activeCell[1] - across.range[0]]]);
      }
    }
    
  }
  
  const showNonCrosses = (e, ad) => {
    e.stopPropagation();
    if (ad == 'down') {
      setDownFilter([]);
    } else {
      setAcrossFilter([]);
    }
  }
  
  if (acrossNumber != '-' || downNumber != '-') {
    return (
      <div class="current-clues">
        <div id="across">
          <div class="inline"><h3>{acrossNumber} Across:</h3><input class="inline-content-editable" onClick={(e) => e.stopPropagation()} style={{ width: measureMyInputText(acrossNumber + 'clue') + 'px' }} value={acrossNumber + ' clue'} type="text"  /></div>
          <div class="current">{across.word.toUpperCase()} <a target="_blank" href={'http://onelook.com/?w=' + across.word.toUpperCase().replace('-','?')}><img style={{width: '16px'}} src="https://cdn.glitch.com/7a2e2b2d-f058-4f81-950d-8b81f72c14fc%2Fonelook.png?v=1611800262010"/><span class="pbtip"><b>Open in OneLook</b></span></a>
            {acrossFilter[0] ? <a onClick={(e) => showNonCrosses(e,'across')}><EyeIcon size={20}/><span class="pbtip"><b>Unfilter Across crosses</b></span></a> : ''}
          </div>
          <div class="suggestions">{acrossSuggestions.map(
              (x, i) => <div class="inline">
                <div onMouseEnter={(e) => highlightCrosses(e, 'across')} onMouseLeave={(e) => unHighlightCrosses(e)} class={acrossFilter[1] && acrossFilter[1] != x[puzzle.activeCell[1] - across.range[0]] ? 'suggestion hidden' : (acrossHighlight == (x[puzzle.activeCell[1] - across.range[0]]) || x == downFilter[0]) ? 'suggestion highlighted' : 'suggestion'} onClick={(e) => fillWithSuggestion(e, x, 'across')} >{x}</div>
                <a onClick={(e) => hideNonCrosses(e, 'across')}><ArrowDownIcon size={12}/><span class="pbtip"><b>{x == downFilter[0] ? 'Unfilter Down crosses' : 'Filter Down crosses'}</b></span></a>
                <a target="_blank" href={'http://onelook.com/?w=' + x}><img style={{width: '12px'}} src="https://cdn.glitch.com/7a2e2b2d-f058-4f81-950d-8b81f72c14fc%2Fonelook.png?v=1611800262010"/><span class="pbtip"><b>Open in OneLook</b></span></a>
              </div>
            )}
          </div>
        </div>
        <div id="down">
          <div class="inline"><h3>{downNumber} Down:</h3><input class="inline-content-editable" onClick={(e) => e.stopPropagation()} style={{ width: measureMyInputText(downNumber + 'clue') + 'px' }} value={downNumber + ' clue'} type="text"  /></div>
          <div class="current">{down.word.toUpperCase()}<a target="_blank" href={'http://onelook.com/?w=' + down.word.toUpperCase().replace('-','?')}><img style={{width: '16px'}} src="https://cdn.glitch.com/7a2e2b2d-f058-4f81-950d-8b81f72c14fc%2Fonelook.png?v=1611800262010"/><span class="pbtip"><b>Open in OneLook</b></span></a>
            {downFilter[0] ? <a onClick={(e) => showNonCrosses(e,'down')}><EyeIcon size={20}/><span class="pbtip"><b>Unfilter Down crosses</b></span></a> : ''}
          </div>
          <div class="suggestions">{downSuggestions.map(
              (x, i) => <div class="inline">
                <div onMouseEnter={(e) => highlightCrosses(e, 'down')} onMouseLeave={(e) => unHighlightCrosses(e)} class={downFilter[1] && downFilter[1] != x[puzzle.activeCell[0] - down.range[0]] ? 'suggestion hidden' : (downHighlight == (x[puzzle.activeCell[0] - down.range[0]]) || x == acrossFilter[0]) ? 'suggestion highlighted' : 'suggestion'} onClick={(e) => fillWithSuggestion(e, x, 'down')} >{x}</div>
                <a onClick={(e) => hideNonCrosses(e, 'down')}><ArrowRightIcon size={12}/><span class="pbtip"><b>{x == acrossFilter[0] ? 'Unfilter Across crosses' : 'Filter Across crosses'}</b></span></a>
                <a target="_blank" href={'http://onelook.com/?w=' + x}><img style={{width: '12px'}} src="https://cdn.glitch.com/7a2e2b2d-f058-4f81-950d-8b81f72c14fc%2Fonelook.png?v=1611800262010"/><span class="pbtip"><b>Open in OneLook</b></span></a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }
}

module.exports = CurrentClues;