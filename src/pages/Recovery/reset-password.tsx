import { IonCol, IonRow } from '@ionic/react';

import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { MainTitle } from '../../components/layout/main-title';
import { MainLayout } from '../../components/layout/mainLayout';
import { StyledInput } from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { heliumPayPath } from '../../routing/navigation-tree';

export function ResetPassword() {
  return (
    <MainLayout>
      <MainGrid>
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>Set your Lock Password</MainTitle>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <StyledInput
              label={'New Password'}
              type={'password'}
              placeholder={'Enter your new password'}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <StyledInput
              label={'Confirm Password'}
              type={'password'}
              placeholder={'Confirm your password'}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <PurpleButton
              routerLink={heliumPayPath(urls.creatingWallet)}
              expand="block"
            >
              Confirm
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </MainLayout>
  );
}
