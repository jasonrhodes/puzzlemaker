const React = require("react");
const { measureMyInputText, focusOnActive } = require("../../utils/style");
const { Link } = require("react-router-dom");
const {
  ArrowDownIcon,
  ArrowRightIcon,
  EyeIcon
} = require("@primer/octicons-react");
const KeyBoard = require("./KeyBoard");
const MobileMenu = require("./MobileMenu");

const CurrentClues = ({ across, down, puzzle }) => {
  const [row, column] = puzzle.activeCell;
  const { acrossNumber, downNumber } = puzzle.getCluesForCell(row, column);
  const [mobileView, setMobileView] = React.useState("keyboard");
  const [downFilter, setDownFilter] = React.useState([]);
  const [acrossFilter, setAcrossFilter] = React.useState([]);
  const [downHighlight, setDownHighlight] = React.useState(null);
  const [acrossHighlight, setAcrossHighlight] = React.useState(null);
  
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

  const fillWithSuggestion = (e, suggestion, direction) => {
    e.stopPropagation();
    const newGrid = [...puzzle.grid];
    if (direction === "across") {
      for (let i = across.range[0]; i <= across.range[1]; i++) {
        newGrid[puzzle.activeCell[0]][i].value =
          suggestion[i - across.range[0]];
      }
    } else if (direction === "down") {
      for (let i = down.range[0]; i <= down.range[1]; i++) {
        newGrid[i][puzzle.activeCell[1]].value = suggestion[i - down.range[0]];
      }
    }
    puzzle.setGrid(newGrid);
    setAcrossFilter([]);
    setDownFilter([]);
    setAcrossHighlight(null);
    setDownHighlight(null);

    focusOnActive();
  };

  const highlightCrosses = (e, ad) => {
    if (ad == "down") {
      setAcrossHighlight(
        e.currentTarget.textContent[puzzle.activeCell[0] - down.range[0]]
      );
    } else {
      setDownHighlight(
        e.currentTarget.textContent[puzzle.activeCell[1] - across.range[0]]
      );
    }
  };

  const unHighlightCrosses = e => {
    setAcrossHighlight(null);
    setDownHighlight(null);
  };

  const hideNonCrosses = (e, ad) => {
    e.stopPropagation();
    if (ad == "down") {
      if (acrossFilter[0] == e.currentTarget.previousSibling.textContent) {
        setAcrossFilter([]);
      } else {
        setAcrossFilter([
          e.currentTarget.previousSibling.textContent,
          e.currentTarget.previousSibling.textContent[
            puzzle.activeCell[0] - down.range[0]
          ]
        ]);
      }
    } else {
      if (downFilter[0] == e.currentTarget.previousSibling.textContent) {
        setDownFilter([]);
      } else {
        setDownFilter([
          e.currentTarget.previousSibling.textContent,
          e.currentTarget.previousSibling.textContent[
            puzzle.activeCell[1] - across.range[0]
          ]
        ]);
      }
    }
  };

  const showNonCrosses = (e, ad) => {
    e.stopPropagation();
    if (ad == "down") {
      setDownFilter([]);
    } else {
      setAcrossFilter([]);
    }
  };

  return (
    <div class="current-clues">
      <MobileMenu
        mobileView={mobileView}
        setMobileView={setMobileView}
        acrossNumber={acrossNumber}
        acrossWord={across.word.toUpperCase()}
        downNumber={downNumber}
        downWord={down.word.toUpperCase()}
      />
      <div id="across" class={mobileView == "across" ? "activemobile" : ""}>
        <div class="inline">
          <h3>{acrossNumber} Across:</h3>
          <input
            class="inline-content-editable"
            onClick={e => e.stopPropagation()}
            style={{ width: measureMyInputText(acrossNumber + "clue") + "px" }}
            value={acrossNumber + " clue"}
            type="text"
          />
        </div>
        <div class="current">
          {across.word.toUpperCase()}
          <a
            target="_blank"
            href={
              "http://onelook.com/?w=" +
              across.word.toUpperCase().replaceAll("-", "?")
            }
          >
            <img
              style={{ width: "16px" }}
              src="https://cdn.glitch.com/7a2e2b2d-f058-4f81-950d-8b81f72c14fc%2Fonelook.png?v=1611800262010"
            />
            <span class="pbtip">
              <b>Open in OneLook</b>
            </span>
          </a>
          {acrossFilter[0] ? (
            <a onClick={e => showNonCrosses(e, "across")}>
              <EyeIcon size={20} />
              <span class="pbtip">
                <b>Unfilter Across crosses</b>
              </span>
            </a>
          ) : (
            ""
          )}
        </div>
        <AcrossSuggestions />
      </div>
      <div id="down" class={mobileView == "down" ? "activemobile" : ""}>
        <div class="inline">
          <h3>{downNumber} Down:</h3>
          <input
            class="inline-content-editable"
            onClick={e => e.stopPropagation()}
            style={{ width: measureMyInputText(downNumber + "clue") + "px" }}
            value={downNumber + " clue"}
            type="text"
          />
        </div>
        <div class="current">
          {down.word.toUpperCase()}
          <a
            target="_blank"
            href={
              "http://onelook.com/?w=" +
              down.word.toUpperCase().replaceAll("-", "?")
            }
          >
            <img
              style={{ width: "16px" }}
              src="https://cdn.glitch.com/7a2e2b2d-f058-4f81-950d-8b81f72c14fc%2Fonelook.png?v=1611800262010"
            />
            <span class="pbtip">
              <b>Open in OneLook</b>
            </span>
          </a>
          {downFilter[0] ? (
            <a onClick={e => showNonCrosses(e, "down")}>
              <EyeIcon size={20} />
              <span class="pbtip">
                <b>Unfilter Down crosses</b>
              </span>
            </a>
          ) : (
            ""
          )}
        </div>
        <DownSuggestions />
      </div>
      <KeyBoard puzzle={puzzle} mobileView={mobileView} />
    </div>
  );
};

module.exports = CurrentClues;
