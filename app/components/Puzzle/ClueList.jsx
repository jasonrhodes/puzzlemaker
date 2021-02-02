const React = require("react");

const ClueList = ({
  clues
}) => {
  return (
    <div class="cluedata">
      <b>Across</b>
      {Object.keys(clues.across).map(key => (
        <div class="listclue">
          <b>{key}</b> {clues.across[key]}
        </div>
      ))}
      <br/>
      <b>Down</b>
      {Object.keys(clues.down).map(key => (
        <div class="listclue">
          <b>{key}</b> {clues.down[key]}
        </div>
      ))}
    </div>
  );
};

module.exports = ClueList;
