const React = require("react");
const { measureMyInputText } = require("../../utils/style");

const PuzzleTitle = ({ width, title, author, setTitle, setAuthor }) => {
  
  const handleChange = (e, setFunc) => {
    e.preventDefault();
    setFunc(e.target.value);
  }

  return (
    <div style={{'margin-right':  (width > (measureMyInputText(author) + measureMyInputText(title) + 220) ? ('calc(100% - ' + (measureMyInputText(author) + measureMyInputText(title) + 220) + 'px)') : '0px')}}>
      <div class="puzzle-info" id="puzzle-info">
        <input id="title" class="inline-content-editable" style={{ width: measureMyInputText(title) + 'px' }} value={title} type="text" onChange={(e) => handleChange(e, setTitle)} />
        <span>by </span>
        <input id="author" class="inline-content-editable" style={{ width: measureMyInputText(author) + 'px' }} value={author} type="text" onChange={(e) => handleChange(e, setAuthor)} />
      </div>
    </div>
  );
}

module.exports = PuzzleTitle;