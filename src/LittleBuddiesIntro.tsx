import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {SoftBackground} from './components/SoftBackground';
import {Particles} from './components/Particles';
import {LogoMark} from './components/LogoMark';
import {BACKING_AUDIO_FILE} from './config/assets';
import {secToFrame, VOCAL_CUE} from './config/timing';

export type IntroProps = {
  /** Path under public/ for the children’s vocal (empty string = none) */
  vocalFile: string;
  /** Whether soft backing bed exists */
  hasBacking: boolean;
};

/**
 * LITTLE BUDDIES — premium preschool YouTube intro (~4s)
 *
 * Timeline (see src/config/timing.ts):
 * 0.00–0.40  soft pastel atmosphere
 * 0.40–1.10  logo elastic entrance (scale + slight rise)
 * 1.10–2.70  hold + particles + breath; emphasis bounce @ ~1.3s (“Little Buddies!”)
 * 2.70–3.50  settle + soft celebration
 * 3.50–4.00  clean hold for transition into the episode
 */
export const LittleBuddiesIntro: React.FC<IntroProps> = ({
  vocalFile,
  hasBacking,
}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#e8f6ff'}}>
      <SoftBackground />
      <Particles />
      <LogoMark />

      {hasBacking ? (
        <Audio src={staticFile(BACKING_AUDIO_FILE)} volume={0.26} />
      ) : null}

      {vocalFile ? (
        <Sequence from={secToFrame(VOCAL_CUE)} layout="none">
          <Audio src={staticFile(vocalFile)} volume={1} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
