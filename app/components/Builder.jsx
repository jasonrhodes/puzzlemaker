const React = require("react");
const { Link } = require("react-router-dom");
const Puzzle = require("./Puzzle");
const { DesktopDownloadIcon, PencilIcon, UnlockIcon, HomeIcon } = require("@primer/octicons-react");
const { initGrid } = require("./utils");

const Builder = function({ location }) {
  const { rows, columns } = location.state || {};
  const grid = initGrid({ rows: rows || 15, columns: columns || 15 });
  
  
  return (
    <div class="container">
      <h1 class="title">Puzzlemaker</h1>
      <div class="menu">
        <Link to="/"><HomeIcon size={24} /></Link>
        <DesktopDownloadIcon size={24} />
        <PencilIcon size={24} />
        <UnlockIcon size={24} />
      </div>
      <div class="puzzle-info">[Title] by [Author]</div>
      <Puzzle initialGrid={grid} />
    </div>
  );
};

module.exports = Builder;
