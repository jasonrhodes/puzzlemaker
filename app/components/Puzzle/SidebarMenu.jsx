const React = require("react");
const { Info, HelpCircle, Search } = require("react-feather");

const SidebarMenu = ({ desktopView, setDesktopView }) => {
  const tabSwitch = (e, view) => {
    e.stopPropagation();
    setDesktopView(view);
  };
  return (
    <div className="sb-menu">
      <div
        className={
          desktopView == "info" ? "sb-menu-item active-tab" : "sb-menu-item"
        }
        onClick={(e) => tabSwitch(e, "info")}
      >
        <Info size={18} /> Info
      </div>
      <div
        className={
          desktopView == "current" ? "sb-menu-item active-tab" : "sb-menu-item"
        }
        onClick={(e) => tabSwitch(e, "current")}
      >
        <Search size={18} /> Suggestions
      </div>
      <div
        className={
          desktopView == "all" ? "sb-menu-item active-tab" : "sb-menu-item"
        }
        onClick={(e) => tabSwitch(e, "all")}
      >
        <HelpCircle size={18} /> Clues
      </div>
    </div>
  );
};

module.exports = SidebarMenu;
