import { ActivationRequestType } from '@helium-pay/backend';
import type { Language } from '@helium-pay/common-i18n';
import { IonCol, IonRow, useIonRouter } from '@ionic/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SubmitActivationCode } from '../components/activation/submit-activation-code';
import {
  Alert,
  errorAlertShell,
  formAlertResetState,
} from '../components/alert/alert';
import { PurpleButton } from '../components/buttons';
import { MainGrid } from '../components/layout/main-grid';
import { MainTitle } from '../components/layout/main-title';
import { MainLayout } from '../components/layout/mainLayout';
import { StyledInput } from '../components/styled-input';
import { urls } from '../constants/urls';
import { heliumPayPath } from '../routing/navigation-tree';
import { OwnersAPI } from '../utils/api';
import { lastPageStorage } from '../utils/last-page-storage';
import { storeLocalAccount } from '../utils/local-account-storage';

enum View {
  Submit,
  TwoFa,
}
export const importAccountUrl = 'import';

export function ImportWallet() {
  const router = useIonRouter();
  const { t, i18n } = useTranslation();

  const [view, setView] = useState(View.Submit);
  const [alert, setAlert] = useState(formAlertResetState);
  const [keyPair, setKeyPair] = useState<string>();
  const [password, setPassword] = useState<string>();

  useEffect(() => {
    if (lastPageStorage.get() === importAccountUrl) setView(View.TwoFa);
  }, []);

  async function submit() {
    try {
      if (keyPair && password) {
        await OwnersAPI.requestActivationCode({
          activationType: ActivationRequestType.ImportWalletAccount,
          payload: {
            privateKey: keyPair,
            password,
          },
          lang: i18n.language as Language,
        });
        setView(View.TwoFa);
        lastPageStorage.store(importAccountUrl);
      }
    } catch (e) {
      let message = t('GenericFailureMsg');
      if (axios.isAxiosError(e)) message = e.response?.data?.message;
      setAlert(errorAlertShell(message));
    }
  }

  async function submitTwoFa(activationCode: string) {
    try {
      if (keyPair && password && activationCode) {
        const { username, identity } = await OwnersAPI.importAccount({
          activationCode,
          password,
          privateKey: keyPair,
        });
        storeLocalAccount({
          identity: identity || username,
          username: username,
        });
        lastPageStorage.clear();
        router.push(heliumPayPath(urls.loggedFunction));
      }
    } catch (e) {
      let message = t('GenericFailureMsg');
      if (axios.isAxiosError(e)) message = e.response?.data?.message;
      setAlert(errorAlertShell(message));
    }
  }

  return (
    <MainLayout>
      <MainGrid>
        <Alert state={alert} />
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>{t('LoginWithExistingCredential')}</MainTitle>
          </IonCol>
        </IonRow>
        {view === View.Submit && (
          <>
            <IonRow>
              <IonCol>
                <StyledInput
                  label={t('KeyPair')}
                  type={'text'}
                  placeholder={t('EnterKeyPair')}
                  onIonInput={({ target: { value } }) =>
                    setKeyPair(value as string)
                  }
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <StyledInput
                  label={t('Password')}
                  type={'password'}
                  placeholder={t('EnterPassword')}
                  onIonInput={({ target: { value } }) =>
                    setPassword(value as string)
                  }
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <PurpleButton
                  disabled={!keyPair || !password}
                  onClick={submit}
                  expand="block"
                >
                  {t('Confirm')}
                </PurpleButton>
              </IonCol>
            </IonRow>
          </>
        )}
        {view === View.TwoFa && (
          <IonRow>
            <IonCol>
              <SubmitActivationCode
                onClose={() => {
                  setView(View.Submit);
                  lastPageStorage.clear();
                }}
                submitWithActivationCode={submitTwoFa}
              />
            </IonCol>
          </IonRow>
        )}
      </MainGrid>
    </MainLayout>
  );
}
