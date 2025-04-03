import { IonIcon } from '@ionic/react';
import type { MouseEventHandler } from 'react';

import { useAppSelector } from '../../../redux/app/hooks';
import { selectTheme } from '../../../redux/slices/preferenceSlice';
import { themeType } from '../../../theme/const';
// #c2c1ff
export const CopyIcon = (props: {
  isGrey?: boolean;
  isPrimaryInDark?: boolean;
  size?: string;
  slot?: string;
  className?: string;
  style?: Record<string, string>;
  onClick?: MouseEventHandler;
}) => {
  const storedTheme = useAppSelector(selectTheme);

  return (
    <IonIcon
      className="icon-button-icon"
      //TODO: check why &[slot="icon-only"] does not work
      src={`/shared-assets/images/${
        props.isGrey
          ? 'copy-icon-grey.svg'
          : storedTheme === themeType.DARK
            ? props.isPrimaryInDark
              ? 'copy-icon-primary-70.svg'
              : 'copy-icon-white.svg'
            : 'copy-icon-primary-10.svg'
      }`}
      {...props}
    />
  );
};
