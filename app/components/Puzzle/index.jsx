const React = require("react");
const Row = require("./Row");
const Menu = require("./Menu");
const { PuzzleContext } = require("./Context");
const Title = require("./Title");
const CurrentClues = require("./CurrentClues");
const AllClues = require("./AllClues");
const InfoTab = require("./InfoTab");
const SidebarMenu = require("./SidebarMenu");

const Puzzle = () => {
  const [desktopView, setDesktopView] = React.useState("info");
  const gridSizeDesc = (length) => {
    if (length > 16) {
      return "largegrid";
    } else if (length > 12) {
      return "mediumgrid";
    } else if (length > 8) {
      return "smallgrid";
    } else {
      return "xsgrid";
    }
  };
  return (
    <PuzzleContext.Consumer>
      {(puzzle) =>
        !puzzle.ready ? null : (
          <div>
            <div
              className="infomenublock"
              style={{ maxWidth: puzzle.grid[0].length * 40 + 15 + "px" }}
            >
              <Title
                titleWidth={puzzle.titleWidth}
                authorWidth={puzzle.authorWidth}
                setTitleWidth={puzzle.setTitleWidth}
                setAuthorWidth={puzzle.setAuthorWidth}
                title={puzzle.title}
                author={puzzle.author}
                setTitle={puzzle.setTitle}
                setAuthor={puzzle.setAuthor}
              />
              <Menu puzzle={puzzle} />
            </div>
            <div className="puzzle-container">
              <div
                className={
                  "puzzle-grid " +
                  gridSizeDesc(puzzle.grid[0].length) +
                  " " +
                  puzzle.zoomed
                }
              >
                {puzzle.grid.map((columns, i) => (
                  <Row key={`row-${i}`} row={i} columns={columns} />
                ))}
              </div>
              <div className="sb">
                <SidebarMenu
                  desktopView={desktopView}
                  setDesktopView={setDesktopView}
                />
                {desktopView == "info" ? (
                  <InfoTab puzzle={puzzle} />
                ) : desktopView == "current" ? (
                  <CurrentClues
                    across={puzzle.words.across}
                    down={puzzle.words.down}
                    puzzle={puzzle}
                  />
                ) : (
                  <AllClues
                    across={puzzle.words.across}
                    down={puzzle.words.down}
                    puzzle={puzzle}
                  />
                )}
              </div>
            </div>
          </div>
        )
      }
    </PuzzleContext.Consumer>
  );
};

module.exports = Puzzle;
