import { CountdownCircleTimer } from 'react-countdown-circle-timer';

// TODO: Link this with the backend value
const ACTIVATION_CODE_EXPIRY_IN_MINUTES = 5;

/**
 * Countdown timer after activation code is submitted.
 * To reset, unmount and mount the component
 * i.e. `someCondition && <ActivationTimer/>`
 *
 * @param onComplete action to carry out once timer elapses
 */
export function ActivationTimer(props: { onComplete: () => void }) {
  return (
    <CountdownCircleTimer
      isPlaying
      duration={
        // TODO: This should be fetched from backend
        ACTIVATION_CODE_EXPIRY_IN_MINUTES * 60
      }
      size={50}
      strokeWidth={6}
      colors="#7444b6"
      {...props}
    >
      {({ remainingTime }) => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = String(remainingTime % 60).padStart(2, '0');

        return `${minutes}:${seconds}`;
      }}
    </CountdownCircleTimer>
  );
}
