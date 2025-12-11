import {
  type CoinSymbol,
  type CryptoCurrencySymbol,
  getCurrencyIcon,
} from '@akashic/as-backend';
import { IonImg } from '@ionic/react';

import { SUPPORTED_CURRENCIES_WITH_NAMES } from '../../../constants/currencies';

export const CryptoCurrencyIcon = ({
  coinSymbol,
  tokenSymbol,
  size = 32,
}: {
  coinSymbol: CoinSymbol;
  tokenSymbol?: CryptoCurrencySymbol;
  size?: number;
}) => {
  const networkIcon = getCurrencyIcon({ coinSymbol });
  const currencyIcon = getCurrencyIcon({ coinSymbol, tokenSymbol });

  const currency = SUPPORTED_CURRENCIES_WITH_NAMES.find(
    (c) => c.coinSymbol === coinSymbol && c.tokenSymbol === tokenSymbol
  );

  return (
    <span
      style={{
        position: 'relative',
        width: size,
        minWidth: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-block',
      }}
    >
      <IonImg
        alt={currency?.displayName}
        src={currencyIcon}
        style={{ position: 'absolute', width: '100%', height: '100%', left: 0 }}
      />
      {currency?.tokenSymbol && (
        <IonImg
          alt={currency.displayName}
          src={networkIcon}
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
