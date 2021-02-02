const React = require("react");

const ClueList = ({
  clues
}) => {
  return (
    <div class="cluedata">
      <h4>Across</h4>
      {clues.across.map((x, i) => (
        <div class="listclue">
          {x} {i} 
        </div>
      ))}
    </div>
  );
};

module.exports = ClueList;
