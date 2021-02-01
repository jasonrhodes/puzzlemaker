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
  const [downSuggestions, setDownSuggestions] = React.useState([]);
  const [acrossSuggestions, setAcrossSuggestions] = React.useState([]);

  const showDownNonCrosses = (e) => {
    e.stopPropagation();
    puzzle.setDownFilter([]);
    puzzle.pencilOut("across");
  };
  
  const showAcrossNonCrosses = (e) => {
    e.stopPropagation();
    puzzle.setAcrossFilter([]);
    puzzle.pencilOut("down");
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
            <Current clueNumber={acrossNumber} word={across.word} filterWord={puzzle.acrossFilter[0]} showNonCrosses={showAcrossNonCrosses} ad={"across"} />
            <SuggestionsList
              ad="across"
              puzzle={puzzle}
              myHighlight={acrossHighlight}
              setOtherHighlight={setDownHighlight}
              myFilter={puzzle.acrossFilter}
              otherFilter={puzzle.downFilter}
              setOtherFilter={puzzle.setDownFilter}
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
            <Current clueNumber={downNumber} word={down.word} filterWord={puzzle.downFilter[0]} showNonCrosses={showDownNonCrosses} ad={"down"} />
            <SuggestionsList
              ad="down"
              puzzle={puzzle}
              myHighlight={downHighlight}
              setOtherHighlight={setAcrossHighlight}
              myFilter={puzzle.downFilter}
              otherFilter={puzzle.acrossFilter}
              setOtherFilter={puzzle.setAcrossFilter}
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
