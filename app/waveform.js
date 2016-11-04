var Waveform = function (selector) {
  this.canvas = document.querySelector(selector)
  this.canvas.width = document.body.clientWidth
  this.context = this.canvas.getContext('2d')
}

Waveform.prototype.update = function (data) {
  var slice = this.canvas.width / (data.length - 1)
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  this.context.beginPath()
  Array.prototype.slice.call(data).reduce((function (x, value, index) {
    var y = (1 + value) * this.canvas.height / 2
    if(index > 0) {
      this.context.lineTo(x, y)
    } else {
      this.context.moveTo(x, y)
    }
    return x + slice
  }).bind(this), 0)
  this.context.stroke()
}