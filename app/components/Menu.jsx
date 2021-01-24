const React = require("react");
const { Link } = require("react-router-dom");

const { DesktopDownloadIcon, PencilIcon, UnlockIcon, HomeIcon } = require("@primer/octicons-react");

const Menu = ({}) => {
  return (
    <div class="menu">
      <Link to="/"><HomeIcon size={24} /></Link>
      <Link to="/"><DesktopDownloadIcon size={24} /></Link>
      <Link to="/"><PencilIcon size={24} /></Link>
      <Link to="/"><UnlockIcon size={24} /></Link>
    </div>
  );
};

module.exports = Menu;