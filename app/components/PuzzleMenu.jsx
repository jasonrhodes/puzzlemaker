const React = require("react");
const { Link } = require("react-router-dom");

const { DesktopDownloadIcon, PencilIcon, UnlockIcon, HomeIcon, LockIcon } = require("@primer/octicons-react");

const { ReactTooltip } = require ("react-tooltip");




const PuzzleMenu = ({puzzle}) => {
  const toggleLock = e => {
    console.log('hey');
    console.log(puzzle.symmetry);
    puzzle.symmetry = !puzzle.symmetry
  };
  
  const lockIcon = () => {
    if (puzzle.symmetry){
      return < LockIcon size={24}/>;
    } else {
      return < UnlockIcon size={24}/>;
    };
  };
  
  return (
    <div class="menu">
      <Link><DesktopDownloadIcon size={24} /></Link>
      <Link><PencilIcon size={24} /></Link>
      <Link onClick={toggleLock} >{lockIcon()}</Link>
      <button onClick={toggleLock}>Test</button>
    </div>
  );
};

module.exports = PuzzleMenu;