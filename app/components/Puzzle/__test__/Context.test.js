const React = require("react");
require("@testing-library/jest-dom/extend-expect");
const { render, screen } = require("@testing-library/react");
const userEvent = require("@testing-library/user-event").default;
const { PuzzleContextProvider, PuzzleContext } = require("../Context");
const initGrid = require("../../../utils/initGrid");
const initialGrid = initGrid({ rows: 15, columns: 15 });

const Wrapper = ({ children }) => (
  <PuzzleContextProvider initialGrid={initialGrid}>
    {children}
  </PuzzleContextProvider>
);

describe("setting the active cell", () => {
  const ActiveCell = ({ row, column }) => {
    const puzzle = React.useContext(PuzzleContext);
    const handleClick = () => {
      puzzle.setActiveCell([row, column]);
    };
    return (
      <React.Fragment>
        <h1 data-testid="active-cell">{puzzle.activeCell.toString()}</h1>
        <button data-testid="change" onClick={handleClick}>
          Change Active Cell
        </button>
      </React.Fragment>
    );
  };

  test("changing the active cell to a valid coordinate set", () => {
    render(
      <Wrapper>
        <ActiveCell row={12} column={5} />
      </Wrapper>
    );
    expect(screen.getByTestId("active-cell")).toHaveTextContent("");
    userEvent.click(screen.getByTestId("change"));
    expect(screen.getByTestId("active-cell")).toHaveTextContent("12,5");
  });
});
