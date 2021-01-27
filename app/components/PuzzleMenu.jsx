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
      return <a class="subicon" onClick={toggleLock} >< LockIcon size={24}/><MirrorIcon size={12} /><span class="pbtip stip"><b>Unlock symmetry</b></span></a>;
    } else {
      return <a class="subicon" onClick={toggleLock} >< UnlockIcon size={24}/><MirrorIcon size={12} /><span class="pbtip stip"><b>Lock symmetry</b></span></a>;
    };
  };
  
  const handleSave = () => puzzle.savePuzzle();
  
  return (
    <div class="menu">
      <a><InfoIcon size={24} />
        <span class="pbtip">
          <b>Info</b><br/>
          <i>Ctrl+click</i> to toggle black square<br/>
          <i>Alt+click</i> to toggle circle<br/>
          <i>Shift+click</i> to toggle shaded square<br/>
          <i>"."</i> to toggle black square<br/>
          <i>";"</i> to toggle circle<br/>
          <i>"/"</i> to toggle shaded square
        </span>
      </a>
      <Link to={{ pathname: "/play"}}><PlayIcon size={24} /><span class="pbtip stip"><b>Play</b></span></Link>
      <a onClick={handleSave}><DatabaseIcon size={24}  /><span class="pbtip"><b>Save</b><br/>...to local storage</span></a>
      <a><DesktopDownloadIcon size={24} /><span class="pbtip"><b>Download</b><br/>...as .puz file</span></a>
      {lockIcon()}
    </div>
  );
};

module.exports = PuzzleMenu;