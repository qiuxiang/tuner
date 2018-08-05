const Tuner = function() {
  this.middleA = 440
  this.semitone = 69
  this.bufferSize = 4096
  this.noteStrings = [
    'C',
    'C♯',
    'D',
    'D♯',
    'E',
    'F',
    'F♯',
    'G',
    'G♯',
    'A',
    'A♯',
    'B'
  ]

  this.initGetUserMedia()
}

Tuner.prototype.initGetUserMedia = function() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext
  if (!window.AudioContext) {
    return alert('AudioContext not supported')
  }

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {}
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      // First get ahold of the legacy getUserMedia, if present
      const getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        alert('getUserMedia is not implemented in this browser')
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject)
      })
    }
  }
}

Tuner.prototype.startRecord = function () {
  const self = this
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function(stream) {
      self.audioContext.createMediaStreamSource(stream).connect(self.analyser)
      self.analyser.connect(self.scriptProcessor)
      self.scriptProcessor.connect(self.audioContext.destination)
      self.scriptProcessor.addEventListener('audioprocess', function(event) {
        const frequency = self.pitchDetector.do(
          event.inputBuffer.getChannelData(0)
        )
        if (frequency && self.onNoteDetected) {
          const note = self.getNote(frequency)
          self.onNoteDetected({
            name: self.noteStrings[note % 12],
            value: note,
            cents: self.getCents(frequency, note),
            octave: parseInt(note / 12) - 1,
            frequency: frequency
          })
        }
      })
    })
    .catch(function(error) {
      alert(error.name + ': ' + error.message)
    })
}

Tuner.prototype.init = function() {
  this.audioContext = new window.AudioContext()
  this.analyser = this.audioContext.createAnalyser()
  this.scriptProcessor = this.audioContext.createScriptProcessor(
    this.bufferSize,
    1,
    1
  )

  const self = this

  Aubio().then(function(aubio) {
    self.pitchDetector = new aubio.Pitch(
      'default',
      self.bufferSize,
      1,
      self.audioContext.sampleRate
    )
    self.startRecord()
  })
}

/**
 * get musical note from frequency
 *
 * @param {number} frequency
 * @returns {number}
 */
Tuner.prototype.getNote = function(frequency) {
  const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2))
  return Math.round(note) + this.semitone
}

/**
 * get the musical note's standard frequency
 *
 * @param note
 * @returns {number}
 */
Tuner.prototype.getStandardFrequency = function(note) {
  return this.middleA * Math.pow(2, (note - this.semitone) / 12)
}

/**
 * get cents difference between given frequency and musical note's standard frequency
 *
 * @param {number} frequency
 * @param {number} note
 * @returns {number}
 */
Tuner.prototype.getCents = function(frequency, note) {
  return Math.floor(
    (1200 * Math.log(frequency / this.getStandardFrequency(note))) / Math.log(2)
  )
}

/**
 * play the musical note
 *
 * @param {number} frequency
 */
Tuner.prototype.play = function(frequency) {
  if (!this.oscillator) {
    this.oscillator = this.audioContext.createOscillator()
    this.oscillator.connect(this.audioContext.destination)
    this.oscillator.start()
  }
  this.oscillator.frequency.value = frequency
}

Tuner.prototype.stop = function() {
  this.oscillator.stop()
  this.oscillator = null
}
