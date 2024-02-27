import { send_midi } from "./midi.js";
import { play, tweak } from "./synth.js";

const faders = document.querySelectorAll(".fader");
faders.forEach((e) =>
  e.addEventListener("input", () => {
    send_midi([0xbd, parseInt(e.id), parseInt(e.value)]);
    tweak(parseInt(e.id), parseInt(e.value));
  })
);

const keys = ["KeyA", "KeyW", "KeyS", "KeyE", "KeyD", "KeyF", "KeyT", "KeyG", "KeyY", "KeyH", "KeyU", "KeyJ"];
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let octave = 4;
function add_octave() {
  octave++;
  if (octave > 7) {
    octave = 7;
  }
}
function min_octave() {
  octave--;
  if (octave < 0) {
    octave = 0;
  }
}

function note2midi(note, note_on) {
  const midi = Tone.Frequency("" + note + octave).toMidi();
  note_on ? send_midi([0x9d, midi, 0x64]) : send_midi([0x8d, midi, 0x64]);

  document.getElementById(note).classList.toggle("active");

  play(note + octave, 100, note_on);
}

const key2note = (key, note_on) => {
  const note = notes[keys.indexOf(key)];
  if (note) {
    note2midi(note, note_on);
  }
};

function change_octave(key) {
  if (key === "KeyZ") {
    min_octave();
  }
  if (key === "KeyX") {
    add_octave();
  }
}

document.querySelectorAll(".key").forEach((e) => e.addEventListener("mousedown", () => note2midi(e.id, true)));
document.querySelectorAll(".key").forEach((e) => e.addEventListener("mouseup", () => note2midi(e.id, false)));

document.addEventListener("keydown", (e) => (e.repeat ? 0 : key2note(e.code, true)));
document.addEventListener("keydown", (e) => (e.repeat ? 0 : change_octave(e.code)));
document.addEventListener("keyup", (e) => key2note(e.code, false));
