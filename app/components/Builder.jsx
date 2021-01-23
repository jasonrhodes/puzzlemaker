const React = require("react");
const Puzzle = require("./Puzzle");
const { initGrid } = require("./utils");
const DEFAULT_BLOCKS = [
  [0, 4], // should trigger 14, 10 (if size is 15) -- for rotational symmetry
  [1, 4],
  [2, 4],
  [3, 4],
  [0, 10],
  [1, 10],
  [2, 10],
  [6, 0],
  [6, 1],
  [6, 2],
  [6, 3]
];

const Builder = function({ location }) {
  let size = 15;
  if (location.state && location.state.gridSize) {
    const [rows, columns] = location.state.gridSize.split(" x ");
    size = rows;
  }
  const grid = initGrid({ size });
  
  const { DesktopDownloadIcon } = require("@primer/octicons-react");
  const { PencilIcon } = require("@primer/octicons-react");
  const { UnlockIcon } = require("@primer/octicons-react");
  return (
    <div class="container">
      <h1 class="title">Puzzlemaker</h1>
      <div class="menu"><DesktopDownloadIcon size={24} /> <PencilIcon size={24} /> <UnlockIcon size={24} /></div>
      <div class="puzzle-info">[Title] by [Author]</div>
      <Puzzle initialGrid={grid} />
    </div>
  );
};

module.exports = Builder;
