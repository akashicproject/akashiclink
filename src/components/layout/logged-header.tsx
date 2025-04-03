import { IonHeader, IonImg, IonRouterLink, isPlatform } from '@ionic/react';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { themeType } from '../../theme/const';
import { useTheme } from '../PreferenceProvider';
import { LanguageDropdown } from './language-select';
import { ThemeSelect } from './theme-select';

export function LoggedHeader({ loggedIn }: { loggedIn?: boolean }) {
  const isMobile = isPlatform('mobile');
  const [storedTheme] = useTheme();

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
            src={
              (!loggedIn && storedTheme === themeType.DARK) ||
              (loggedIn &&
                (storedTheme === themeType.LIGHT ||
                  storedTheme === themeType.SYSTEM))
                ? '/shared-assets/images/wallet-logo-white.svg'
                : loggedIn && storedTheme === themeType.DARK
                ? '/shared-assets/images/wallet-logo-dark.svg'
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
          <ThemeSelect />
        </div>
      </div>
    </IonHeader>
  );
}
