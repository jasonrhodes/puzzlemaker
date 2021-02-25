const React = require("react");
const { measureMyInputText } = require("../../utils/style");

const PuzzleNotes = ({ notes, copyright, setNotes, setCopyright }) => {
  const handleChange = (e, setFunc) => {
    e.preventDefault();
    setFunc(e.target.value);
  };

  return (
    <div className="infoblock">
      <div className="puzzle-info" id="puzzle-info">
        <span>Notes: </span>
        <input
          id="notes"
          placeholder="(optional, e.g. to give a hint about the puzzle's theme)"
          className="inline-content-editable"
          style={{
            width:
              (notes.length
                ? measureMyInputText(notes)
                : measureMyInputText(
                    "(optional, e.g. to give a hint about the puzzle's theme)"
                  )) + "px",
          }}
          value={notes}
          type="text"
          onChange={(e) => handleChange(e, setNotes)}
        />
        <br />
        <br />
        <span>&#169;: </span>
        <input
          id="copyright"
          placeholder="(optional)"
          className="inline-content-editable"
          style={{
            width:
              (copyright.length
                ? measureMyInputText(copyright)
                : measureMyInputText("(optional)")) + "px",
          }}
          value={copyright}
          type="text"
          onChange={(e) => handleChange(e, setCopyright)}
        />
      </div>
    </div>
  );
};

module.exports = PuzzleNotes;
