import type { IExchangeRate } from '@helium-pay/backend';
import useSWR from 'swr';

import { useFocusCurrencyDetail } from '../../components/providers/PreferenceProvider';
import { calculateInternalWithdrawalFee } from '../internal-fee';
import fetcher from '../ownerFetcher';

export const useExchangeRates = () => {
  const { data, error } = useSWR(
    `/public-api/owner/exchange-rates`,
    fetcher,
    {}
  );
  return {
    keys: (data || []) as IExchangeRate[],
    length: data ? Object.keys(data).length : 0,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useCalculateFocusCurrencyL2WithdrawalFee = () => {
  const { keys: exchangeRates } = useExchangeRates();
  const { chain, token } = useFocusCurrencyDetail();

  return (amount: string) => {
    return calculateInternalWithdrawalFee(
      amount ?? '0',
      exchangeRates,
      chain,
      token
    );
  };
};
