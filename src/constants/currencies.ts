import {
  CoinSymbol,
  CryptoCurrencySymbol,
  type ICurrency,
  NetworkDictionary,
} from '@helium-pay/backend';

/**
 * Currencies filled out with metadata for use on the frontend.
 *
 * This generic type should be extended for the specific frontend in question e.g. tsx icons, colouring etc
 *
 * @param network that the currency is on
 * @param networkMetadata that the currency is on
 */
export type ICurrencyForFrontend = Omit<ICurrency, 'network'> & {
  network: CoinSymbol;
};

/**
 * Unlike in the rest of the app, there is no longer
 * a nested structure of the form
 *
 *      {chain1: [token1, token2]}, {chain2: [token1, token2]}
 *
 * and instead the currencies are completely standalone with the following structure
 *
 *      {chain1, token1}, {chain2, token1}, {chain2, token2}
 */

/**
 * A currency on the wallet extension (called the wallet currency) is uniquely characterised by
 *
 * @param chain the chain it is on
 * @param token (optional) token
 * @param displayName the display name of the currency
 *
 * Users interact with each currency individually - thus USDT-ETH and ETH will appear as
 * separate wallet currencies
 */
export interface IWalletCurrency {
  chain: CoinSymbol;
  token?: CryptoCurrencySymbol;
  displayName: string;
}

/**
 * Quick method to generate a valid IWalletCurrency for a chain-token combination
 */
