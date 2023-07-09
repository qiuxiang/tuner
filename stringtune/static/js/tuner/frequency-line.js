/**
 * the frequency line graph
 *
 * @param {string} selector
 * @constructor
 */
const FrequencyLines = function (selector) {
  this.$ = document.querySelector(selector);
  this.$.width = document.body.clientWidth;
  this.$.height = document.body.clientHeight / 2;
  this.canvasContext = this.$.getContext("2d");
  this.update = this.update.bind(this); // Binding this context to the update function
};

FrequencyLines.prototype.createGradient = function() {
  const gradient = this.canvasContext.createLinearGradient(0, 0, this.$.width, 0);

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
  const length = 64; // low frequency only
  const width = this.$.width / length;
  this.canvasContext.clearRect(0, 0, this.$.width, this.$.height);
  
  // Start the line from the bottom of the graph
  this.canvasContext.beginPath();
  this.canvasContext.moveTo(0, this.$.height);
  
  for (var i = 0; i < length; i += 1) {
    // Draw a line to the next data point
    this.canvasContext.lineTo(
      i * width,
      this.$.height - data[i]
    );
  }
  
  // End the line at the bottom of the graph
  this.canvasContext.lineTo(this.$.width, this.$.height);

  // Use the color gradient for the strokeStyle
  this.canvasContext.strokeStyle = this.createGradient();
  this.canvasContext.stroke();
};

