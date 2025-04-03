// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './selection-coin.css';

import styled from '@emotion/styled';
import { TEST_TO_MAIN } from '@helium-pay/backend';
import { IonCol, IonGrid, IonImg, IonRow } from '@ionic/react';
import Big from 'big.js';
import { useEffect, useState } from 'react';
import SwiperCore, { Navigation, Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useAggregatedBalances } from '../utils/hooks/useAggregatedBalances';
import { useExchangeRates } from '../utils/hooks/useExchangeRates';
import { WALLET_CURRENCIES } from '../utils/supported-currencies';

// install Virtual module
SwiperCore.use([Virtual, Navigation]);

const BalanceWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '8px',
  height: '56px',
});

const BalanceTitle = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '28px',
  textAlign: 'center',
  color: '#290056',
});

const BalanceText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#290056',
});

interface SelectCoinProps {
  changeCurrency: (wc: string) => void;
}

export function SelectCoin({ changeCurrency }: SelectCoinProps) {
  const aggregatedBalances = useAggregatedBalances();
  const { keys: exchangeRates } = useExchangeRates();

  /** Tracking of swiper and currency under focus */
  const [swiperRef, setSwiperRef] = useState<SwiperCore>();
  const [swiperIdx, setSwiperIdx] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState(
    WALLET_CURRENCIES[0]
  );
  const [selectedCurrencyUSDT, setSelectedCurrencyUSDT] = useState<Big>();

  useEffect(() => {
    changeCurrency(WALLET_CURRENCIES[0].symbol);
  }, []);

  /** Handling choosing another currency and convert to USDT */
  const handleSlideChange = () => {
    setSwiperIdx(swiperRef?.activeIndex ?? 0);
    const wc = WALLET_CURRENCIES[swiperRef?.activeIndex ?? 0];
    setSelectedCurrency(wc);

    const conversionRate =
      exchangeRates.find(
        (ex) =>
          !wc.currency[1] &&
          ex.coinSymbol === (TEST_TO_MAIN.get(wc.currency[0]) || wc.currency[0])
      )?.price || 1;

    const bigCurrency = Big(aggregatedBalances.get(wc.currency) || 0);

    setSelectedCurrencyUSDT(Big(conversionRate).times(bigCurrency));
    changeCurrency(wc.symbol);
  };

  useEffect(() => {
    const defaultBig = Big(
      aggregatedBalances.get(WALLET_CURRENCIES[0].currency) || 0
    );
    const conversionRate =
      exchangeRates.find(
        (ex) => ex.coinSymbol === WALLET_CURRENCIES[0].currency[0]
      )?.price || 1;
    setSelectedCurrencyUSDT(Big(conversionRate).times(defaultBig));
  }, [aggregatedBalances, exchangeRates]);

  return (
    <IonGrid>
      <IonRow style={{ marginTop: '15px' }}>
        <IonCol class="ion-center">
          <Swiper
            onSwiper={setSwiperRef}
            onSlideChange={handleSlideChange}
            slidesPerView={3}
            centeredSlides={true}
            spaceBetween={0}
            navigation={{
              enabled: true,
            }}
          >
            {WALLET_CURRENCIES.map(({ logo, symbol }, idx) => {
              return (
                <SwiperSlide key={symbol}>
                  <IonImg
                    alt={''}
                    src={logo}
                    style={
                      swiperIdx == idx
                        ? { width: '56px', height: '56px' }
                        : { width: '32px', height: '32px', opacity: 0.2 }
                    }
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <BalanceWrapper>
            <BalanceTitle>
              {aggregatedBalances.get(selectedCurrency.currency) || 0}{' '}
              {selectedCurrency.symbol}
            </BalanceTitle>
            <BalanceText>{`${selectedCurrencyUSDT} USD`}</BalanceText>
          </BalanceWrapper>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
