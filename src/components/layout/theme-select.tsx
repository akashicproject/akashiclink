import './theme-select.scss';

import { IonIcon } from '@ionic/react';
import { moon, sunny } from 'ionicons/icons';

import { themeType } from '../../theme/const';
import { Toggle } from '../common/toggle/toggle';
import { useTheme } from '../providers/PreferenceProvider';

/**
 * Slider prototyped of stack overflow answer, for toggling theme
 */
export function ThemeSelect() {
  const [storedTheme, setStoredTheme] = useTheme();

  /**
   * Callback to call when slider is switched
   */
  const handleThemeUpdate = async () => {
    const newTheme =
      storedTheme === themeType.LIGHT ? themeType.DARK : themeType.LIGHT;

    if (setStoredTheme) {
      setStoredTheme(newTheme);
    }
  };

  // Shorthand for setting css props of the slider
  const isDarkMode =
    storedTheme === themeType.DARK ||
    (storedTheme === themeType.SYSTEM &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <Toggle
      onClickHandler={handleThemeUpdate}
      currentState={isDarkMode ? 'active' : 'inActive'}
      containerStyle={{ alignSelf: 'base-line' }}
      sliderStyle={{
        backgroundColor: isDarkMode ? '#7444B6' : '#C297FF',
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
