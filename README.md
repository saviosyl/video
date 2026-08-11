# Little Buddies — YouTube Intro

Premium preschool-style animated intro for the **LITTLE BUDDIES** YouTube channel.

- **Resolution:** 1920 × 1080 (16:9)
- **Frame rate:** 60 FPS
- **Duration:** 4.0 seconds
- **Engine:** [Remotion](https://www.remotion.dev/) (deterministic, editable)

## Important: logo usage

Place your final logo at:

```text
public/logo.png
```

The project uses that file **exactly as provided**. It does **not** redesign the logo, regenerate the character, or alter the LITTLE BUDDIES text. Animation only moves/scales the image container (gentle elastic entrance + subtle breath/bounce).

## Replaceable assets

| Asset | Path | Notes |
| --- | --- | --- |
| Logo | `public/logo.png` | Required — your supplied artwork |
| Vocal | `public/audio/vocal.wav` (or `.mp3`) | Children singing “Little Buddies!” |
| Backing music | `public/audio/backing.wav` | Auto-generated soft plucked bed |

Also accepted vocal filenames:

- `public/audio/little-buddies-vocal.wav`
- `public/audio/little-buddies-vocal.mp3`

## Animation timeline

| Time | Action |
| --- | --- |
| 0.00–0.40s | Soft pastel atmosphere (not a blank hold) |
| 0.40–1.10s | Logo enters centre — scale-up, slight rise, elastic easing, soft shadow |
| 1.10–2.70s | Logo holds with floating particles, gentle parallax, subtle breath |
| ~1.30s | Emphasis bounce synced to “Little Buddies!” vocal |
| 2.70–3.50s | Soft celebratory settle |
| 3.50–4.00s | Clean hold for transition into the episode |

Timing knobs live in `src/config/timing.ts` (including `VOCAL_CUE = 1.3`).

## Commands

```bash
npm install
npm run generate:audio   # soft original backing bed
npm start                # Remotion Studio preview
npm run render           # writes out/little-buddies-intro.mp4
```

If a vocal file is present, pass it as a prop:

```bash
node scripts/detect-assets.mjs
npx remotion render LittleBuddiesIntro out/little-buddies-intro.mp4 \
  --props='{"vocalFile":"audio/vocal.wav","hasBacking":true}'
```

## Audio design

- Soft short plucked / pad bed (no ding-dong, no nursery rhyme, no long music)
- Children’s “Little Buddies!” vocal is the main audio identity when provided
- Vocal automatically starts at **1.3s** to match the logo bounce
