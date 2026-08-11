/**
 * Central timing config — edit here to retune the intro.
 * All values are in seconds unless noted.
 */
export const FPS = 60;
export const DURATION_SECONDS = 4;
export const DURATION_FRAMES = Math.round(DURATION_SECONDS * FPS);

/** Soft pastel background is visible immediately */
export const BG_START = 0;

/** Logo entrance window */
export const LOGO_ENTER_START = 0.4;
export const LOGO_ENTER_END = 1.1;

/**
 * Children sing “Little Buddies!” here.
 * Place your vocal file so it starts at this timestamp.
 */
export const VOCAL_CUE = 1.3;

/** Happy emphasis bounce synced to the vocal */
export const EMPHASIS_START = 1.28;
export const EMPHASIS_END = 1.75;

/** Settling / soft celebration */
export const SETTLE_START = 2.7;
export const SETTLE_END = 3.5;

/** Clean hold for transition into the educational video */
export const HOLD_START = 3.5;

export const secToFrame = (sec: number) => Math.round(sec * FPS);
export const frameToSec = (frame: number) => frame / FPS;
