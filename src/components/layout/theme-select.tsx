import './theme-select.scss';

import { IonIcon } from '@ionic/react';
import { moon, sunny } from 'ionicons/icons';
import { useEffect } from 'react';

import type { ThemeType } from '../../theme/const';
import { themeType } from '../../theme/const';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
interface Props {
  updateTheme: (val: ThemeType) => void;
}
/**
 * Slider prototyped of stack overflow answer, for toggling theme
 */
export function ThemeSelect(props: Props) {
  /**
   * Theme set across the app
   */
  const [storedTheme, setStoredTheme, _] = useLocalStorage(
    'theme',
    themeType.SYSTEM as ThemeType
  );

  // Shorthand for setting css props of the slider
  const isDarkMode = storedTheme === themeType.DARK;

  /**
   * Update theme across the app when it is changed
   */
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

  /**
   * Add 'dark' to all elements on the page
   */
  const toggleDarkTheme = (setDark: boolean) => {
    document.body.classList.toggle('dark', setDark);
    document.body.classList.toggle('light', !setDark);
    document.dispatchEvent(themeChangeEvent);
  };

  const handleThemeUpdate = () => {
    const newTheme =
      storedTheme === themeType.LIGHT ? themeType.DARK : themeType.LIGHT;

    setStoredTheme(newTheme);
    props.updateTheme(newTheme);
  };

  // Use event to listen for changes to theme made in other instances of this component
  // Not the best solution, but most straightforward for now
  const themeChangeEvent = new CustomEvent('themeChange', {
    detail: storedTheme,
  });
  document.addEventListener(
    'themeChange',
    (e) => {
      const theme = (e as CustomEvent).detail as ThemeType;
      setStoredTheme(theme);
    },
    false
  );

  return (
    <>
      {/* eslint-disable */}
      <div className="slider-button" onClick={handleThemeUpdate}>
        {/* eslint-enable */}
        <div className="slider">
          <div className={`slider-handle ${isDarkMode ? 'right' : 'left'}`}>
            <IonIcon icon={isDarkMode ? moon : sunny} />
          </div>
          <IonIcon
            className={`icon-handle ${isDarkMode ? 'right' : 'left'}`}
            icon={isDarkMode ? sunny : moon}
          />
        </div>
      </div>
    </>
  );
}
