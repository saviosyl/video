/**
 * Detects optional vocal / backing assets and prints Remotion props JSON.
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(__dirname, '..', 'public');

const vocalCandidates = [
  'audio/vocal.wav',
  'audio/vocal.mp3',
  'audio/little-buddies-vocal.wav',
  'audio/little-buddies-vocal.mp3',
];

const vocalFile = vocalCandidates.find((f) => fs.existsSync(path.join(pub, f))) || '';
const hasBacking = fs.existsSync(path.join(pub, 'audio/backing.wav'));
const hasLogo = fs.existsSync(path.join(pub, 'logo.png'));

const props = {vocalFile, hasBacking};
console.log(JSON.stringify({props, hasLogo, hasBacking, vocalFile}, null, 2));
