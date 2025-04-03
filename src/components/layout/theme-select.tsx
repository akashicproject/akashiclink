import './theme-select.scss';

import { IonIcon } from '@ionic/react';
import { moon, sunny } from 'ionicons/icons';
import { useEffect } from 'react';

import { themeType } from '../../theme/const';
import { useTheme } from '../PreferenceProvider';
import { Toggle } from '../toggle/toggle';
/**
 * Slider prototyped of stack overflow answer, for toggling theme
 */
export function ThemeSelect() {
  const [storedTheme, setStoredTheme] = useTheme();

  // Update theme across the app when it is changed
  useEffect(() => {
    if (storedTheme !== themeType.SYSTEM) {
      toggleDarkTheme(storedTheme === themeType.DARK);
    } else {
      // Infer theme to set
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      toggleDarkTheme(prefersDark.matches);
      prefersDark.addEventListener('change', (mediaQuery) => {
        toggleDarkTheme(mediaQuery.matches);
      });
    }
  }, [storedTheme]);

  // Add 'dark' to all elements on the page
  const toggleDarkTheme = (setDark: boolean) => {
    document.body.classList.toggle('dark', setDark);
    document.body.classList.toggle('light', !setDark);
  };

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
      firstIcon={<IonIcon style={{ left: '1px' }} icon={sunny} />}
      secondIcon={<IonIcon style={{ right: '1px' }} icon={moon} />}
    />
  );
}
