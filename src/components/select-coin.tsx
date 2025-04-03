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

import type { IWalletCurrency } from '../constants/currencies';
import {
  compareWalletCurrencies,
  SUPPORTED_CURRENCIES_FOR_EXTENSION,
} from '../constants/currencies';
import { limitDecimalPlaces } from '../utils/conversions';
import { useAggregatedBalances } from '../utils/hooks/useAggregatedBalances';
import { useExchangeRates } from '../utils/hooks/useExchangeRates';
import { useFocusCurrency, useTheme } from './PreferenceProvider';

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

/**
 * Swiper requires that the total number of slides
 * is at least 2 x `slidesPerView` in order for the looping to occur properly,
 * hence we just duplicate the size to ensure this is always the case
 */
const CURRENCIES_FOR_SWIPER = [
  ...SUPPORTED_CURRENCIES_FOR_EXTENSION.list,
  ...SUPPORTED_CURRENCIES_FOR_EXTENSION.list,
];

export function SelectCoin() {
  const [storedTheme] = useTheme();
  const [focusCurrency, setFocusCurrency] = useFocusCurrency();

  /**
   * Balance information
   */
  const [focusCurrencyUSDTBalance, setFocusCurrencyUSDTBalance] =
    useState<Big>();

  const { keys: exchangeRates, length: exchangeRateLength } =
    useExchangeRates();

  const findExchangeRate = ({ chain, token }: IWalletCurrency) =>
    exchangeRates.find(
      (ex) => !token && ex.coinSymbol === (TEST_TO_MAIN.get(chain) || chain)
    )?.price || 1;

  const aggregatedBalances = useAggregatedBalances();

  /**
   * Update the USDT equivalent once exchange rates are loaded
   */
  useEffect(
    () => {
      const defaultBig = Big(aggregatedBalances.get(focusCurrency) || 0);
      const conversionRate = findExchangeRate(focusCurrency);
      setFocusCurrencyUSDTBalance(Big(conversionRate).times(defaultBig));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [aggregatedBalances, exchangeRateLength]
  );

  /**
   * Tracking of swiper and currency under focus
   */
  const [swiperRef, setSwiperRef] = useState<SwiperCore>();
  const [swiperIdx, setSwiperIdx] = useState<number>(
    CURRENCIES_FOR_SWIPER.findIndex(({ walletCurrency }) =>
      compareWalletCurrencies(walletCurrency, focusCurrency)
    )
  );

  /**
   * Slide to last index
   */
  useEffect(() => {
    if (!swiperRef || swiperRef.destroyed) return;
    swiperRef.slideToLoop(swiperIdx);
  }, [swiperRef, swiperIdx]);
  /**
   * Handle user selecting different currency:
   * - Update slider focus
   * - Update usdt conversion value
   * - Update global state
   */
  const handleSlideChange = () => {
    if (!swiperRef) return;

    if (isNaN(swiperRef.realIndex)) {
      return;
    }

    const newIndex = swiperRef.realIndex;
    setSwiperIdx(newIndex);
    const wc = CURRENCIES_FOR_SWIPER[newIndex].walletCurrency;
    setFocusCurrency && setFocusCurrency(wc);

    const conversionRate = findExchangeRate(wc);
    const bigCurrency = Big(aggregatedBalances.get(wc) || 0);
    setFocusCurrencyUSDTBalance(Big(conversionRate).times(bigCurrency));
  };

  const getIcon = (
    currencyIcon: string | undefined,
    darkCurrencyIcon: string | undefined,
    greyCurrencyIcon: string | undefined,
    idx: number
  ) => {
    if (swiperIdx !== idx && greyCurrencyIcon !== undefined) {
      return greyCurrencyIcon;
    } else if (storedTheme === 'dark' && darkCurrencyIcon !== undefined) {
      return darkCurrencyIcon;
    } else {
      return currencyIcon;
    }
  };

  // Lookup USDT icon
  const usdtChainIcon = (wc: IWalletCurrency, idx: number) => {
    const chain = CURRENCIES_FOR_SWIPER.find(
      ({ walletCurrency: { chain } }) => chain === wc.chain
    );
    if (swiperIdx !== idx && chain?.greyCurrencyIcon !== undefined) {
      return chain.greyCurrencyIcon;
    } else if (
      storedTheme === 'dark' &&
      chain?.darkCurrencyIcon !== undefined
    ) {
      return chain.darkCurrencyIcon;
    } else {
      return chain?.currencyIcon;
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
            spaceBetween={-18}
            centeredSlides={true}
            navigation={{
              enabled: true,
            }}
            loop={true}
            onInit={(swiper) => {
              setTimeout(() => {
                try {
                  swiper.loopCreate();
                } catch (e) {
                  console.warn('swiper not ready');
                }
              }, 1000);
            }}
          >
            {CURRENCIES_FOR_SWIPER.map(
              (
                {
                  currencyIcon,
                  darkCurrencyIcon,
                  greyCurrencyIcon,
                  walletCurrency,
                },
                idx
              ) => {
                return (
                  <SwiperSlide
                    className="unselectable"
                    key={idx}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <img
                      alt={walletCurrency.displayName}
                      src={getIcon(
                        currencyIcon,
                        darkCurrencyIcon,
                        greyCurrencyIcon,
                        idx
                      )}
                      style={
                        swiperIdx === idx
                          ? { height: '56px', width: '56px' }
                          : {
                              width: '32px',
                              height: '32px',
                            }
                      }
                    />
                    {walletCurrency.token && (
                      <img
                        alt={walletCurrency.displayName}
                        src={usdtChainIcon(walletCurrency, idx)}
                        style={
                          swiperIdx === idx
                            ? {
                                height: '30px',
                                position: 'absolute',
                                top: 0,
                                left: '59px',
                              }
                            : {
                                width: '16px',
                                height: '16px',
                                position: 'absolute',
                                top: 0,
                                left: '54px',
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
            {limitDecimalPlaces(aggregatedBalances.get(focusCurrency) || 0)}{' '}
            {focusCurrency.displayName.toUpperCase()}
          </BalanceTitle>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-no-padding">
          <BalanceText>${`${focusCurrencyUSDTBalance} USD`}</BalanceText>
        </IonCol>
      </IonRow>
    </>
  );
}
