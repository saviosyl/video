import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {FPS} from '../config/timing';

/**
 * Soft pastel preschool atmosphere — gentle parallax blobs & light wash.
 * Not a flat single-color slide; no overstimulating patterns.
 */
export const SoftBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const driftA = Math.sin(t * 0.55) * 18;
  const driftB = Math.cos(t * 0.42) * 22;
  const driftC = Math.sin(t * 0.33 + 1.2) * 14;
  const breathe = interpolate(Math.sin(t * 0.8), [-1, 1], [0.96, 1.04]);

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 50% 42%, #fff9f0 0%, #e8f6ff 45%, #d9f3ea 78%, #cfe9ff 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Warm peach glow — upper left */}
      <div
        style={{
          position: 'absolute',
          width: 920,
          height: 920,
          left: -180 + driftA,
          top: -260 + driftB * 0.4,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255, 196, 160, 0.55) 0%, rgba(255, 196, 160, 0) 68%)',
          transform: `scale(${breathe})`,
          filter: 'blur(2px)',
        }}
      />

      {/* Soft sky blue — right */}
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          right: -320 + driftB,
          top: -40 + driftA * 0.5,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(140, 210, 255, 0.5) 0%, rgba(140, 210, 255, 0) 70%)',
          transform: `scale(${1.02 - (breathe - 1)})`,
        }}
      />

      {/* Mint accent — bottom */}
      <div
        style={{
          position: 'absolute',
          width: 980,
          height: 720,
          left: '18%',
          bottom: -280 + driftC,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(160, 235, 200, 0.48) 0%, rgba(160, 235, 200, 0) 72%)',
        }}
      />

      {/* Soft butter highlight behind logo zone */}
      <div
        style={{
          position: 'absolute',
          width: 760,
          height: 520,
          left: '50%',
          top: '46%',
          transform: `translate(-50%, -50%) scale(${breathe})`,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255, 255, 255, 0.72) 0%, rgba(255, 248, 220, 0.35) 40%, rgba(255, 255, 255, 0) 72%)',
        }}
      />

      {/* Subtle vignette for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 75% 65% at 50% 48%, transparent 40%, rgba(120, 160, 190, 0.12) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
