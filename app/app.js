var audioContext = new (window.AudioContext || window.webkitAudioContext)()
var biquadFilter = audioContext.createBiquadFilter()
var scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1)
var pitchDetector = new (Module().PitchDetector)(
      'default', scriptProcessor.bufferSize, 1, audioContext.sampleRate)
var waveform = new Waveform('#waveform')
var frequencyBars = new FrequencyBars('#frequency-bars')
var $pitch = document.querySelector('#pitch')

biquadFilter.type = 'lowpass'
biquadFilter.frequency.value = 440

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
navigator.getUserMedia({audio: true}, function (stream) {
  audioContext.createMediaStreamSource(stream).connect(biquadFilter)
  biquadFilter.connect(scriptProcessor)
}, function () {})

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

scriptProcessor.connect(audioContext.destination)
scriptProcessor.addEventListener('audioprocess', function (event) {
  var audioBuffer = event.inputBuffer.getChannelData(0)
  waveform.update(audioBuffer)
  // frequencyBars.update(frequencyData)

  var frequency = pitchDetector.getPitch(audioBuffer)
  if (frequency) {
    var note = noteFromFrequency(frequency)
    var noteString = noteStrings[note % 12] || ''
    var centsDiff = centsDiffFromFrequency(frequency, note)
    $pitch.innerHTML = noteString + ', ' + centsDiff + ' cents, ' + frequency.toFixed(1) + ' Hz'
  }
})