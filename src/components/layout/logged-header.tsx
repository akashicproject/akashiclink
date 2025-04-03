import { IonHeader, IonImg, IonRouterLink, isPlatform } from '@ionic/react';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { LanguageDropdown } from './language-select';
import { ThemeSelect } from './theme-select';

export function LoggedHeader(props: { loggedIn?: boolean }) {
  const isMobile = isPlatform('mobile');

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
        gap: '10px',
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
        <ThemeSelect />
      </div>
    </IonHeader>
  );
}
