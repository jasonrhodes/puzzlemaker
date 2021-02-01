const React = require("react");
const OneLookLink = require("./OneLookLink");
const { TypographyIcon, TriangleLeftIcon, TriangleRightIcon } = require("@primer/octicons-react");


const Current = ({ puzzle, mobileView }) => {
    return (
          <div class="inline" onClick={e => e.stopPropagation()}>
            <h3>{acrossNumber}A: </h3>
            <ClueInput direction="across" number={acrossNumber} />
          </div>

          <div class="current" onClick={e => e.stopPropagation()}>
            {across.word.toUpperCase()}
            <OneLookLink word={across.word} />
            {acrossFilter[0] ? (
              <a onClick={e => showNonCrosses(e, "across")}>
                <EyeIcon size={20} />
                <span class="pbtip">
                  <b>Unfilter Across crosses</b>
                </span>
              </a>
            ) : (
              ""
            )}
          </div>
  );
}

module.exports = Current;