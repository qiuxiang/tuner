var FrequencyBars = function (selector, bars) {
  this.$element = document.querySelector(selector)
  this.$bars = []
  var barWidth = this.$element.clientWidth / bars - 1
  for (var i = 0; i < bars; i += 1) {
    var $bar = document.createElement('div')
    $bar.className = 'frequency-bar'
    $bar.style.width = barWidth + 'px'
    $bar.style.left = (barWidth + 1) * i + 'px'
    this.$bars.push($bar)
    this.$element.appendChild($bar)
  }
}

FrequencyBars.prototype.update = function (data) {
  var $bars = this.$bars
  var step = data.length / this.$bars.length
  var sum = 0
  data.reduce(function (count, value) {
    if (count % step) {
      sum += value
    } else {
      value = sum / step
      $bars[(count / step) - 1].style.height = value + 'px'
      sum = 0
    }
    return count + 1
  }, 1)
}
