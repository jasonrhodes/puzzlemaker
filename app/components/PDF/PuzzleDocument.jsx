const React = require("react");
const {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} = require("@react-pdf/renderer");
const PrintGrid = require("./PrintGrid");

// Register font
Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf",
  format: "truetype",
});
Font.register({
  family: "RobotoBold",
  src: "https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc9.ttf",
  format: "truetype",
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFF",
    fontFamily: "Roboto",
  },
  title: {
    flexDirection: "column",
    margin: 10,
    padding: 10,
    fontFamily: "RobotoBold",
    fontSize: "14pt",
  },
  grid: {
    marginBottom: 5,
  },
  gridrow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginLeft: 10,
    paddingLeft: 10,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: 5,
  },
  column20: {
    flex: 1,
    flexBasis: "20%",
  },
  column33: {
    flex: 1,
    flexBasis: "33%",
  },
  column50: {
    flex: 1,
    flexBasis: "50%",
  },
  column66: {
    flex: 2,
    flexBasis: "66%",
    width: "auto",
  },
  column80: {
    flex: 2,
    flexBasis: "80%",
    width: "auto",
  },
  column0: {
    flex: 1,
    flexBasis: "0%",
  },
  clue: {
    fontSize: "10pt",
  },
  clueHeader: {
    fontSize: "12pt",
    fontFamily: "RobotoBold",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    height: "20pt",
    width: "20pt",
    border: "1pt solid #777",
    borderBottom: 0,
    borderRight: 0,
    fontSize: "5pt",
    padding: 1,
    paddingLeft: 2,
  },
  blackCell: {
    backgroundColor: "#000",
  },
  markedCell: {
    backgroundColor: "#ddd",
  },
  lastRow: {
    borderBottom: "1pt solid #777",
  },
  lastColumn: {
    borderRight: "1pt solid #777",
  },
  circle: {
    width: "19pt",
    height: "19pt",
    borderRadius: "10pt",
    border: "1pt solid #000",
    position: "absolute",
    top: "1pt",
    left: "1pt",
    opacity: "0.5",
  },
});

const PrintClue = ({ num, clue }) => {
  if (num == "across" || num == "down") {
    return (
      <Text
        style={[styles.clueHeader, { marginTop: num == "down" ? "10" : "0" }]}
      >
        {clue}
      </Text>
    );
  } else {
    return (
      <Text style={styles.clue}>
        <Text style={{ fontFamily: "RobotoBold" }}>{num}</Text>{" "}
        {clue || "(Blank Clue)"}
      </Text>
    );
  }
};

module.exports = function PDFPuzzleDoc({ puzzle }) {
  const columnCount = puzzle.grid.length > 15 ? 4 : 3;
  var totalClueHeight = 3;
  var usedClueHeight = 0;
  const lnsPerSqr = 1.8;
  const lineCharacters = columnCount == 4 ? 20 : 30;
  const allClues = [["across", "across", "ACROSS"]];
  const clueHeight = (clue) => {
    return clue == "DOWN" ? 2 : Math.ceil((clue.length || 10) / lineCharacters);
  };
  for (const key of Object.keys(puzzle.clues.across)) {
    totalClueHeight += clueHeight(puzzle.clues.across[key]);
    allClues.push(["down", key, puzzle.clues.across[key]]);
  }
  allClues.push(["down", "down", "DOWN"]);
  for (const key of Object.keys(puzzle.clues.down)) {
    totalClueHeight += clueHeight(puzzle.clues.down[key]);
    allClues.push(["across", key, puzzle.clues.down[key]]);
  }
  const wantLength =
    (totalClueHeight + (columnCount - 1) * puzzle.grid.length * lnsPerSqr) /
    columnCount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.title}>
          <Text>
            {puzzle.title} by {puzzle.author}
          </Text>
        </View>
        <View style={styles.gridrow}>
          <View
            style={[
              styles.column,
              columnCount === 4 ? styles.column20 : styles.column33,
            ]}
          >
            {[...Array(allClues.length)].map((key, i) => {
              if (usedClueHeight < wantLength) {
                let curClue = allClues.shift();
                usedClueHeight += clueHeight(curClue[2]);
                return <PrintClue key={i} num={curClue[1]} clue={curClue[2]} />;
              }
            })}
          </View>
          <View
            style={[
              styles.column,
              columnCount === 4 ? styles.column80 : styles.column66,
            ]}
          >
            <PrintGrid puzzle={puzzle} styles={styles} />
            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.column,
                  columnCount === 4 ? styles.column33 : styles.column50,
                ]}
              >
                {[...Array(allClues.length)].map((key, i) => {
                  if (
                    usedClueHeight <
                    wantLength +
                      (wantLength - puzzle.grid.length * lnsPerSqr) * 1
                  ) {
                    let curClue = allClues.shift();
                    usedClueHeight += clueHeight(curClue[2]);
                    return (
                      <PrintClue key={i} num={curClue[1]} clue={curClue[2]} />
                    );
                  }
                })}
              </View>
              <View
                style={[
                  styles.column,
                  columnCount === 4 ? styles.column33 : styles.column50,
                ]}
              >
                {[...Array(allClues.length)].map((key, i) => {
                  if (
                    usedClueHeight <
                    wantLength +
                      (wantLength - puzzle.grid.length * lnsPerSqr) * 2
                  ) {
                    let curClue = allClues.shift();
                    usedClueHeight += clueHeight(curClue[2]);
                    return (
                      <PrintClue key={i} num={curClue[1]} clue={curClue[2]} />
                    );
                  }
                })}
              </View>
              <View
                style={[
                  styles.column,
                  columnCount === 4 ? styles.column33 : styles.column0,
                ]}
              >
                {[...Array(allClues.length)].map((key, i) => {
                  if (
                    usedClueHeight <
                    wantLength +
                      (wantLength - puzzle.grid.length * lnsPerSqr) * 3
                  ) {
                    let curClue = allClues.shift();
                    usedClueHeight += clueHeight(curClue[2]);
                    return (
                      <PrintClue key={i} num={curClue[1]} clue={curClue[2]} />
                    );
                  }
                })}
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
