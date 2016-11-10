var Meter = function (selector) {
  this.$root = document.querySelector(selector)
  this.$pointer = this.$root.querySelector('.meter-pointer')
  this.init()
}

Meter.prototype.init = function () {
  var deg = -45;
  for (var i = 0; i <= 10; i += 1) {
    var $scale = document.createElement('div')
    $scale.className = 'meter-scale'
    $scale.style.transform = 'rotate(' + (i * 9 - 45) + 'deg)'
    if (i % 5 == 0) {
      $scale.classList.add('meter-scale-strong')
    }
    this.$root.appendChild($scale)
  }
}

Meter.prototype.update = function (deg) {
  this.$pointer.style.transform = 'rotate(' + deg + 'deg)'
}