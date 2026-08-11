import React from 'react';
import {Composition, Folder} from 'remotion';
import {LittleBuddiesIntro, IntroProps} from './LittleBuddiesIntro';
import {DURATION_FRAMES, FPS} from './config/timing';

/**
 * Default props assume backing audio is generated and vocal may be absent.
 * Replace public/logo.png with the supplied Little Buddies logo (exact).
 * Drop vocal at public/audio/vocal.wav (or .mp3) — it auto-syncs at 1.3s.
 */
export const RemotionRoot: React.FC = () => {
  const defaultProps: IntroProps = {
    vocalFile: '',
    hasBacking: true,
  };

  return (
    <Folder name="Little-Buddies">
      <Composition
        id="LittleBuddiesIntro"
        component={LittleBuddiesIntro}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
        calculateMetadata={async ({props}) => {
          // Keep composition deterministic; props can toggle audio presence.
          return {
            props,
            durationInFrames: DURATION_FRAMES,
            fps: FPS,
          };
        }}
      />
    </Folder>
  );
};
