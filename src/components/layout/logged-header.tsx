import type {
  IonToggleCustomEvent,
  ToggleChangeEventDetail,
} from '@ionic/core';
import { IonHeader, IonImg, IonRouterLink, IonToggle } from '@ionic/react';
import { useEffect, useState } from 'react';

import { urls } from '../../constants/urls';
import { heliumPayPath } from '../../routing/navigation-tree';
import type { ThemeType } from '../../theme/const';
import { themeType } from '../../theme/const';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';

export function LoggedHeader() {
  const [storedTheme, setStoredTheme] = useLocalStorage(
    'theme',
    themeType.SYSTEM as ThemeType
  );

  const [isDarkMode, setIsDarkMode] = useState(storedTheme === themeType.DARK);

  const toggleDarkTheme = (shouldAdd: boolean) => {
    document.body.classList.toggle('dark', shouldAdd);
  };

  useEffect(() => {
    if (storedTheme === themeType.DARK || storedTheme === themeType.LIGHT) {
      toggleDarkTheme(storedTheme === themeType.DARK);
      setIsDarkMode(storedTheme === themeType.DARK);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    toggleDarkTheme(prefersDark.matches);
    setIsDarkMode(prefersDark.matches);
    prefersDark.addEventListener('change', (mediaQuery) => {
      toggleDarkTheme(mediaQuery.matches);
      setIsDarkMode(mediaQuery.matches);
    });
  }, []);

  // TODO: Can this be only triggered by user click but not value changing?
  const handleToggleTheme = (
    e: IonToggleCustomEvent<ToggleChangeEventDetail>
  ) => {
    toggleDarkTheme(e.detail.checked);
    setIsDarkMode(e.detail.checked);
    setStoredTheme(e.detail.checked ? themeType.DARK : themeType.LIGHT);
  };

  return (
    <IonHeader
      className="ion-no-border"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#5B299C',
        gap: '160px',
        height: '72px',
      }}
    >
      <IonRouterLink routerLink={heliumPayPath(urls.loggedFunction)}>
        <IonImg
          alt={''}
          src="/shared-assets/images/layout/logged-icon.png"
          style={{ width: '75px', height: '30px' }}
        />
      </IonRouterLink>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <IonImg
          alt={''}
          src="/shared-assets/images/layout/avatar.png"
          style={{ width: '40px', height: '40px' }}
        />
        <IonToggle checked={isDarkMode} onIonChange={handleToggleTheme} />
      </div>
    </IonHeader>
  );
}
