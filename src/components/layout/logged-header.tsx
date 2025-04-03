import type {
  IonToggleCustomEvent,
  ToggleChangeEventDetail,
} from '@ionic/core';
import {
  IonHeader,
  IonImg,
  IonRouterLink,
  IonToggle,
  isPlatform,
} from '@ionic/react';
import { useEffect, useState } from 'react';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import type { ThemeType } from '../../theme/const';
import { themeType } from '../../theme/const';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { LanguageDropdown } from './language-select';

export function LoggedHeader(props: { loggedIn?: boolean }) {
  const [storedTheme, setStoredTheme] = useLocalStorage(
    'theme',
    themeType.SYSTEM as ThemeType
  );
  const isMobile = isPlatform('mobile');
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
  }, [storedTheme]);

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
        background: props.loggedIn ? '#290056' : '#F3F5F6',
        justifyContent: 'space-between',
        height: isMobile ? '72px' : '40px',
      }}
    >
      <LanguageDropdown />
      <IonRouterLink routerLink={akashicPayPath(urls.loggedFunction)}>
        <IonImg
          alt={''}
          src={
            props.loggedIn
              ? '/shared-assets/images/wallet-logo-white.svg'
              : '/shared-assets/images/wallet-logo-black.svg'
          }
          style={{ height: '100%' }}
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
        <IonToggle checked={isDarkMode} onIonChange={handleToggleTheme} />
      </div>
    </IonHeader>
  );
}
