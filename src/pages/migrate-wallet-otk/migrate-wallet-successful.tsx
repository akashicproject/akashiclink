import styled from '@emotion/styled';
import { IonCol, IonRow, IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../../components/common/buttons';
import { SuccessfulIconWithTitle } from '../../components/common/state-icon-with-title/successful-icon-with-title';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/page-layout/public-layout';
import { useAppDispatch } from '../../redux/app/hooks';
import { onClear } from '../../redux/slices/migrateWalletSlice';
import { historyResetStackAndRedirect } from '../../routing/history';
import { useOwner } from '../../utils/hooks/useOwner';

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
          <IonCol size="12">
            <SuccessfulIconWithTitle title={t('WalletCreationSuccessful')} />
            <IonText color={'dark'}>
              <p className={'ion-text-align-center ion-text-size-xs'}>
                {t('WalletProtectedSuccessfully')}
              </p>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow className={'ion-center ion-grid-row-gap-xs'}>
          <IonCol size={'12'}>
            <h3 className={'ion-text-align-center ion-margin-bottom-sm'}>
              {t('Remember')}
            </h3>
            <IonText className={'ion-text-size-xs'} color={'dark'}>
              <ul>
                <li>{t('CantRecoverSecretPhrase')}</li>
                <li>{t('WillNeverAskRecoveryPhrase')}</li>
                <li>
                  <b>{t('NeverShareRecoveryPhrase')}</b> {t('riskOfFunds')}
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
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow className={'ion-center'}>
          <IonCol size={'6'}>
            <PurpleButton expand="block" onClick={handleOnConfirm}>
              {t('GotIt')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
};
