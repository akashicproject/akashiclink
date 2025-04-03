import {
  IonCol,
  IonGrid,
  IonRow,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useState } from 'react';

import { aggregatedWalletBalances } from '../../constants/dummy-data';
import { SettingsPopover } from '../settings/settings-popover';

export function LoggedToolbar() {
  const keys = Object.keys(aggregatedWalletBalances);
  const [key, setKey] = useState(keys.length > 0 ? keys[0] : undefined);

  return (
    <IonGrid fixed>
      <IonRow class="ion-justify-content-around">
        <IonCol size="6">
          <IonSelect
            value={key}
            onIonChange={({ detail: { value: key } }) => setKey(key)}
            interface="popover"
          >
            {keys.map((k) => (
              <IonSelectOption key={k} value={k} class="menu-text">
                {k}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonCol>
        <IonCol size="auto">
          <SettingsPopover />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
