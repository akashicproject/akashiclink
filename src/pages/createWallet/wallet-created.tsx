import styled from '@emotion/styled';
import { IonImg, IonRow } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { lastPageStorage } from '../../utils/last-page-storage';
import { StyledSpan } from './create-wallet-secret';

export const StyledA = styled.a({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-white-button-text)',
  marginTop: '4px',
  lineHeight: '16px',
  cursor: 'pointer',
});

export const WalletCreated = () => {
  const { t } = useTranslation();
  const history = useHistory<LocalAccount>();
  const { setActiveAccount } = useAccountStorage();

  return (
    <PublicLayout contentStyle={{ padding: '0 30px' }}>
      <MainGrid style={{ gap: '24px', padding: '0' }}>
        <IonRow style={{ marginTop: '56px', justifyContent: 'center' }}>
          <IonImg
            alt={''}
            src={'/shared-assets/images/right.png'}
            style={{ width: '40px', height: '40px' }}
          />
        </IonRow>
        <IonRow>
          <h2
            style={{
              margin: '0 auto',
              fontWeight: 700,
            }}
          >
            {t('WalletCreationSuccessful')}
          </h2>
          <StyledSpan style={{ textAlign: 'center' }}>
            {t('WalletProtectedSuccessfully')}
          </StyledSpan>
        </IonRow>
        <IonRow style={{ width: '100%' }}>
          <h3
            style={{
              textAlign: 'center',
              fontFamily: 'Nunito Sans',
              margin: '0 auto',
              fontWeight: 700,
            }}
          >
            {t('Remember')}
          </h3>
        </IonRow>
        <IonRow>
          <ul style={{ paddingLeft: '15px', margin: '0' }}>
            <li>
              <StyledSpan>{t('CantRecoverSecretPhrase')}</StyledSpan>
            </li>
            <li>
              <StyledSpan>{t('WillNeverAskRecoveryPhrase')}</StyledSpan>
            </li>
            <li>
              <StyledSpan>
                <b>{t('NeverShareRecoveryPhrase')}</b> {t('riskOfFunds')}
              </StyledSpan>
            </li>
            <li>
              <StyledA
                href="https://akashic-1.gitbook.io/akashicwallet/"
                target={'_blank'}
              >
                {t('LearnMore')}
              </StyledA>
            </li>
          </ul>
        </IonRow>
        <IonRow style={{ justifyContent: 'center' }}>
          <PurpleButton
            style={{ width: '149px' }}
            expand="block"
            onClick={async () => {
              await lastPageStorage.clear();
              // Set the new active account after passphrase has been added
              setActiveAccount(history.location.state);
              history.push(akashicPayPath(urls.loggedFunction));
            }}
          >
            {t('GotIt')}
          </PurpleButton>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
};
