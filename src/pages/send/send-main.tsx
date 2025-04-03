import styled from '@emotion/styled';
import {
  IonCol,
  IonItem,
  IonRow,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { LoggedLayout } from '../../components/layout/loggedLayout';
import { SettingsPopover } from '../../components/settings/settings-popover';
import { aggregatedWalletBalances } from '../../constants/dummy-data';

const SelectDiv = styled.div({
  width: '350px',
  height: '40px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '96px',
  margin: '0 auto',
});

export const SendMain: React.FC<{ children: ReactNode }> = ({ children }) => {
  const keys = Object.keys(aggregatedWalletBalances);
  const [key, setKey] = useState(keys.length > 0 ? keys[0] : undefined);
  return (
    <LoggedLayout>
      <IonRow style={{ marginTop: '50px' }}>
        <IonCol class="ion-center">
          <SelectDiv>
            <IonItem fill="outline" class={'select-item'}>
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
            </IonItem>
            <SettingsPopover />
          </SelectDiv>
        </IonCol>
      </IonRow>
      {children}
    </LoggedLayout>
  );
};
