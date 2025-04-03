import { datadogRum } from '@datadog/browser-rum';
import { userConst } from '@helium-pay/backend';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { CreatePasswordForm } from '../../components/public/create-password-form';
import { urls } from '../../constants/urls';
import {
  historyGoBackOrReplace,
  historyResetStackAndRedirect,
} from '../../history';
import {
  onClear,
  onInputChange,
  selectCreateWalletForm,
} from '../../slices/createWalletSlice';
import { useOwner } from '../../utils/hooks/useOwner';
import { useIosScrollPasswordKeyboardIntoView } from '../../utils/scroll-when-password-keyboard';

export function CreateWalletPassword() {
  useIosScrollPasswordKeyboardIntoView();
  const { t } = useTranslation();
  const createWalletForm = useAppSelector(selectCreateWalletForm);
  const dispatch = useAppDispatch();
  const [alert, setAlert] = useState(formAlertResetState);
  const { authenticated } = useOwner();

  /** Tracking user input */
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const validateConfirmPassword = (value: string) =>
    createWalletForm.password === value;

  /**
   * Validates Password, creates OTK and sends on to OTK-confirmation (Create)
   * OR, for import validates password, stores OTK and send sto Success-screen
   */
  async function confirmPasswordAndCreateOtk() {
    if (
      !(
        createWalletForm.password &&
        createWalletForm.confirmPassword &&
        createWalletForm.checked
      )
    )
      return;

    const isPasswordValid =
      validateConfirmPassword(createWalletForm.confirmPassword) &&
      validatePassword(createWalletForm.password);

    if (isPasswordValid) {
      try {
        setAlert(formAlertResetState);
        historyResetStackAndRedirect(urls.createWalletSecretPhrase);
      } catch (e) {
        datadogRum.addError(e);
        setAlert(errorAlertShell(t('GenericFailureMsg')));
      }
    } else {
      setAlert(errorAlertShell(t('PasswordHelperText')));
    }
  }

  const onClickCancel = () => {
    dispatch(onClear());
    historyGoBackOrReplace(
      authenticated ? urls.loggedFunction : urls.akashicPay
    );
  };

  return (
    <CreatePasswordForm
      form={createWalletForm}
      onInputChange={onInputChange}
      onCancel={onClickCancel}
      onSubmit={confirmPasswordAndCreateOtk}
      alert={alert}
    />
  );
}
