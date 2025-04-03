import { CoinSymbol, isCoinSymbol } from '@helium-pay/backend';

/**
 * Unlike the owners webapp, the wallet will support
 * a discreete set of currencies and there is no longer
 * a nested structure of the form
 *
 *      {chain1: [token1, token2]}, {chain2: [token1, token2]}
 *
 * and instead the currencies are completely standalone
 *
 *      {chain1, token1}, {chain2, token1}, {chain2, token2}
 *
 * This file declares the lookup tables and types to work
 * with the currencies across the application
 */

/**
 * Wallet currency is characterised by
 * arg1: the chain it is on
 * arg2: (optional) token symbol
 */
export type WalletCurrency = [CoinSymbol, string?];

/** Quick method to generate a valid currency */
export function makeWalletCurrency(
  chain: CoinSymbol,
  tokenSymbol?: string
): WalletCurrency {
  return tokenSymbol ? [chain, tokenSymbol] : [chain];
}

/** Method to parse the stringified version of the currency that is stored in hashmap */
export function parseWalletCurrency(
  currency: string
): WalletCurrency | undefined {
  const [chain, token] = JSON.parse(currency);
  if (isCoinSymbol(chain)) return makeWalletCurrency(chain, token);
}

/**
 * Hashmap for storing and looking up wallet currencies
 */
export class CurrencyMap<T> extends Map {
  get(c: WalletCurrency) {
    return super.get(this.toKey(c));
  }

  set(c: WalletCurrency, value: T) {
    return super.set(this.toKey(c), value);
  }

  has(c: WalletCurrency) {
    return super.has(this.toKey(c));
  }

  delete(c: WalletCurrency) {
    return super.delete(this.toKey(c));
  }

  toKey(c: WalletCurrency) {
    return JSON.stringify(c);
  }
}

/**
 * Information for display of currency in app
 * TODO: combine currency and symbol - they both represent the same information
   currency: [CoinSymbol, TokenSymbol]
   symbol: [CoinSymbol-TokenSymbol]
   Will need to include parsing and dynamic typechecks and make use of `parseWalletCurrency`
 *
 * @param symbol of the currency WITHIN the wallet extension.
 * @param currency indenity, see WalletCurrency: [CoinSymbol (chain currency is on), Token(does not exist for native coins)]
 * @param logo of currency
 */
export interface WalletCurrencyMetadata {
  currency: WalletCurrency;
  symbol: string;
  logo: string;
  icon: string;
}
export const L2Icon = '/shared-assets/icons/akashic_icon.png';
/** Declaration of supported currencies */
const MAINNET_CURRENCIES: WalletCurrencyMetadata[] = [
  {
    symbol: 'BTC',
    currency: makeWalletCurrency(CoinSymbol.Bitcoin),
    logo: '/shared-assets/images/btc.png',
    icon: '/shared-assets/icons/btc_icon.png',
  },
  {
    symbol: 'ETH',
    currency: makeWalletCurrency(CoinSymbol.Ethereum_Mainnet),
    logo: '/shared-assets/images/eth.png',
    icon: '/shared-assets/icons/eth_icon.png',
  },
  {
    symbol: 'TRX',
    currency: makeWalletCurrency(CoinSymbol.Tron),
    logo: '/shared-assets/images/trx.png',
    icon: '/shared-assets/icons/trx_icon.png',
  },
  {
    symbol: 'USDT-ERC20',
    currency: makeWalletCurrency(CoinSymbol.Ethereum_Mainnet, 'USDT'),
    logo: '/shared-assets/images/erc-usdt.png',
    icon: '/shared-assets/icons/eth_icon.png',
  },
  {
    symbol: 'USDT-TRC20',
    currency: makeWalletCurrency(CoinSymbol.Tron, 'USDT'),
    logo: '/shared-assets/images/trc-usdt.png',
    icon: '/shared-assets/icons/trx_icon.png',
  },
];

const TESTNET_CURRENCIES: WalletCurrencyMetadata[] = [
  {
    symbol: 'tBTC',
    currency: makeWalletCurrency(CoinSymbol.Bitcoin_Testnet),
    logo: '/shared-assets/images/btc.png',
    icon: '/shared-assets/icons/btc_icon.png',
  },
  {
    symbol: 'GOR',
    currency: makeWalletCurrency(CoinSymbol.Görli),
    logo: '/shared-assets/images/eth.png',
    icon: '/shared-assets/icons/eth_icon.png',
  },
  {
    symbol: 'Nile',
    currency: makeWalletCurrency(CoinSymbol.Tron_Nile),
    logo: '/shared-assets/images/trx.png',
    icon: '/shared-assets/icons/trx_icon.png',
  },
  {
    symbol: 'Shasta',
    currency: makeWalletCurrency(CoinSymbol.Tron_Shasta),
    logo: '/shared-assets/images/trx.png',
    icon: '/shared-assets/icons/trx_icon.png',
  },
  {
    symbol: 'tUSDT-ERC20',
    currency: makeWalletCurrency(CoinSymbol.Görli, 'USDT'),
    logo: '/shared-assets/images/erc-usdt.png',
    icon: '/shared-assets/icons/eth_icon.png',
  },
  {
    symbol: 'tUSDT-TRC20',
    currency: makeWalletCurrency(CoinSymbol.Tron_Nile, 'USDT'),
    logo: '/shared-assets/images/trc-usdt.png',
    icon: '/shared-assets/icons/trx_icon.png',
  },
];

/** All the currencies supported by the wallet */
export const WALLET_CURRENCIES = [
  ...MAINNET_CURRENCIES,
  ...(process.env.NODE_ENV !== 'production' ? TESTNET_CURRENCIES : []),
];
