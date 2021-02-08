const React = require("react");
const { Document, Page, Text, View, StyleSheet } = require("@react-pdf/renderer");
const PrintGrid = require("./PrintGrid");

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFF'
  },
  title: {
    flexDirection: 'column',
    margin: 10,
    padding: 10,
  },
  gridrow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginLeft: 10,
    paddingLeft: 10,
  },
  column1: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '33%',
    flex: 1,
    paddingLeft: 5,
  },
  column2and3: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '66%',
    width: 'auto'
  },
  column2: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '50%',
  },
  column3: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '50%',
  },
  clue: {
    fontSize: '10pt',

  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    height: '20pt',
    width: '20pt',
    border: '1pt solid #777',
    borderBottom: 0,
    borderRight: 0,
    fontSize: '5pt',
    padding: 1,
    paddingLeft: 2,
  },
  blackCell: {
    backgroundColor: '#000',
  },
  markedCell: {
    backgroundColor: '#ddd',
  },
  lastRow: {
    borderBottom: '1pt solid #777'
  },
  lastColumn: {
    borderRight: '1pt solid #777'
  }
});

module.exports = function PDFPuzzleDoc({ puzzle }) {
  const downClues = Object.keys(puzzle.clues.down).length;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.title}>
          <Text>{puzzle.title} by {puzzle.author}</Text>
        </View>
        <View style={styles.gridrow}>
          <View style={styles.column1}>
            <Text style={{ fontSize: '14pt', fontWeight: 'bolder', marginBottom: 2 }}>Across</Text>
            {Object.keys(puzzle.clues.across).map(key => (
              <Text style={styles.clue}><Text style={{fontWeight: 'bolder', minWidth: '1cm'}}>{key}</Text> {puzzle.clues.across[key] || '(Blank Clue)'}</Text>
            ))}
          </View>
          <View style={styles.column2and3}>
            <PrintGrid puzzle={puzzle} styles={styles} />
            <View style={{flexDirection: 'row'}}>
              <View style={styles.column2}>
                <Text style={{ fontSize: '14pt', fontWeight: 'bolder', marginBottom: 2 }}>Down</Text>
                {Object.keys(puzzle.clues.down).map((key, i) => {
                  if (i < downClues / 2) {
                    return (
                      <Text style={styles.clue}><Text key={key} style={{fontWeight: 'bolder', minWidth: '1cm'}}>{key}</Text> {puzzle.clues.down[key] || '(Blank Clue)'}</Text>
                    );
                  }
                })}
              </View>
              <View style={styles.column3}>
                {Object.keys(puzzle.clues.down).map((key, i) => {
                  if (i >= downClues / 2) {
                    return (
                      <Text style={styles.clue}><Text key={key} style={{fontWeight: 'bolder', minWidth: '1cm'}}>{key}</Text> {puzzle.clues.down[key] || '(Blank Clue)'}</Text>
                    )
                  }
                })}
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
