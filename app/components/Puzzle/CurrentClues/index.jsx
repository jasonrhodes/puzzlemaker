const React = require("react");
const { measureMyInputText } = require("../../../utils/style");
const { Link } = require("react-router-dom");
const {
  EyeIcon
} = require("@primer/octicons-react");
const KeyBoard = require("./KeyBoard");
const MobileMenu = require("./MobileMenu");
const { SuggestionsList } = require("./suggestions");
const ClueInput = require("./ClueInput");

const CurrentClues = ({ across, down, puzzle }) => {
  const [row, column] = puzzle.activeCell;
  const { acrossNumber, downNumber } = puzzle.getCluesForCell(row, column);
  const [mobileView, setMobileView] = React.useState("keyboard");
  const [downHighlight, setDownHighlight] = React.useState(null);
  const [acrossHighlight, setAcrossHighlight] = React.useState(null);
  const [downFilter, setDownFilter] = React.useState([]);
  const [acrossFilter, setAcrossFilter] = React.useState([]);
  
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
          <h3>{acrossNumber}a: </h3>
          <ClueInput direction="across" number={acrossNumber} />
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
        <SuggestionsList ad={"across"} puzzle={puzzle} myHighlight={acrossHighlight} setOtherHighlight={setDownHighlight} myFilter={acrossFilter} otherFilter={downFilter} setOtherFilter={setDownFilter} />
      </div>
      <div id="down" class={mobileView == "down" ? "activemobile" : ""}>
        <div class="inline">
          <h3>{downNumber}d: </h3>
          <ClueInput direction="down" number={downNumber} />
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
        <SuggestionsList ad={"down"} puzzle={puzzle} myHighlight={downHighlight} setOtherHighlight={setAcrossHighlight} myFilter={downFilter} otherFilter={acrossFilter} setOtherFilter={setAcrossFilter}  />
      </div>
      <KeyBoard puzzle={puzzle} mobileView={mobileView} />
    </div>
  );
};

module.exports = CurrentClues;
