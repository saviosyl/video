/**
 * Soft original musical bed for the Little Buddies intro.
 * Simple plucked / soft-pad tones — no ding-dong, no nursery rhyme, no long music.
 *
 * Writes: public/audio/backing.wav (~4.0s stereo 44.1kHz)
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'audio');
const outFile = path.join(outDir, 'backing.wav');

const SAMPLE_RATE = 44100;
const DURATION = 4.0;
const NUM_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

fs.mkdirSync(outDir, {recursive: true});

/** Gentle pentatonic-ish plucks (C major colors, soft & friendly) */
const NOTES = [
  {freq: 523.25, start: 0.08, dur: 0.55, gain: 0.11}, // C5
  {freq: 659.25, start: 0.28, dur: 0.5, gain: 0.09}, // E5
  {freq: 783.99, start: 0.48, dur: 0.55, gain: 0.1}, // G5
  {freq: 987.77, start: 1.28, dur: 0.7, gain: 0.13}, // B5 — lifts with “Little Buddies!”
  {freq: 783.99, start: 1.42, dur: 0.65, gain: 0.1}, // G5
  {freq: 659.25, start: 1.58, dur: 0.7, gain: 0.09}, // E5
  {freq: 523.25, start: 2.75, dur: 0.85, gain: 0.08}, // soft settle C5
  {freq: 392.0, start: 2.9, dur: 0.95, gain: 0.07}, // G4
];

function midiLikeEnv(t, dur) {
  // Plucky envelope: quick attack, soft exponential decay
  const attack = 0.012;
  if (t < 0) return 0;
  if (t < attack) return t / attack;
  const decay = Math.exp(-(t - attack) * 3.2);
  const tail = t > dur ? 0 : 1;
  return decay * tail;
}

function softPad(t) {
  // Very quiet evolving bed — not a melody
  const a = Math.sin(2 * Math.PI * 196.0 * t) * 0.012;
  const b = Math.sin(2 * Math.PI * 246.94 * t) * 0.01;
  const c = Math.sin(2 * Math.PI * 329.63 * t) * 0.008;
  const swell =
    t < 0.4
      ? t / 0.4
      : t > 3.5
        ? Math.max(0, 1 - (t - 3.5) / 0.5)
        : 1;
  return (a + b + c) * swell * 0.55;
}

const left = new Float64Array(NUM_SAMPLES);
const right = new Float64Array(NUM_SAMPLES);

for (let i = 0; i < NUM_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;
  let l = softPad(t);
  let r = softPad(t + 0.002);

  for (const n of NOTES) {
    const local = t - n.start;
    if (local < 0 || local > n.dur + 0.4) continue;
    const env = midiLikeEnv(local, n.dur) * n.gain;
    // Soft plucked: fundamental + gentle partials (no harsh square/ding)
    const pluck =
      Math.sin(2 * Math.PI * n.freq * local) * 0.72 +
      Math.sin(2 * Math.PI * n.freq * 2 * local) * 0.18 * Math.exp(-local * 6) +
      Math.sin(2 * Math.PI * n.freq * 3 * local) * 0.06 * Math.exp(-local * 10);
    // Tiny stereo spread per note
    const pan = ((n.freq % 100) / 100) * 0.2 - 0.1;
    l += pluck * env * (1 - pan);
    r += pluck * env * (1 + pan);
  }

  // Soft noise shimmer (very quiet)
  const shimmer = (Math.random() * 2 - 1) * 0.004 * Math.exp(-t * 0.15);
  l += shimmer;
  r += shimmer;

  // Soft clip / limit
  left[i] = Math.tanh(l * 1.15);
  right[i] = Math.tanh(r * 1.15);
}

// Fade out cleanly in the last 0.35s
const fadeStart = Math.floor((DURATION - 0.35) * SAMPLE_RATE);
for (let i = fadeStart; i < NUM_SAMPLES; i++) {
  const g = 1 - (i - fadeStart) / (NUM_SAMPLES - fadeStart);
  left[i] *= g;
  right[i] *= g;
}

function floatTo16BitPCM(floatArr) {
  const buf = Buffer.alloc(floatArr.length * 2);
  for (let i = 0; i < floatArr.length; i++) {
    const s = Math.max(-1, Math.min(1, floatArr[i]));
    buf.writeInt16LE((s * 0x7fff) | 0, i * 2);
  }
  return buf;
}

const dataSize = NUM_SAMPLES * 2 * 2;
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + dataSize, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(2, 22); // stereo
header.writeUInt32LE(SAMPLE_RATE, 24);
header.writeUInt32LE(SAMPLE_RATE * 2 * 2, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(dataSize, 40);

const pcmL = floatTo16BitPCM(left);
const pcmR = floatTo16BitPCM(right);
const interleaved = Buffer.alloc(dataSize);
for (let i = 0; i < NUM_SAMPLES; i++) {
  pcmL.copy(interleaved, i * 4, i * 2, i * 2 + 2);
  pcmR.copy(interleaved, i * 4 + 2, i * 2, i * 2 + 2);
}

fs.writeFileSync(outFile, Buffer.concat([header, interleaved]));
console.log(`Wrote ${outFile} (${DURATION}s stereo)`);
