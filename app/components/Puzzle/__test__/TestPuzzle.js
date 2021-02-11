/* eslint-disable jest/no-standalone-expect */
const React = require("react");
const { render } = require("@testing-library/react");
const userEvent = require("@testing-library/user-event").default;
const PuzzleComponent = require("..");
const { PuzzleContextProvider } = require("../Context");
const initGrid = require("../../../utils/initGrid");
const { MemoryRouter } = require("react-router-dom");

const WrappedPuzzle = ({ rows = 15, columns = 15 }) => (
  <MemoryRouter>
    <PuzzleContextProvider initialGrid={initGrid({ rows, columns })}>
      <PuzzleComponent />
    </PuzzleContextProvider>
  </MemoryRouter>
);

module.exports = class TestPuzzle {
  constructor({ rows = 15, columns = 15 } = {}) {
    this.rows = rows;
    this.columns = columns;
    this.container = render(
      <WrappedPuzzle rows={rows} columns={columns} />
    ).container;
  }

  lastRow() {
    return this.rows - 1;
  }

  lastCol() {
    return this.columns - 1;
  }

  activeCell() {
    return getActiveCell({ container: this.container });
  }

  getCell(row, column) {
    return getPuzzleCell({ container: this.container, row, column });
  }

  clickCell(row, column) {
    return userEvent.click(this.getCell(row, column));
  }

  expectNoActiveCell() {
    return expect(this.activeCell()).toBe(false);
  }

  expectActiveCellToBe(row, column) {
    return expect(this.activeCell().outerHTML).toEqual(
      this.getCell(row, column).outerHTML
    );
  }

  type(value) {
    return userEvent.type(this.activeCell(), value);
  }
};

function getPuzzleCell({ container, row, column }) {
  const rows = container.querySelectorAll(".puzzle-row");
  if (!rows[row]) {
    throw new Error(`Invalid row ${row}, not found`);
  }
  const cells = rows[row].querySelectorAll(".puzzle-cell");
  if (!cells[column]) {
    throw new Error(`Invalid column ${column}, not found`);
  }
  return cells[column];
}

function getActiveCell({ container }) {
  try {
    const active = container.querySelector(".puzzle-cell.active");
    if (!active) {
      throw new Error("No active element returned");
    }
    return active;
  } catch (err) {
    return false;
  }
}
