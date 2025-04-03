import styled from '@emotion/styled';
import { IonContent, IonFooter, IonPage, isPlatform } from '@ionic/react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { BottomTabButton } from '../buttons';
import { LoggedHeader } from './logged-header';
import { ChainDiv } from './logged-layout';

const Tabs = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  height: '40px',
});

export const NftLayout: React.FC<{
  children: ReactNode;
  noFooter?: boolean;
}> = ({ children, noFooter }) => {
  const { t } = useTranslation();
  const isMobile = isPlatform('mobile');
  const history = useHistory();
  const ChainDivMarginBottom = isMobile ? '32px' : '0px';
  return (
    <IonPage>
      <LoggedHeader loggedIn={true} />
      <IonContent class="nft-layout">
        <ChainDiv style={{ marginBottom: ChainDivMarginBottom }}>
          {t('AkashicChain')}
        </ChainDiv>
        {children}
      </IonContent>
      {noFooter ? null : (
        <IonFooter class={'ion-no-border'}>
          <Tabs>
            <BottomTabButton
              style={{ width: '50%', borderTop: '2px solid #CCC4CF' }}
              id={'activity'}
              onClick={() => history.push(akashicPayPath(urls.activity))}
            >
              {t('Activity')}
            </BottomTabButton>
            <BottomTabButton
              style={{ width: '50%', borderTop: '2px solid #C297FF' }}
              id={'nft'}
              onClick={() => history.push(akashicPayPath(urls.nfts))}
            >
              Nft
            </BottomTabButton>
          </Tabs>
        </IonFooter>
      )}
    </IonPage>
  );
};
