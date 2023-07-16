/**
 * the frequency histogram
 *
 * @param {string} selector
 * @constructor
 */
const FrequencyBars = function (selector) {
  this.$canvas = document.querySelector(selector);
  this.$canvas.width = document.body.clientWidth;
  this.$canvas.height = document.body.clientHeight / 2;
  this.canvasContext = this.$canvas.getContext("2d");
};

/**
 * @param {Uint8Array} data
 */
FrequencyBars.prototype.update = function (data) {
  const length = 64; // low frequency only
  const width = this.$canvas.width / length - 0.5;
  this.canvasContext.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
  for (var i = 0; i < length; i += 1) {
    this.canvasContext.fillStyle = "#ecf0f1";
    this.canvasContext.fillRect(
      i * (width + 0.5),
      this.$canvas.height - data[i],
      width,
      data[i]
    );
  }
};
