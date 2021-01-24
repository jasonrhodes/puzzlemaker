const React = require("react");
const { Link } = require("react-router-dom");

const { DesktopDownloadIcon, PencilIcon, UnlockIcon, HomeIcon } = require("@primer/octicons-react");

const Menu = ({}) => {
  return (
    <div class="menu">
      <Link to="/"><HomeIcon size={24} /></Link>
      <DesktopDownloadIcon size={24} />
      <PencilIcon size={24} />
      <UnlockIcon size={24} />
    </div>
  );
};

module.exports = Menu;