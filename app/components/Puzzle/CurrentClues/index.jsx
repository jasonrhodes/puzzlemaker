const React = require("react");
const { measureMyInputText } = require("../../../utils/style");
const { Link } = require("react-router-dom");
const { EyeIcon, TriangleLeftIcon, TriangleRightIcon } = require("@primer/octicons-react");
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
  const [downSuggestions, setDownSuggestions] = React.useState([]);
  const [acrossSuggestions, setAcrossSuggestions] = React.useState([]);
  

  const showNonCrosses = (e, ad) => {
    e.stopPropagation();
    if (ad == "down") {
      setDownFilter([]);
    } else {
      setAcrossFilter([]);
    }
  };
  const navClue = (e,ad,mod) => {
    e.stopPropagation();
    var wantnumber = ad == 'across' ? acrossNumber + mod : downNumber + mod;
    var newGrid = puzzle.grid;
    for (let row = 0; row < newGrid.length; row++) {
      for (let column = 0; column < newGrid[row].length; column++) {
        var clue = newGrid[row][column].clue;
        console.log(clue);
        if ((ad == 'down' && clue.isDownStart && clue.downClueNumber == wantnumber) || 
            (ad == 'across' && clue.isAcrossStart && clue.acrossClueNumber == wantnumber)) {
          puzzle.setActiveCell[row,column];
          break;
        }
      }
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
          <a class="cluenav prev key" onClick={(e) => {navClue(e,'across',-1)}}><TriangleLeftIcon size={24} /></a>
          <a class="cluenav next key" onClick={(e) => {navClue(e,'across',1)}}><TriangleRightIcon size={24} /></a>
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
            mySuggestions={acrossSuggestions}
            setMySuggestions={setAcrossSuggestions}
            otherSuggestions={downSuggestions}
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
            mySuggestions={downSuggestions}
            setMySuggestions={setDownSuggestions}
            otherSuggestions={acrossSuggestions}
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
