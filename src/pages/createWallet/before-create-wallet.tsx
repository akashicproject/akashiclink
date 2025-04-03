import { IonCol, IonRow } from '@ionic/react';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { MainTitle } from '../../components/layout/main-title';
import { MainLayout } from '../../components/layout/mainLayout';
import { urls } from '../../constants/urls';
import { heliumPayPath } from '../../routing/navigation-tree';

export function BeforeCreateWallet() {
  return (
    <MainLayout>
      <MainGrid>
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>New in HeliumWallet?</MainTitle>
          </IonCol>
        </IonRow>
        <IonRow style={{ marginTop: '40px' }}>
          <IonCol>
            <PurpleButton
              routerLink={heliumPayPath(urls.createWallet)}
              expand="block"
            >
              <span>Create your Wallet</span>
            </PurpleButton>
          </IonCol>
        </IonRow>
        <IonRow style={{ marginTop: '16px' }}>
          <IonCol>
            <WhiteButton routerLink={heliumPayPath(urls.import)} expand="block">
              <span>Import Wallet</span>
            </WhiteButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </MainLayout>
  );
}
