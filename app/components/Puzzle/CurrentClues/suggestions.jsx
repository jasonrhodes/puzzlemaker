const React = require("react");
const WordCache = new Map();
const hasDash = char => char === "-";
const { focusOnActive } = require("../../../utils/style");
const {
  ArrowDownIcon,
  ArrowRightIcon
} = require("@primer/octicons-react");

module.exports = {
  getSuggestions,
  SuggestionsList
};

const getMatches = (response, len) => {
  let result = [];

  for (let entry of response) {
    let word = entry.word.replace(/-/g, "").replace(/ /g, "");
    if (
      word.length === len &&
      /^[a-zA-Z]+$/.test(word) &&
      !result.includes(word.toUpperCase())
    ) {
      result.push({
        text: word.toUpperCase(),
        score: entry.tags[0].replace("f:", "")
      });
    }
  }
  return result;
};

async function getSuggestions(clue, setFunc) {
  const chars = clue.split("");
  const hasNoDashes = !chars.some(hasDash);
  const hasAllDashes = chars.every(hasDash);
  if (hasNoDashes || hasAllDashes) {
    // if the word is all blank or all filled in, no suggestions needed
    setFunc([]);
    return [];
  }
  const cached = WordCache.get(clue);
  if (cached) {
    setFunc(cached); // don't re-call API for clue pattern we already cached
    return cached;
  }
  const apiString =
    "https://api.datamuse.com/words?sp=" +
    clue.replace(/-/g, "?") +
    "&max=1000&md=f";
  const response = await fetch(apiString);
  const myJson = await response.json();
  const matches = getMatches(myJson, clue.length);
  WordCache.set(clue, matches);
  setFunc(matches);
  return matches;
}

function SuggestionsList({
  ad,
  puzzle,
  myHighlight,
  setOtherHighlight,
  myFilter,
  otherFilter,
  setOtherFilter
}) {
  const cur_word = ad == "down" ? puzzle.words.down : puzzle.words.across;
  const active_letter = ad == "down" ? puzzle.activeCell[0] : puzzle.activeCell[1];
  const position = active_letter - cur_word.range[0];
  const [mySuggestions, setMySuggestions] = React.useState([]);

  React.useEffect(() => {
    getSuggestions(cur_word.word.toLowerCase(), setMySuggestions);
  });

  const highlightCrosses = e => {
    setOtherHighlight(e.currentTarget.textContent[position]);
  };

  const unHighlightCrosses = e => {
    setOtherHighlight(null);
  };

  const hideNonCrosses = (e, ad) => {
    e.stopPropagation();
    if (otherFilter[0] == e.currentTarget.previousSibling.textContent) {
      setOtherFilter([]);
    } else {
      setOtherFilter([
        e.currentTarget.previousSibling.textContent,
        e.currentTarget.previousSibling.textContent[position]
      ]);
    }
  };

  const filterSuggestions = (suggestions) => {
    var filter = myFilter[1];
    let finalresult = [];

    suggestions.sort(function(a, b) {
      return parseFloat(b.score) - parseFloat(a.score);
    });

    for (let word of suggestions) {
      if (filter && filter != word.text[position]) {
        continue;
      }
      if (finalresult.length === 100) {
        break;
      }
      finalresult.push(word.text);
    }
    return finalresult;
  };

  const fillWithSuggestion = (e, suggestion) => {
    e.stopPropagation();
    const newGrid = [...puzzle.grid];
    
    for (let i = cur_word.range[0]; i <= cur_word.range[1]; i++) {
      if (ad == 'down') {
        newGrid[i][puzzle.activeCell[1]].value = suggestion[i - cur_word.range[0]];
      } else {
        newGrid[puzzle.activeCell[0]][i].value = suggestion[i - cur_word.range[0]];
      }
    }
    puzzle.setGrid(newGrid);

    setOtherFilter([]);
    setOtherHighlight(null);
    focusOnActive();
  };

  return (
    <div class="suggestions">
      {filterSuggestions(mySuggestions).map((x, i) => (
        <div class="inline">
          <div
            onMouseEnter={e => highlightCrosses(e, ad)}
            onMouseLeave={e => unHighlightCrosses(e)}
            class={
              myHighlight == x[active_letter - cur_word.range[0]] ||
              x == otherFilter[0]
                ? "suggestion highlighted"
                : // !otherSuggestions.length ||
                  //   otherSuggestions
                  //     .map(
                  //       s => s.text[puzzle.activeCell[1] - across.range[0]]
                  //     )
                  //     .includes(x[puzzle.activeCell[0] - down.range[0]])
                  // ?
                  "suggestion"
              //: "suggestion unmatched"
            }
            onClick={e => fillWithSuggestion(e, x, ad)}
          >
            {x}
          </div>
          <a onClick={e => hideNonCrosses(e, ad)}>
            {ad == 'down' ? <ArrowRightIcon size={12} /> : <ArrowDownIcon size={12} /> }
            <span class="pbtip">
              <b>
                {x == myFilter[0]
                  ? "Unfilter " + (ad == 'down' ? 'Across' : 'Down') + " crosses"
                  : "Filter " + (ad == 'down' ? 'Across' : 'Down') + " crosses"}
              </b>
            </span>
          </a>
          <a target="_blank" href={"http://onelook.com/?w=" + x}>
            <img
              style={{ width: "12px" }}
              src="https://cdn.glitch.com/7a2e2b2d-f058-4f81-950d-8b81f72c14fc%2Fonelook.png?v=1611800262010"
            />
            <span class="pbtip">
              <b>Open in OneLook</b>
            </span>
          </a>
        </div>
      ))}
    </div>
  );
}
