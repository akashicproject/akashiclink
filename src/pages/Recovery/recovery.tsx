import { IonCol, IonRow } from '@ionic/react';

import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { MainTitle } from '../../components/layout/main-title';
import { MainLayout } from '../../components/layout/mainLayout';
import { StyledInput } from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { heliumPayPath } from '../../routing/navigation-tree';

export function Recovery() {
  return (
    <MainLayout>
      <MainGrid>
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>Please enter your email</MainTitle>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <StyledInput
              label={'Email'}
              type={'email'}
              placeholder={'Enter your email'}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <PurpleButton
              routerLink={heliumPayPath(urls.verification)}
              expand="block"
            >
              Send
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </MainLayout>
  );
}
