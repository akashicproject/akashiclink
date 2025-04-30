import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { useHistoricBalances } from './useHistoricBalances';

export const useYesterdayHistoricBalance = () => {
  const { historicBalances } = useHistoricBalances({
    startDate: dayjs().subtract(1, 'day').toDate(),
  });
  //save yesterdayBalanceUSDT to state to prevent flicking
  const [yesterdayBalanceUSDT, setYesterdayBalanceUSDT] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (historicBalances?.length === 0) return;
    const next = historicBalances?.[0]?.totalBalanceUSDT;

    if (!next || yesterdayBalanceUSDT === next) return;
    setYesterdayBalanceUSDT(next);
  }, [historicBalances?.length]);

  return {
    yesterdayBalanceUSDT,
  };
};
