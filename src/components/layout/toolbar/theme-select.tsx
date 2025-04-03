import { IonIcon } from '@ionic/react';
import { moon, sunny } from 'ionicons/icons';

import { useAppDispatch, useAppSelector } from '../../../redux/app/hooks';
import { selectTheme, setTheme } from '../../../redux/slices/preferenceSlice';
import { themeType } from '../../../theme/const';
import { Toggle } from '../../common/toggle/toggle';

export function ThemeSelect() {
  const dispatch = useAppDispatch();
  const storedTheme = useAppSelector(selectTheme);

  const handleThemeUpdate = async () => {
    const newTheme =
      storedTheme === themeType.LIGHT ? themeType.DARK : themeType.LIGHT;

    dispatch(setTheme(newTheme));
  };

  // Shorthand for setting css props of the slider
  const isDarkMode = storedTheme === themeType.DARK;

  return (
    <Toggle
      onClickHandler={handleThemeUpdate}
      currentState={isDarkMode ? 'active' : 'inActive'}
      containerStyle={{ alignSelf: 'base-line' }}
      sliderStyle={{
        backgroundColor: isDarkMode
          ? 'var(--ion-color-primary)'
          : 'var(--ion-color-primary-70)',
      }}
      switchStyle={{ width: '60px' }}
      firstIcon={
        <IonIcon style={{ left: '1px', color: '#290056' }} icon={sunny} />
      }
      secondIcon={
        <IonIcon style={{ right: '1px', color: '#290056' }} icon={moon} />
      }
    />
  );
}
