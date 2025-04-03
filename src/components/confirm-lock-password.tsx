import { datadogRum } from '@datadog/browser-rum';
import { IonCol, IonRow } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import type { FullOtk } from '../utils/otk-generation';
import { scrollWhenPasswordKeyboard } from '../utils/scroll-when-password-keyboard';
import { AlertBox, errorAlertShell, formAlertResetState } from './alert/alert';
import { PurpleButton, WhiteButton } from './buttons';
import { MainGrid } from './layout/main-grid';
import { StyledInput } from './styled-input';

/**
 * Initiates a confirmation procedure using supplied method
 *
 * @param setVal callback to initiate requres to backend with the signed password
 */
export function ConfirmLockPassword({
  onPasswordCheckSuccess,
}: {
  onPasswordCheckSuccess: (otk: FullOtk) => void;
}) {
  const { t } = useTranslation();
  const [password, setPassword] = useState<string>();
  const [alert, setAlert] = useState(formAlertResetState);
  const { getLocalOtk, activeAccount } = useAccountStorage();

  const history = useHistory();

  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  // Submit request to display private key - requires password
  const handleOnConfirm = async () => {
    try {
      if (typeof password === 'undefined') {
        setAlert(errorAlertShell(t('InvalidPassword')));
        return;
      }
      const otk = await getLocalOtk(activeAccount!.identity!, password);
      if (otk) {
        onPasswordCheckSuccess(otk);
      } else {
        setAlert(errorAlertShell(t('PleaseConfirm')));
      }
    } catch (e) {
      datadogRum.addError(e);
      setAlert(errorAlertShell(t('InvalidPassword')));
    }
  };

  return (
    <MainGrid style={{ padding: '56px 48px' }}>
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
      <IonRow className={'ion-grid-row-gap-lg'}>
        <IonCol size="12">
          <StyledInput
            label={t('Password')}
            type="password"
            placeholder={t('PleaseConfirmYourPassword')}
            onIonInput={({ target: { value } }) => {
              setAlert(formAlertResetState);
              setPassword(value as string);
            }}
          />
        </IonCol>
        {alert.visible && (
          <IonCol size="12">
            <AlertBox state={alert} />
          </IonCol>
        )}
        <IonCol size="6">
          <WhiteButton expand="block" onClick={() => history.goBack()}>
            {t('Cancel')}
          </WhiteButton>
        </IonCol>
        <IonCol size="6">
          <PurpleButton
            expand="block"
            disabled={!password}
            onClick={handleOnConfirm}
          >
            {t('Confirm')}
          </PurpleButton>
        </IonCol>
      </IonRow>
    </MainGrid>
  );
}
