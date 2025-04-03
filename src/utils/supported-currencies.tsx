import type { IOwnerBalancesResponse } from '@helium-pay/backend';
import {
  CoinSymbol,
  CurrencySymbol,
  NetworkDictionary,
} from '@helium-pay/backend';

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
 * @param displayName
 * @param the chain it is on
 * @param (optional) token - if not supplied, default to the NATIVE coin of the chain
 */
export type WalletCurrency = {
  displayName: string;
  chain: CoinSymbol;
  token?: CurrencySymbol;
};

/** Quick method to generate a valid currency */
export function makeWalletCurrency(
  chain: CoinSymbol,
  token?: CurrencySymbol
): WalletCurrency {
  if (!token)
    return {
      displayName: NetworkDictionary[chain].nativeCoin.displayName,
      chain,
    };

  const tokenMetadata = NetworkDictionary[chain].tokens.find(
    ({ symbol }) => symbol === token
  );
  if (!tokenMetadata)
    throw Error(`Token ${token} does not exist on chain ${chain}`);
  return {
    displayName: tokenMetadata.displayName,
    chain,
    token,
  };
}

/**
 * Hashmap for storing and looking up values assigned to wallet currencies
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
 * Information for display of currency in app:
 *
 * @param currency identity, see WalletCurrency: [displayName, CoinSymbol (chain currency is on), Token(does not exist for native coins)]
 * @param logo main
 * @param darkLogo to use when dark theme is on
 * @param greyLogo to use when currency is out of focus
 */
interface WalletCurrencyMetadata {
  currency: WalletCurrency;
  logo: string;
  icon: string;
  darkLogo?: string;
  greyLogo?: string;
}

/**
 * Information about user wallet formatted for display in the extension
 */
export type UserWallet = Omit<IOwnerBalancesResponse, 'balance'> & {
  balance?: string;
  address?: string;
};

export const L2Icon = '/shared-assets/images/PayLogo-all-white.svg';

const MAINNET_CURRENCIES: WalletCurrencyMetadata[] = [
  // TODO: re-enable when L2 transactions are supported for BTC
  // {
  //   symbol: 'BTC',
  //   currency: makeWalletCurrency(CoinSymbol.Bitcoin),
  //   logo: '/shared-assets/images/btc.png',
  //   greyLogo: '/shared-assets/images/btc-grey.png',
  //   icon: '/shared-assets/icons/btc_icon.png',
  // },
  {
    currency: makeWalletCurrency(CoinSymbol.Ethereum_Mainnet),
    logo: '/shared-assets/images/eth.png',
    darkLogo: '/shared-assets/images/eth-dark.png',
    greyLogo: '/shared-assets/images/eth-grey.png',
    icon: '/shared-assets/icons/eth_icon.png',
  },
  {
    currency: makeWalletCurrency(CoinSymbol.Tron),
    logo: '/shared-assets/images/trx.png',
    darkLogo: '/shared-assets/images/trx.png',
    greyLogo: '/shared-assets/images/trx-grey.png',
    icon: '/shared-assets/icons/trx_icon.png',
  },
  {
    currency: makeWalletCurrency(
      CoinSymbol.Ethereum_Mainnet,
      CurrencySymbol.USDT
    ),
    logo: '/shared-assets/images/usdt.png',
    greyLogo: '/shared-assets/images/usdt-grey.png',
    icon: '/shared-assets/icons/eth_icon.png',
  },
  {
    currency: makeWalletCurrency(CoinSymbol.Tron, CurrencySymbol.USDT),
    logo: '/shared-assets/images/usdt.png',
    greyLogo: '/shared-assets/images/usdt-grey.png',
    icon: '/shared-assets/icons/trx_icon.png',
  },
];

const TESTNET_CURRENCIES: WalletCurrencyMetadata[] = [
  // TODO: re-enable when L2 transactions are supported for BTC
  // {
  //   symbol: 'tBTC',
  //   currency: makeWalletCurrency(CoinSymbol.Bitcoin_Testnet),
  //   logo: '/shared-assets/images/btc.png',
  //   greyLogo: '/shared-assets/images/btc-grey.png',
  //   icon: '/shared-assets/icons/btc_icon.png',
  // },
  {
    currency: makeWalletCurrency(CoinSymbol.Görli),
    logo: '/shared-assets/images/eth.png',
    darkLogo: '/shared-assets/images/eth-dark.png',
    greyLogo: '/shared-assets/images/eth-grey.png',
    icon: '/shared-assets/icons/eth_icon.png',
  },
  {
    currency: makeWalletCurrency(CoinSymbol.Tron_Nile),
    logo: '/shared-assets/images/trx.png',
    greyLogo: '/shared-assets/images/trx-grey.png',
    icon: '/shared-assets/icons/trx_icon.png',
  },
  {
    currency: makeWalletCurrency(CoinSymbol.Tron_Shasta),
    logo: '/shared-assets/images/trx.png',
    greyLogo: '/shared-assets/images/trx-grey.png',
    icon: '/shared-assets/icons/trx_icon.png',
  },
  {
    currency: makeWalletCurrency(CoinSymbol.Görli, CurrencySymbol.USDT),
    logo: '/shared-assets/images/usdt.png',
    greyLogo: '/shared-assets/images/usdt-grey.png',
    icon: '/shared-assets/icons/eth_icon.png',
  },
  {
    currency: makeWalletCurrency(CoinSymbol.Tron_Nile, CurrencySymbol.USDT),
    logo: '/shared-assets/images/usdt.png',
    greyLogo: '/shared-assets/images/usdt-grey.png',
    icon: '/shared-assets/icons/trx_icon.png',
  },
];

/** All the currencies supported by the wallet */
export const WALLET_CURRENCIES = [
  ...MAINNET_CURRENCIES,
  // OPTIMISE is used as a proxy for NODE_ENV when building the extension
  // because of clashes with the BABEL library when trying to set NODE_ENV=development for local builds:
  //
  // - Running yarn build will set OPTIMISE=undefined (skipping testnets for production mode)
  // - Running yarn build:dev will set OPTIMISE=false (adding testenets for dev mode)
  ...(process.env.REACT_APP_ENABLE_TESTNET_CURRENCIES === 'true'
    ? TESTNET_CURRENCIES
    : []),
];

/**
 * Comparator between two wallet currencies, checking both chain and token sybmol
 */
export function compareWalletCurrency(
  wc1: WalletCurrency,
  wc2: WalletCurrency
) {
  return wc1.chain === wc2.chain && wc1.token === wc2.token;
}

/**
 * Fetch metadata of a given currency
 */
export function lookupWalletCurrency(wc1: WalletCurrency) {
  return (
    WALLET_CURRENCIES.find(({ currency: wc2 }) =>
      compareWalletCurrency(wc1, wc2)
    ) || WALLET_CURRENCIES[0]
  );
}
