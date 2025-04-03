import { IonCol, IonRow } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { scrollWhenPasswordKeyboard } from '../utils/scroll-when-password-keyboard';
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

  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  return (
    <MainGrid style={{ padding: '80px 48px' }}>
      <IonRow>
        <IonCol className="ion-no-padding">
          <h2 style={{ marginBottom: '8px' }}>{t('KeyPairBackup')}</h2>
        </IonCol>
      </IonRow>
      <IonRow style={{ marginBottom: '40px' }}>
        <IonCol>
          <h6 style={{ margin: '0px' }}>{t('PleaseEnterYourPassword')}</h6>
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
