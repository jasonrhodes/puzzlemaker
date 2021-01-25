const React = require("react");
const { Link } = require("react-router-dom");

const { DesktopDownloadIcon, PencilIcon, UnlockIcon, HomeIcon, LockIcon, MirrorIcon } = require("@primer/octicons-react");

const { ReactTooltip } = require ("react-tooltip");




const PuzzleMenu = ({puzzle}) => {
  const toggleLock = e => {
    puzzle.toggleSymmetry();
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
      <Link><DesktopDownloadIcon size={24} /><ReactTooltip /></Link>
      <Link class="subicon" onClick={toggleLock} >{lockIcon()} <MirrorIcon size={12} /></Link>
    </div>
  );
};

module.exports = PuzzleMenu;