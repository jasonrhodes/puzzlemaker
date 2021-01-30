module.exports = {
  measureMyInputText,
  focusOnActive
};

function measureMyInputText(value) {
  var tmp = document.createElement("span");
  tmp.className = "fakeinput noopacity";
  tmp.innerHTML = value;
  document.body.appendChild(tmp);
  var theWidth = tmp.getBoundingClientRect().width;
  document.body.removeChild(tmp);
  return theWidth;
}

function focusOnActive() {
  var active = document.querySelector('.active');
  active.querySelector('input').focus();
}