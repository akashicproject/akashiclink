import { IonImg } from '@ionic/react';

import { useAppSelector } from '../../redux/app/hooks';
import { selectTheme } from '../../redux/slices/preferenceSlice';
import { themeType } from '../../theme/const';

export const HeaderLogo = () => {
  const storedTheme = useAppSelector(selectTheme);
  const logoName =
    storedTheme === themeType.DARK
      ? 'wallet-logo-dark-public-header.svg'
      : 'wallet-logo-light-public-header.svg';

  return (
    <IonImg
      alt={''}
      src={`/shared-assets/images/${logoName}`}
      style={{ width: 112 }}
    />
  );
};
