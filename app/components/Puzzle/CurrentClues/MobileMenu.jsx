const React = require("react");
const { TypographyIcon, TriangleLeftIcon, TriangleRightIcon } = require("@primer/octicons-react");

module.exports = function MobileMenu({
  mobileView,
  setMobileView,
  acrossNumber,
  acrossWord,
  downNumber,
  downWord,
  navClue
}) {
  const keyBoardSwitch = (e, view) => {
    e.stopPropagation();
    setMobileView(view);
  };

  return (
    <div id="mobilemenu">
      <a class="cluenav prev key" onClick={e => {navClue(e, "prev");}}>
        <TriangleLeftIcon size={24} />
      </a>
      <a class={mobileView == "keyboard" ? "activemobile" : ""}onClick={e => keyBoardSwitch(e, "keyboard")}>
        <TypographyIcon size={20} />
      </a>
      <a
        class={mobileView == "across" ? "activemobile" : ""}
        onClick={e => keyBoardSwitch(e, "across")}
      >
        {acrossNumber !== '-' ? acrossNumber + 'A: ' + acrossWord : '-' }
      </a>
      <a
        class={mobileView == "down" ? "activemobile" : ""}
        onClick={e => keyBoardSwitch(e, "down")}
      >
        {downNumber !== '-' ? downNumber + 'A: ' + downWord : '-' }
      </a>
      <a class="cluenav next key" onClick={e => { navClue(e,"next");}}>
        <TriangleRightIcon size={24} />
      </a>
    </div>
  );
};
