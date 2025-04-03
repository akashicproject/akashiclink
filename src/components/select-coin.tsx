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

import { limitDecimalPlaces } from '../utils/conversions';
import { useAggregatedBalances } from '../utils/hooks/useAggregatedBalances';
import { useExchangeRates } from '../utils/hooks/useExchangeRates';
import type { WalletCurrency } from '../utils/supported-currencies';
import {
  compareWalletCurrency,
  WALLET_CURRENCIES,
} from '../utils/supported-currencies';
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
const WALLET_CURRENCIES_FOR_SWIPER = [
  ...WALLET_CURRENCIES,
  ...WALLET_CURRENCIES,
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

  const findExchangeRate = ({ chain, token }: WalletCurrency) =>
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
    WALLET_CURRENCIES_FOR_SWIPER.findIndex(({ currency }) =>
      compareWalletCurrency(currency, focusCurrency)
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
    const wc = WALLET_CURRENCIES_FOR_SWIPER[newIndex].currency;
    setFocusCurrency && setFocusCurrency(wc);

    const conversionRate = findExchangeRate(wc);
    const bigCurrency = Big(aggregatedBalances.get(wc) || 0);
    setFocusCurrencyUSDTBalance(Big(conversionRate).times(bigCurrency));
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

  // Lookup USDT icon
  const usdtChainIcon = (wc: WalletCurrency, idx: number) => {
    const chain = WALLET_CURRENCIES_FOR_SWIPER.find(
      ({ currency: { chain } }) => chain === wc.chain
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
            {WALLET_CURRENCIES_FOR_SWIPER.map(
              ({ logo, darkLogo, greyLogo, currency }, idx) => {
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
                    {currency.token && (
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
