import { IonHeader, IonImg, IonRouterLink, isPlatform } from '@ionic/react';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import type { ThemeType } from '../../theme/const';
import { themeType } from '../../theme/const';
import { useTheme } from '../PreferenceProvider';
import { LanguageDropdown } from './language-select';
import { ThemeSelect } from './theme-select';

export function LoggedHeader({ loggedIn }: { loggedIn?: boolean }) {
  const isMobile = isPlatform('mobile');
  const [storedTheme] = useTheme();

  // Helper function to choose which logo-colors to present given light and dark preference + whether logged in or not
  // Also takes into account system-theme if logging in for first time and no preference is stored by us
  const chooseLogo = (loggedIn: boolean, storedTheme: ThemeType): string => {
    let prefersDark = false;
    if (
      storedTheme === themeType.DARK ||
      (storedTheme === themeType.SYSTEM &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      prefersDark = true;
    }
    // Difference between logged in and not, and ofc between wanting dark or light mode
    if (loggedIn) {
      return prefersDark
        ? '/shared-assets/images/wallet-logo-dark.svg'
        : '/shared-assets/images/wallet-logo-white.svg';
    }
    return prefersDark
      ? '/shared-assets/images/wallet-logo-white.svg'
      : '/shared-assets/images/wallet-logo-black.svg';
  };

  return (
    <IonHeader
      className="ion-no-border"
      style={{
        background: loggedIn
          ? 'var(--ion-logged-header)'
          : 'var(--ion-background-color)',
        padding: loggedIn ? '0px 32px' : '0px 24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: isMobile ? '72px' : loggedIn ? '72px' : '80px',
          gap: '10px',
          marginTop: 'var(--ion-safe-area-top, 0)',
        }}
      >
        {!loggedIn && <LanguageDropdown />}
        <IonRouterLink
          routerLink={
            loggedIn ? akashicPayPath(urls.loggedFunction) : undefined
          }
        >
          <IonImg
            alt={''}
            src={chooseLogo(loggedIn ?? false, storedTheme)}
            style={{ height: '100%' }}
          />
        </IonRouterLink>
        <ThemeSelect />
      </div>
    </IonHeader>
  );
}
