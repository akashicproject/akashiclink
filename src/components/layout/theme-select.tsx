import './theme-select.css';

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
    if (storedTheme === themeType.DARK || storedTheme === themeType.LIGHT) {
      toggleDarkTheme(storedTheme === themeType.DARK);
      return;
    }

    // Infer theme to set
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    toggleDarkTheme(prefersDark.matches);
    prefersDark.addEventListener('change', (mediaQuery) => {
      toggleDarkTheme(mediaQuery.matches);
    });
  }, [storedTheme]);

  /**
   * Add 'dark' to all elements on the page
   */
  const toggleDarkTheme = (setDark: boolean) => {
    document.body.classList.toggle('dark', setDark);
  };

  return (
    <>
      {/* eslint-disable */}
      <div
        className="slider-button"
        onClick={() => {
          setStoredTheme(
            storedTheme === themeType.LIGHT ? themeType.DARK : themeType.LIGHT
          );
          props.updateTheme(
            storedTheme === themeType.LIGHT ? themeType.DARK : themeType.LIGHT
          );
        }}
      >
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
