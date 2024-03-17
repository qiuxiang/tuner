// Generate and save MIDI notes to files based on the tuner output
import MidiWriter from '../../node_modules/midi-writer-js';
export function generateMidi() {
  console.log("GOT HERE");

  // Define an instrument (optional):
  track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
  
  // Add some notes:
  const note = new MidiWriter.NoteEvent({pitch: ['C4', 'D4', 'E4'], duration: '4'});
  track.addEvent(note);
  
  // Generate a data URI
  const write = new MidiWriter.Writer(track);
  console.log(write.dataUri());
}

// Request MIDI access
/*
navigator.requestMIDIAccess()
  .then(function(midiAccess) {
    // Get MIDI input and output ports
    var inputs = midiAccess.inputs.values();
    var outputs = midiAccess.outputs.values();
    
    // Log available MIDI devices
    for (var input of inputs) {
      console.log('MIDI Input:', input.name);
    }
    for (var output of outputs) {
      console.log('MIDI Output:', output.name);
    }
    
    // Example: Send MIDI note-on and note-off messages
    var output = outputs.next().value; // Get the first MIDI output port
    output.send([0x90, 60, 100]); // Note-on (MIDI note 60, velocity 100)
    setTimeout(function() {
      output.send([0x80, 60, 0]); // Note-off (MIDI note 60, velocity 0) after 1 second
    }, 1000);
  })
  .catch(function(err) {
    console.error('Error accessing MIDI:', err);
  });

// Function to generate and save a MIDI file
function generateAndSaveMIDI() {
  // Create a new MIDI file
  var midiFile = new MidiWriter.File();

  // Create a track
  var track = new MidiWriter.Track();

  // Add a note-on event (middle C, velocity 127, start time 0)
  track.addEvent(new MidiWriter.NoteEvent({pitch: ['C4'], duration: '4n', velocity: 127}));

  // Add the track to the MIDI file
  midiFile.addTrack(track);

  // Convert the MIDI file to a data URI
  var dataUri = 'data:audio/midi;base64,' + btoa(midiFile.toBytes());

  // Create a download link for the MIDI file
  var link = document.createElement('a');
  link.href = dataUri;
  link.download = 'output.mid';
  
  // Trigger a click event to download the MIDI file
  link.click();
  console.log("got here");
}

generateAndSaveMIDI();
*/