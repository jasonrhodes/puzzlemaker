const React = require("react");
const { measureMyInputText } = require("../../../utils/style");
const { Link } = require("react-router-dom");
const {
  ArrowDownIcon,
  ArrowRightIcon,
  EyeIcon
} = require("@primer/octicons-react");
const KeyBoard = require("./KeyBoard");
const MobileMenu = require("./MobileMenu");
const { SuggestionsList } = require("./suggestions");

const CurrentClues = ({ across, down, puzzle }) => {
  const [row, column] = puzzle.activeCell;
  const { acrossNumber, downNumber } = puzzle.getCluesForCell(row, column);
  const [mobileView, setMobileView] = React.useState("keyboard");
  const [acrossSuggestions, setAcrossSuggestions] = React.useState([]);
  const [downSuggestions, setDownSuggestions] = React.useState([]);
  const [downHighlight, setDownHighlight] = React.useState(null);
  const [acrossHighlight, setAcrossHighlight] = React.useState(null);
  const [downFilter, setDownFilter] = React.useState([]);
  const [acrossFilter, setAcrossFilter] = React.useState([]);

  // Not sure if these need to stay here or can move to the suggestions.jsx file
  // Also: do we need getSuggestions to re-run in both directions whenever either of
  // those values update, or do we want across to re-run when across changes and
  // down to re-run when down updates?
  
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
        <SuggestionsList ad={"across"} puzzle={puzzle} mysuggestions={acrossSuggestions} setMySuggestions={setAcrossSuggestions} myHighlight={acrossHighlight} setOtherHighlight={setDownHighlight} myFilter={acrossFilter} otherFilter={downFilter} setOtherFilter={setDownFilter} />
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
        <SuggestionsList ad={"down"} puzzle={puzzle} mysuggestions={downSuggestions} setMySuggestions={setDownSuggestions} myHighlight={downHighlight} setOtherHighlight={setAcrossHighlight} myFilter={downFilter} otherFilter={acrossFilter} setOtherFilter={setAcrossFilter}  />
      </div>
      <KeyBoard puzzle={puzzle} mobileView={mobileView} />
    </div>
  );
};

module.exports = CurrentClues;
