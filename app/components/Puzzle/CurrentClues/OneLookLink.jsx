const React = require("react");

module.exports = function OneLookLink({ word }) {
  return (
    <a
      target="_blank"
      href={
        "http://onelook.com/?w=" +
        word.toUpperCase().replaceAll("-", "?")
      }
    >
      <img
        style={{ width: "16px" }}
        src="https://cdn.glitch.com/7a2e2b2d-f058-4f81-950d-8b81f72c14fc%2Fonelook.png?v=1611800262010"
      />
      <span className="pbtip">
        <b>Open in OneLook</b>
      </span>
    </a>
  )
};
