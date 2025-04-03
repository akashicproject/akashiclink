import './nft-layout.scss';

import { IonCol, IonContent, IonIcon, IonPage, IonRow } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { SquareWhiteButton } from '../buttons';
import { LoggedHeader } from './logged-header';
import { ChainDiv } from './logged-layout';

export function NftLayout({
  children,
  backButton = false,
}: {
  children: ReactNode;
  backButton?: boolean;
  noFooter?: boolean;
}) {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <IonPage>
      <LoggedHeader loggedIn={true} />
      <IonContent class="nft-layout">
        <IonRow style={{ borderBottom: '2px solid #C297FF' }}>
          <IonCol size="1">
            {backButton && (
              <SquareWhiteButton
                class="icon-button"
                onClick={() => history.goBack()}
              >
                <IonIcon
                  class="icon-button-icon"
                  slot="icon-only"
                  icon={arrowBack}
                />
              </SquareWhiteButton>
            )}
          </IonCol>
          <IonCol size="4" offset="3">
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
