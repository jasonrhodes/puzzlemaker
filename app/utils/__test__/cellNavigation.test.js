const {
  getNextAcrossCellCoords,
  getNextAcrossClueStart,
  getPrevAcrossCellCoords,
  getPrevAcrossClueStart,
} = require("../cellNavigation");

const gridMock = require("./gridMock");

describe("get next across coords", () => {
  test("basic next cell", () => {
    expect(getNextAcrossCellCoords(0, 3, gridMock)).toEqual([0, 4]);
  });
  test("wrap around to the first cell in the next row", () => {
    expect(getNextAcrossCellCoords(0, 6, gridMock)).toEqual([1, 0]);
  });
  test("wrap back to the beginning", () => {
    expect(getNextAcrossCellCoords(6, 6, gridMock)).toEqual([0, 0]);
  });
});

describe("get next across clue start", () => {
  test("skipping a black square", () => {
    expect(getNextAcrossClueStart(0, 2, gridMock)).toEqual([0, 4]);
  });
  test("starting on a black square", () => {
    expect(getNextAcrossClueStart(0, 3, gridMock)).toEqual([0, 4]);
  });
  test("wrapping to the next row", () => {
    expect(getNextAcrossClueStart(0, 4, gridMock)).toEqual([1, 1]);
  });
  test("wrapping to the next row with a starting black square", () => {
    expect(getNextAcrossClueStart(2, 0, gridMock)).toEqual([4, 0]);
  });
  test("wrapping back to the start", () => {
    expect(getNextAcrossClueStart(6, 4, gridMock)).toEqual([0, 0]);
  });
});

describe("get previous across cell coordinates", () => {
  test("basic coordinates", () => {
    expect(getPrevAcrossCellCoords(0, 4, gridMock)).toEqual([0, 3]);
  });
  test("wrap back to the last cell in the previous row", () => {
    expect(getPrevAcrossCellCoords(1, 0, gridMock)).toEqual([0, 6]);
  });
  test("wrap around to the end", () => {
    expect(getPrevAcrossCellCoords(0, 0, gridMock)).toEqual([6, 6]);
  });
});

describe("get prev across clue start", () => {
  test("skipping a black square", () => {
    expect(getPrevAcrossClueStart(0, 5, gridMock)).toEqual([0, 0]);
  });
  test("starting on a black square", () => {
    expect(getPrevAcrossClueStart(0, 3, gridMock)).toEqual([0, 0]);
  });
  test("wrapping across rows", () => {
    expect(getPrevAcrossClueStart(4, 5, gridMock)).toEqual([2, 0]);
  });
  test("wrapping to the previous row with a trailing black square", () => {
    expect(getPrevAcrossClueStart(6, 1, gridMock)).toEqual([5, 4]);
  });
  // TODO: Need to fix this test
  test("wrapping back to the end", () => {
    expect(getPrevAcrossClueStart(0, 1, gridMock)).toEqual([6, 4]);
  });
});
