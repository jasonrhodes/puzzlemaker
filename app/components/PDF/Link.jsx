const React = require("react");
const { BlobProvider } = require("@react-pdf/renderer");
const PDFPuzzleDocument = require("./PuzzleDocument");

// { blob: null, url: null, loading: true, error: null }

const Download = ({ url, fileName, onFinish }) => {
  React.useEffect(() => {
    var link = document.createElement('a');
    document.body.appendChild(link); // required in FF, optional for Chrome
    link.href = url;
    link.download = fileName;
    link.click();
    link.remove();
    onFinish();
  }, []);
  return null;
}

const WithDownload = ({ loading, url, children, fileName, onFinish }) => (
  <React.Fragment>
    <Download loading={loading} url={url} fileName={fileName} onFinish={onFinish} />
    {children}
  </React.Fragment>
);

// <Download loading={loading} url={url} children={children} fileName={`${puzzle.title}.pdf`} onFinish={() => setLoading(false)} />

module.exports = function PDFLink({ puzzle, children }) {
  const [load, setLoading] = React.useState(false);
  if (!load) {
    return (
      <a onClick={() => setLoading(true)} style={{ cursor: "pointer" }}>
        {children}
      </a>
    );
  }
  return (
    <BlobProvider document={<PDFPuzzleDocument puzzle={puzzle} />}>
      {({ loading, url }) => loading ? children : (<WithDownload loading={loading} url={url} children={children} fileName={`${puzzle.title}.pdf`} onFinish={() => setLoading(false)} />)}
    </BlobProvider>
  );
}
