/**
 * the frequency line graph
 *
 * @param {string} selector
 * @constructor
 */
const FrequencyLines = function (selector) {
  this.$canvas = document.querySelector(selector);
  this.$canvas.width = document.body.clientWidth;
  this.$canvas.height = document.body.clientHeight / 2;
  this.canvasContext = this.$canvas.getContext("2d");
};

FrequencyLines.prototype.createGradient = function() {
  const gradient = this.canvasContext.createLinearGradient(0, 0, this.$canvas.width, 0);

  // Define the color stops here.
  // Note: You can change these colors to any color of your choice.
  gradient.addColorStop(0, '#81D4FA');  // Material Pink 200
  gradient.addColorStop(0.5, '#F48FB1');  // Material Light Blue 200
  gradient.addColorStop(1, '#A5D6A7');  // Material Light Green 200
  
  return gradient;
}

/**
 * @param {Uint8Array} data
 */
FrequencyLines.prototype.update = function (data) {
  const length = 128; // low frequency only
  const width = this.$canvas.width / length;
  this.canvasContext.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
  
  // Start the line from the bottom of the graph
  this.canvasContext.beginPath();
  this.canvasContext.moveTo(0, this.$canvas.height);
  
  for (var i = 0; i < length; i += 1) {
    // Draw a line to the next data point
    this.canvasContext.lineTo(
      i * width,
      this.$canvas.height - data[i]
    );
  }
  
  // End the line at the bottom of the graph
  this.canvasContext.lineTo(
    this.$canvas.width,
    this.$canvas.height
  );

  // Use the color gradient for the strokeStyle
  this.canvasContext.strokeStyle = this.createGradient();
  this.canvasContext.stroke();
};

