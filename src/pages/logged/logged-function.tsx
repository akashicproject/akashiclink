import './logged.css';

import { IonCol, IonIcon, IonRow } from '@ionic/react';
import { arrowDownOutline, arrowForwardOutline } from 'ionicons/icons';
import { useEffect } from 'react';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { SelectCoin } from '../../components/select-coin';
import { LoggedMain } from './logged-main';

export function LoggedFunction() {
  useEffect(() => {
    console.log(document.getElementById('activity'));
    document.getElementById('activity')?.click();
  }, []);

  return (
    <LoggedMain>
      <>
        <SelectCoin />
        <IonRow class="ion-justify-content-between">
          <IonCol>
            <PurpleButton expand="block">
              Send
              <IonIcon slot="end" icon={arrowForwardOutline}></IonIcon>
            </PurpleButton>
          </IonCol>
          <IonCol>
            <WhiteButton expand="block">
              Deposit
              <IonIcon slot="end" icon={arrowDownOutline}></IonIcon>
            </WhiteButton>
          </IonCol>
        </IonRow>
      </>
    </LoggedMain>
  );
}
