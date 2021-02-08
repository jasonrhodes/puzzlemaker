const React = require("react");
const { PDFDownloadLink } = require("@react-pdf/renderer");
const PDFPuzzleDocument = require("./PuzzleDocument");

module.exports = function PDFLink({ puzzle, children }) {
  return (
    <PDFDownloadLink document={<PDFPuzzleDocument puzzle={puzzle} />} fileName={`${puzzle.title}.pdf`} >
      {children}
    </PDFDownloadLink>
  );
}
