import {
  CoinSymbol,
  EthereumSymbol,
  isCoinSymbol,
  MAINNET_CURRENCIES,
  MAINNET_CURRENCIES_WITH_NAMES,
  SUPPORTED_MAINNETS,
  SUPPORTED_TESTNETS,
  TESTNET_CURRENCIES,
  TESTNET_CURRENCIES_WITH_NAMES,
  TronSymbol,
} from '@akashic/as-backend';

/**
 * "Smart" list of currencies supported in the extension
 */
export const SUPPORTED_CURRENCIES = [
  ...MAINNET_CURRENCIES,
  ...(process.env.REACT_APP_ENABLE_TESTNET_CURRENCIES === 'true'
    ? TESTNET_CURRENCIES
    : []),
];

export const SUPPORTED_CURRENCIES_WITH_NAMES = [
  ...MAINNET_CURRENCIES_WITH_NAMES,
  ...(process.env.REACT_APP_ENABLE_TESTNET_CURRENCIES === 'true'
    ? TESTNET_CURRENCIES_WITH_NAMES
    : []),
];

export const ALLOWED_NETWORKS: CoinSymbol[] =
  process.env.REACT_APP_ENABLE_TESTNET_CURRENCIES === 'true'
    ? SUPPORTED_TESTNETS
    : SUPPORTED_MAINNETS;

// Currently only allow USDT on Tron and Eth to be scanned
export const ALLOWED_ADDRESS_SCAN_CURRENCY =
  process.env.REACT_APP_ENABLE_TESTNET_CURRENCIES === 'true'
    ? TESTNET_CURRENCIES.filter(
        (c) =>
          !!c.tokenSymbol &&
          (isCoinSymbol(c.coinSymbol, TronSymbol) ||
            isCoinSymbol(c.coinSymbol, EthereumSymbol))
      )
    : MAINNET_CURRENCIES.filter(
        (c) =>
          !!c.tokenSymbol &&
          (isCoinSymbol(c.coinSymbol, TronSymbol) ||
            isCoinSymbol(c.coinSymbol, EthereumSymbol))
      );

export const ALLOWED_NETWORK_FOR_ADDRESS_SCREENING: CoinSymbol[] = [
  CoinSymbol.Ethereum_Mainnet,
  CoinSymbol.Tron,
];
