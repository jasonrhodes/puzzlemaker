const React = require("react");
const { Link } = require("react-router-dom");

const { DesktopDownloadIcon, PencilIcon, UnlockIcon, HomeIcon, LockIcon } = require("@primer/octicons-react");

const { ReactTooltip } = require ("react-tooltip");

const toggleLock = e => {
  
};

const Menu = ({}) => {
  return (
    <div class="menu">
      <Link data-tip="Home" to="/"><HomeIcon size={24} /></Link>
      <Link><DesktopDownloadIcon size={24} /></Link>
      <Link><PencilIcon size={24} /></Link>
      <Link onClick={toggleLock()} ><UnlockIcon size={24} /></Link>
    </div>
  );
};

module.exports = Menu;