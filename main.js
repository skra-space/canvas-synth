import { get_params, get_waveform } from "./synth.js";

for (let i = 1; i < 8; i++) {
  const fader = document.getElementById("0").cloneNode(true);
  fader.setAttribute("id", i);
  fader.setAttribute("name", "fader-" + i);
  document.getElementById("faders").appendChild(fader);
}

let params = {};
let wave = [];

const x1 = 120;
const x2 = 190;
const x3 = 260;
const x4 = 330;

const y1 = 60;
const y2 = 80;
const y3 = 120;
const y4 = 160;
const y5 = 180;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

///////        For sharper pixels:        /////////////////////////////////////
const dpr = window.devicePixelRatio;
const rect = canvas.getBoundingClientRect();

// Set the "actual" size of the canvas
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

// Scale the context to ensure correct drawing operations
ctx.scale(dpr, dpr);

// Set the "drawn" size of the canvas
canvas.style.width = `${rect.width}px`;
canvas.style.height = `${rect.height}px`;
///////////////////////////////////////////////////////////////////////////////

function hline(x, y, l) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + l, y);
  ctx.stroke();
}

function vline(x, y, h) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h);
  ctx.stroke();
}

function circle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
}

function draw_grid() {
  vline(120, 0, 240);
  vline(190, 0, 240);
  vline(260, 0, 240);
  vline(330, 0, 240);

  hline(0, 120, 400);
}

function clean_frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function map_range(value, inMin, inMax, outMin, outMax) {
  const slope = (outMax - outMin) / (inMax - inMin);
  return outMin + slope * (value - inMin);
}

function draw_waveform(values) {
  ctx.save();
  ctx.translate(0, 240);
  ctx.rotate((270 * Math.PI) / 180);

  ctx.beginPath();
  ctx.moveTo(0, Math.floor(map_range(values[0], -1, 1, 80, 30)));

  for (let i = 0; i < 400; i++) {
    ctx.lineTo(1 + i, Math.floor(map_range(values[i], -1, 1, 80, 30)));
  }

  ctx.stroke();
  ctx.restore();
}

function update_controls() {
  params = get_params();
  wave = get_waveform();
}

function draw_frame(params) {
  ctx.font = "16px monospace";
  let x = x1;
  let y = y1;
  for (const [key, value] of Object.entries(params)) {
    ctx.fillText(key, x + 5, y);
    ctx.fillText(value, x + 5, y + 20);
    x += 70;
    if (x > 330) {
      x = x1;
      y = y4;
    }
  }
}

let acc = 0;

window.main = () => {
  window.requestAnimationFrame(main);

  clean_frame();
  // draw_grid();
  draw_frame(params);
  draw_waveform(wave);

  if (acc) {
    update_controls();
  }

  acc > 20 ? (acc = 0) : acc++;
};

main();
