import { IonCol, IonRow } from '@ionic/react';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { CountdownDiv } from '../../components/layout/countdown';
import { MainGrid } from '../../components/layout/main-grid';
import { MainTitle } from '../../components/layout/main-title';
import { MainLayout } from '../../components/layout/mainLayout';
import { StyledInput } from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { heliumPayPath } from '../../routing/navigation-tree';

export function CreateWallet() {
  return (
    <MainLayout>
      <MainGrid>
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>Create Your Wallet</MainTitle>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <StyledInput
              label={'Email'}
              type={'email'}
              placeholder={'Enter your email'}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <WhiteButton expand="block">Send</WhiteButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <CountdownDiv>60</CountdownDiv>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <StyledInput
              label={'Verification Code'}
              type={'text'}
              placeholder={'Enter the code sent'}
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
