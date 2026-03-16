import { FiatCurrencySign } from '@akashic/as-backend';

import { useAppSelector } from '../../redux/app/hooks';
import { selectFiatCurrencyDisplay } from '../../redux/slices/preferenceSlice';
export const useFiatCurrencyDisplay = () => {
  const fiatCurrencySymbol = useAppSelector(selectFiatCurrencyDisplay);

  return {
    fiatCurrencySymbol: fiatCurrencySymbol ?? '',
    fiatCurrencySign: FiatCurrencySign[fiatCurrencySymbol],
  };
};
