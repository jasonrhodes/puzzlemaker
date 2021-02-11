const React = require("react");
const { Link } = require("react-router-dom");
const { v4: uuidv4 } = require("uuid");
const SavedPuzzleList = require("./SavedPuzzleList");

const CreateLink = ({ rows, columns }) => {
  const [id] = React.useState(uuidv4());
  if (!rows || !columns) {
    return null;
  }
  return (
    <Link className="btn" to={{ pathname: "/edit/" + id, state: { rows, columns }}}>Create {rows} x {columns} puzzle</Link>
  );
}

module.exports = () => {
  const [gridSize, setGridSize] = React.useState(false);
  const handleChange = e => {
    setGridSize(e.target.value);
  }

  const [rows, columns] = (gridSize ? gridSize.split(" x ") : []);
  return (
    <React.Fragment>
      <h1 className="title">Puzzle<span className="accent-text">maker</span></h1>
      <h3>Create a New Puzzle</h3>
      <div className="inline">
        <select onChange={handleChange} defaultValue="">
          <option disabled={true} value="">-- Choose a grid size --</option>
          <option value="15 x 15">15 x 15 (standard NYT, Mon-Sat)</option>
          <option value="21 x 21">21 x 21 (standard NYT, Sun)</option>
          <option value="5 x 5">5 x 5 (standard NYT Mini, Mon-Fri)</option>
          <option value="7 x 7">7 x 7 (standard NYT Mini, Sat-Sun)</option>
          <option value="8 x 8">8 x 8</option>
          <option value="9 x 9">9 x 9</option>
          <option value="10 x 10">10 x 10</option>
          <option value="11 x 11">11 x 11</option>
          <option value="12 x 12">12 x 12</option>
          <option value="13 x 13">13 x 13</option>
          <option value="14 x 14">14 x 14</option>
          <option value="16 x 16">16 x 16</option>
          <option value="17 x 17">17 x 17</option>
          <option value="18 x 18">18 x 18</option>
          <option value="19 x 19">19 x 19</option>
          <option value="20 x 20">20 x 20</option>
        </select>
        <div style={{'marginTop': '10px'}}>{gridSize ? <CreateLink rows={rows} columns={columns} /> : null}</div>
      </div>
      <br/>
      <div>
        <h3>Load a Saved Puzzle</h3>
        <SavedPuzzleList />
      </div>
    </React.Fragment>
  );
};
