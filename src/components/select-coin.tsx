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

import type { ThemeType } from '../theme/const';
import { themeType } from '../theme/const';
import { useAggregatedBalances } from '../utils/hooks/useAggregatedBalances';
import { useExchangeRates } from '../utils/hooks/useExchangeRates';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import type {
  WalletCurrency,
  WalletCurrencyMetadata,
} from '../utils/supported-currencies';
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
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '28px',
  textAlign: 'center',
  color: 'var(--ion-color-primary-10)',
});

const BalanceText = styled.div({
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
});

export function SelectCoin() {
  const aggregatedBalances = useAggregatedBalances();
  const { keys: exchangeRates, length: exchangeRateLength } =
    useExchangeRates();

  /**
   * Track cross-page currency selection by user
   */
  const [currency, setCurrency, _] = useLocalStorage(
    'currency',
    WALLET_CURRENCIES[0].symbol
  );

  const [__, ___, storedTheme] = useLocalStorage(
    'theme',
    themeType.SYSTEM as ThemeType
  );

  /**
   * Aux functions to lookup the currency information
   */
  const findCurrency =
    (currencySymbol: string) => (c: WalletCurrencyMetadata) =>
      c.symbol === currencySymbol;
  const findExchangeRate = ({
    currency: [chain, token],
  }: WalletCurrencyMetadata) =>
    exchangeRates.find(
      (ex) => !token && ex.coinSymbol === (TEST_TO_MAIN.get(chain) || chain)
    )?.price || 1;

  /**
   * Track currency under focus in the slider
   */
  const [focusCurrency, setFocusCurrency] = useState(
    WALLET_CURRENCIES.find(findCurrency(currency)) || WALLET_CURRENCIES[0]
  );
  const [focusCurrencyUSDT, setFocusCurrencyUSDT] = useState<Big>();

  /**
   * Update the USDT equivalent once exchange rates are loaded
   */
  useEffect(
    () => {
      const defaultBig = Big(
        aggregatedBalances.get(focusCurrency.currency) || 0
      );
      const conversionRate = findExchangeRate(focusCurrency);
      setFocusCurrencyUSDT(Big(conversionRate).times(defaultBig));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [aggregatedBalances, exchangeRateLength]
  );

  /**
   * Tracking of swiper and currency under focus
   */
  const [swiperRef, setSwiperRef] = useState<SwiperCore>();
  const [swiperIdx, setSwiperIdx] = useState(
    WALLET_CURRENCIES.findIndex((c) => c.symbol === currency) || 0
  );
  /**
   * Slide to last index
   */
  useEffect(
    () => {
      if (!swiperRef || swiperRef.destroyed) return;
      swiperRef.slidePrev();
      swiperRef.slideToLoop(swiperIdx);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [swiperRef]
  );
  /**
   * Handle user selecting different currency:
   * - Update slider focus
   * - Update usdt conversion value
   * - Update global state
   */
  const handleSlideChange = () => {
    setSwiperIdx(swiperRef?.realIndex ?? 0);

    const wc = WALLET_CURRENCIES[swiperRef?.realIndex ?? 0];
    setFocusCurrency(wc);

    const conversionRate = findExchangeRate(wc);
    const bigCurrency = Big(aggregatedBalances.get(wc.currency) || 0);
    setFocusCurrencyUSDT(Big(conversionRate).times(bigCurrency));

    setCurrency(wc.symbol);
  };

  // select the relevant icon path
  const currentLogo = (
    logo: string | undefined,
    darkLogo: string | undefined,
    greyLogo: string | undefined,
    idx: number
  ) => {
    if (swiperIdx !== idx && greyLogo !== undefined) {
      return greyLogo;
    } else if (storedTheme === 'dark' && darkLogo !== undefined) {
      return darkLogo;
    } else {
      return logo;
    }
  };

  // select the relevant chain icon to construct the USDT logo
  const usdtChainIcon = (currency: WalletCurrency, idx: number) => {
    const chain = WALLET_CURRENCIES.find(
      (wc) => wc.currency[0] === currency[0]
    );
    if (swiperIdx !== idx && chain?.greyLogo !== undefined) {
      return chain.greyLogo;
    } else if (storedTheme === 'dark' && chain?.darkLogo !== undefined) {
      return chain.darkLogo;
    } else {
      return chain?.logo;
    }
  };

  return (
    <IonGrid style={{ width: '280px' }}>
      <IonRow style={{ marginTop: '15px' }}>
        <IonCol class="ion-center">
          <Swiper
            onSwiper={setSwiperRef}
            onSlideChange={handleSlideChange}
            slidesPerView={3}
            centeredSlides={true}
            navigation={{
              enabled: true,
            }}
            style={{ position: 'relative' }}
            loop={true}
          >
            {WALLET_CURRENCIES.map(
              ({ logo, darkLogo, greyLogo, symbol, currency }, idx) => {
                return (
                  <SwiperSlide
                    key={symbol}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <IonImg
                      alt={''}
                      src={currentLogo(logo, darkLogo, greyLogo, idx)}
                      style={
                        swiperIdx === idx
                          ? { height: '56px', width: '56px' }
                          : {
                              width: '32px',
                              height: '32px',
                            }
                      }
                    />
                    {currency[1] && (
                      <IonImg
                        src={usdtChainIcon(currency, idx)}
                        style={
                          swiperIdx === idx
                            ? {
                                height: '30px',
                                position: 'absolute',
                                top: 0,
                                left: '56px',
                              }
                            : {
                                width: '16px',
                                height: '16px',
                                position: 'absolute',
                                top: 0,
                                left: '49px',
                              }
                        }
                      />
                    )}
                  </SwiperSlide>
                );
              }
            )}
          </Swiper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <BalanceWrapper>
            <BalanceTitle>
              {aggregatedBalances.get(focusCurrency.currency) || 0}{' '}
              {focusCurrency.symbol}
            </BalanceTitle>
            <BalanceText>{`${focusCurrencyUSDT} USD`}</BalanceText>
          </BalanceWrapper>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
