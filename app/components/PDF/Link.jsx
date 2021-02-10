const React = require("react");
const { BlobProvider } = require("@react-pdf/renderer");
const PDFPuzzleDocument = require("./PuzzleDocument");

// { blob: null, url: null, loading: true, error: null }

const Redirect = ({ url }) => {
  window.location.href = url;
  return null;
}

module.exports = function PDFLink({ puzzle, children }) {
  const [load, setLoad] = React.useState(false);
  if (!load) {
    return (
      <a onClick={() => setLoad(true)} style={{ cursor: "pointer" }}>
        {children}
      </a>
    );
  }
  return (
    <BlobProvider document={<PDFPuzzleDocument puzzle={puzzle} />} fileName={`${puzzle.title}.pdf`} >
      {({ loading, url }) => loading ? children : <Redirect url={url} />}
    </BlobProvider>
  );
}
