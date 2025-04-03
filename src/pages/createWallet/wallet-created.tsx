import styled from '@emotion/styled';
import { IonCol, IonImg, IonRow, IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { lastPageStorage } from '../../utils/last-page-storage';

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
  const history = useHistory();

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
            <PurpleButton
              expand="block"
              onClick={async () => {
                await lastPageStorage.clear();
                history.push(akashicPayPath(urls.loggedFunction));
              }}
            >
              {t('GotIt')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
};
