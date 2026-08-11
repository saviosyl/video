import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  EMPHASIS_START,
  FPS,
  LOGO_ENTER_START,
  SETTLE_START,
  SETTLE_END,
} from '../config/timing';

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  phase: number;
  kind: 'dot' | 'star';
  depth: number;
};

const COLORS = [
  '#FF8FAB', // soft rose
  '#FFD166', // warm yellow
  '#7BDFF2', // sky
  '#B5E48C', // mint
  '#FFB4A2', // peach
  '#A0C4FF', // periwinkle-soft (not purple-heavy)
  '#FFFFFF',
];

function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function makeParticles(count: number): Particle[] {
  return Array.from({length: count}, (_, i) => {
    const r1 = seeded(i + 1);
    const r2 = seeded(i + 17);
    const r3 = seeded(i + 41);
    const r4 = seeded(i + 73);
    const r5 = seeded(i + 99);
    return {
      id: i,
      x: r1 * 100,
      y: r2 * 100,
      size: 4 + r3 * 10,
      color: COLORS[Math.floor(r4 * COLORS.length)]!,
      speed: 0.35 + r5 * 0.85,
      phase: r1 * Math.PI * 2,
      kind: r3 > 0.62 ? 'star' : 'dot',
      depth: 0.4 + r2 * 0.6,
    };
  });
}

const Star: React.FC<{size: number; color: string; opacity: number}> = ({
  size,
  color,
  opacity,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{opacity, display: 'block'}}>
    <path
      d="M12 2.2l2.4 6.6h7l-5.6 4.2 2.2 6.8L12 16.8 6 19.8l2.2-6.8L2.6 8.8h7L12 2.2z"
      fill={color}
    />
  </svg>
);

export const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  const particles = useMemo(() => makeParticles(28), []);

  const appear = spring({
    frame: frame - LOGO_ENTER_START * fps,
    fps,
    config: {damping: 200, stiffness: 80, mass: 1},
  });

  const celebrate = interpolate(
    t,
    [SETTLE_START, (SETTLE_START + SETTLE_END) / 2, SETTLE_END],
    [0, 1, 0.35],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const emphasisBoost = interpolate(
    t,
    [EMPHASIS_START, EMPHASIS_START + 0.18, EMPHASIS_START + 0.55],
    [0, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {particles.map((p) => {
        const floatY = Math.sin(t * p.speed + p.phase) * (10 * p.depth);
        const floatX = Math.cos(t * p.speed * 0.7 + p.phase) * (8 * p.depth);
        const twinkle =
          0.35 +
          0.45 * (0.5 + 0.5 * Math.sin(t * (1.4 + p.speed) + p.phase)) +
          celebrate * 0.25 +
          emphasisBoost * 0.2;

        // Keep particles around the logo zone, not a full-screen snowstorm
        const left = 18 + p.x * 0.64;
        const top = 12 + p.y * 0.72;

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${top}%`,
              transform: `translate(${floatX}px, ${floatY - celebrate * 12 * p.depth}px) scale(${
                0.85 + appear * 0.15 + celebrate * 0.12
              })`,
              opacity: Math.min(1, appear * twinkle * (0.55 + p.depth * 0.35)),
              filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.35))',
            }}
          >
            {p.kind === 'star' ? (
              <Star size={p.size * 1.35} color={p.color} opacity={1} />
            ) : (
              <div
                style={{
                  width: p.size,
                  height: p.size,
                  borderRadius: '50%',
                  background: p.color,
                }}
              />
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
