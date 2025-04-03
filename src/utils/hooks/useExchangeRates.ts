import type { IExchangeRate } from '@helium-pay/backend';
import useSWR from 'swr';

import { useAppSelector } from '../../redux/app/hooks';
import { selectFocusCurrencyDetail } from '../../redux/slices/preferenceSlice';
import { calculateInternalWithdrawalFee } from '../internal-fee';
import fetcher from '../ownerFetcher';

export const useExchangeRates = () => {
  const { data, ...response } = useSWR<IExchangeRate[], Error>(
    `/public-api/owner/exchange-rates`,
    fetcher
  );
  return {
    exchangeRates: data ?? [],
    ...response,
  };
};

export const useCalculateFocusCurrencyL2WithdrawalFee = () => {
  const { exchangeRates } = useExchangeRates();
  const { chain, token } = useAppSelector(selectFocusCurrencyDetail);

  return (amount: string) => {
    return calculateInternalWithdrawalFee(
      amount ?? '0',
      exchangeRates,
      chain,
      token
    );
  };
};
