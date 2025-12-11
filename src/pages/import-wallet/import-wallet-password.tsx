import { userConst } from '@akashic/as-backend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../../components/common/alert/alert';
import { CreatePasswordForm } from '../../components/wallet-setup/create-password-form';
import { urls } from '../../constants/urls';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import {
  onClear as onClearImportWalletSlice,
  onInputChange,
  selectImportWalletForm,
  selectOtk,
  selectOtkType,
} from '../../redux/slices/importWalletSlice';
import {
  historyGoBackOrReplace,
  historyResetStackAndRedirect,
} from '../../routing/history';
import { useIosScrollPasswordKeyboardIntoView } from '../../utils/hooks/useIosScrollPasswordKeyboardIntoView';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useLogout } from '../../utils/hooks/useLogout';

export function ImportWalletPassword({ isPopup = false }) {
  useIosScrollPasswordKeyboardIntoView();

  const {
    addLocalOtkAndCache,
    addLocalAccount,
    setActiveAccount,
    activeAccount,
    localAccounts,
  } = useAccountStorage();
  const logout = useLogout();

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(formAlertResetState);
  const { t } = useTranslation();

  // pick up import data from redux
  const importWalletForm = useAppSelector(selectImportWalletForm);
  const otk = useAppSelector(selectOtk);
  const otkType = useAppSelector(selectOtkType);

  const dispatch = useAppDispatch();

  /**
   * Validates Password, creates OTK and sends on to OTK-confirmation (Create)
   * OR, for import validates password, stores OTK and send to Success-screen
   */
  const validateConfirmPassword = (value: string) =>
    importWalletForm.password === value;
  const validatePassword = (value: string) =>
    !!RegExp(userConst.passwordRegex).exec(value);

  async function confirmPasswordAndCreateOtk() {
    if (
      !(
        importWalletForm.password &&
        importWalletForm.confirmPassword &&
        importWalletForm.checked
      )
    ) {
      return;
    }
    setIsLoading(true);
    const isPasswordValid =
      validateConfirmPassword(importWalletForm.confirmPassword) &&
      validatePassword(importWalletForm.password);

    if (!isPasswordValid) {
      setIsLoading(false);
      return;
    }

    if (isPasswordValid && otk?.identity && otkType) {
      // If user is currently signed in, ensure the currently active account and connected webapps are signed out
      if (activeAccount) {
        await logout();
      }

      // call import api and store the Identity. added local otk
      addLocalOtkAndCache({
        otk,
        otkType: otkType,
        password: importWalletForm.password,
      });
      // need to add local account
      addLocalAccount({
        identity: otk.identity,
        otkType: otkType,
      });

      setActiveAccount({
        identity: otk.identity,
        otkType: otkType,
      });

      if (isPopup) {
        dispatch(onClearImportWalletSlice());
        historyResetStackAndRedirect(urls.importWalletSuccessful);
        return;
      }

      setIsLoading(false);
      historyResetStackAndRedirect(urls.importWalletSuccessful);
    }
  }

  const onClickCancel = async () => {
    dispatch(onClearImportWalletSlice());
    if (isPopup) {
      historyGoBackOrReplace(urls.root);
    } else {
      await logout();
    }
  };

  useEffect(() => {
    // Check if the user is attempting to import a keypair with an L2 address
    // that matches an existing non-migrated account, and display an alert if so
    if (
      localAccounts.some(
        (localAccount) =>
          localAccount.identity === otk?.identity && !localAccount.otkType
      )
    ) {
      dispatch(onClearImportWalletSlice());
      setAlert(errorAlertShell(t('ExistingL2AccountError')));
    }
  }, [localAccounts.length, otk?.identity]);

  return (
    <>
      <CustomAlert state={alert} onDidDismiss={onClickCancel} />
      <CreatePasswordForm
        form={importWalletForm}
        isLoading={isLoading}
        onInputChange={onInputChange}
        onCancel={onClickCancel}
        onSubmit={confirmPasswordAndCreateOtk}
      />
    </>
  );
}
