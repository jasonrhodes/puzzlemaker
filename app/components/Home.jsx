const React = require("react");

module.exports = () => {
  const [gridSize, setGridSize] = React.useState(false);
  const handleChange = e => {
    console.log("change", e);
    setGridSize(e.target.value);
  }
  return (
    <React.Fragment>
      <h1>p u z z l e b u i l d e r</h1>
      <label>Choose a grid size:
        <select onChange={handleChange}>
          <option value="5,5">5 x 5</option>
          <option value="6,6">6 x 6</option>
          <option value="7,7">7 x 7</option>
          <option value="8,8">8 x 8</option>
          <option value="9,9">9 x 9</option>
          <option value="10,10">10 x 10</option>
          <option value="11,11">11 x 11</option>
          <option value="12,12">12 x 12</option>
          <option value="13,13">13 x 13</option>
          <option value="14,14">14 x 14</option>
          <option value="15,15" selected>15 x 15</option>
        </select>
      </label>
      <div>{!!gridSize ? <p>Create Puzzle</p> : <a href="/edit">Create Puzzle</a>}</div>
    </React.Fragment>
  )
}