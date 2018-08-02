const Application = function() {
  this.tuner = new Tuner()
  this.note = new Note('.note', this.tuner)
  this.meter = new Meter('.meter')
  this.frequencyBars = new FrequencyBars('.frequency-bars')
  this.automaticMode = true
  this.update({ name: 'A', frequency: 440, numbered: 4, value: 69, cents: 0 })
}

Application.prototype.start = function() {
  const self = this
  this.tuner.onNoteDetected = function(note) {
    if (self.automaticMode) {
      if (self.lastNote === note.name) {
        self.update(note)
      } else {
        self.lastNote = note.name
      }
    }
  }
  if (!/Android/i.test(navigator.userAgent)) {
    this.updateFrequencyBars()
  }
  swal('Welcome!').then(function() {
    self.tuner.init()
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount)
  })
}

Application.prototype.updateFrequencyBars = function() {
  if (this.tuner.analyser) {
    this.tuner.analyser.getByteFrequencyData(this.frequencyData)
    this.frequencyBars.update(this.frequencyData)
  }
  requestAnimationFrame(this.updateFrequencyBars.bind(this))
}

Application.prototype.update = function(note) {
  this.note.update(note)
  this.meter.update((note.cents / 50) * 45)
}

// noinspection JSUnusedGlobalSymbols
Application.prototype.toggleAutoMode = function() {
  this.automaticMode = !this.automaticMode
  this.note.setAutoMode(this.automaticMode)
}

const app = new Application()
app.start()
