var audioContext = new AudioContext()
var analyser = audioContext.createAnalyser()
analyser.fftSize = 4096
var biquadFilter = audioContext.createBiquadFilter()
var audioBuffer = new Float32Array(analyser.fftSize)
var frequencyData = new Uint8Array(analyser.frequencyBinCount)
var waveform = new Waveform('#waveform')
var spectrogram = new Spectrogram('#spectrogram')
var pitchDetector = new (Module().PitchDetector)('default', analyser.fftSize, 1, audioContext.sampleRate)
var $pitch = document.querySelector('#pitch')

biquadFilter.type = 'lowpass'
biquadFilter.frequency.value = 440

navigator.mediaDevices.getUserMedia({audio: true}).then(function (stream) {
  audioContext.createMediaStreamSource(stream).connect(biquadFilter)
  biquadFilter.connect(analyser)
})

function noteFromFrequency(frequency) {
  var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2))
  return Math.round(noteNum) + 69
}

function frequencyFromNote(note) {
  return 440 * Math.pow(2, (note - 69) / 12)
}

function centsDiffFromFrequency(frequency, note) {
  return Math.floor(1200 * Math.log(frequency / frequencyFromNote(note)) / Math.log(2))
}

var noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

process()
function process() {
  requestAnimationFrame(process)
  analyser.getFloatTimeDomainData(audioBuffer)
  analyser.getByteFrequencyData(frequencyData)
  waveform.update(audioBuffer)
  spectrogram.update(frequencyData)

  var frequency = pitchDetector.getPitch(audioBuffer)
  if (frequency) {
    var note = noteFromFrequency(frequency)
    var noteString = noteStrings[note % 12] || ''
    var centsDiff = centsDiffFromFrequency(frequency, note)
    $pitch.innerHTML = noteString + ', ' + centsDiff + ' cents, ' + frequency.toFixed(1) + ' Hz'
  }
}