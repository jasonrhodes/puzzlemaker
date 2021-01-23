const React = require("react");
const { Link } = require("react-router");

module.exports = () => {
  const [gridSize, setGridSize] = React.useState(false);
  const handleChange = e => {
    console.log("change", e);
    setGridSize(e.target.value);
  }
  return (
    <React.Fragment>
      <h1>p u z z l e b u i l d e r</h1>
      <h2>Create a New Puzzle</h2>

      <select onChange={handleChange}>
        <option>-- Choose a grid size --</option>
        <option value="10 x 10">10 x 10</option>
        <option value="11 x 11">11 x 11</option>
        <option value="12 x 12">12 x 12</option>
        <option value="13 x 13">13 x 13</option>
        <option value="14 x 14">14 x 14</option>
        <option value="15 x 15">15 x 15 (standard NYT, Mon-Sat)</option>
        <option value="21 x 21">21 x 21 (standard NYT, Sun)</option>
      </select>
      <div>{!gridSize ? <p>Create Puzzle</p> : <Link href="/edit">Create {gridSize} Puzzle</a>}</div>
    </React.Fragment>
  )
}