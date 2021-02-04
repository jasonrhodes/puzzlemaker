const React = require("react");
const OneLookLink = require("./OneLookLink");
const { EyeIcon, TriangleLeftIcon, TriangleRightIcon } = require("@primer/octicons-react");
const ClueInput = require("./ClueInput");

const Current = ({ clueNumber, word, filterWord, showNonCrosses, direction }) => {
  return (
    <React.Fragment>
      <div class="inline" onClick={e => e.stopPropagation()}>
        <h3>{clueNumber}{direction == 'across' ? 'a' : 'd'}: </h3>
        <ClueInput direction={direction} number={clueNumber} />
      </div>
      <div class="current" onClick={e => e.stopPropagation()}>
        {word.toUpperCase()}
        <OneLookLink word={word} />
        {filterWord ? (
          <a onClick={e => showNonCrosses(e, "across")}>
            <EyeIcon size={20} />
            <span class="pbtip">
              <b>Unfilter Across crosses</b>
            </span>
          </a>
        ) : null}
      </div>
    </React.Fragment>
  );
}

module.exports = Current;