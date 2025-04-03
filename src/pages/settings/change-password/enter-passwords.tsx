import { userConst } from '@helium-pay/backend';
import { IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../../components/common/alert/alert';
import { PurpleButton, WhiteButton } from '../../../components/common/buttons';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../../components/common/input/styled-input';
import { MainGrid } from '../../../components/layout/main-grid';
import { DashboardLayout } from '../../../components/page-layout/dashboard-layout';
import { urls } from '../../../constants/urls';
import { akashicPayPath } from '../../../routing/navigation-tabs';
import { useAccountStorage } from '../../../utils/hooks/useLocalAccounts';
import { unpackRequestErrorMessage } from '../../../utils/unpack-request-error-message';

export function ChangePassword() {
  const { t } = useTranslation();
  const history = useHistory();
  const { activeAccount } = useAccountStorage();

  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [allowedToChange, setAllowedToChange] = useState<boolean>(false);

  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);

  const validateConfirmPassword = (value: string) => newPassword === value;

  const [alertRequest, setAlertRequest] = useState(formAlertResetState);
  const { changeOtkPassword } = useAccountStorage();

  // When confirming or cancelling
  const resetStates = () => {
    setAlertRequest(formAlertResetState);
    setAllowedToChange(false);
    setNewPassword(undefined);
    setOldPassword(undefined);
    setConfirmPassword(undefined);
  };

  // Checks whether user is allowed to press confirm and thus change password
  // A number of checks must be passed.
  const validatePasswordChange = (
    oldPassword?: string,
    newPassword?: string,
    confirmPassword?: string
  ) => {
    setAlertRequest(formAlertResetState);
    setAllowedToChange(false);
    // All fields must've been supplied
    if (!oldPassword || !newPassword || !confirmPassword) {
      return;
    }

    // All fields must adhere to password-regex
    if (
      !userConst.passwordRegex.exec(oldPassword) ||
      !userConst.passwordRegex.exec(newPassword) ||
      !userConst.passwordRegex.exec(confirmPassword)
    ) {
      return;
    }

    // Can not change to same password
    if (oldPassword === newPassword) {
      return;
    }

    // The two inputs for new password must be the same
    if (newPassword !== confirmPassword) {
      return;
    }

    setAllowedToChange(true);
  };

  async function changePassword() {
    if (newPassword && oldPassword) {
      try {
        await changeOtkPassword(
          activeAccount!.identity!,
          oldPassword,
          newPassword
        );
        history.push(akashicPayPath(urls.changePasswordConfirm));
        resetStates();
      } catch (error) {
        setAlertRequest(errorAlertShell(t(unpackRequestErrorMessage(error))));
      }
    }
  }

  return (
    <DashboardLayout>
      <MainGrid style={{ padding: '0px 24px' }}>
        <IonRow className={'ion-grid-row-gap-lg'}>
          <IonCol size="12">
            <h2 className={'ion-margin-top-0 ion-margin-bottom-xs'}>
              {t('ChangePassword')}
            </h2>
            <h6>{t('ChangePasswordInfo')}</h6>
          </IonCol>
        </IonRow>
        <IonRow className={'ion-grid-row-gap-xs'}>
          <IonCol size="12">
            <StyledInput
              label={t('OldPassword')}
              placeholder={t('EnterPassword')}
              type="password"
              onIonInput={({ target: { value } }) => {
                setOldPassword(value as string);
                validatePasswordChange(
                  value as string,
                  newPassword,
                  confirmPassword
                );
              }}
              value={oldPassword}
              errorPrompt={StyledInputErrorPrompt.Password}
              validate={validatePassword}
            />
          </IonCol>
          <IonCol size="12">
            <StyledInput
              label={t('NewPassword')}
              placeholder={t('EnterPassword')}
              type="password"
              onIonInput={({ target: { value } }) => {
                setNewPassword(value as string);
                validatePasswordChange(
                  oldPassword,
                  value as string,
                  confirmPassword
                );
              }}
              value={newPassword}
              errorPrompt={StyledInputErrorPrompt.Password}
              validate={validatePassword}
            />
          </IonCol>
          <IonCol size="12">
            <StyledInput
              label={t('ConfirmPassword')}
              type="password"
              placeholder={t('ConfirmPassword')}
              onIonInput={({ target: { value } }) => {
                setConfirmPassword(value as string);
                validatePasswordChange(
                  oldPassword,
                  newPassword,
                  value as string
                );
              }}
              value={confirmPassword}
              errorPrompt={StyledInputErrorPrompt.ConfirmPassword}
              validate={validateConfirmPassword}
              submitOnEnter={changePassword}
            />
          </IonCol>
          {alertRequest.visible && (
            <IonCol size="12">
              <AlertBox state={alertRequest} />
            </IonCol>
          )}
        </IonRow>
        <IonRow className={'ion-grid-row-gap-lg'}>
          <IonCol size="6">
            <WhiteButton
              expand="block"
              fill="clear"
              onClick={() => {
                resetStates();
                history.push(akashicPayPath(urls.dashboard));
              }}
            >
              {t('Cancel')}
            </WhiteButton>
          </IonCol>
          <IonCol size="6">
            <PurpleButton
              expand="block"
              onClick={changePassword}
              disabled={!allowedToChange}
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </DashboardLayout>
  );
}
