const React = require("react");
const { measureMyInputText } = require("./utils");

const PuzzleTitle = ({ width, title, author, setTitle, setAuthor }) => {
  const [authorWidth, setAuthorWidth] = React.useState(60);
  const [titleWidth, setTitleWidth] = React.useState(75);
  
  const handleChange = (e, setFunc, setWidthFunc) => {
    e.preventDefault();
    let fieldWidth = measureMyInputText(e.target.id);
    e.target.style.width = fieldWidth + 'px';
    setFunc(e.target.value);
    setWidthFunc(fieldWidth < 40 ? 40 : fieldWidth);
  }

  return (
    <div>
      <div class="puzzle-info" id="puzzle-info">
        <input id="title" class="inline-content-editable"  value={title} type="text" onChange={(e) => handleChange(e, setTitle, setTitleWidth)} />
        <span>by </span>
        <input id="author" class="inline-content-editable" value={author} type="text" onChange={(e) => handleChange(e, setAuthor, setAuthorWidth)} />
      </div>
      {authorWidth + titleWidth > width - 210 ? <div><br/><br/></div> : null}
    </div>
  );
}

module.exports = PuzzleTitle;