const React = require("react");
const { Link } = require("react-router-dom");
const datamuse = require('datamuse');
 


const CreateLink = ({ rows, columns }) => {
  if (!rows || !columns) {
    return null;
  }
  return (
    <Link class="btn" to={{ pathname: "/edit", state: { rows, columns }}}>Create {rows} x {columns} puzzle</Link>
  );
}

module.exports = () => {
  const [gridSize, setGridSize] = React.useState(false);
  const handleChange = e => {
    setGridSize(e.target.value);
  }
  
  console.log('a');
  /*datamuse.request('words?ml=ringing in the ears')
.then((json) => {
  console.log(json);
  //do it!
});*/
  
  const [rows, columns] = (gridSize ? gridSize.split(" x ") : []);
  return (
    <React.Fragment>
      <h1 class="title">Puzzle<span class="accent-text">maker</span></h1>
      <h2>Create a New Puzzle</h2>
      <div class="inline">
        <select onChange={handleChange}>
          <option disabled={true} selected={true}>-- Choose a grid size --</option>
          <option value="15 x 15">15 x 15 (standard NYT, Mon-Sat)</option>
          <option value="21 x 21">21 x 21 (standard NYT, Sun)</option>
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
        <div>{gridSize ? <CreateLink rows={rows} columns={columns} /> : null}</div>
      </div>
    </React.Fragment>
  )
}