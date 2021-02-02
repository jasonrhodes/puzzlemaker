const React = require("react");

const ClueList = ({
  clues
}) => {
  return (
    <div class="cluedata">
      <h4>Across</h4>
      {Object.keys(clues.across).map(key => (
        <div class="listclue">
          <b>{key}</b> {clues.across[key]}
        </div>
      ))}
      <br/>
      <h4>Down</h4>
      {Object.keys(clues.down).map(key => (
        <div class="listclue">
          <b>{key}</b> {clues.down[key]}
        </div>
      ))}
    </div>
  );
};

module.exports = ClueList;
