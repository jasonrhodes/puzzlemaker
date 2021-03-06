const React = require("react");
const { measureMyInputText } = require("../../../utils/style");
const { PuzzleContext } = require("../Context");

module.exports = function ClueInput({ direction, number, jumpToClue }) {
  return (
    <PuzzleContext.Consumer>
      {({ clues, setClue }) => {
        const value = clues[direction][number];
        const handleChange = (e) => setClue(number, direction, e.target.value);
        return (
          <input
            className="inline-content-editable"
            onFocus={(e) =>
              typeof jumpToClue === "function"
                ? jumpToClue(e, number, direction)
                : ""
            }
            onChange={handleChange}
            style={{
              width:
                (value && value.length > 15
                  ? measureMyInputText(value)
                  : measureMyInputText("(Enter clue here)")) + "px",
            }}
            value={value}
            type="text"
            placeholder="(Enter clue here)"
          />
        );
      }}
    </PuzzleContext.Consumer>
  );
};
