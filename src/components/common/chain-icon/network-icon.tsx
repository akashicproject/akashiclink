import type { CoinSymbol } from '@helium-pay/backend';
import { IonImg } from '@ionic/react';

import { SUPPORTED_CURRENCIES_FOR_EXTENSION } from '../../../constants/currencies';
import { useAppSelector } from '../../../redux/app/hooks';
import { selectTheme } from '../../../redux/slices/preferenceSlice';
import { themeType } from '../../../theme/const';

export const NetworkIcon = ({
  chain: targetChain,
  size = 24,
}: {
  chain: CoinSymbol;
  size?: number;
}) => {
  const storedTheme = useAppSelector(selectTheme);

  const currencyIcon = SUPPORTED_CURRENCIES_FOR_EXTENSION.list.find(
    ({ walletCurrency: { chain } }) => chain === targetChain
  )?.[storedTheme === themeType.DARK ? 'darkCurrencyIcon' : 'currencyIcon'];

  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
      }}
    >
      <IonImg src={currencyIcon} style={{ width: 'auto', height: '100%' }} />
    </span>
  );
};
