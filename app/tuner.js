var Tuner = function () {
  window.AudioContext = window.AudioContext || window.webkitAudioContext
  if (!window.AudioContext) {
    return alert('AudioContext not supported')
  }

  this.middleA = 440
  this.semitone = 69
  this.bufferSize = 8192
  this.noteStrings = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
  this.audioContext = new window.AudioContext()
  this.biquadFilter = this.audioContext.createBiquadFilter()
  this.biquadFilter.type = 'lowpass'
  this.biquadFilter.frequency.value = 440
  this.scriptProcessor = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1)
  this.pitchDetector = new (Module().AubioPitch)(
    'default', this.bufferSize, 1, this.audioContext.sampleRate)
}

Tuner.prototype.start = function () {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
  if (!navigator.getUserMedia) {
    return alert('getUserMedia not supported')
  }

  var self = this
  navigator.getUserMedia({audio: true}, function (stream) {
    self.audioContext.createMediaStreamSource(stream).connect(self.biquadFilter)
    self.biquadFilter.connect(self.scriptProcessor)
    self.scriptProcessor.connect(self.audioContext.destination)
    self.scriptProcessor.addEventListener('audioprocess', function (event) {
      var audioBuffer = event.inputBuffer.getChannelData(0)
      if (self.onAudioProcess) {
        self.onAudioProcess(audioBuffer)
      }

      var frequency = self.pitchDetector.do(audioBuffer)
      if (frequency && self.onNoteDetected) {
        var note = self.getNote(frequency)
        self.onNoteDetected({
          name: self.noteStrings[note % 12],
          value: note,
          cents: self.getCents(frequency, note),
          numbered: parseInt(note / 12) - 1,
          frequency: frequency,
        })
      }
    })
  }, function (error) {
    alert(error.name + ': ' + error.message)
  })
}

Tuner.prototype.getNote = function (frequency) {
  var note = 12 * (Math.log(frequency / this.middleA) / Math.log(2))
  return Math.round(note) + this.semitone
}

Tuner.prototype.getStandardFrequency = function (note) {
  return this.middleA * Math.pow(2, (note - this.semitone) / 12)
}

Tuner.prototype.getCents = function (frequency, note) {
  return Math.floor(1200 * Math.log(frequency / this.getStandardFrequency(note)) / Math.log(2))
}