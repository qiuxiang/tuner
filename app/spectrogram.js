var Spectrogram = function (selector) {
  this.canvas = document.querySelector(selector)
  this.canvas.width = document.body.clientWidth
  this.context = this.canvas.getContext('2d')
  this.scale = 8
}

Spectrogram.prototype.update = function (data) {
  var lengthScaled = parseInt(data.length * 0.75) / this.scale
  var barWidth = this.canvas.width / lengthScaled
  var barSum = 0
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  data.reduce((function (x, value, index) {
    barSum += value
    if (index > 0 && (index % this.scale) == 0) {
      value = barSum / this.scale
      barSum = 0
      this.context.fillStyle = 'hsl(' + (index / this.scale * 360 / lengthScaled) + ', 100%, 50%)'
      this.context.fillRect(x, this.canvas.height - value / 2, barWidth, value / 2)
      return x + barWidth
    } else {
      return x
    }
  }).bind(this), 0)
}