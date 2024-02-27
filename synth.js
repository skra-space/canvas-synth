const osc = new Tone.OmniOscillator();
const wave = new Tone.Waveform(512);
const filter = new Tone.Filter(1500, "lowpass");

const env = new Tone.AmplitudeEnvelope({
  attack: 0.2,
  decay: 0.2,
  sustain: 1,
  release: 0.2,
});

osc.chain(filter, wave, env, Tone.Destination);

function map_range(value, inMin, inMax, outMin, outMax) {
  const slope = (outMax - outMin) / (inMax - inMin);
  return outMin + slope * (value - inMin);
}

function midi2freq(value) {
  return Math.floor(map_range(value, 0, 127, 20, 20000));
}
function freq2midi(value) {
  return Math.floor(map_range(value, 20, 20000, 0, 127));
}

function env2midi(value) {
  return Math.floor(map_range(value, 0, 2, 0, 127));
}
function midi2env(value) {
  return map_range(value, 0, 127, 0, 2);
}

const mapping = {
  0: (v) => (filter.frequency.value = midi2freq(v)),
  1: (v) => (filter.Q.value = map_range(v, 0, 127, 0, 20)),
  2: (v) => console.log(v),
  3: (v) => (filter.Q.value = map_range(v, 0, 127, 0, 20)),
  4: (v) => (env.attack = map_range(v, 0, 127, 0, 2)),
  5: (v) => (env.decay = map_range(v, 0, 127, 0, 2)),
  6: (v) => (env.sustain = map_range(v, 0, 127, 0, 1)),
  7: (v) => (env.release = map_range(v, 0, 127, 0, 2)),
};

export const get_waveform = () => wave.getValue();

export function get_params() {
  return {
    freq: Math.floor(filter.frequency.value),
    res: filter.Q.value.toFixed(2),
    attack: env.attack.toFixed(2),
    decay: env.decay.toFixed(2),
    sus: env.sustain.toFixed(2),
    rel: env.release.toFixed(2),
  };
}

export function play(note, velocity, note_on) {
  if (note_on) {
    osc.start();
    osc.set({
      frequency: note,
    });
    env.triggerAttack();
  } else {
    env.triggerRelease();
  }
}
export function tweak(id, value) {
  mapping[id](value);
}
