const React = require("react");
// require("@testing-library/jest-dom/extend-expect");
const TestPuzzle = require("./TestPuzzle");

test("Can we load the Puzzle without any errors", () => {
  new TestPuzzle();
});

test("Clicking on a cell to make it active", () => {
  const puzzle = new TestPuzzle();
  puzzle.expectNoActiveCell();

  puzzle.clickCell(0, 0);
  puzzle.expectActiveCellToBe(0, 0);

  puzzle.clickCell(8, 11);
  puzzle.expectActiveCellToBe(8, 11);
});

describe("Navigating cells by arrow keys", () => {
  let puzzle;

  beforeEach(() => {
    puzzle = new TestPuzzle();
  });

  test("right and left arrows move between columns", () => {
    puzzle.clickCell(0, 0);
    puzzle.expectActiveCellToBe(0, 0);
    puzzle.type("{arrowright}");
    puzzle.expectActiveCellToBe(0, 1);
    puzzle.type("{arrowleft}");
    puzzle.expectActiveCellToBe(0, 0);
  });

  test("left arrow from 0,0 wraps to bottom right cell", () => {
    puzzle.clickCell(0, 0);
    puzzle.expectActiveCellToBe(0, 0);
    puzzle.type("{arrowleft}");
    puzzle.expectActiveCellToBe(puzzle.lastRow(), puzzle.lastCol());
  });

  test("right arrow from last,last wraps to 0,0", () => {
    puzzle.clickCell(puzzle.lastRow(), puzzle.lastCol());
    puzzle.type("{arrowright}");
    puzzle.expectActiveCellToBe(0, 0);
  });

  test("wrapping around to next and previous rows", () => {
    puzzle.clickCell(5, 1);
    puzzle.type("{arrowleft}{arrowleft}{arrowleft}");
    puzzle.expectActiveCellToBe(4, puzzle.lastCol() - 1);
    puzzle.type("{arrowright}{arrowright}{arrowright}{arrowright}");
    puzzle.expectActiveCellToBe(5, 2);
  });

  test("up and down arrows move between rows", () => {
    puzzle.clickCell(6, 8);
    puzzle.type("{arrowdown}");
    puzzle.expectActiveCellToBe(7, 8);
    puzzle.type("{arrowup}");
    puzzle.expectActiveCellToBe(6, 8);
  });

  test("up arrow from 0,0 wraps to bottom right", () => {
    puzzle.clickCell(0, 0);
    puzzle.type("{arrowup}");
    puzzle.expectActiveCellToBe(puzzle.lastRow(), puzzle.lastCol());
  });

  test("down arrow from last,last wraps to 0,0", () => {
    puzzle.clickCell(puzzle.lastRow(), puzzle.lastCol());
    puzzle.type("{arrowdown}");
    puzzle.expectActiveCellToBe(0, 0);
  });
});

test("Navigating across clues by tab and shift tab", () => {
  // TODO
});
