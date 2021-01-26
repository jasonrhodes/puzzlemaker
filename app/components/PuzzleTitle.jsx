const React = require("react");
const { measureMyInputText } = require("./utils");

const PuzzleTitle = () => {
  const [title, setTitle] = React.useState("Untitled");
  const [author, setAuthor] = React.useState("Author");
  const [width, setWidth] = React.useState(160);
  
  setWidth(measureMyInputText("puzzle-info"))
  
  const handleTitleChange = e => {
    e.preventDefault();
    e.target.style.width = measureMyInputText(e.target.id) + 'px';
    setTitle(e.target.value);
  }
  const handleAuthorChange = e => {
    e.preventDefault();
    let AuthorWidth = measureMyInputText(e.target.id);
    e.target.style.width = AuthorWidth + 'px';
    setAuthor(e.target.value);
    setWidth(width + AuthorWidth - 60);
  }
  return (
    <div>
      <div class="puzzle-info" id="puzzle-info">
        <input id="title" class="inline-content-editable" style={{ width: '66px' }} value={title} type="text" onChange={handleTitleChange} />
        <span>by </span>
        <input id="author" class="inline-content-editable" style={{ width: '57px' }} value={author} type="text" onChange={handleAuthorChange} />
      </div>
      {width > 200 ? <br/> : null}{width}
    </div>
  );
}

module.exports = PuzzleTitle;