import './logged.css';

import styled from '@emotion/styled';
import { CoinSymbol } from '@helium-pay/backend';
import { IonImg, IonItem } from '@ionic/react';
import Big from 'big.js';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TabButton } from '../../components/buttons';
import { LoggedLayout } from '../../components/layout/loggedLayout';
import { useAggregatedBalances } from '../../components/select-coin';
import { useExchangeRates } from '../../utils/hooks/useExchangeRates';
import { makeWalletCurrency } from '../../utils/supported-currencies';

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
  const { t } = useTranslation();
  const aggregatedBalances = useAggregatedBalances();
  /**
   * TODO: refactor this by tracking state of an object rather than each currency and conversion individually
   * Suggested (feel free to restructure/rename) base objects that can replace BTC, ETH, USDT_BTC, USDT_ETH:
      type MainBalance = {
        balance: Big;
        convertedBalance: Big;
      };
      const [balances, setBalances] = useState<CurrencyMap<MainBalance>[]>([]);
   */
  const { keys: exchangeRates } = useExchangeRates();
  const [BTC, setBTC] = useState<Big>();
  const [ETH, setETH] = useState<Big>();
  const [USDT_BTC, setUSDT_BTC] = useState<Big>();
  const [USDT_ETH, setUSDT_ETH] = useState<Big>();

  useEffect(() => {
    const BTC = Big(
      aggregatedBalances.get(makeWalletCurrency(CoinSymbol.Bitcoin)) || 0
    );
    const ETH = Big(
      aggregatedBalances.get(makeWalletCurrency(CoinSymbol.Ethereum_Mainnet)) ||
        0
    );
    setBTC(BTC);
    setETH(ETH);
    const BTC_exchange =
      exchangeRates.find((ex) => ex.coinSymbol === CoinSymbol.Bitcoin)?.price ||
      1;
    const ETH_exchange =
      exchangeRates.find((ex) => ex.coinSymbol === CoinSymbol.Ethereum_Mainnet)
        ?.price || 1;
    setUSDT_BTC(Big(BTC_exchange).times(BTC));
    setUSDT_ETH(Big(ETH_exchange).times(ETH));
    document.getElementById('activity')?.click();
  }, [aggregatedBalances, exchangeRates]);

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
            {t('Activity')}
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
                <ItemBalanceTitle>{`${BTC} BTC`}</ItemBalanceTitle>
                <ItemBalanceText>{`${USDT_BTC} USD`}</ItemBalanceText>
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
                <ItemBalanceTitle>{`${ETH} ETH`}</ItemBalanceTitle>
                <ItemBalanceText>{`${USDT_ETH} USD`}</ItemBalanceText>
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
