import './nft-layout.scss';

import styled from '@emotion/styled';
import { IonCol, IonContent, IonPage, IonRow } from '@ionic/react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { LoggedHeader } from './logged-header';
import { ChainDiv } from './logged-layout';

const BackgroundDiv = styled.div({
  display: 'block',
  height: '25vh',
  backgroundColor: 'var(--nft-background)',
});

export function NftLayout({
  children,
  background = true,
}: {
  children: ReactNode;
  backButton?: boolean;
  noFooter?: boolean;
  backButtonUrl?: string;
  background?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <IonPage>
      <LoggedHeader loggedIn={true} />
      <IonContent class="nft-layout">
        <IonRow style={{ borderBottom: '2px solid #C297FF' }}>
          <IonCol size="12" className="ion-no-padding">
            <ChainDiv
              style={{ borderBottom: 'none' }}
              routerLink={akashicPayPath(urls.loggedFunction)}
            >
              {t('AkashicChain')}
            </ChainDiv>
          </IonCol>
        </IonRow>
        {background && <BackgroundDiv />}
        {children}
      </IonContent>
    </IonPage>
  );
}
