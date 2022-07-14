// audioContext for sound
const audioContext = new AudioContext()
const form = document.querySelector('[data-form]')
let value = "sawtooth" // base value

// NOTE_DETAILS
// contains: note, associated key, musical frequency, and current activation
const NOTE_DETAILS = [
  { note: "C", key: "A", frequency: 261.626, active: false },
  { note: "Db", key: "W", frequency: 277.183, active: false},
  { note: "D", key: "S", frequency: 293.665, active: false },
  { note: "Eb", key: "E", frequency: 311.127, active: false },
  { note: "E", key: "D", frequency: 329.628, active: false },
  { note: "F", key: "F", frequency: 349.228, active: false },
  { note: "Gb", key: "T", frequency: 369.994, active: false },
  { note: "G", key: "G", frequency: 391.995, active: false },
  { note: "Ab", key: "Y", frequency: 415.305, active: false },
  { note: "A", key: "H", frequency: 440, active: false },
  { note: "Bb", key: "U", frequency: 466.164, active: false },
  { note: "B", key: "J", frequency: 493.883, active: false },

  { note: "highC", key: "K", frequency: 521.60, active: false },
  { note: "highDb", key: "O", frequency: 551.55, active: false},
  { note: "highD", key: "L", frequency: 587.5, active: false },
  { note: "highEb", key: "P", frequency: 620, active: false },
  { note: "highE", key: ";", frequency: 658.5, active: false }
]

// form for changing value
form.addEventListener('change', e => {
  value = e.target.value
})

// keyDown event listener
// when a key is pressed, play a sound
document.addEventListener("keydown", e => {
  
  if (e.repeat) return         // guard clause, no repeats
  const keyboardKey = e.code   // code = key pressed on keyboard
  const noteDetail = getNoteDetail(keyboardKey)

  if (noteDetail == null) return      // quit if detail is null
  
  noteDetail.active = true        // set active to true
  playNotes()
})

// keyUp event listener
// when a key is released, stop the sound
document.addEventListener("keyup", e => {
  const keyboardKey = e.code
  const noteDetail = getNoteDetail(keyboardKey)

  if (noteDetail == null) return

  noteDetail.active = false
  playNotes()
})

// getNoteDetail()
// matches keyboard input to const NOTE_DETAILS
// returns null if not found
// otherwise, returns the key from the constant!
function getNoteDetail(keyboardKey) {
  if (keyboardKey === "Semicolon") {
    return NOTE_DETAILS.find(n => `${n.key}` === ";") // semicolon edge case
  } else {
    return NOTE_DETAILS.find(n => `Key${n.key}` === keyboardKey)
  }
  
}

// playNotes()
// actives the class "active" for each note
function playNotes() {
  NOTE_DETAILS.forEach(n => {
    const keyElement = document.querySelector(`[data-note="${n.note}"]`) // select the class
    keyElement.classList.toggle("active", n.active) // toggle active

    if (n.oscillator != null) {
      n.oscillator.stop()       // stop the sound
      n.oscillator.disconnect() // remove from our audio context
    }
  })

  const activeNotes = NOTE_DETAILS.filter(n => n.active) // array of active notes
  const gain = 1 / activeNotes.length // makes the volume constant, prevents oscillators from stacking
  activeNotes.forEach(n => {
    startNote(n, gain)
  })
}

// startNote()
// takes in a note and plays that note
function startNote(noteDetail, gain){
  // preventing stacked oscillators
  const gainNode = audioContext.createGain()
  gainNode.gain.value = gain

  const oscillator = audioContext.createOscillator()
  oscillator.frequency.value = noteDetail.frequency // connect to the frequency

  oscillator.type = value
  oscillator.connect(gainNode).connect(audioContext.destination) // play through the speakers
  oscillator.start() 

  noteDetail.oscillator = oscillator // save a reference to make it a global variable
}

