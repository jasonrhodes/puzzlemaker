const React = require("react");
const { render } = require("@testing-library/react");
const { PuzzleContextProvider, PuzzleContext } = require("../Context");
const initGrid = require("../../../utils/initGrid");

const initialGrid = initGrid({ rows: 15, columns: 15 });
test("does this work", () => {
  const result = render(
    <PuzzleContextProvider initialGrid={initialGrid}>
      <PuzzleContext.Consumer>
        {(puzzle) => {
          <h1>puzzle.title</h1>;
        }}
      </PuzzleContext.Consumer>
    </PuzzleContextProvider>
  );
});
