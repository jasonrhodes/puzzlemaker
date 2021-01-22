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

const Builder = function() {
  const [grid, setGrid] = React.useState(initGrid({ size: 15, blocks: DEFAULT_BLOCKS }));
  const [editMode, setEditMode] = React.useState(false);
  
  const toggleEdit = e => {
    console.log(editMode)
    if (!editMode){
      editMode = true;
    }
  }
  
  return (
    <div>
      <h1>p u z z l e m a k e r</h1>
      <p>[Title] by [Author]</p>
      <button onClick={toggleEdit}>Edit Mode</button>
      <Puzzle grid={grid} setGrid={setGrid} mode={editMode}/>
    </div>
  );
};

module.exports = Builder;
