const React = require("react");
const { measureMyInputText } = require("./utils");

const PuzzleTitle = () => {
  const [title, setTitle] = React.useState("Untitled");
  const [author, setAuthor] = React.useState("Author");
  const handleTitleChange = e => {
    e.preventDefault();
    e.target.style.width = measureMyInputText(e.target.id) + 'px';
    setTitle(e.target.value);
  }
  const handleAuthorChange = e => {
    e.preventDefault();
    e.target.style.width = measureMyInputText(e.target.id) + 'px';
    setAuthor(e.target.value);
  }
  return (
    <div class="puzzle-info">
      <input id="title" class="inline-content-editable" style={{ width: '6ch' }} value={title} type="text" onChange={handleTitleChange} />
      <span> by </span>
      <input id="author" class="inline-content-editable" style={{ width: '57px' }} value={author} type="text" onChange={handleAuthorChange} />
    </div>
  );
}

module.exports = PuzzleTitle;