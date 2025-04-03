import styled from '@emotion/styled';
import { IonCol, IonIcon, IonRow, IonText } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  PurpleButton,
  SquareWhiteButton,
  WhiteButton,
} from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useOwner } from '../../utils/hooks/useOwner';

export const StyledSpan = styled.span({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
  letterSpacing: '0.4px',
});

export const SelectImportMethod = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { authenticated } = useOwner();

  return (
    <PublicLayout>
      <SquareWhiteButton
        className="icon-button"
        onClick={() => {
          if (history.length > 1) {
            history.goBack();
          } else {
            history.replace(
              authenticated
                ? akashicPayPath(urls.loggedFunction)
                : akashicPayPath(urls.akashicPay)
            );
          }
        }}
      >
        <IonIcon
          className="icon-button-icon"
          slot="icon-only"
          icon={arrowBack}
        />
      </SquareWhiteButton>
      <MainGrid style={{ padding: '120px 16px' }}>
        <IonRow className={'ion-grid-row-gap-md'}>
          <IonCol size="12" style={{ textAlign: 'center' }}>
            <h2 className={'ion-margin-bottom-xxs'}>{t('ImportWallet')}</h2>
            <IonText
              className={
                'ion-text-align-center ion-text-size-xs ion-margin-bottom-lg'
              }
              color={'dark'}
            >
              {t('PleaseChooseSecurityOptionToImportWallet')}
            </IonText>
          </IonCol>
          <IonCol size="12" style={{ textAlign: 'center' }}>
            <PurpleButton
              style={{ width: '100%' }}
              expand="block"
              onClick={() => {
                history.push(akashicPayPath(urls.secretPhraseImport));
              }}
            >
              {t('12Words')}
            </PurpleButton>
          </IonCol>
          <IonCol size="12" style={{ textAlign: 'center' }}>
            <WhiteButton
              style={{ width: '100%' }}
              fill="clear"
              onClick={() => {
                history.push(akashicPayPath(urls.keyPairImport));
              }}
            >
              {t('KeyPair')}
            </WhiteButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
};
