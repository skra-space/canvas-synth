let devices = [];
// index = -1

// controller = null
// source = null

if (navigator.requestMIDIAccess) navigator.requestMIDIAccess().then(success, fail);
else alert("No MIDI support present in your browser.  Try Chrome.");

function success(midi) {
  listInputsAndOutputs(midi);
  startLoggingMIDIInput(midi);

  const inputs = midi.inputs.values();
  devices = [];
  for (let i = inputs.next(); i && !i.done; i = inputs.next()) {
    devices.push(i.value);
  }
  //   list();
  //   connect();
}

// function connect(source = "Midi Through", controller = "Arturia") {
//   const ctrl = find(controller);
//   const src = find(source);

//   if (!ctrl) {
//     console.warn("IO", "Could not connect " + controller);
//   } else {
//     console.info("IO", "Connected to controller " + ctrl.name);
//     ctrl.onmidimessage = onControl;
//   }

//   if (!src) {
//     console.warn("IO", "Could not connect " + source);
//   } else {
//     console.info("IO", "Connected to source " + src.name);
//     src.onmidimessage = onMessage;
//   }
// }

function onControl(msg) {
  if (msg.data[0] >= 176 && msg.data[0] < 184) {
    const ch = msg.data[0] - 176;
    const knob = msg.data[1] - 1;
    const val = msg.data[2];
    // mixer.tweak(ch, knob, val)
  } else if (msg.data[0] === 144) {
    const pad = msg.data[1];
    const vel = msg.data[2];
    // play(client.channel, pad, vel) // pass a channel here?
  }
}

function onMessage(msg) {
  const [channel, unit, value] = parse(msg.data);
  // console.log(`channel: ${channel}, unit: ${unit}, value: ${value}`);
  if (msg.data[0] >= 144 && msg.data[0] < 160) {
    const ch = msg.data[0] - 144;
    const pad = msg.data[1] - 24;
    const vel = msg.data[2];
    // play(ch, pad, vel);
  } else if (msg.data[0] >= 176 && msg.data[0] < 184) {
    const ch = msg.data[0] - 176;
    const knob = msg.data[1] - 1;
    const vel = msg.data[2];
    // mixer.tweak(ch, knob, vel)
  }
}

function startLoggingMIDIInput(midiAccess) {
  midiAccess.inputs.forEach((entry) => {
    entry.onmidimessage = onMessage;
  });
}

function parse(midiData) {
  const status = midiData[0];
  const data1 = midiData[1];
  const data2 = midiData[2];
  // console.log(`status: ${status.toString(2)}, data1: ${data1.toString(2)}, data2: ${data2.toString(2)}`);
  // console.log(`status: ${status.toString(16)}, data1: ${data1.toString(16)}, data2: ${data2.toString(16)}`);

  let channel;
  const unit = data1; // note or knob or pad
  const value = data2; // or velocity or pressure

  // Note off
  if (status >= 128 && status <= 143) {
    channel = status - 127;
  }

  // Note on
  if (status >= 144 && status <= 159) {
    channel = status - 143;
  }

  // Polyphonic Aftertouch
  if (status >= 160 && status <= 175) {
    channel = status - 159;
  }

  // knobs, Modulation Wheel etc.
  if (status >= 176 && status <= 191) {
    channel = status - 175;
    // const unit = data1;
    // const value = data2;
  }

  // // Channel Aftertouch not available in Arturia - may use later
  // if (status >= 208 && status <= 223) {
  // }

  // Pitch Bend Change
  if (status >= 224 && status <= 239) {
    channel = status - 223;
    const _ = data1; // 0, 127
  }

  // return `channel: ${channel}, unit: ${unit}, value: ${value}`;
  return [channel, unit, value];
}

// function find(name) {
//   for (const device of devices) {
//     if (device.name.indexOf(name) < 0) {
//       continue;
//     }
//     return device;
//   }
// }

// function list() {
//   console.info("Midi devices:");
//   for (const device of devices) {
//     console.info(device.name);
//   }
// }

function listInputsAndOutputs(midiAccess) {
  for (const entry of midiAccess.inputs) {
    const input = entry[1];
    console.log(
      `Input port [type:'${input.type}']
        id:'${input.id}'
        manufacturer:'${input.manufacturer}'
        name:'${input.name}'
        version:'${input.version}'`
    );
  }

  for (const entry of midiAccess.outputs) {
    const output = entry[1];
    console.log(
      `Output port [type:'${output.type}']
        id:'${output.id}' 
        manufacturer:'${output.manufacturer}' 
        name:'${output.name}' 
        version:'${output.version}'`
    );
  }
}

function fail(err) {
  console.log(`Failed to get MIDI access - ${err}`);
}

export function send_midi(msg) {
  parse(msg);
}
