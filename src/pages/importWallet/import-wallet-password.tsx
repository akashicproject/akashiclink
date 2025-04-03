import { userConst } from '@helium-pay/backend';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CreatePasswordForm } from '../../components/public/create-password-form';
import { urls } from '../../constants/urls';
import {
  historyGoBackOrReplace,
  historyResetStackAndRedirect,
} from '../../history';
import {
  onInputChange,
  selectImportWalletForm,
  selectOtk,
} from '../../slices/importWalletSlice';
import { useBalancesMe } from '../../utils/hooks/useBalancesMe';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useNftMe } from '../../utils/hooks/useNftMe';
import { useNftTransfersMe } from '../../utils/hooks/useNftTransfersMe';
import { useOwner } from '../../utils/hooks/useOwner';
import { useTransfersMe } from '../../utils/hooks/useTransfersMe';
import { useIosScrollPasswordKeyboardIntoView } from '../../utils/scroll-when-password-keyboard';

export function ImportWalletPassword() {
  useIosScrollPasswordKeyboardIntoView();
  const [isLoading, setIsLoading] = useState(false);
  /** Tracking user input */
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const { addLocalOtkAndCache, addLocalAccount, setActiveAccount } =
    useAccountStorage();
  const importWalletForm = useAppSelector(selectImportWalletForm);
  const otk = useAppSelector(selectOtk);
  const dispatch = useAppDispatch();
  const validateConfirmPassword = (value: string) =>
    importWalletForm.password === value;
  const { mutateOwner } = useOwner();
  const { mutateTransfersMe } = useTransfersMe();
  const { mutateNftTransfersMe } = useNftTransfersMe();
  const { mutateBalancesMe } = useBalancesMe();
  const { mutateNftMe } = useNftMe();

  /**
   * Validates Password, creates OTK and sends on to OTK-confirmation (Create)
   * OR, for import validates password, stores OTK and send sto Success-screen
   */
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

    if (isPasswordValid && otk && otk.identity) {
      // call import api and store the Identity.
      // added local otk
      addLocalOtkAndCache(otk, importWalletForm.password);
      // need to add local account
      addLocalAccount({
        identity: otk.identity,
      });
      setActiveAccount({
        identity: otk.identity,
      });

      await mutateOwner();
      await mutateTransfersMe();
      await mutateNftTransfersMe();
      await mutateBalancesMe();
      await mutateNftMe();
      setIsLoading(false);
      historyResetStackAndRedirect(urls.importWalletSuccessful);
    }
  }

  const onClickCancel = () => {
    dispatch(
      onInputChange({
        password: '',
        confirmPassword: '',
      })
    );
    historyGoBackOrReplace(urls.akashicPay);
  };

  return (
    <CreatePasswordForm
      form={importWalletForm}
      isLoading={isLoading}
      onInputChange={onInputChange}
      onCancel={onClickCancel}
      onSubmit={confirmPasswordAndCreateOtk}
    />
  );
}
