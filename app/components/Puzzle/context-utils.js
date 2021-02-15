module.exports = {
  isValidTuple,
  updateFilter,
};

function isValidTuple(range, type0, type1 = type0) {
  return (
    Array.isArray(range) &&
    range.length === 2 &&
    typeof range[0] === type0 &&
    typeof range[1] === type1
  );
}

function updateFilter({ filter, setFilter, wordRange, activeIndex }) {
  if (!isValidTuple(filter, "string")) {
    return;
  }
  const [filterString, currentLetter] = filter;
  const [wordStart] = wordRange;
  const newLetter = filterString[activeIndex - wordStart];
  if (newLetter === currentLetter) {
    return;
  }
  setFilter([filterString, newLetter]);
}
