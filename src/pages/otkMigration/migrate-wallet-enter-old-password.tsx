import { datadogRum } from '@datadog/browser-rum';
import { userError } from '@helium-pay/backend';
import { IonCol, IonRow } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { historyGoBack } from '../../routing/history-stack';
import {
  onInputChange,
  selectMigrateWalletForm,
  selectUsername,
} from '../../slices/migrateWalletSlice';
import { OwnersAPI } from '../../utils/api';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';

export function MigrateWalletOldPassword() {
  const { t } = useTranslation();
  const history = useHistory();
  const migrateWalletForm = useAppSelector(selectMigrateWalletForm);
  const username = useAppSelector(selectUsername);
  const dispatch = useAppDispatch();

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  const [alert, setAlert] = useState(formAlertResetState);

  async function confirmOldPassword() {
    if (!migrateWalletForm.oldPassword) return;

    try {
      if (username && migrateWalletForm.oldPassword) {
        await OwnersAPI.validatePassword({
          username: username,
          password: migrateWalletForm.oldPassword,
        });
      }
      history.push(urls.migrateWalletSecret);
    } catch (e) {
      setAlert(errorAlertShell(t(unpackRequestErrorMessage(e))));
    }
  }

  /**
   * Redirect user to previous page, and reset page state
   */
  const CancelButton = (
    <IonCol>
      <WhiteButton
        expand="block"
        fill="clear"
        onClick={() => {
          dispatch(
            onInputChange({
              oldPassword: String(''),
            })
          );
          setAlert(formAlertResetState);
          historyGoBack(history, true);
        }}
      >
        {t('Cancel')}
      </WhiteButton>
    </IonCol>
  );
  return (
    <PublicLayout className="vertical-center">
      <MainGrid>
        <IonRow>
          <IonCol>
            <h2>{t('PleaseEnterYourPassword')}</h2>
          </IonCol>
        </IonRow>

        <>
          <IonRow>
            <AlertBox state={alert} />
          </IonRow>

          <IonRow>
            <IonCol>
              <StyledInput
                label={t('Password')}
                placeholder={t('EnterPassword')}
                type="password"
                onIonInput={({ target: { value } }) => {
                  dispatch(
                    onInputChange({
                      oldPassword: String(value),
                    })
                  );
                }}
                value={migrateWalletForm.oldPassword}
                errorPrompt={StyledInputErrorPrompt.Password}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <PurpleButton
                expand="block"
                onClick={confirmOldPassword}
                disabled={!migrateWalletForm.oldPassword}
              >
                {t('Confirm')}
              </PurpleButton>
            </IonCol>
            {CancelButton}
          </IonRow>
        </>
      </MainGrid>
    </PublicLayout>
  );
}
