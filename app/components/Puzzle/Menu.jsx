const React = require("react");
const { Link } = require("react-router-dom");
const { convertPuzzleToJSON, PuzWriter } = require("../../utils/export");
const PDFLink = require("../PDF/Link");

const { MirrorIcon } = require("@primer/octicons-react");

const { Play, Printer, Download, Lock, Unlock } = require("react-feather");

const SymmetryToggle = ({ symmetry, toggleSymmetry }) => {
  const toggleLock = (e) => {
    toggleSymmetry();
    e.stopPropagation();
  };

  if (symmetry) {
    return (
      <a className="subicon" onClick={toggleLock}>
        <Lock size={18} />
        <MirrorIcon size={10} />
        <span className="pbtip">
          <b>Unlock symmetry</b>
        </span>
      </a>
    );
  } else {
    return (
      <a className="subicon" onClick={toggleLock}>
        <Unlock size={18} />
        <MirrorIcon size={10} />
        <span className="pbtip">
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
    let filename = puzzle.title ? puzzle.title + ".puz" : "myPuz.puz";
    let serialized = convertPuzzleToJSON(puzzle);
    let fileContents = new PuzWriter().toPuz(serialized);
    let file = new Blob([fileContents], { type: "application/octet-stream" });

    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="menu">
      <Link to={{ pathname: "/play/" + puzzle.savedPuzzleId }}>
        <Play size={18} />
        <span className="pbtip stip">
          <b>Play</b>
        </span>
      </Link>
      <PDFLink puzzle={puzzle}>
        <Printer size={18} />
        <span className="pbtip stip">
          <b>PDF</b>
        </span>
      </PDFLink>
      <a onClick={downloadFile}>
        <Download size={18} />
        <span className="pbtip">
          <b>Download</b>
          <br />
          ...as .puz file
        </span>
      </a>
      <SymmetryToggle
        symmetry={puzzle.symmetry}
        toggleSymmetry={puzzle.toggleSymmetry}
      />
    </div>
  );
};

module.exports = PuzzleMenu;
