var Application = function () {
  this.tuner = new Tuner()
  this.fft = new (Module().AubioFFT)(this.tuner.bufferSize)
  this.lastNote = ''
  this.$note = document.querySelector('.pitch-name')
  this.$frequency = document.querySelector('.pitch-frequency')
  this.frequencyBars = new FrequencyBars('.frequency-bars', 32)
  this.meter = new Meter('.meter')
  this.update({name: 'A', frequency: 440, numbered: 4, cents: 0})
}

Application.prototype.start = function () {
  var self = this
  this.tuner.onAudioProcess = function (buffer) {
    self.frequencyBars.update(
      self.fft.forward(buffer).norm.slice(0, self.tuner.bufferSize / 64))
  }
  this.tuner.onNoteDetected = function (note) {
    console.log(note)
    if (self.lastNote == note.name) {
      self.update(note)
    } else {
      self.lastNote = note.name
    }
  }
  this.tuner.start()
}

Application.prototype.update = function (note) {
  var sharp = note.name[1] || ''
  this.$note.innerHTML = note.name[0] +
    '<span class="pitch-sharp">' + sharp + '</span>' +
    '<span class="pitch-numbered">' + note.numbered + '</span>'
  this.$frequency.innerHTML = note.frequency.toFixed(1) + '<span>Hz</span>'
  this.meter.update(note.cents / 50 * 45)
}

var app = new Application()
app.start()