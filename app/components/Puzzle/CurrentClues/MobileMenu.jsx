const React = require("react");
const { TypographyIcon, TriangleLeftIcon, TriangleRightIcon } = require("@primer/octicons-react");


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
    prevClue();
  };
  
  const handleNextClueClick = e => {
    e.stopPropagation();
    nextClue();
  };

  return (
    <div id="mobilemenu">
      <a class="cluenav prev key" onClick={handlePrevClueClick}>
        <TriangleLeftIcon size={20} />
      </a>
      <a class={mobileView == "keyboard" ? "activemobile" : ""}onClick={e => keyBoardSwitch(e, "keyboard")}>
        <TypographyIcon size={20} />
      </a>
      <a
        class={mobileView == "across" ? "activemobile" : ""}
        onClick={e => keyBoardSwitch(e, "across")}
      >
        {acrossNumber !== '-' ? acrossNumber + 'a: ' + acrossWord : '-' }
      </a>
      <a
        class={mobileView == "down" ? "activemobile" : ""}
        onClick={e => keyBoardSwitch(e, "down")}
      >
        {downNumber !== '-' ? downNumber + 'd: ' + downWord : '-' }
      </a>
      <a class="cluenav next key" onClick={handleNextClueClick}>
        <TriangleRightIcon size={20} />
      </a>
    </div>
  );
};
