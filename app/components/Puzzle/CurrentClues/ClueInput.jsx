const React = require("react");
const { measureMyInputText } = require("../../../utils/style");
const { PuzzleContext } = require("../Context");

module.exports = function ClueInput({ direction, number }) {
  return (
    <PuzzleContext.Consumer>
      {({ clues, setClue }) => {
        const value = clues[direction][number];
        const handleChange = (e) => setClue(number, direction, e.target.value);
        return (
          <input
            class="inline-content-editable"
            onClick={e => e.stopPropagation()}
            onChange={handleChange}
            style={{ width: measureMyInputText(value) + "px" }}
            value={value}
            type="text"
          />
        );
      }}
    </PuzzleContext.Consumer>
  );
}