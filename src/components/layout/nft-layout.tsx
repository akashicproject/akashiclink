import './nft-layout.scss';

import { IonContent, IonPage } from '@ionic/react';
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
  noFooter?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <IonPage>
      <LoggedHeader loggedIn={true} />
      <IonContent class="nft-layout">
        <ChainDiv routerLink={akashicPayPath(urls.loggedFunction)}>
          {t('AkashicChain')}
        </ChainDiv>
        {children}
      </IonContent>
    </IonPage>
  );
}
