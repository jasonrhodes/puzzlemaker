const React = require("react");
const { PDFDownloadLink } = require("@react-pdf/renderer");
const PDFPuzzleDocument = require("./PuzzleDocument");

module.exports = function PDFLink({ puzzle, children }) {
  return (
    <PDFDownloadLink document={<PDFPuzzleDocument author={puzzle.author} title={puzzle.title} />} fileName={`${puzzle.title}.pdf`}>
      {children}
    </PDFDownloadLink>
  );
};