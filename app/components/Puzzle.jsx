const React = require("react");
const PuzzleRow = require("./PuzzleRow");
const PuzzleMenu = require("./PuzzleMenu");
const { PuzzleContext } = require("./PuzzleContext");
const PuzzleTitle = require("./PuzzleTitle");
const CurrentClues = require("./CurrentClues");

const Puzzle = ({ initialGrid }) => {
  return (
    <PuzzleContext.Consumer>
      {puzzle => (
        <div>
          <PuzzleTitle
            width={puzzle.grid[0].length * 40}
            title={puzzle.title}
            author={puzzle.author}
            setTitle={puzzle.setTitle}
            setAuthor={puzzle.setAuthor}
          />
          <div class="puzzle-container">
            <PuzzleMenu puzzle={puzzle} />
            <div class={"puzzle-grid grid" + puzzle.grid[0].length}>
              {puzzle.grid.map((columns, i) => (
                <PuzzleRow key={`row-${i}`} row={i} columns={columns} />
              ))}
            </div>
            <CurrentClues
              across={puzzle.words.across}
              down={puzzle.words.down}
              puzzle={puzzle}
            />
          </div>
        </div>
      )}
    </PuzzleContext.Consumer>
  );
};

module.exports = Puzzle;
