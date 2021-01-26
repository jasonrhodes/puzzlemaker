const React = require("react");
const { Link } = require("react-router-dom");

const { DesktopDownloadIcon, DatabaseIcon, UnlockIcon, HomeIcon, LockIcon, MirrorIcon, ShareIcon, PlayIcon, InfoIcon } = require("@primer/octicons-react");



const PuzzleMenu = ({puzzle}) => {
  const toggleLock = e => {
    puzzle.toggleSymmetry();
    e.stopPropagation();
  };
  
  const lockIcon = () => {
    if (puzzle.symmetry){
      return <Link class="subicon" onClick={toggleLock} >< LockIcon size={24}/><MirrorIcon size={12} /><span class="pbtip"><b>Unlock symmetry</b></span></Link>;
    } else {
      return <Link class="subicon" onClick={toggleLock} >< UnlockIcon size={24}/><MirrorIcon size={12} /><span class="pbtip"><b>Lock symmetry</b></span></Link>;
    };
  };
  
  return (
    <div class="menu">
      <Link><InfoIcon size={24} />
        <span class="pbtip">
          <b>Info</b><br/>
          <i>Ctrl+click</i> to toggle black square<br/>
          <i>"."</i> to toggle black square<br/>
          <i>"+"</i> to toggle circle/shaded square
        </span>
      </Link>
      <Link><DatabaseIcon size={24} /><span class="pbtip"><b>Save</b><br/>...to our storage</span></Link>
      <Link><DesktopDownloadIcon size={24} /><span class="pbtip"><b>Download</b><br/>...as .puz file</span></Link>
      {lockIcon()}
    </div>
  );
};

module.exports = PuzzleMenu;