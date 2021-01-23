const React = require("react");
const { Link } = require("react-router-dom");

const CreateLink = ({ rows, columns }) => {
  if (rows === 0 || columns === 0) {
    return null;
  }
  return (
    <Link to={{ pathname: "/edit", state: { rows, columns }}}>Create {rows} x {columns} puzzle</Link>
  );
}

module.exports = () => {
  const [gridSize, setGridSize] = React.useState(false);
  const handleChange = e => {
    setGridSize(e.target.value);
  }
  const [rows = 0, columns = 0] = gridSize ? gridSize.split(" x ") : [];
  return (
    <React.Fragment>
      <h1 class="title">Puzzlemaker</h1>
      <h2>Create a New Puzzle</h2>

      <select onChange={handleChange}>
        <option disabled={true}>-- Choose a grid size --</option>
        <option value="10 x 10">10 x 10</option>
        <option value="11 x 11">11 x 11</option>
        <option value="12 x 12">12 x 12</option>
        <option value="13 x 13">13 x 13</option>
        <option value="14 x 14">14 x 14</option>
        <option value="15 x 15">15 x 15 (standard NYT, Mon-Sat)</option>
        <option value="21 x 21">21 x 21 (standard NYT, Sun)</option>
      </select>
      <div>{gridSize ? <CreateLink rows={rows} columns={columns} /> : null}</div>
    </React.Fragment>
  )
}