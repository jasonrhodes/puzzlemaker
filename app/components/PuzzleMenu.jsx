const React = require("react");
const { Link } = require("react-router-dom");

const { DesktopDownloadIcon, PencilIcon, UnlockIcon, HomeIcon, LockIcon, MirrorIcon } = require("@primer/octicons-react");

const ReactTooltip = require("react-tooltip");




const PuzzleMenu = ({puzzle}) => {
  const toggleLock = e => {
    puzzle.toggleSymmetry();
    e.stopPropagation();
  };
  
  const lockIcon = () => {
    if (puzzle.symmetry){
      return < LockIcon data-tip="Unlock symmetry" data-for='b' size={24}/>;
    } else {
      return < UnlockIcon data-tip="Lock symmetry" data-for='b' size={24}/>;
    };
  };
  
  return (
    <div class="menu">
      <Link><DesktopDownloadIcon size={24} /></Link>
      <Link class="subicon" onClick={toggleLock} >{lockIcon()} <MirrorIcon size={12} /></Link>
      <a data-tip="test" data-for='b'>test 1</a>
      <ReactTooltip id='a'>test 2</ReactTooltip>
    </div>
  );
};

module.exports = PuzzleMenu;