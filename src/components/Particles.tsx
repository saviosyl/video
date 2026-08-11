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
  angle: number;
  radius: number;
  size: number;
  color: string;
  speed: number;
  phase: number;
  kind: 'dot' | 'star';
  depth: number;
};

const COLORS = [
  '#FF8FAB',
  '#FFD166',
  '#7BDFF2',
  '#B5E48C',
  '#FFB4A2',
  '#A0C4FF',
  '#FFFFFF',
  '#FF9F1C',
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
      // Orbit around logo — keep clear of the badge centre
      angle: r1 * Math.PI * 2,
      radius: 280 + r2 * 220,
      size: 6 + r3 * 12,
      color: COLORS[Math.floor(r4 * COLORS.length)]!,
      speed: 0.25 + r5 * 0.55,
      phase: r1 * Math.PI * 2,
      kind: r3 > 0.55 ? 'star' : 'dot',
      depth: 0.45 + r2 * 0.55,
    };
  });
}

const Star: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
    <path
      d="M12 2.2l2.4 6.6h7l-5.6 4.2 2.2 6.8L12 16.8 6 19.8l2.2-6.8L2.6 8.8h7L12 2.2z"
      fill={color}
    />
  </svg>
);

export const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / FPS;
  const particles = useMemo(() => makeParticles(36), []);

  const appear = spring({
    frame: frame - LOGO_ENTER_START * fps,
    fps,
    config: {damping: 200, stiffness: 80, mass: 1},
  });

  const celebrate = interpolate(
    t,
    [SETTLE_START, (SETTLE_START + SETTLE_END) / 2, SETTLE_END],
    [0, 1, 0.4],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const emphasisBoost = interpolate(
    t,
    [EMPHASIS_START, EMPHASIS_START + 0.18, EMPHASIS_START + 0.55],
    [0, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const cx = width / 2;
  const cy = height / 2 - 10;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {particles.map((p) => {
        const ang = p.angle + t * 0.12 * p.speed;
        const float = Math.sin(t * p.speed + p.phase) * (14 * p.depth);
        const r = p.radius + float + celebrate * 18 * p.depth;
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r * 0.78;
        const twinkle =
          0.45 +
          0.5 * (0.5 + 0.5 * Math.sin(t * (1.6 + p.speed) + p.phase)) +
          celebrate * 0.3 +
          emphasisBoost * 0.25;

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${
                0.9 + appear * 0.15 + celebrate * 0.15 + emphasisBoost * 0.1
              })`,
              opacity: Math.min(1, appear * twinkle * (0.65 + p.depth * 0.35)),
              filter: 'drop-shadow(0 1px 3px rgba(255,255,255,0.5))',
            }}
          >
            {p.kind === 'star' ? (
              <Star size={p.size * 1.4} color={p.color} />
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
