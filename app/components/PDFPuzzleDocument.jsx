const React = require("react");
const { Document, Page, Text, View, StyleSheet } = require("@react-pdf/renderer");

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

module.exports = function PDFPuzzleDoc({ title, author }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1 - {title}</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2 - {author}</Text>
        </View>
      </Page>
    </Document>
  );
};