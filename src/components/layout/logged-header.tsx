import { IonHeader, IonImg, IonRouterLink, isPlatform } from '@ionic/react';
import { useState } from 'react';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import type { ThemeType } from '../../theme/const';
import { themeType } from '../../theme/const';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { LanguageDropdown } from './language-select';
import { ThemeSelect } from './theme-select';

export function LoggedHeader({ loggedIn }: { loggedIn?: boolean }) {
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
        background: loggedIn
          ? 'var(--ion-logged-header)'
          : 'var(--ion-background-color)',
        justifyContent: 'space-between',
        height: isMobile ? '72px' : '60px',
        gap: '10px',
        padding: loggedIn ? '0px 32px' : '0px',
      }}
    >
      {!loggedIn && <LanguageDropdown />}
      <IonRouterLink
        routerLink={loggedIn ? akashicPayPath(urls.loggedFunction) : undefined}
      >
        <IonImg
          alt={''}
          src={
            loggedIn || currentTheme === themeType.DARK
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
