import { CoinSymbol, CryptoCurrencySymbol } from '@akashic/core-lib';
import { IonImg } from '@ionic/react';

import { SUPPORTED_CURRENCIES_WITH_NAMES } from '../../../constants/currencies';

const COIN_ICONS: Partial<Record<CoinSymbol, string>> = {
  [CoinSymbol.Ethereum_Mainnet]: '/assets/images/eth.svg',
  [CoinSymbol.Ethereum_Sepolia]: '/assets/images/eth.svg',
  [CoinSymbol.Tron]: '/assets/images/trx.svg',
  [CoinSymbol.Tron_Shasta]: '/assets/images/trx.svg',
  [CoinSymbol.Binance_Smart_Chain_Mainnet]: '/assets/images/bsc.svg',
  [CoinSymbol.Binance_Smart_Chain_Testnet]: '/assets/images/bsc.svg',
  [CoinSymbol.Bitcoin]: '/assets/images/btc.svg',
  [CoinSymbol.Bitcoin_Testnet]: '/assets/images/btc.svg',
  [CoinSymbol.Solana]: '/assets/images/sol.svg',
  [CoinSymbol.Solana_Devnet]: '/assets/images/sol.svg',
};

const TOKEN_ICONS: Partial<Record<CryptoCurrencySymbol, string>> = {
  [CryptoCurrencySymbol.USDT]: '/assets/images/usdt.svg',
  [CryptoCurrencySymbol.USDC]: '/assets/images/usdc.svg',
};

export const CryptoCurrencyIcon = ({
  coinSymbol,
  tokenSymbol,
  size = 32,
}: {
  coinSymbol: CoinSymbol;
  tokenSymbol?: CryptoCurrencySymbol;
  size?: number;
}) => {
  const networkIcon = COIN_ICONS[coinSymbol];
  const currencyIcon = tokenSymbol ? TOKEN_ICONS[tokenSymbol] : networkIcon;

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
