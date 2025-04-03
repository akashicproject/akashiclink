import { IonHeader, IonImg, IonRouterLink } from '@ionic/react';

import { themeType } from '../../theme/const';
import { useTheme } from '../providers/PreferenceProvider';
import { SettingSelect } from '../settings/setting-select';

export function Header() {
  const [storedTheme] = useTheme();

  const logoName =
    storedTheme === themeType.DARK
      ? 'wallet-logo-dark.svg'
      : 'wallet-logo-white.svg';

  return (
    <IonHeader
      className="ion-no-border"
      style={{
        background: 'var(--ion-header-background)',
      }}
    >
      <IonRouterLink>
        <IonImg
          alt={''}
          src={`/shared-assets/images/${logoName}`}
          style={{ height: '100%' }}
        />
      </IonRouterLink>
      <SettingSelect loggedIn={true} />
    </IonHeader>
  );
}
