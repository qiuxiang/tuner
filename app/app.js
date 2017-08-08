var Application = function () {
  this.tuner = new Tuner()
  this.$note = document.querySelector('.note-name')
  this.$frequency = document.querySelector('.note-frequency')
  this.note = new Note('.note', this.tuner)
  this.meter = new Meter('.meter')
  this.frequencyBars = new FrequencyBars('.frequency-bars')
  this.frequencyData = new Uint8Array(this.tuner.analyser.frequencyBinCount)
  this.automaticMode = true
  this.update({name: 'A', frequency: 440, numbered: 4, value: 69, cents: 0})
}

Application.prototype.start = function () {
  var self = this
  this.tuner.onNoteDetected = function (note) {
    if (self.automaticMode) {
      if (self.lastNote === note.name) {
        self.update(note)
      } else {
        self.lastNote = note.name
      }
    }
  }
  this.tuner.start()
  if (!/Android/i.test(navigator.userAgent)) {
    this.updateFrequencyBars()
  }
}

Application.prototype.updateFrequencyBars = function () {
  this.tuner.analyser.getByteFrequencyData(this.frequencyData)
  this.frequencyBars.update(this.frequencyData)
  requestAnimationFrame(this.updateFrequencyBars.bind(this))
}

Application.prototype.update = function (note) {
  this.note.update(note)
  this.meter.update(note.cents / 50 * 45)
}

Application.prototype.toggleAutoMode = function () {
  if (this.automaticMode) {
    this.automaticMode = false
    this.$note.style.display = 'none'
  } else {
    this.automaticMode = true
    this.$note.style.display = 'inline-block'
  }
  this.note.setAutoMode(this.automaticMode)
}

var app = new Application()
app.start()
