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
      return <Link class="subicon" onClick={toggleLock} >< LockIcon size={24}/><MirrorIcon size={12} /><span class="pbtip">Unlock symmetry</span></Link>;
    } else {
      return <Link class="subicon" onClick={toggleLock} >< UnlockIcon size={24}/><MirrorIcon size={12} /><span class="pbtip">Lock symmetry</span></Link>;
    };
  };
  
  return (
    <div class="menu">
      <Link><InfoIcon size={24} />
        <span class="pbtip">
          <b>Info</b><br/>
          <i>Ctrl+click</i> to toggle black square<br/>
          <i>"."</i> to toggle black square<br/>
          <i>"+"</i> to toggle circle</span>
      </Link>
      <Link><ShareIcon size={24} /><span class="pbtip">Share</span></Link>
      <Link><PlayIcon size={24} /><span class="pbtip">Play</span></Link>
      <Link><DatabaseIcon size={24} /><span class="pbtip">Save</span></Link>
      <Link><DesktopDownloadIcon size={24} /><span class="pbtip">Download</span></Link>
      {lockIcon()}
    </div>
  );
};

module.exports = PuzzleMenu;