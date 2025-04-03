// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './selection-coin.css';

import styled from '@emotion/styled';
import { TEST_TO_MAIN } from '@helium-pay/backend';
import { IonCol, IonImg, IonRow } from '@ionic/react';
import Big from 'big.js';
import { useEffect, useState } from 'react';
import SwiperCore, { Navigation, Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { ThemeType } from '../theme/const';
import { themeType } from '../theme/const';
import { limitDecimalPlaces } from '../utils/conversions';
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

const BalanceTitle = styled.div({
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '28px',
  textAlign: 'center',
  color: 'var(--ion-color-primary-10)',
});

const BalanceText = styled.h4({
  fontWeight: 500,
  margin: '4px',
});

export function SelectCoin() {
  const [__, ___, storedTheme] = useLocalStorage(
    'theme',
    themeType.SYSTEM as ThemeType
  );

  // TODO: change to 0 once swiper is upgraded to v10.x
  // set the default currency the 2nd one because otherwise the swiper doesn't look good
  const defaultCurrencyIdx = 1;

  /**
   * Swiper requires that the total number of slides
   * is at least 2 x `slidesPerView` in order for the looping to occur properly,
   * hence we just duplicate the size to ensure this is always the case
   */
  const WALLET_CURRENCIES_FOR_SWIPER = [
    ...WALLET_CURRENCIES,
    ...WALLET_CURRENCIES,
  ];

  const aggregatedBalances = useAggregatedBalances();
  const { keys: exchangeRates, length: exchangeRateLength } =
    useExchangeRates();

  /**
   * Track cross-page currency selection by user
   */
  const [currency, setCurrency, _] = useLocalStorage(
    'currency',
    WALLET_CURRENCIES_FOR_SWIPER[defaultCurrencyIdx].symbol
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
   * TODO: Combine with currency
   * Track currency under focus in the slider
   */
  const [focusCurrency, setFocusCurrency] = useState(
    WALLET_CURRENCIES_FOR_SWIPER.find(findCurrency(currency)) ||
      WALLET_CURRENCIES_FOR_SWIPER[defaultCurrencyIdx]
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
    WALLET_CURRENCIES_FOR_SWIPER.findIndex((c) => c.symbol === currency) ||
      defaultCurrencyIdx
  );
  /**
   * Slide to last index
   */
  useEffect(
    () => {
      if (!swiperRef || swiperRef.destroyed) return;
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
    const newIndex = swiperRef?.realIndex ?? defaultCurrencyIdx;
    const newCurrency = WALLET_CURRENCIES_FOR_SWIPER[newIndex];

    setSwiperIdx(newIndex);
    setFocusCurrency(newCurrency);
    setCurrency(newCurrency.symbol);

    const conversionRate = findExchangeRate(newCurrency);
    const bigCurrency = Big(aggregatedBalances.get(newCurrency.currency) || 0);
    setFocusCurrencyUSDT(Big(conversionRate).times(bigCurrency));
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
    const chain = WALLET_CURRENCIES_FOR_SWIPER.find(
      (newCurrency) => newCurrency.currency[0] === currency[0]
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
    <>
      <IonRow style={{ marginTop: '8px' }}>
        <IonCol class="ion-center">
          <Swiper
            onSwiper={setSwiperRef}
            onSlideChange={handleSlideChange}
            slidesPerView={3}
            spaceBetween={-30}
            centeredSlides={true}
            navigation={{
              enabled: true,
            }}
            loop={true}
          >
            {WALLET_CURRENCIES_FOR_SWIPER.map(
              ({ logo, darkLogo, greyLogo, symbol, currency }, idx) => {
                return (
                  <SwiperSlide
                    className="unselectable"
                    key={`${symbol}-${idx}`}
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
                                left: '66px',
                              }
                            : {
                                width: '16px',
                                height: '16px',
                                position: 'absolute',
                                top: 0,
                                left: '59px',
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
      <IonRow class="ion-margin-top">
        <IonCol class="ion-no-padding">
          <BalanceTitle>
            {limitDecimalPlaces(
              aggregatedBalances.get(focusCurrency.currency) || 0
            )}{' '}
            {focusCurrency.symbol.toUpperCase()}
          </BalanceTitle>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-no-padding">
          <BalanceText>${`${focusCurrencyUSDT} USD`}</BalanceText>
        </IonCol>
      </IonRow>
    </>
  );
}
