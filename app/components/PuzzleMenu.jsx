const React = require("react");
const { Link } = require("react-router-dom");

const { DesktopDownloadIcon, PencilIcon, UnlockIcon, HomeIcon, LockIcon } = require("@primer/octicons-react");

const { ReactTooltip } = require ("react-tooltip");




const PuzzleMenu = ({puzz}) => {
  const toggleLock = e => {
    // puzz.toggleSymmetry();
    // return (
    //   puzz.symmetry ? <LockIcon size={24} /> : <UnlockIcon size={24} />
    // );
  };
  
  return (
    <div class="menu">
      <Link><DesktopDownloadIcon size={24} /></Link>
      <Link><PencilIcon size={24} /></Link>
      <Link onClick={toggleLock()} ><UnlockIcon size={24} /></Link>
<!--       <Link onClick={toggleLock()} >{puzz.symmetry ? <LockIcon size={24} /> : <UnlockIcon size={24} />}</Link> -->
    </div>
  );
};

module.exports = PuzzleMenu;