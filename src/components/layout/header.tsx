import { IonHeader, IonImg } from '@ionic/react';

import { themeType } from '../../theme/const';
import { useTheme } from '../providers/PreferenceProvider';
import { SettingSelect } from '../settings/setting-select';
import { HistoryBackButton } from './toolbar/history-back-button';

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
      <div
        style={{
          height: 40,
          width: 40,
        }}
      >
        <HistoryBackButton />
      </div>
      <div>
        <IonImg
          alt={''}
          src={`/shared-assets/images/${logoName}`}
          style={{ height: '100%' }}
        />
      </div>
      <div
        style={{
          height: 40,
          width: 40,
        }}
      >
        <SettingSelect loggedIn />
      </div>
    </IonHeader>
  );
}
