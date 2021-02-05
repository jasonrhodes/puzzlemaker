module.exports = function initGrid({ rows, columns }) {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < columns; j++) {
      row.push({
        value: "",
        isBlackSquare: false,
        isRebus: false,
        rowIndex: i,
        columnIndex: j,
        clue: {},
        style: null,
      });
    }
    grid.push(row);
  }
  return grid;
};
