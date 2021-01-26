const React = require("react");
const { Link } = require("react-router-dom");

const { DesktopDownloadIcon, DatabaseIcon, UnlockIcon, HomeIcon, LockIcon, MirrorIcon, ShareIcon, PlayIcon } = require("@primer/octicons-react");

const ReactTooltip = require("react-tooltip");




const PuzzleMenu = ({puzzle}) => {
  const toggleLock = e => {
    puzzle.toggleSymmetry();
    e.stopPropagation();
  };
  
  const lockIcon = () => {
    if (puzzle.symmetry){
      return < LockIcon data-tip="Unlock symmetry" size={24}/>;
    } else {
      return < UnlockIcon data-tip="Lock symmetry" size={24}/>;
    };
  };
  
  return (
    <div class="menu">
      <Link><ShareIcon size={24} /></Link>
      <Link><PlayIcon size={24} /></Link>
      <Link><DatabaseIcon size={24} /></Link>
      <Link><DesktopDownloadIcon size={24} /></Link>
      <Link class="subicon" onClick={toggleLock} >{lockIcon()} <MirrorIcon size={12} /></Link>
    </div>
  );
};

module.exports = PuzzleMenu;