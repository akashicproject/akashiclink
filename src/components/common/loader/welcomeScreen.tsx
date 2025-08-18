import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

import splashAnimation from './akashic_welcome_animation.json';
import { FullScreenBlock } from './full-screen-block';

interface SplashScreenProps {
  onFinish?: () => void;
}

export function WelcomeScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'exit' | 'done'>('enter');

  useEffect(() => {
    const playTimer = setTimeout(() => setPhase('exit'), 2800);
    return () => clearTimeout(playTimer);
  }, []);

  useEffect(() => {
    if (phase === 'exit') {
      const exitTimer = setTimeout(() => setPhase('done'), 600);
      return () => clearTimeout(exitTimer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'done') {
      onFinish && onFinish();
    }
  }, [phase, onFinish]);

  if (phase === 'done') return null;

  if (process.env.REACT_APP_DEBUG_DISABLE_STARTING_ANIMATION === 'true')
    return null;

  return (
    <FullScreenBlock isTransparent={phase !== 'enter'}>
      <div
        style={{
          width: 200,
          height: 200,
          margin: '0 auto',
          marginTop: `calc(50vh - ${phase === 'enter' ? '130px' : '234px'})`,
          transition: 'margin 0.6s ease-in-out',
        }}
      >
        <Lottie animationData={splashAnimation} loop={false} />
      </div>
    </FullScreenBlock>
  );
}
