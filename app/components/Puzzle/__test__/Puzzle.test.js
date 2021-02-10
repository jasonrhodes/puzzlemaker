const React = require("react");
require("@testing-library/jest-dom/extend-expect");
const { render, screen } = require("@testing-library/react");
const userEvent = require("@testing-library/user-event").default;
const Puzzle = require("../");
const { PuzzleContextProvider } = require("../Context");
const initGrid = require("../../../utils/initGrid");
const { MemoryRouter } = require("react-router-dom");

const Passthrough = ({ children }) => children;

// jest.mock("@react-pdf/renderer", () => ({
//   PDFDownloadLink: Passthrough,
//   Document: Passthrough,
//   Page: Passthrough,
//   Text: Passthrough,
//   View: Passthrough,
//   StyleSheet: {
//     create: (s) => s,
//   },
// }));

const WrappedPuzzle = ({ rows = 15, columns = 15 }) => (
  <MemoryRouter>
    <PuzzleContextProvider initialGrid={initGrid({ rows, columns })}>
      <Puzzle />
    </PuzzleContextProvider>
  </MemoryRouter>
);

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
    throw new Error(`No active cell found, ${err.message}`);
  }
}

test("Can we load the Puzzle without any errors", () => {
  render(<WrappedPuzzle />);
});

test("Clicking on a cell to make it active", () => {
  const { container } = render(<WrappedPuzzle />);
  expect(() => getActiveCell({ container })).toThrow();

  const firstCell = getPuzzleCell({ container, row: 0, column: 0 });
  userEvent.click(firstCell);
  const active = getActiveCell({ container });
  expect(active).toEqual(firstCell);

  const anotherCell = getPuzzleCell({ container, row: 8, column: 11 });
  userEvent.click(anotherCell);
  const active2 = getActiveCell({ container });
  expect(anotherCell).not.toEqual(firstCell);
  expect(active2).not.toEqual(firstCell);
  expect(active2).toEqual(anotherCell);
});
