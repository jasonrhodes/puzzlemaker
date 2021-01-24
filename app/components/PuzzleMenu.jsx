const React = require("react");
const { Link } = require("react-router-dom");

const { DesktopDownloadIcon, PencilIcon, UnlockIcon, HomeIcon, LockIcon } = require("@primer/octicons-react");

const { ReactTooltip } = require ("react-tooltip");




const PuzzleMenu = ({puzzle}) => {
  const toggleLock = e => {
    // puzzle.toggleSymmetry();
    // return (
    //   puzzle.symmetry ? <LockIcon size={24} /> : <UnlockIcon size={24} />
    // );
  };
  
  return (
    <div class="menu">
      <Link><DesktopDownloadIcon size={24} /></Link>
      <Link><PencilIcon size={24} /></Link>
    </div>
  );
};

module.exports = PuzzleMenu;