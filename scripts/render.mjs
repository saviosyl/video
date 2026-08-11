/**
 * Render helper: detects assets, generates backing audio, renders MP4.
 */
import {spawnSync} from 'child_process';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const pub = path.join(root, 'public');
const outDir = path.join(root, 'out');
const outFile = path.join(outDir, 'little-buddies-intro.mp4');

fs.mkdirSync(outDir, {recursive: true});
fs.mkdirSync(path.join(pub, 'audio'), {recursive: true});

if (!fs.existsSync(path.join(pub, 'logo.png'))) {
  console.error('Missing public/logo.png — place the supplied Little Buddies logo there (unaltered).');
  process.exit(1);
}

const gen = spawnSync('node', [path.join(__dirname, 'generate-backing-audio.mjs')], {
  cwd: root,
  stdio: 'inherit',
});
if (gen.status !== 0) process.exit(gen.status ?? 1);

const vocalCandidates = [
  'audio/vocal.wav',
  'audio/vocal.mp3',
  'audio/little-buddies-vocal.wav',
  'audio/little-buddies-vocal.mp3',
];
const vocalFile = vocalCandidates.find((f) => fs.existsSync(path.join(pub, f))) || '';
const props = JSON.stringify({vocalFile, hasBacking: true});
console.log('Render props:', props);

const args = [
  'remotion',
  'render',
  'LittleBuddiesIntro',
  outFile,
  '--codec=h264',
  '--image-format=png',
  '--crf=18',
  `--props=${props}`,
];

const render = spawnSync('npx', args, {cwd: root, stdio: 'inherit'});
process.exit(render.status ?? 1);
