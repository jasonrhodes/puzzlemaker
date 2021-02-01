const React = require("react");
const OneLookLink = require("./OneLookLink");
const { EyeIcon, TriangleLeftIcon, TriangleRightIcon } = require("@primer/octicons-react");


const Current = ({ clueNumber, word, filterWord, showNonCrosses }) => {
  return (
    <React.fragment>
      <div class="inline" onClick={e => e.stopPropagation()}>
        <h3>{clueNumber}A: </h3>
        <ClueInput direction="across" number={clueNumber} />
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
        ) : ( "" )}
      </div>
    </React.fragment>
  );
}

module.exports = Current;