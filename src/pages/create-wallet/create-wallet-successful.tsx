import styled from '@emotion/styled';
import { IonCol, IonImg, IonRow, IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../../components/common/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/page-layout/public-layout';
import { useAppDispatch } from '../../redux/app/hooks';
import { onClear } from '../../redux/slices/createWalletSlice';
import { historyResetStackAndRedirect } from '../../routing/history';
import { useBalancesMe } from '../../utils/hooks/useBalancesMe';
import { useNftMe } from '../../utils/hooks/useNftMe';
import { useNftTransfersMe } from '../../utils/hooks/useNftTransfersMe';
import { useOwner } from '../../utils/hooks/useOwner';
import { useTransfersMe } from '../../utils/hooks/useTransfersMe';

export const StyledA = styled.a({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-white-button-text)',
  marginTop: '4px',
  lineHeight: '16px',
  cursor: 'pointer',
});

export const CreateWalletSuccessful = () => {
  const { t } = useTranslation();
  const { mutateOwner } = useOwner();
  const { mutateTransfersMe } = useTransfersMe();
  const { mutateNftTransfersMe } = useNftTransfersMe();
  const { mutateBalancesMe } = useBalancesMe();
  const { mutateNftMe } = useNftMe();
  const dispatch = useAppDispatch();

  const handleOnConfirm = async () => {
    dispatch(onClear());
    await mutateOwner();
    await mutateTransfersMe();
    await mutateNftTransfersMe();
    await mutateBalancesMe();
    await mutateNftMe();
    // creation flow is finished, completely reset router history
    historyResetStackAndRedirect();
  };

  return (
    <PublicLayout className="vertical-center">
      <MainGrid className={'ion-grid-row-gap-lg'}>
        <IonRow className={'ion-grid-row-gap-md ion-center'}>
          <IonCol size={'12'} className={'ion-center'}>
            <IonImg
              alt={''}
              src={'/shared-assets/images/right.png'}
              style={{ width: '40px', height: '40px' }}
            />
          </IonCol>
          <IonCol size={'12'}>
            <h2 className={'ion-text-align-center ion-margin-0'}>
              {t('WalletCreationSuccessful')}
            </h2>
            <IonText
              className={'ion-text-align-center ion-text-size-xs'}
              color={'dark'}
            >
              <p>{t('WalletProtectedSuccessfully')}</p>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow className={'ion-grid-row-gap-sm ion-center'}>
          <IonCol size={'12'}>
            <h3 className={'ion-text-align-center ion-margin-0'}>
              {t('Remember')}
            </h3>
          </IonCol>
          <IonCol size={'12'}>
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
