const React = require("react");
const { Link } = require("react-router-dom");
const { convertPuzzleToJSON, PuzWriter } = require("../../utils/export");

const {
  DesktopDownloadIcon,
  UnlockIcon,
  LockIcon,
  MirrorIcon,
  PlayIcon,
  InfoIcon,
  FileIcon
} = require("@primer/octicons-react");

const SymmetryToggle = ({ symmetry, toggleSymmetry }) => {
  const toggleLock = e => {
    toggleSymmetry();
    e.stopPropagation();
  };
  
  if (symmetry) {
    return (
      <a class="subicon" onClick={toggleLock}>
        <LockIcon size={24} />
        <MirrorIcon size={12} />
        <span class="pbtip">
          <b>Unlock symmetry</b>
        </span>
      </a>
    );
  } else {
    return (
      <a class="subicon" onClick={toggleLock}>
        <UnlockIcon size={24} />
        <MirrorIcon size={12} />
        <span class="pbtip">
          <b>Lock symmetry</b>
        </span>
      </a>
    );
  }
};

const PuzzleMenu = ({ puzzle }) => {
  const downloadFile = () => {
    const element = document.createElement("a");
    //const file = new Blob(["test"],
    //             {type: 'text/plain;charset=utf-8'});
    let filename = puzzle.title ? puzzle.title+'.puz' : 'myPuz.puz';
    let serialized = convertPuzzleToJSON(puzzle);
    let fileContents = new PuzWriter().toPuz(serialized);
    let file = new File([fileContents], filename);

    element.href = URL.createObjectURL(file);
    //element.download = "myPuz.puz";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div class="menu">
      <a>
        <InfoIcon size={24} />
        <span class="pbtip">
          <b>Info</b>
          <br />
          <i>Ctrl+click</i> to toggle black square
          <br />
          <i>Alt+click</i> to toggle circle
          <br />
          <i>Shift+click</i> to toggle shaded square
          <br />
          <i>Enter</i> to switch directions
          <br />
          <i>Tab</i> to move ahead
          <br />
          <i>Shift+Tab</i> to move back
          <br />
          <i>"."</i> to toggle black square
          <br />
          <i>";" or ","</i> to toggle circle
          <br />
          <i>"/" or "-"</i> to toggle shaded square
        </span>
      </a>
      <Link to={{ pathname: "/play/" + puzzle.savedPuzzleId}}>
        <PlayIcon size={24} />
        <span class="pbtip stip">
          <b>Play</b>
        </span>
      </Link>
      <Link to={"/altprint/" + puzzle.savedPuzzleId}>
        <FileIcon size={24} />
        <span class="pbtip stip">
          <b>PDF</b>
        </span>
      </Link>
      <a onClick={downloadFile}>
        <DesktopDownloadIcon size={24} />
        <span class="pbtip">
          <b>Download</b>
          <br />
          ...as .puz file
        </span>
      </a>
      <SymmetryToggle symmetry={puzzle.symmetry} toggleSymmetry={puzzle.toggleSymmetry} />
    </div>
  );
};

module.exports = PuzzleMenu;
