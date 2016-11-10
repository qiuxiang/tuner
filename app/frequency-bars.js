/**
 * the frequency histogram
 *
 * @param {string} selector
 * @param {int} bars - the bars number
 * @constructor
 */
var FrequencyBars = function (selector, bars) {
  this.$root = document.querySelector(selector)
  this.$bars = []
  this.initBars(bars)
}

/**
 * @param {int} bars - the bars number
 */
FrequencyBars.prototype.initBars = function (bars) {
  var barWidth = this.$root.clientWidth / bars - 1
  for (var i = 0; i < bars; i += 1) {
    var $bar = document.createElement('div')
    $bar.className = 'frequency-bar'
    $bar.style.width = barWidth + 'px'
    $bar.style.left = (barWidth + 1) * i + 'px'
    this.$bars.push($bar)
    this.$root.appendChild($bar)
  }
}

/**
 * @param {Array} data
 */
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
