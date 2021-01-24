const React = require("react");
const { Link } = require("react-router-dom");
const Puzzle = require("./Puzzle");
const Menu = require("./Menu");

const { initGrid } = require("./utils");

const Builder = function({ location }) {
  const { rows, columns } = location.state || {};
  const grid = initGrid({ rows: rows || 15, columns: columns || 15 });
  
  
  return (
    <div class="container">
      <h1 class="title">Puzzle<span class="accent-text">Maker</span></h1>
      <Menu />
      <Puzzle initialGrid={grid} />
    </div>
  );
};

module.exports = Builder;
