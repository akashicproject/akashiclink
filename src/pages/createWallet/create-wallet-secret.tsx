import styled from '@emotion/styled';
import { IonCol, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { SecretWords } from '../../components/secret-words/secret-words';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
} from '../../utils/last-page-storage';

export const StyledSpan = styled.span({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
});
export function CreateWalletSecret() {
  const { t } = useTranslation();
  const [secretWords, setSecretWords] = useState<Array<string>>([]);
  const history = useHistory<LocalAccount>();

  useEffect(() => {
    cacheCurrentPage(urls.secret, NavigationPriority.IMMEDIATE, async () => {
      const data = await lastPageStorage.getVars();
      if (data.passPhrase && !secretWords.length) {
        setSecretWords(data.passPhrase.split(' '));
      }
    });
  }, []);

  const confirmSecret = async () => {
    const data = await lastPageStorage.getVars();
    await lastPageStorage.store(
      urls.secretConfirm,
      NavigationPriority.IMMEDIATE,
      {
        ...data,
        passPhrase: secretWords.join(' '),
      }
    );
    history.push({
      pathname: akashicPayPath(urls.secretConfirm),
      state: history.location.state,
    });
  };

  return (
    <PublicLayout contentStyle={{ padding: '24px 30px' }}>
      <MainGrid style={{ gap: '24px', padding: '0' }}>
        <IonRow>
          <IonCol size="12" style={{ textAlign: 'center' }}>
            <IonRow>
              <h2
                style={{
                  fontSize: '20pt',
                  margin: '0 auto',
                }}
              >
                {t('WriteSecretRecoveryPhrase')}
              </h2>
            </IonRow>
            <IonRow>
              <StyledSpan style={{ textAlign: 'center' }}>
                {t('Store12SecretRecoveryPhrase')}
              </StyledSpan>
            </IonRow>
          </IonCol>
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
              {secretWords.length && (
                <SecretWords initialWords={secretWords} withAction={true} />
              )}
            </IonRow>
            <IonRow style={{ justifyContent: 'center' }}>
              <PurpleButton
                style={{ width: '149px' }}
                expand="block"
                onClick={() => {
                  confirmSecret();
                }}
              >
                {t('Next')}
              </PurpleButton>
            </IonRow>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
