import type { CoinSymbol } from '@akashic/core-lib';
import { CoinSymbol as CoinSymbolEnum } from '@akashic/core-lib';
import { IonImg } from '@ionic/react';

const COIN_ICONS: Partial<Record<CoinSymbol, string>> = {
  [CoinSymbolEnum.Ethereum_Mainnet]: '/assets/images/eth.svg',
  [CoinSymbolEnum.Ethereum_Sepolia]: '/assets/images/eth.svg',
  [CoinSymbolEnum.Tron]: '/assets/images/trx.svg',
  [CoinSymbolEnum.Tron_Shasta]: '/assets/images/trx.svg',
  [CoinSymbolEnum.Binance_Smart_Chain_Mainnet]: '/assets/images/bsc.svg',
  [CoinSymbolEnum.Binance_Smart_Chain_Testnet]: '/assets/images/bsc.svg',
  [CoinSymbolEnum.Bitcoin]: '/assets/images/btc.svg',
  [CoinSymbolEnum.Bitcoin_Testnet]: '/assets/images/btc.svg',
  [CoinSymbolEnum.Solana]: '/assets/images/sol.svg',
  [CoinSymbolEnum.Solana_Devnet]: '/assets/images/sol.svg',
};

export const NetworkIcon = ({
  chain,
  size = 24,
}: {
  chain: CoinSymbol;
  size?: number;
}) => {
  const currencyIcon = COIN_ICONS[chain];

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
