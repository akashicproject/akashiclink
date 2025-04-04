import styled from '@emotion/styled';
import { IonImg, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../app/hooks';
import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { historyResetStackAndRedirect } from '../../history';
import { onClear } from '../../slices/migrateWalletSlice';
import { useOwner } from '../../utils/hooks/useOwner';
import { StyledSpan } from './migrate-wallet-secret';

export const StyledA = styled.a({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-white-button-text)',
  marginTop: '4px',
  lineHeight: '16px',
  cursor: 'pointer',
});

export const MigrateWalletSuccessful = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { mutateOwner } = useOwner();

  const handleOnConfirm = async () => {
    dispatch(onClear());
    await mutateOwner();
    // migration flow is finished, completely reset router history
    historyResetStackAndRedirect();
  };

  return (
    <PublicLayout className="vertical-center">
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
          <ul style={{ paddingLeft: '16px', margin: '0' }}>
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
            onClick={handleOnConfirm}
          >
            {t('GotIt')}
          </PurpleButton>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
};
