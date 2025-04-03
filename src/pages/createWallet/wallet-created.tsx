import './create-wallet.css';

import { IonCol, IonLabel, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../../components/buttons';
import { Copy } from '../../components/copy/copy';
import { MainGrid } from '../../components/layout/main-grid';
import { MainTitle } from '../../components/layout/main-title';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';

export function WalletCreated({
  privateKey,
  walletAddress,
}: {
  privateKey?: string;
  walletAddress?: string;
}) {
  const { t } = useTranslation();

  return (
    <MainGrid>
      <IonRow>
        <IonCol class="ion-center">
          <MainTitle>{t('WalletCreated')}</MainTitle>
        </IonCol>
      </IonRow>
      <IonRow>{t('SaveKey')}</IonRow>
      <IonRow class="ion-justify-content-center">
        <IonCol>
          <IonLabel position="stacked">{t('PublicAddress')}</IonLabel>
          <Copy text={walletAddress} />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-center">
        <IonCol>
          <IonLabel position="stacked">{t('PrivateKey')}</IonLabel>
          <Copy text={privateKey} />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <PurpleButton
            expand="block"
            routerLink={akashicPayPath(urls.loggedFunction)}
          >
            {t('Continue')}
          </PurpleButton>
        </IonCol>
      </IonRow>
    </MainGrid>
  );
}
