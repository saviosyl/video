import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EMPHASIS_START, FPS, LOGO_ENTER_START, SETTLE_START} from '../config/timing';

/**
 * Soft halo / pulse behind the logo for depth — does not alter logo artwork.
 */
export const SoftAccentRing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;

  const enter = spring({
    frame: frame - LOGO_ENTER_START * fps,
    fps,
    config: {damping: 18, stiffness: 90, mass: 1},
  });

  const emphasis = interpolate(
    t,
    [EMPHASIS_START, EMPHASIS_START + 0.22, EMPHASIS_START + 0.7],
    [0, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const settle = interpolate(
    t,
    [SETTLE_START, SETTLE_START + 0.35, SETTLE_START + 0.9],
    [0, 0.7, 0.25],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  if (t < LOGO_ENTER_START) return null;

  const pulse = 1 + emphasis * 0.08 + settle * 0.03;
  const opacity = Math.min(1, enter) * (0.35 + emphasis * 0.35 + settle * 0.2);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          width: 820,
          height: 820,
          borderRadius: '50%',
          transform: `scale(${pulse})`,
          opacity,
          background:
            'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,230,160,0.28) 28%, rgba(160,220,255,0.18) 52%, rgba(160,220,255,0) 72%)',
          filter: 'blur(2px)',
        }}
      />
    </AbsoluteFill>
  );
};
