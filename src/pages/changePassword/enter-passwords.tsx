import { userConst } from '@helium-pay/backend';
import { IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import { LoggedLayout } from '../../components/layout/logged-layout';
import { MainGrid } from '../../components/layout/main-grid';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';

export function ChangePassword() {
  const { t } = useTranslation();
  const history = useHistory();
  const { activeAccount } = useAccountStorage();

  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const validateConfirmPassword = (value: string) => newPassword === value;

  const [alertRequest, setAlertRequest] = useState(formAlertResetState);
  const { changeOtkPassword } = useAccountStorage();

  /**
     * Activation request is sent -> email with activation code is sent to user
  
     */
  async function changePassword() {
    if (newPassword && oldPassword) {
      try {
        await changeOtkPassword(
          activeAccount!.identity!,
          oldPassword,
          newPassword
        );
        history.push(akashicPayPath(urls.changePasswordConfirm));
      } catch (error) {
        setAlertRequest(errorAlertShell(t(unpackRequestErrorMessage(error))));
      }
    }
  }

  return (
    <LoggedLayout>
      <MainGrid style={{ padding: '32px 48px' }}>
        <IonRow className={'ion-grid-row-gap-xl'}>
          <IonCol size="12">
            <h2 className={'ion-margin-top-0 ion-margin-bottom-xs'}>
              {t('ChangePassword')}
            </h2>
            <h6>{t('ChangePasswordInfo')}</h6>
          </IonCol>
          <IonCol size="12">
            <StyledInput
              label={t('OldPassword')}
              placeholder={t('EnterPassword')}
              type="password"
              onIonInput={({ target: { value } }) =>
                setOldPassword(value as string)
              }
              value={oldPassword}
              errorPrompt={StyledInputErrorPrompt.Password}
              validate={validatePassword}
            />
            <StyledInput
              label={t('NewPassword')}
              placeholder={t('EnterPassword')}
              type="password"
              onIonInput={({ target: { value } }) =>
                setNewPassword(value as string)
              }
              value={newPassword}
              errorPrompt={StyledInputErrorPrompt.Password}
              validate={validatePassword}
            />
            <StyledInput
              label={t('ConfirmPassword')}
              type="password"
              placeholder={t('ConfirmPassword')}
              onIonInput={({ target: { value } }) =>
                setConfirmPassword(value as string)
              }
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
          <IonCol size="6">
            <WhiteButton
              expand="block"
              fill="clear"
              onClick={() => {
                history.push(akashicPayPath(urls.loggedFunction));
              }}
            >
              {t('Cancel')}
            </WhiteButton>
          </IonCol>
          <IonCol size="6">
            <PurpleButton
              expand="block"
              onClick={changePassword}
              disabled={!oldPassword || !newPassword || !confirmPassword}
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </LoggedLayout>
  );
}
