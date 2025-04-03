import { datadogRum } from '@datadog/browser-rum';
import styled from '@emotion/styled';
import { IonCol, IonRow } from '@ionic/react';
import axios from 'axios';
import { isEqual } from 'lodash';
import { useState } from 'react';
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
import { Spinner } from '../../components/loader/spinner';
import { SecretWords } from '../../components/secret-words/secret-words';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import {
  onInputChange,
  selectCreateWalletForm,
  selectMaskedPassPhrase,
  selectOtk,
} from '../../slices/createWalletSlice';
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
  const [creatingAccount, setCreatingAccount] = useState(false);

  const { addLocalAccount, setActiveAccount, addLocalOtkAndCache } =
    useAccountStorage();

  async function activateWalletAccount() {
    // Check for correct 12-word confirmation
    if (
      !isEqual(
        createWalletForm.confirmPassPhrase!.join(' '),
        otk!.phrase!.trim()
      )
    )
      return;

    // Submit request and display "creating account loader"
    try {
      if (!otk || !createWalletForm.password) {
        throw new Error('Something went wrong. Try again');
      }
      setCreatingAccount(true);

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
      // Push to Wallet-Created page
      history.push({
        pathname: akashicPayPath(urls.walletCreated),
      });
    } catch (e) {
      datadogRum.addError(e);
      let message = t('GenericFailureMsg');
      if (axios.isAxiosError(e)) message = e.response?.data?.message || message;
      setAlert(errorAlertShell(message));
    } finally {
      setCreatingAccount(false);
    }
  }

  return (
    <PublicLayout className="vertical-center">
      {creatingAccount && (
        <Spinner
          header={'CreatingYourWallet'}
          warning={'DoNotClose'}
          animationDuration="30s"
        />
      )}
      <MainGrid style={{ gap: '24px', padding: '0' }}>
        <IonRow>
          <IonCol size="12" style={{ textAlign: 'center' }}>
            <IonRow>
              <h2
                style={{
                  margin: '0 56px',
                }}
              >
                {t('ConfirmSecretRecovery')}
              </h2>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow>
          <AlertBox state={alert} />
        </IonRow>
        <IonRow>
          <IonCol>
            <IonRow style={{ textAlign: 'left' }}>
              <h3 style={{ margin: '0' }}>{t('Important')}</h3>
              <StyledSpan style={{ textAlign: 'justify' }}>
                {t('SaveBackUpSecureLocation')}
              </StyledSpan>
            </IonRow>
            <IonRow style={{ marginTop: '16px' }}>
              <SecretWords
                initialWords={maskedPassPhrase}
                withAction={false}
                onChange={(value) => {
                  dispatch(
                    onInputChange({
                      confirmPassPhrase: value,
                    })
                  );
                }}
              />
            </IonRow>
            <IonRow style={{ justifyContent: 'space-around' }}>
              <IonCol size="5">
                <PurpleButton
                  style={{ width: '100%' }}
                  expand="block"
                  onClick={() => activateWalletAccount()}
                >
                  {t('Confirm')}
                </PurpleButton>
              </IonCol>
              <IonCol size="5">
                <WhiteButton
                  style={{ width: '100%' }}
                  fill="clear"
                  onClick={async () => {
                    history.push({
                      pathname: akashicPayPath(urls.secret),
                    });
                  }}
                >
                  {t('GoBack')}
                </WhiteButton>
              </IonCol>
            </IonRow>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
