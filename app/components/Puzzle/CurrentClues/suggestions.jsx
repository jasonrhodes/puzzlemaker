const React = require("react");

const filterSuggestions = (list, ad) => {
  var filter = ad == "down" ? downFilter[1] : acrossFilter[1];
  var position =
    ad == "down"
      ? puzzle.activeCell[0] - down.range[0]
      : puzzle.activeCell[1] - across.range[0];
  let finalresult = [];

  list.sort(function(a, b) {
    return parseFloat(b.score) - parseFloat(a.score);
  });

  for (let word of list) {
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

function AcrossSuggestions({ puzzle, across }) {
  const [acrossSuggestions, setAcrossSuggestions] = React.useState([]);
  const [downSuggestions, setDownSuggestions] = React.useState([]);
  
  const getSuggestions = async (clue, setFunc) => {
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
    //console.log(apiString);
    const response = await fetch(apiString);
    const myJson = await response.json();
    const matches = getMatches(myJson, clue.length);
    WordCache.set(clue, matches);
    setFunc(matches);
    return matches;
  };
  React.useEffect(() => {
    getSuggestions(across.word.toLowerCase(), setAcrossSuggestions);
    getSuggestions(down.word.toLowerCase(), setDownSuggestions);
  }, [across, down]);
  return (
    <div class="suggestions">
      {filterSuggestions(acrossSuggestions, "across").map((x, i) => (
        <div class="inline">
          <div
            onMouseEnter={e => highlightCrosses(e, "across")}
            onMouseLeave={e => unHighlightCrosses(e)}
            class={
              acrossHighlight ==
                x[puzzle.activeCell[1] - across.range[0]] ||
              x == downFilter[0]
                ? "suggestion highlighted"
                : !downSuggestions.length ||
                  downSuggestions
                    .map(s => s.text[puzzle.activeCell[0] - down.range[0]])
                    .includes(x[puzzle.activeCell[1] - across.range[0]])
                ? "suggestion"
                : "suggestion unmatched"
            }
            onClick={e => fillWithSuggestion(e, x, "across")}
          >
            {x}
          </div>
          <a onClick={e => hideNonCrosses(e, "across")}>
            <ArrowDownIcon size={12} />
            <span class="pbtip">
              <b>
                {x == downFilter[0]
                  ? "Unfilter Down crosses"
                  : "Filter Down crosses"}
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

function DownSuggestions({ puzzle, down }) {
  return (
    <div class="suggestions">
      {filterSuggestions(downSuggestions, "down").map((x, i) => (
        <div class="inline">
          <div
            onMouseEnter={e => highlightCrosses(e, "down")}
            onMouseLeave={e => unHighlightCrosses(e)}
            class={
              downHighlight == x[puzzle.activeCell[0] - down.range[0]] ||
              x == acrossFilter[0]
                ? "suggestion highlighted"
                : !acrossSuggestions.length ||
                  acrossSuggestions
                    .map(
                      s => s.text[puzzle.activeCell[1] - across.range[0]]
                    )
                    .includes(x[puzzle.activeCell[0] - down.range[0]])
                ? "suggestion"
                : "suggestion unmatched"
            }
            onClick={e => fillWithSuggestion(e, x, "down")}
          >
            {x}
          </div>
          <a onClick={e => hideNonCrosses(e, "down")}>
            <ArrowRightIcon size={12} />
            <span class="pbtip">
              <b>
                {x == acrossFilter[0]
                  ? "Unfilter Across crosses"
                  : "Filter Across crosses"}
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
  )
}