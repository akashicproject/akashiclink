import { ActivationRequestType } from '@helium-pay/backend';
import type { Language } from '@helium-pay/common-i18n';
import { IonCol, IonRow, isPlatform } from '@ionic/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { ActivationTimer } from '../components/activation/activation-timer';
import { SubmitActivationCode } from '../components/activation/submit-activation-code';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../components/alert/alert';
import { PurpleButton } from '../components/buttons';
import { MainGrid } from '../components/layout/main-grid';
import { MainTitle } from '../components/layout/main-title';
import { MainLayout } from '../components/layout/mainLayout';
import { useLogout } from '../components/logout';
import { StyledInput } from '../components/styled-input';
import { ContentText } from '../components/text/context-text';
import { OwnersAPI } from '../utils/api';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import { lastPageStorage, ResetPageButton } from '../utils/last-page-storage';

enum View {
  Submit,
  TwoFa,
}
export const importAccountUrl = 'import';

export function ImportWallet() {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const logout = useLogout();

  const { addLocalAccount, setActiveAccount } = useAccountStorage();
  const [view, setView] = useState(View.Submit);
  const [alert, setAlert] = useState(formAlertResetState);
  const [timer, setTimer] = useState(false);

  /**
   * Track user inputs
   */
  const [privateKey, setPrivateKey] = useState<string>();
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    if (lastPageStorage.get() === importAccountUrl) {
      const { privateKey, email } = lastPageStorage.getVars();
      setPrivateKey(privateKey);
      setEmail(email);
      setView(View.TwoFa);
    }
  }, []);

  async function submitTwoFa(activationCode: string) {
    if (privateKey) {
      const { username, identity } = await OwnersAPI.importAccount({
        activationCode,
        privateKey: privateKey,
      });
      lastPageStorage.clear();

      // Add accounts, and redirect to login page
      const importedAccount = {
        identity: identity || username,
        username,
      };
      addLocalAccount(importedAccount);
      setActiveAccount(importedAccount);
      setTimeout(() => {
        logout().then(() => {
          setView(View.Submit);
          isPlatform('mobile') && location.reload();
        });
      }, 500);
    }
  }

  /**
   * Button that uploads user credentials in a request to import an
   * account
   */
  const RequestImportAccountButton = (
    <IonCol>
      <PurpleButton
        disabled={!privateKey}
        onClick={async () => {
          try {
            if (privateKey) {
              const { email } = await OwnersAPI.requestActivationCode({
                activationType: ActivationRequestType.ImportWalletAccount,
                payload: { privateKey },
                lang: i18n.language as Language,
              });
              if (!email) {
                setAlert(errorAlertShell(t('UserDoesNotExist')));
                return;
              }

              setEmail(email);
              setTimer(true);
              setView(View.TwoFa);
              // TODO: reword logic to avoid storing private key in plain text open format
              lastPageStorage.store(importAccountUrl, {
                privateKey,
                email,
              });
            }
          } catch (e) {
            let message = t('GenericFailureMsg');
            if (axios.isAxiosError(e))
              message = e.response?.data?.message || message;
            setAlert(errorAlertShell(message));
          }
        }}
        expand="block"
      >
        {view === View.Submit ? t('Confirm') : t('SendCode')}
      </PurpleButton>
    </IonCol>
  );

  /**
   * Drop any intermediate state and redirect to landing page
   */
  const ResetButton = (
    <IonCol>
      <ResetPageButton
        expand="block"
        callback={() => {
          setView(View.Submit);
          setTimer(false);
          history.push('/');
          isPlatform('mobile') && location.reload();
        }}
      />
    </IonCol>
  );

  return (
    <MainLayout>
      <MainGrid>
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>{t('ImportWallet')}</MainTitle>
          </IonCol>
        </IonRow>
        {view === View.Submit && (
          <>
            <IonRow>
              <IonCol class="ion-center">
                <ContentText>{t('EnterKeyPair')}</ContentText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <StyledInput
                  label={t('KeyPair')}
                  type={'text'}
                  placeholder={t('EnterKeyPair')}
                  onIonInput={({ target: { value } }) => {
                    setPrivateKey(value as string);
                    setAlert(formAlertResetState);
                  }}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              {ResetButton}
              {RequestImportAccountButton}
            </IonRow>
            <IonRow>
              <AlertBox state={alert} />
            </IonRow>
          </>
        )}
        {view === View.TwoFa && (
          <>
            <IonRow>
              <IonCol>
                <StyledInput
                  label="Email"
                  type="email"
                  placeholder=""
                  disabled={true}
                  value={email}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="ion-center">
                {timer ? (
                  <ActivationTimer onComplete={() => setTimer(false)} />
                ) : (
                  RequestImportAccountButton
                )}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <SubmitActivationCode
                  onClose={() => {
                    lastPageStorage.clear();
                    setView(View.Submit);
                    history.push('/');
                  }}
                  submitWithActivationCode={submitTwoFa}
                />
              </IonCol>
            </IonRow>
          </>
        )}
      </MainGrid>
    </MainLayout>
  );
}
