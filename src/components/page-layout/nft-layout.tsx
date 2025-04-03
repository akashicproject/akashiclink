import './nft-layout.scss';

import styled from '@emotion/styled';
import { IonCol, IonContent, IonPage, IonRow } from '@ionic/react';
import type { ReactNode } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { Header } from '../layout/header';
import { ChainDiv } from './dashboard-layout';

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
      <Header />
      <IonContent class="nft-layout">
        <IonRow style={{ borderBottom: '2px solid #C297FF' }}>
          <IonCol size="12" className="ion-no-padding">
            <ChainDiv
              style={{ borderBottom: 'none' }}
              routerLink={akashicPayPath(urls.dashboard)}
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
