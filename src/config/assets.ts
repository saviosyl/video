/**
 * Drop-in asset paths (files live in /public).
 *
 * Replace these files without touching animation code:
 * - public/logo.png              → your Little Buddies logo (exact, unaltered)
 * - public/audio/backing.wav     → soft musical bed (auto-generated)
 * - public/audio/vocal.wav|.mp3  → children singing “Little Buddies!”
 */
export const LOGO_FILE = 'logo.png';
export const BACKING_AUDIO_FILE = 'audio/backing.wav';
export const VOCAL_AUDIO_CANDIDATES = [
  'audio/vocal.wav',
  'audio/vocal.mp3',
  'audio/little-buddies-vocal.wav',
  'audio/little-buddies-vocal.mp3',
] as const;

/** Max logo display width as a fraction of composition width */
export const LOGO_MAX_WIDTH_RATIO = 0.58;
