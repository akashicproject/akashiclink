import { IonHeader, IonImg, IonRouterLink } from '@ionic/react';

import { themeType } from '../../theme/const';
import { useTheme } from '../providers/PreferenceProvider';
import { SettingSelect } from '../settings/setting-select';
import { LanguageDropdown } from './language-select';

export function PublicHeader() {
  const [storedTheme] = useTheme();

  const logoName =
    storedTheme === themeType.DARK
      ? 'wallet-logo-white.svg'
      : 'wallet-logo-dark.svg';

  return (
    <IonHeader
      className="ion-no-border"
      style={{
        background: 'var(--ion-background-color)',
      }}
    >
      <LanguageDropdown />
      <IonRouterLink>
        <IonImg
          alt={''}
          src={`/shared-assets/images/${logoName}`}
          style={{ height: '100%' }}
        />
      </IonRouterLink>
      <SettingSelect loggedIn={false} />
    </IonHeader>
  );
}
