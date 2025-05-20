import { IonImg } from '@ionic/react';

import {
  type IWalletCurrency,
  SUPPORTED_CURRENCIES_FOR_EXTENSION,
} from '../../../constants/currencies';
import { useAppSelector } from '../../../redux/app/hooks';
import { selectTheme } from '../../../redux/slices/preferenceSlice';
import { themeType } from '../../../theme/const';

export const CryptoCurrencyIcon = ({
  currency,
  size = 32,
}: {
  currency: IWalletCurrency;
  size?: number;
}) => {
  const storedTheme = useAppSelector(selectTheme);

  const tokenBadgeIcon = SUPPORTED_CURRENCIES_FOR_EXTENSION.list.find(
    (c) => c.walletCurrency.chain === currency.chain && !c.walletCurrency.token
  )?.[storedTheme === themeType.DARK ? 'darkCurrencyIcon' : 'currencyIcon'];

  const currencyIcon = SUPPORTED_CURRENCIES_FOR_EXTENSION.list.find(
    (c) =>
      c.walletCurrency.chain === currency.chain &&
      c.walletCurrency.token === currency.token
  )?.[storedTheme === themeType.DARK ? 'darkCurrencyIcon' : 'currencyIcon'];

  return (
    <span
      style={{
        position: 'relative',
        width: size + size / 4,
        height: size,
        borderRadius: '50%',
        display: 'inline-block',
      }}
    >
      <IonImg
        alt={currency.displayName}
        src={currencyIcon}
        style={{ position: 'absolute', width: 'auto', height: '100%', left: 0 }}
      />
      {currency.token && (
        <IonImg
          alt={currency.displayName}
          src={tokenBadgeIcon}
          style={{
            position: 'absolute',
            top: '0px',
            left: size - size / 4,
            width: size / 2,
            height: size / 2,
            borderRadius: '50%',
          }}
        />
      )}
    </span>
  );
};
