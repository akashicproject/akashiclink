import { IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../constants/urls';
import { akashicPayPath } from '../routing/navigation-tree';
import { PurpleButton, WhiteButton } from './buttons';
import { MainGrid } from './layout/main-grid';
import { StyledInput } from './styled-input';

/**
 * Initiates a confirmation procedure using supplied method
 *
 * @param setVal callback to initiate requres to backend with the signed password
 */
export function ConfirmLockPassword({
  setVal,
}: {
  setVal: (password: string) => void;
}) {
  const { t } = useTranslation();
  const [password, setPassword] = useState<string>();

  return (
    <MainGrid>
      <IonRow>
        <IonCol>
          <h2>{t('KeyPairBackup')}</h2>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <h4>{t('PleaseEnterYourPassword')}</h4>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <StyledInput
            label={'Password'}
            type="password"
            placeholder={'Please confirm your password'}
            onIonInput={({ target: { value } }) => setPassword(value as string)}
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <WhiteButton
            routerLink={akashicPayPath(urls.loggedFunction)}
            expand="block"
          >
            {t('Cancel')}
          </WhiteButton>
        </IonCol>
        <IonCol>
          <PurpleButton
            expand="block"
            disabled={!password}
            onClick={() => password && setVal(password)}
          >
            {t('Confirm')}
          </PurpleButton>
        </IonCol>
      </IonRow>
    </MainGrid>
  );
}
