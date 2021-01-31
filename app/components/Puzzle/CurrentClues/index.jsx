const React = require("react");
const { measureMyInputText } = require("../../../utils/style");
const { Link } = require("react-router-dom");
const { EyeIcon } = require("@primer/octicons-react");
const KeyBoard = require("./KeyBoard");
const MobileMenu = require("./MobileMenu");
const { SuggestionsList } = require("./suggestions");
const ClueInput = require("./ClueInput");
const OneLookLink = require("./OneLookLink");

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
      {acrossNumber !== "-" ? (
        <div id="across" class={mobileView == "across" ? "activemobile" : ""}>
          <div class="inline" onClick={e => e.stopPropagation()}>
            <h3>{acrossNumber}A: </h3>
            <ClueInput direction="across" number={acrossNumber} />
          </div>

          <div class="current" onClick={e => e.stopPropagation()}>
            {across.word.toUpperCase()}
            <OneLookLink word={across.word} />
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
          <SuggestionsList
            ad={"across"}
            puzzle={puzzle}
            myHighlight={acrossHighlight}
            setOtherHighlight={setDownHighlight}
            myFilter={acrossFilter}
            otherFilter={downFilter}
            setOtherFilter={setDownFilter}
          />
        </div>
      ) : (
        ""
      )}
      {downNumber !== "-" ? (
        <div id="down" class={mobileView == "down" ? "activemobile" : ""}>
          {downNumber !== "-" ? (
            <div class="inline" onClick={e => e.stopPropagation()}>
              <h3>{downNumber}D: </h3>
              <ClueInput direction="down" number={downNumber} />
            </div>
          ) : (
            <h3>Select input field</h3>
          )}
          <div class="current" onClick={e => e.stopPropagation()}>
            {down.word.toUpperCase()}
            <OneLookLink word={down.word} />
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
          <SuggestionsList
            ad={"down"}
            puzzle={puzzle}
            myHighlight={downHighlight}
            setOtherHighlight={setAcrossHighlight}
            myFilter={downFilter}
            otherFilter={acrossFilter}
            setOtherFilter={setAcrossFilter}
          />
        </div>
      ) : (
        ""
      )}
      <KeyBoard puzzle={puzzle} mobileView={mobileView} />
    </div>
  );
};

module.exports = CurrentClues;
