const React = require("react");
const { measureMyInputText } = require("./utils");

const PuzzleTitle = ({ width }) => {
  const [title, setTitle] = React.useState("Untitled");
  const [author, setAuthor] = React.useState("Author");
  const [authorWidth, setAuthorWidth] = React.useState(60);
  const [titleWidth, setTitleWidth] = React.useState(75);
  
  const handleChange = (e, setFunc, setWidthFunc) => {
    e.preventDefault();
    let fieldWidth = measureMyInputText(e.target.id);
    e.target.style.width = fieldWidth + 'px';
    setFunc(e.target.value);
    setWidthFunc(fieldWidth < 40 ? 40 : fieldWidth);
  }
  const handleAuthorChange = e => {
    e.preventDefault();
    let fieldWidth = measureMyInputText(e.target.id);
    e.target.style.width = fieldWidth + 'px';
    setAuthor(e.target.value);
    setAuthorWidth(fieldWidth < 40 ? 40 : fieldWidth);
  }
  return (
    <div>
      <div class="puzzle-info" id="puzzle-info">
        <input id="title" class="inline-content-editable" style={{ width: '66px' }} value={title} type="text" onChange={(e) => handleChange(e, setTitle, setTitleWidth)} />
        <span>by </span>
        <input id="author" class="inline-content-editable" style={{ width: '57px' }} value={author} type="text" onChange={(e) => handleChange(e, setAuthor, setAuthorWidth)} />
      </div>
      {authorWidth + titleWidth > width - 200 ? <div><br/><br/></div> : null}
    </div>
  );
}

module.exports = PuzzleTitle;