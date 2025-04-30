import { IonHeader, IonRouterLink } from '@ionic/react';

import { SettingModalWithTriggerButton } from '../settings/setting-modal-with-trigger-button';
import { HeaderLogo } from './header-logo';
import { LanguageDropdown } from './toolbar/language-select';

export function PublicHeader() {
  return (
    <IonHeader
      className="ion-no-border"
      style={{
        background: 'var(--ion-background-color)',
        display: 'flex', // overwrite ionic default ion-header
      }}
    >
      <LanguageDropdown />
      <IonRouterLink>
        <HeaderLogo />
      </IonRouterLink>
      <SettingModalWithTriggerButton />
    </IonHeader>
  );
}
