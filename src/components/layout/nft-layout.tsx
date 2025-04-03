import './nft-layout.scss';

import { IonCol, IonContent, IonPage, IonRow } from '@ionic/react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { LoggedHeader } from './logged-header';
import { ChainDiv } from './logged-layout';

export function NftLayout({
  children,
}: {
  children: ReactNode;
  backButton?: boolean;
  noFooter?: boolean;
  backButtonUrl?: string;
}) {
  const { t } = useTranslation();
  return (
    <IonPage>
      <LoggedHeader loggedIn={true} />
      <IonContent class="nft-layout">
        <IonRow style={{ borderBottom: '2px solid #C297FF' }}>
          <IonCol size="12">
            <ChainDiv
              style={{ borderBottom: 'none' }}
              routerLink={akashicPayPath(urls.loggedFunction)}
            >
              {t('AkashicChain')}
            </ChainDiv>
          </IonCol>
        </IonRow>
        {children}
      </IonContent>
    </IonPage>
  );
}
