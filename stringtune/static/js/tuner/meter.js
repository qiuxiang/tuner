/**
 * @param {string} selector
 * @constructor
 */
const Meter = function (selector) {
  this.$root = document.querySelector(selector);
  this.$pointer = this.$root.querySelector(".tuner .meter-pointer");
  this.init();
};

Meter.prototype.init = function () {
  for (var i = 0; i <= 10; i += 1) {
    const $scale = document.createElement("div");
    $scale.className = "meter-scale";
    $scale.style.transform = "rotate(" + (i * 9 - 45) + "deg)";
    if (i % 5 === 0) {
      $scale.classList.add("meter-scale-strong");
    }
    this.$root.appendChild($scale);
  }
};

/**
 * @param {number} deg
 */
Meter.prototype.update = function (deg) {
  this.$pointer.style.transform = "rotate(" + deg + "deg)";
  const tunedArea = document.getElementById("tunedArea");
 
  // Adjust these values to match the actual range of your "tuned" area
  const minTunedDegree = -4;  
  const maxTunedDegree = 4;
  
  if (deg >= minTunedDegree && deg <= maxTunedDegree) {
    tunedArea.style.visibility = "visible";
  } else {
    tunedArea.style.visibility = "hidden";
  }
};
