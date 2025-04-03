import { IonCol, IonRow } from '@ionic/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/common/alert/alert';
import { PurpleButton } from '../../components/common/buttons';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/common/input/styled-input';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/page-layout/public-layout';
import { urls } from '../../constants/urls';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import {
  onInputChange,
  selectMigrateWalletForm,
  selectUsername,
} from '../../redux/slices/migrateWalletSlice';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { OwnersAPI } from '../../utils/api';
import { useIosScrollPasswordKeyboardIntoView } from '../../utils/hooks/useIosScrollPasswordKeyboardIntoView';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';

export function MigrateWalletOldPassword() {
  useIosScrollPasswordKeyboardIntoView();
  const { t } = useTranslation();
  const history = useHistory();
  const migrateWalletForm = useAppSelector(selectMigrateWalletForm);
  const username = useAppSelector(selectUsername);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

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
