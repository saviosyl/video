import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {LOGO_FILE, LOGO_MAX_WIDTH_RATIO} from '../config/assets';
import {
  EMPHASIS_END,
  EMPHASIS_START,
  LOGO_ENTER_END,
  LOGO_ENTER_START,
  FPS,
} from '../config/timing';

/**
 * Displays the supplied Little Buddies logo EXACTLY as provided.
 * Animation only applies container transforms (scale / translate) —
 * never skew, stretch, rotate-spin, or regenerate the artwork.
 */
export const LogoMark: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const t = frame / FPS;

  const enterLocalFrame = frame - LOGO_ENTER_START * fps;
  const enterProgress = spring({
    frame: Math.max(0, enterLocalFrame),
    fps,
    config: {
      damping: 12,
      stiffness: 120,
      mass: 0.85,
      overshootClamping: false,
    },
  });

  // Soft elastic scale-up + slight upward settle
  const enterScale = interpolate(enterProgress, [0, 1], [0.72, 1]);
  const enterY = interpolate(enterProgress, [0, 1], [36, 0]);
  const enterOpacity = interpolate(
    t,
    [LOGO_ENTER_START, LOGO_ENTER_START + 0.12, LOGO_ENTER_END],
    [0, 1, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Subtle breathing — never distorts the face (uniform scale only)
  const breath =
    t >= LOGO_ENTER_END
      ? 1 + Math.sin((t - LOGO_ENTER_END) * Math.PI * 1.15) * 0.012
      : 1;

  // Happy bounce synced to “Little Buddies!” vocal cue (~1.3s)
  // Spring 0→1 mapped through a half-sine so scale punches up then settles to 1.
  const emphasis = spring({
    frame: frame - EMPHASIS_START * fps,
    fps,
    config: {damping: 16, stiffness: 140, mass: 0.7},
    durationInFrames: Math.round((EMPHASIS_END - EMPHASIS_START) * fps),
  });
  const bounce = t >= EMPHASIS_START ? Math.sin(Math.min(1, Math.max(0, emphasis)) * Math.PI) : 0;
  const emphasisScale = 1 + bounce * 0.09;
  const emphasisY = -bounce * 16;

  const visible = t >= LOGO_ENTER_START - 0.02;
  if (!visible) {
    return null;
  }

  const logoWidth = width * LOGO_MAX_WIDTH_RATIO;
  const scale = enterScale * breath * emphasisScale;
  const translateY = enterY + emphasisY;

  // Soft contact shadow under the logo (separate layer so the artwork stays crisp)
  const shadowOpacity = 0.22 * enterOpacity;
  const shadowScaleX = interpolate(scale, [0.72, 1.08], [0.75, 1.05]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: logoWidth,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity: enterOpacity,
          willChange: 'transform, opacity',
        }}
      >
        {/* Soft elliptical ground shadow */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: -18,
            width: '70%',
            height: 36,
            transform: `translateX(-50%) scaleX(${shadowScaleX})`,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(70, 90, 110, 0.28) 0%, rgba(70, 90, 110, 0) 70%)',
            opacity: shadowOpacity,
            filter: 'blur(6px)',
            pointerEvents: 'none',
          }}
        />

        <Img
          src={staticFile(LOGO_FILE)}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            // Soft shadow on the mark itself — no color/hue alteration of pixels
            filter:
              'drop-shadow(0 14px 28px rgba(60, 90, 120, 0.18)) drop-shadow(0 4px 10px rgba(60, 90, 120, 0.12))',
            // Keep raster logo sharp
            imageRendering: 'auto',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
