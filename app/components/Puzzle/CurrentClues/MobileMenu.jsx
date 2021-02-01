const React = require("react");
const { TypographyIcon, TriangleLeftIcon, TriangleRightIcon } = require("@primer/octicons-react");

const navClue = (e, pn) => {
  e.stopPropagation();
  var newGrid = puzzle.grid;
  var terminus, termrow, termcol;
  var ad = puzzle.direction;
  if (pn == 'next') {
    //find the start with the next highest number
    for (let row = 0; row < newGrid.length; row++) {
      for (let column = 0; column < newGrid[row].length; column++) {
        var clue = newGrid[row][column].clue;
        if ((ad == "down" && clue.isDownStart && clue.downClueNumber > downNumber) ||
            (ad == "across" && clue.isAcrossStart && clue.acrossClueNumber > acrossNumber)) {
          puzzle.setActiveCell([row, column]);
          return;
        } else if ((!terminus && ad == "down" && clue.isDownStart) ||
                   (!terminus && ad == "across" && clue.isAcrossStart) ||
                   (ad == "down" && clue.isDownStart && clue.downClueNumber < terminus) ||
                   (ad == "across" && clue.isAcrossStart && clue.acrossClueNumber < terminus)) {
          terminus = ad == "down" ? clue.downClueNumber : clue.acrossClueNumber;
          termrow = row;
          termcol = column;
        }
      }
    }
  } else {
    //find the start with the next lowest number
    for (let row = newGrid.length - 1; row >= 0; row--) {
      for (let column = newGrid[row].length - 1; column >= 0; column--) {
        var clue = newGrid[row][column].clue;
        if ((ad == "down" && clue.isDownStart && clue.downClueNumber < downNumber) ||
            (ad == "across" && clue.isAcrossStart && clue.acrossClueNumber < acrossNumber)) {
          puzzle.setActiveCell([row, column]);
          return;
        } else if ((!terminus && ad == "down" && clue.isDownStart) ||
                   (!terminus && ad == "across" && clue.isAcrossStart) ||
                   (ad == "down" && clue.isDownStart && clue.downClueNumber < terminus) ||
                   (ad == "across" && clue.isAcrossStart && clue.acrossClueNumber < terminus)) {
          terminus = ad == "down" ? clue.downClueNumber : clue.acrossClueNumber;
          termrow = row;
          termcol = column;
        }
      }
    }
  }
  console.log(terminus);
  console.log(row);
  console.log(column);
  puzzle.setActiveCell([termrow, termcol]);
  return;
};

module.exports = function MobileMenu({
  mobileView,
  setMobileView,
  acrossNumber,
  acrossWord,
  downNumber,
  downWord
}) {
  const keyBoardSwitch = (e, view) => {
    e.stopPropagation();
    setMobileView(view);
  };
  
  const handlePrevClueClick = e => {
    navClue(e, "prev");
  };
  
  const handleNextClueClick = e => {
    navClue(e, "next");
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
        {acrossNumber !== '-' ? acrossNumber + 'A: ' + acrossWord : '-' }
      </a>
      <a
        class={mobileView == "down" ? "activemobile" : ""}
        onClick={e => keyBoardSwitch(e, "down")}
      >
        {downNumber !== '-' ? downNumber + 'A: ' + downWord : '-' }
      </a>
      <a class="cluenav next key" onClick={handleNextClueClick}>
        <TriangleRightIcon size={20} />
      </a>
    </div>
  );
};
