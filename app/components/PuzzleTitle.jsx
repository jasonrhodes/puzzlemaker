const React = require("react");
const { measureMyInputText } = require("./utils");

const PuzzleTitle = ({ width }) => {
  const [title, setTitle] = React.useState("Untitled");
  const [author, setAuthor] = React.useState("Author");
  const [authorWidth, setAuthorWidth] = React.useState(60);
  const [titleWidth, setTitleWidth] = React.useState(75);
  
  //setWidth(measureMyInputText("puzzle-info"))
  
  const handleTitleChange = e => {
    e.preventDefault();
    let width = measureMyInputText(e.target.id);
    e.target.style.width = width + 'px';
    setTitle(e.target.value);
    setTitleWidth(width);
  }
  const handleAuthorChange = e => {
    e.preventDefault();
    let width = measureMyInputText(e.target.id);
    e.target.style.width = width + 'px';
    setAuthor(e.target.value);
    setAuthorWidth(width);
  }
  return (
    <div>
      <div class="puzzle-info" id="puzzle-info">
        <input id="title" class="inline-content-editable" style={{ width: '66px' }} value={title} type="text" onChange={handleTitleChange} />
        <span>by </span>
        <input id="author" class="inline-content-editable" style={{ width: '57px' }} value={author} type="text" onChange={handleAuthorChange} />
      </div>
      {authorWidth + titleWidth > width - 200 ? <div><br/><br/></div> : null}
    </div>
  );
}

module.exports = PuzzleTitle;