export function makeWalletCurrency(
  chain: CoinSymbol,
  token?: CryptoCurrencySymbol
): IWalletCurrency {
  if (!token) {
    return {
      displayName: NetworkDictionary[chain].nativeCoin.displayName,
      chain,
    };
  }

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
 * Comparator between two IWalletExtensionCurrencies, checking both chain and token sybmol
 */
export function compareWalletCurrencies(
  wc1: IWalletCurrency,
  wc2: IWalletCurrency
) {
  return wc1.chain === wc2.chain && wc1.token === wc2.token;
}

/**
 * Full data to support currencies on the extension, with metadata including
 *
 * @param currencyIcon
 * @param darkCurrencyIcon
 * @param greyCurrencyIcon
 * @param networkIcon
 *
 * TODO: rename currencyIcon to currencyIcon
 */
export interface ICurrencyForExtension extends ICurrencyForFrontend {
  walletCurrency: IWalletCurrency;
  currencyIcon: string;
  balance?: string;
  darkCurrencyIcon?: string;
  greyCurrencyIcon?: string;
}

class CurrencyFactory {
  private _currencies: ICurrencyForExtension[] = [];

  constructor(
    currencies: {
      chain: CoinSymbol;
      token?: CryptoCurrencySymbol;
      currencyIcon: string;
      darkCurrencyIcon?: string;
      greyCurrencyIcon?: string;
    }[]
  ) {
    currencies.forEach(({ chain, token, ...meta }) =>
      this._currencies.push({
        walletCurrency: makeWalletCurrency(chain, token),
        network: chain,
        ...NetworkDictionary[chain].nativeCoin,
        ...meta,
      })
    );
  }

  /**
   * Lookup metadata of a currency or default to the first one
   */
  public lookup(wc1: IWalletCurrency) {
    return (
      this._currencies.find(({ walletCurrency: wc2 }) =>
        compareWalletCurrencies(wc1, wc2)
      ) || this._currencies[0]
    );
  }

  get default() {
    return this._currencies[0];
  }

  get list() {
    return this._currencies;
  }
}

/**
 * "Smart" list of currencies supported in the extension
 */
export const SUPPORTED_CURRENCIES_FOR_EXTENSION = new CurrencyFactory([
  ...[
    {
      chain: CoinSymbol.Ethereum_Mainnet,
      currencyIcon: '/shared-assets/images/eth.svg',
      darkCurrencyIcon: '/shared-assets/images/eth.svg',
      greyCurrencyIcon: '/shared-assets/images/eth-grey.svg',
    },
    {
      chain: CoinSymbol.Tron,
      currencyIcon: '/shared-assets/images/trx.png',
      darkCurrencyIcon: '/shared-assets/images/trx.png',
      greyCurrencyIcon: '/shared-assets/images/trx-grey.png',
    },
    {
      chain: CoinSymbol.Ethereum_Mainnet,
      token: CryptoCurrencySymbol.USDT,
      // eslint-disable-next-line sonarjs/no-duplicate-string
      currencyIcon: '/shared-assets/images/usdt.png',
      darkCurrencyIcon: '/shared-assets/images/usdt.png',

      greyCurrencyIcon: '/shared-assets/images/usdt-grey.png',
    },
    {
      chain: CoinSymbol.Tron,
      token: CryptoCurrencySymbol.USDT,
      currencyIcon: '/shared-assets/images/usdt.png',
      darkCurrencyIcon: '/shared-assets/images/usdt.png',
      greyCurrencyIcon: '/shared-assets/images/usdt-grey.png',
    },
  ],
  ...(process.env.REACT_APP_ENABLE_TESTNET_CURRENCIES === 'true'
    ? [
        {
          chain: CoinSymbol.Ethereum_Sepolia,
          currencyIcon: '/shared-assets/images/eth.svg',
          darkCurrencyIcon: '/shared-assets/images/eth.svg',
          greyCurrencyIcon: '/shared-assets/images/eth-grey.svg',
        },
        {
          chain: CoinSymbol.Tron_Shasta,
          currencyIcon: '/shared-assets/images/trx.png',
          darkCurrencyIcon: '/shared-assets/images/trx.png',
          greyCurrencyIcon: '/shared-assets/images/trx-grey.png',
        },
        {
          chain: CoinSymbol.Ethereum_Sepolia,
          token: CryptoCurrencySymbol.USDT,
          currencyIcon: '/shared-assets/images/usdt.png',
          darkCurrencyIcon: '/shared-assets/images/usdt.png',
          greyCurrencyIcon: '/shared-assets/images/usdt-grey.png',
        },
        {
          chain: CoinSymbol.Tron_Shasta,
          token: CryptoCurrencySymbol.TETHER,
          currencyIcon: '/shared-assets/images/usdt.png',
          darkCurrencyIcon: '/shared-assets/images/usdt.png',
          greyCurrencyIcon: '/shared-assets/images/usdt-grey.png',
        },
      ]
    : []),
]);

export const ALLOWED_NETWORKS: CoinSymbol[] =
  process.env.REACT_APP_ENABLE_TESTNET_CURRENCIES === 'true'
    ? [CoinSymbol.Ethereum_Sepolia, CoinSymbol.Tron_Shasta]
    : [CoinSymbol.Ethereum_Mainnet, CoinSymbol.Tron];

// TODO: refactor tgt with NetworkDictionary
export const ALLOWED_ADDRESS_SCAN_CURRENCY: IWalletCurrency[] =
  process.env.REACT_APP_ENABLE_TESTNET_CURRENCIES === 'true'
    ? [
        {
          chain: CoinSymbol.Tron_Shasta,
          token: CryptoCurrencySymbol.TETHER,
          displayName: NetworkDictionary[CoinSymbol.Tron_Shasta].tokens.find(
            ({ symbol }) => symbol === CryptoCurrencySymbol.TETHER
          )!.displayName,
        },
        {
          chain: CoinSymbol.Ethereum_Sepolia,
          token: CryptoCurrencySymbol.USDT,
          displayName: NetworkDictionary[
            CoinSymbol.Ethereum_Sepolia
          ].tokens.find(({ symbol }) => symbol === CryptoCurrencySymbol.USDT)!
            .displayName,
        },
      ]
    : [
        {
          chain: CoinSymbol.Tron,
          token: CryptoCurrencySymbol.USDT,
          displayName: NetworkDictionary[CoinSymbol.Tron].tokens.find(
            ({ symbol }) => symbol === CryptoCurrencySymbol.USDT
          )!.displayName,
        },
        {
          chain: CoinSymbol.Ethereum_Mainnet,
          token: CryptoCurrencySymbol.USDT,
          displayName: NetworkDictionary[
            CoinSymbol.Ethereum_Mainnet
          ].tokens.find(({ symbol }) => symbol === CryptoCurrencySymbol.USDT)!
            .displayName,
        },
      ];

export const ALLOWED_NETWORK_FOR_ADDRESS_SCREENING: CoinSymbol[] = [
  CoinSymbol.Ethereum_Mainnet,
  CoinSymbol.Tron,
];
