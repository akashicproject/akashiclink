import { datadogRum } from '@datadog/browser-rum';
import styled from '@emotion/styled';
import { IonCol, IonRow, IonText } from '@ionic/react';
import axios from 'axios';
import { isEqual } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/common/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/common/buttons';
import { Spinner } from '../../components/common/loader/spinner';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/page-layout/public-layout';
import { SecretWords } from '../../components/wallet-setup/secret-words';
import { urls } from '../../constants/urls';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import {
  onInputChange,
  selectCreateWalletForm,
  selectMaskedPassPhrase,
  selectOtk,
} from '../../redux/slices/createWalletSlice';
import { historyResetStackAndRedirect } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { createAccountWithKeys } from './backend-interaction';

export const StyledSpan = styled.span({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
});

export function CreateWalletSecretConfirm() {
  const { t } = useTranslation();
  const history = useHistory();
  const otk = useAppSelector(selectOtk);
  const createWalletForm = useAppSelector(selectCreateWalletForm);
  const maskedPassPhrase = useAppSelector(selectMaskedPassPhrase);
  const dispatch = useAppDispatch();

  const [alert, setAlert] = useState(formAlertResetState);

  /** Tracking response from server after account is created */
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const { addLocalAccount, setActiveAccount, addLocalOtkAndCache } =
    useAccountStorage();

  async function activateWalletAccount() {
    // Submit request and display "creating account loader"
    try {
      // Check for correct 12-word confirmation
      if (
        !createWalletForm.confirmPassPhrase ||
        !otk?.phrase ||
        !isEqual(
          createWalletForm.confirmPassPhrase.join(' '),
          otk.phrase.trim()
        )
      ) {
        throw new Error(t('InvalidSecretPhrase'));
      }
      if (!otk || !createWalletForm.password) {
        throw new Error('Something went wrong. Try again');
      }
      setIsCreatingAccount(true);

      // TODO: When going to phase2 (i.e. v1 endpoints only or local otk only), enable this
      // - Remove the 2FA step when creating account, go directly here. (email no longer needed)
      // - Also remove "username" from LocalAccount, use "fullOtk" in newAccount and addLocalOtk below

      const { otk: fullOtk, keysNotCreated } = await createAccountWithKeys(otk);

      if (keysNotCreated.length > 0) {
        throw new Error(
          'Not all wallets are healthy. Please contact CS or make a new account'
        );
      }

      // Set new account details and display summary screen
      const newAccount = {
        identity: fullOtk.identity,
      };

      addLocalOtkAndCache(fullOtk, createWalletForm.password);
      addLocalAccount(newAccount);
      setAlert(formAlertResetState);
      setActiveAccount(newAccount);
      historyResetStackAndRedirect(urls.createWalletSuccessful);
    } catch (e) {
      datadogRum.addError(e);
      const error = e as Error;
      let message = error.message || 'GenericFailureMsg';
      if (axios.isAxiosError(e)) message = e.response?.data?.message || message;
      setAlert(errorAlertShell(message));
    } finally {
      setIsCreatingAccount(false);
    }
  }

  const onGoBack = () => {
    history.replace(akashicPayPath(urls.createWalletSecretPhrase));
  };

  return (
    <PublicLayout className="vertical-center">
      {isCreatingAccount && (
        <Spinner header={'CreatingYourWallet'} warning={'DoNotClose'} />
      )}
      <MainGrid>
        <IonRow>
          <IonCol size="12" style={{ textAlign: 'center' }}>
            <h2
              className={
                'ion-text-align-center ion-text-size-xl ion-margin-bottom-xxs'
              }
            >
              {t('ConfirmSecretRecovery')}
            </h2>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size={'12'}>
            <IonText className={'ion-text-size-xs'} color={'dark'}>
              <h3 className={'ion-text-align-center ion-margin-0'}>
                {t('Important')}
              </h3>
              <p
                className={
                  'ion-text-align-center ion-margin-top-xxs ion-text-bold ion-text-size-xxs'
                }
              >
                {t('SaveBackUpSecureLocation')}
              </p>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size={'12'}>
            <SecretWords
              initialWords={maskedPassPhrase}
              withAction={false}
              onChange={(value) => {
                dispatch(
                  onInputChange({
                    confirmPassPhrase: value,
                  })
                );
                setAlert(formAlertResetState);
              }}
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
          <IonCol size="6">
            <PurpleButton
              expand="block"
              onClick={() => activateWalletAccount()}
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
          <IonCol size="6">
            <WhiteButton expand="block" fill="clear" onClick={onGoBack}>
              {t('GoBack')}
            </WhiteButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
