const React = require("react");
const OneLookLink = require("./OneLookLink");
const { Filter } = require("react-feather");
const ClueInput = require("./ClueInput");

const Current = ({ clueNumber, word, filterWord, showNonCrosses, direction }) => {
  return (
    <React.Fragment>
      <div className="inline" onClick={e => e.stopPropagation()}>
        <h3>{clueNumber}{direction == 'across' ? 'a' : 'd'}: </h3>
        <ClueInput direction={direction} number={clueNumber} />
      </div>
      <div className="current" onClick={e => e.stopPropagation()}>
        {word.toUpperCase()}
        <OneLookLink word={word} />
        {filterWord ? (
          <a onClick={e => showNonCrosses(e, "across")}>
            <Filter size={16} />
            <span className="pbtip">
              <b>Unfilter Across crosses</b>
            </span>
          </a>
        ) : null}
      </div>
    </React.Fragment>
  );
}

module.exports = Current;
