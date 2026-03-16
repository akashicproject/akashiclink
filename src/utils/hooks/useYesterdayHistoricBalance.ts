import Big from 'big.js';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { useFiatCurrencyDisplay } from './useFiatCurrencyDisplay';
import { useFiatExchangeRates } from './useFiatExchangeRates';
import { useHistoricBalances } from './useHistoricBalances';

export const useYesterdayHistoricBalance = () => {
  const { historicBalances } = useHistoricBalances({
    startDate: dayjs().subtract(1, 'day').startOf('day').toDate(),
  });

  const { fiatCurrencySymbol } = useFiatCurrencyDisplay();

  const { exchangeRate: fiatExchangeRate } =
    useFiatExchangeRates(fiatCurrencySymbol);

  //save yesterdayBalanceUSDT to state to prevent flicking
  const [yesterdayBalanceUSDT, setYesterdayBalanceUSDT] = useState<
    Big | undefined
  >();

  useEffect(() => {
    if (historicBalances?.length === 0) return;
    const next = historicBalances?.[0]?.totalBalanceUSDT;

    if (!next || yesterdayBalanceUSDT?.eq(next)) return;
    setYesterdayBalanceUSDT(Big(next));
  }, [historicBalances?.length]);

  const yesterdayBalanceInFiat = Big(yesterdayBalanceUSDT ?? '0').times(
    fiatExchangeRate?.USDT ?? 1
  );

  return {
    yesterdayBalanceUSDT,
    yesterdayBalanceInFiat,
  };
};
