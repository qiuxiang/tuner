var audioContext = new AudioContext()
analyser = audioContext.createAnalyser()
analyser.connect(audioContext.destination)
navigator.mediaDevices.getUserMedia({audio: true}).then(function (stream) {
    audioContext.createMediaStreamSource(stream).connect(analyser)
    process()
})

var buffer = new Float32Array(analyser.fftSize)
function process() {
    requestAnimationFrame(process)
    analyser.getFloatTimeDomainData(buffer)
    console.log(buffer)
}

// var oscillator = audioContext.createOscillator()
// oscillator.connect(analyser)
// oscillator.start()
