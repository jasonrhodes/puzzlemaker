const React = require("react");
const { measureMyInputText } = require("../../../utils/style");
//const { Link } = require("react-router-dom");
//const { EyeIcon } = require("@primer/octicons-react");
//const KeyBoard = require("../CurrentClues/KeyBoard");
//const MobileMenu = require("../CurrentClues/MobileMenu");
//const { SuggestionsList } = require("./suggestions");
const ClueListAll = require("./ClueListAll");


const AllClues = ({ across, down, puzzle }) => {
  //const [row, column] = puzzle.activeCell;
  //const { acrossNumber, downNumber } = puzzle.getCluesForCell(row, column);
  //const [mobileView, setMobileView] = React.useState("keyboard");
  //const [downHighlight, setDownHighlight] = React.useState(null);
  //const [acrossHighlight, setAcrossHighlight] = React.useState(null);
  //const [downSuggestions, setDownSuggestions] = React.useState([]);
  //const [acrossSuggestions, setAcrossSuggestions] = React.useState([]);

  /*
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
  */
  
  return (
    <div className="current-clues" id="all-clues">
      <div id="all-clues-across">
        <React.Fragment>
          <h3>Across</h3>
          <ClueListAll
            ad="across"
            puzzle={puzzle}
          />
        </React.Fragment>
      </div>
      <div id="all-clues-down"> 
        <React.Fragment>
          <h3>Down</h3>
          <ClueListAll
            ad="down"
            puzzle={puzzle}
          />
        </React.Fragment>
      </div>
    </div>
  );
};

module.exports = AllClues;
