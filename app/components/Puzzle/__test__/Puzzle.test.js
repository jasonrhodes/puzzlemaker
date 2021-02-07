const React = require("react");
require("@testing-library/jest-dom/extend-expect");
const { render, screen } = require("@testing-library/react");
const userEvent = require("@testing-library/user-event").default;
const Puzzle = require("../");
const { PuzzleContextProvider } = require("../Context");
const initGrid = require("../../../utils/initGrid");
const { MemoryRouter } = require("react-router-dom");

const Passthrough = ({ children }) => children;

jest.mock("@react-pdf/renderer", () => ({
  PDFDownloadLink: Passthrough,
  Document: Passthrough,
  Page: Passthrough,
  Text: Passthrough,
  View: Passthrough,
  StyleSheet: {
    create: (s) => s,
  },
}));

const WrappedPuzzle = ({ rows = 15, columns = 15 }) => (
  <MemoryRouter>
    <PuzzleContextProvider initialGrid={initGrid({ rows, columns })}>
      <Puzzle />
    </PuzzleContextProvider>
  </MemoryRouter>
);

test("Can we load the Puzzle?", () => {
  render(<WrappedPuzzle />);
});
