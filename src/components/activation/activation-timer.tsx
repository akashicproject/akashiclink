import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import { themeType } from '../../theme/const';
import { useTheme } from '../PreferenceProvider';
// TODO: Link this with the backend value
const ACTIVATION_CODE_EXPIRY_IN_MINUTES = 6;

/**
 * Countdown timer after activation code is submitted.
 * To reset, unmount and mount the component
 * i.e. `someCondition && <ActivationTimer/>`
 *
 * @param onComplete action to carry out once timer elapses
 */
export function ActivationTimer({
  resetTrigger,
  ...props
}: {
  onComplete?: () => void;
  resetTrigger?: number;
}) {
  const [storedTheme] = useTheme();
  return (
    <CountdownCircleTimer
      isPlaying
      duration={
        // TODO: This should be fetched from backend
        ACTIVATION_CODE_EXPIRY_IN_MINUTES * 60
      }
      size={50}
      strokeWidth={6}
      colors={storedTheme === themeType.DARK ? '#C297ff' : '#7444b6'}
      key={resetTrigger}
      {...props}
    >
      {({ remainingTime }) => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = String(remainingTime % 60).padStart(2, '0');

        return (
          <h5 style={{ color: 'var(--ion-text-header)' }}>
            {minutes}:{seconds}
          </h5>
        );
      }}
    </CountdownCircleTimer>
  );
}
