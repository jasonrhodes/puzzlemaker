const React = require("react");
const { measureMyInputText } = require("../../../utils/style");
const { Link } = require("react-router-dom");
const { EyeIcon } = require("@primer/octicons-react");
const KeyBoard = require("./KeyBoard");
const MobileMenu = require("./MobileMenu");
const { SuggestionsList } = require("./suggestions");
const Current = require("./Current");


const CurrentClues = ({ across, down, puzzle }) => {
  const [row, column] = puzzle.activeCell;
  const { acrossNumber, downNumber } = puzzle.getCluesForCell(row, column);
  const [mobileView, setMobileView] = React.useState("keyboard");
  const [downHighlight, setDownHighlight] = React.useState(null);
  const [acrossHighlight, setAcrossHighlight] = React.useState(null);
  const [downFilter, setDownFilter] = React.useState([]);
  const [acrossFilter, setAcrossFilter] = React.useState([]);
  const [downSuggestions, setDownSuggestions] = React.useState([]);
  const [acrossSuggestions, setAcrossSuggestions] = React.useState([]);

  const showDownNonCrosses = (e) => {
    e.stopPropagation();
    setDownFilter([]);
  };
  
  const showAcrossNonCrosses = (e) => {
    e.stopPropagation();
    setAcrossFilter([]);
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
        {acrossNumber !== "-" ? (
          <React.Fragment>
            <Current clueNumber={acrossNumber} word={across.word} filterWord={acrossFilter[0]} showNonCrosses={showAcrossNonCrosses} />
            <SuggestionsList
              ad="across"
              puzzle={puzzle}
              myHighlight={acrossHighlight}
              setOtherHighlight={setDownHighlight}
              myFilter={acrossFilter}
              otherFilter={downFilter}
              setOtherFilter={setDownFilter}
              mySuggestions={acrossSuggestions}
              setMySuggestions={setAcrossSuggestions}
              otherSuggestions={downSuggestions}
            />
          </React.Fragment>
        ) : (
          ""
        )}
      </div>
        <div id="down" class={mobileView == "down" ? "activemobile" : ""}>
          {downNumber !== "-" ? (
          <React.Fragment>
            <Current clueNumber={downNumber} word={down.word} filterWord={downFilter[0]} showNonCrosses={showDownNonCrosses} />
            <SuggestionsList
              ad="down"
              puzzle={puzzle}
              myHighlight={downHighlight}
              setOtherHighlight={setAcrossHighlight}
              myFilter={downFilter}
              otherFilter={acrossFilter}
              setOtherFilter={setAcrossFilter}
              mySuggestions={downSuggestions}
              setMySuggestions={setDownSuggestions}
              otherSuggestions={acrossSuggestions}
            />
          </React.Fragment>
        ) : (
          ""
        )}
      </div>
      <KeyBoard puzzle={puzzle} mobileView={mobileView} />
    </div>
  );
};

module.exports = CurrentClues;
