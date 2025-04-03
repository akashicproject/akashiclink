import { IonHeader, IonImg, IonRouterLink, isPlatform } from '@ionic/react';
import { useState } from 'react';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import type { ThemeType } from '../../theme/const';
import { themeType } from '../../theme/const';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { LanguageDropdown } from './language-select';
import { ThemeSelect } from './theme-select';

export function LoggedHeader(props: { loggedIn?: boolean }) {
  const isMobile = isPlatform('mobile');

  const [_, __, storedTheme] = useLocalStorage(
    'theme',
    themeType.SYSTEM as ThemeType
  );
  const [currentTheme, setCurrentTheme] = useState(storedTheme);

  return (
    <IonHeader
      className="ion-no-border"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        background: props.loggedIn
          ? 'var(--ion-logged-header)'
          : 'var(--ion-background-color)',
        justifyContent: 'space-between',
        height: isMobile ? '72px' : '40px',
        gap: '10px',
      }}
    >
      <LanguageDropdown />
      <IonRouterLink routerLink={akashicPayPath(urls.loggedFunction)}>
        <IonImg
          alt={''}
          src={
            props.loggedIn || currentTheme === themeType.DARK
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
        <ThemeSelect updateTheme={setCurrentTheme} />
      </div>
    </IonHeader>
  );
}
