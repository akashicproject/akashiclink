import { datadogRum } from '@datadog/browser-rum';
import { IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useIosScrollPasswordKeyboardIntoView } from '../../utils/hooks/useIosScrollPasswordKeyboardIntoView';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import type { FullOtk } from '../../utils/otk-generation';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../common/alert/alert';
import { PurpleButton, WhiteButton } from '../common/buttons';
import { StyledInput } from '../common/input/styled-input';
import { MainGrid } from '../layout/main-grid';

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
  useIosScrollPasswordKeyboardIntoView();
  const { t } = useTranslation();
  const [password, setPassword] = useState<string>();
  const [alert, setAlert] = useState(formAlertResetState);
  const { getLocalOtk, activeAccount } = useAccountStorage();

  const history = useHistory();

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
    <MainGrid className={'ion-grid-row-gap-sm'}>
      <IonRow>
        <IonCol>
          <h2 style={{ marginBottom: '8px' }}>{t('KeyPairBackup')}</h2>
          <h6 style={{ margin: '0px' }}>{t('PleaseEnterYourPassword')}</h6>
        </IonCol>
      </IonRow>
      <IonRow>
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
