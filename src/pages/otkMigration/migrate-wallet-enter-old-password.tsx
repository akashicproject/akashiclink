import { IonCol, IonRow, IonSpinner } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
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
  const [isLoading, setIsLoading] = useState(false);
  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  const [alert, setAlert] = useState(formAlertResetState);

  async function confirmOldPassword() {
    if (!migrateWalletForm.oldPassword) return;
    setIsLoading(true);
    try {
      if (username && migrateWalletForm.oldPassword) {
        await OwnersAPI.validatePassword({
          username: username,
          password: migrateWalletForm.oldPassword,
        });
      }
      setIsLoading(false);
      history.replace(akashicPayPath(urls.migrateWalletSecret));
    } catch (e) {
      setIsLoading(false);
      setAlert(errorAlertShell(t(unpackRequestErrorMessage(e))));
    }
  }

  return (
    <PublicLayout className="vertical-center">
      <MainGrid className={'ion-grid-row-gap-lg'}>
        <IonRow>
          <IonCol>
            <h2>{t('PleaseEnterYourPassword')}</h2>
          </IonCol>
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
                setAlert(formAlertResetState);
              }}
              value={migrateWalletForm.oldPassword}
              errorPrompt={StyledInputErrorPrompt.Password}
            />
          </IonCol>
        </IonRow>
        {alert.visible && (
          <IonRow>
            <IonCol size="12">
              <AlertBox state={alert} />
            </IonCol>
          </IonRow>
        )}
        <IonRow>
          <IonCol>
            <PurpleButton
              expand="block"
              onClick={confirmOldPassword}
              disabled={!migrateWalletForm.oldPassword}
              isLoading={isLoading}
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
