import { IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();

  return (
    <MainGrid className="force-center">
      <IonRow>
        <IonCol>
          <h2>{t('KeyPairBackup')}</h2>
        </IonCol>
      </IonRow>
      <IonRow style={{ marginBottom: '24px' }}>
        <IonCol>
          <h6>{t('PleaseEnterYourPassword')}</h6>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <StyledInput
            label={t('Password')}
            type="password"
            placeholder={t('PleaseConfirmYourPassword')}
            onIonInput={({ target: { value } }) => setPassword(value as string)}
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <WhiteButton expand="block" onClick={() => history.goBack()}>
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
