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
  
  const loadWidth = () => {
    console.log(this);
    let fieldWidth = measureMyInputText(this.id);
    console.log(fieldWidth);
    this.style.width = fieldWidth + 'px';
  }

  return (
    <div>
      <div class="puzzle-info" id="puzzle-info">
        <input id="title" class="inline-content-editable"  value={title} type="text" onload={loadWidt} onChange={(e) => handleChange(e, setTitle, setTitleWidth)} />
        <span>by </span>
        <input id="author" class="inline-content-editable" value={author} type="text" onload={(e) => handleChange(e)} onChange={(e) => handleChange(e, setAuthor, setAuthorWidth)} />
      </div>
      {authorWidth + titleWidth > width - 210 ? <div><br/><br/></div> : null}
    </div>
  );
}

module.exports = PuzzleTitle;