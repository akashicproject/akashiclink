import './logged.css';

import styled from '@emotion/styled';
import { IonImg, IonItem } from '@ionic/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { TabButton } from '../../components/buttons';
import { LoggedLayout } from '../../components/layout/loggedLayout';

const ItemBalanceWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  gap: '8px',
  height: '48px',
  marginLeft: '30px',
});

const ItemBalanceTitle = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: '#290056',
});

const ItemBalanceText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '16px',
  color: '#290056',
});

const TabsWrapper = styled.div({
  position: 'fixed',
  bottom: 0,
  width: '100vw',
  left: 0,
});

const Tabs = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  height: '40px',
});

const NFTDiv = styled.div({
  height: '160px',
});

export const LoggedMain: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tab, setTab] = useState('activity');

  useEffect(() => {
    console.log(document.getElementById('activity'));
    document.getElementById('activity')?.click();
  }, []);

  return (
    <LoggedLayout>
      {children}
      <TabsWrapper>
        <Tabs>
          <TabButton
            style={{ width: '50%' }}
            id={'activity'}
            onClick={() => setTab('activity')}
          >
            Activity
          </TabButton>
          <TabButton
            style={{ width: '50%' }}
            id={'nft'}
            onClick={() => setTab('nft')}
          >
            NFT
          </TabButton>
        </Tabs>
        {tab === 'activity' ? (
          <>
            <IonItem
              class="activity-list-item"
              detail={true}
              onClick={() => console.log('Redirect')}
              style={{
                '--detail-icon-color': '#7444b6',
                '--detail-icon-opacity': 1,
              }}
            >
              <IonImg
                alt="Bitcoin activity"
                src="/shared-assets/images/bitcoin.png"
                style={{ width: '40px', height: '40px' }}
              />
              <ItemBalanceWrapper>
                <ItemBalanceTitle>0 BTC</ItemBalanceTitle>
                <ItemBalanceText>$0.00 USD</ItemBalanceText>
              </ItemBalanceWrapper>
            </IonItem>
            <IonItem
              class="activity-list-item"
              detail={true}
              onClick={() => console.log('Redirect')}
              style={{
                '--detail-icon-color': '#7444b6',
                '--detail-icon-opacity': 1,
              }}
            >
              <IonImg
                alt="Ethereum Activity"
                src="/shared-assets/images/eth.png"
                style={{ width: '40px', height: '40px' }}
              />
              <ItemBalanceWrapper>
                <ItemBalanceTitle>0 ETH</ItemBalanceTitle>
                <ItemBalanceText>$0.00 USD</ItemBalanceText>
              </ItemBalanceWrapper>
            </IonItem>
          </>
        ) : (
          <NFTDiv> nft</NFTDiv>
        )}
      </TabsWrapper>
    </LoggedLayout>
  );
};
