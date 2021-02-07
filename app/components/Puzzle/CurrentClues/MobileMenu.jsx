const React = require("react");
const { Type, ChevronLeft, ChevronRight } = require("react-feather");

module.exports = function MobileMenu({
  mobileView,
  setMobileView,
  acrossNumber,
  acrossWord,
  downNumber,
  downWord,
  puzzle
}) {
  
  const keyBoardSwitch = (e, view) => {
    e.stopPropagation();
    setMobileView(view);
  };

  const handlePrevClueClick = e => {
    e.stopPropagation();
    puzzle.rewindActiveClue();
  };
  
  const handleNextClueClick = e => {
    e.stopPropagation();
    puzzle.advanceActiveClue();
  };

  return (
    <div id="mobilemenu">
      <a className="cluenav prev key" onClick={handlePrevClueClick}>
        <ChevronLeft size={16} />
      </a>
      <a className={mobileView == "keyboard" ? "activemobile" : ""}onClick={e => keyBoardSwitch(e, "keyboard")}>
        <Type size={16} />
      </a>
      <a
        className={mobileView == "across" ? "activemobile" : ""}
        onClick={e => keyBoardSwitch(e, "across")}
      >
        {acrossNumber !== '-' ? acrossNumber + 'a: ' + acrossWord : '-' }
      </a>
      <a
        className={mobileView == "down" ? "activemobile" : ""}
        onClick={e => keyBoardSwitch(e, "down")}
      >
        {downNumber !== '-' ? downNumber + 'd: ' + downWord : '-' }
      </a>
      <a className="cluenav next key" onClick={handleNextClueClick}>
        <ChevronRight size={16} />
      </a>
    </div>
  );
};
