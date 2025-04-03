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

export const ImportWalletSelectMethod = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { authenticated } = useOwner();

  const onBackButton = () => {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.replace(
        authenticated
          ? akashicPayPath(urls.loggedFunction)
          : akashicPayPath(urls.akashicPay)
      );
    }
  };
  const onSelectKeyPair = () => {
    history.push(akashicPayPath(urls.importWalletKeypair));
  };
  const onSelect12Words = () => {
    history.push(akashicPayPath(urls.importWalletSecretPhrase));
  };

  return (
    <PublicLayout>
      <SquareWhiteButton className="icon-button" onClick={onBackButton}>
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
              onClick={onSelect12Words}
            >
              {t('12Words')}
            </PurpleButton>
          </IonCol>
          <IonCol size="12" style={{ textAlign: 'center' }}>
            <WhiteButton
              style={{ width: '100%' }}
              fill="clear"
              onClick={onSelectKeyPair}
            >
              {t('KeyPair')}
            </WhiteButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
};
