import type { Dispatch, ReactNode } from 'react';
import { createContext, useContext } from 'react';

import type { IWalletCurrency } from '../constants/currencies';
import { SUPPORTED_CURRENCIES_FOR_EXTENSION } from '../constants/currencies';
import type { ThemeType } from '../theme/const';
import { themeType } from '../theme/const';
import type { LocalAccount } from '../utils/hooks/useLocalAccounts';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import type { FullOtk } from '../utils/otk-generation';

/**
 * Contexts that are passed down to all children components to avoid props drilling.
 *
 * At any location in the App, you can:
 * ```
 * {prop, setProp} = useContext(XXXContext)
 * ```
 *
 * to access the prop and the prop updater function.
 */

const ThemeContext = createContext<{
  theme: ThemeType;
  setTheme: Dispatch<ThemeType>;
}>({
  theme: themeType.SYSTEM as ThemeType,
  setTheme: () => {
    console.warn('setTheme not ready');
  },
});

const CurrencyContext = createContext<{
  focusCurrency: IWalletCurrency;
  setFocusCurrency: Dispatch<IWalletCurrency>;
}>({
  focusCurrency: SUPPORTED_CURRENCIES_FOR_EXTENSION.default.walletCurrency,
  setFocusCurrency: () => {
    console.warn('setFocusCurrency not ready');
  },
});

export const LocalAccountContext = createContext<{
  localAccounts: LocalAccount[];
  setLocalAccounts: Dispatch<LocalAccount[]>;
}>({
  localAccounts: [],
  setLocalAccounts: () => {
    console.warn('setLocalAccounts not ready');
  },
});

export const LocalOtkContext = createContext<{
  localOtks: FullOtk[];
  setLocalOtks: Dispatch<FullOtk[]>;
}>({
  localOtks: [],
  setLocalOtks: () => {
    console.warn('setLocalOtks not ready');
  },
});

export const ActiveAccountContext = createContext<{
  activeAccount: LocalAccount | null;
  setActiveAccount: Dispatch<LocalAccount | null>;
}>({
  activeAccount: null,
  setActiveAccount: () => {
    console.warn('setActiveAccount not ready');
  },
});

export const CacheOtkContext = createContext<{
  cacheOtk: FullOtk | null;
  setCacheOtk: Dispatch<FullOtk | null>;
}>({
  cacheOtk: null,
  setCacheOtk: () => {
    console.warn('setCacheOtks not ready');
  },
});

export const PreferenceProvider = ({ children }: { children: ReactNode }) => {
  const [storedTheme, setStoredTheme] = useLocalStorage<ThemeType>(
    'theme',
    themeType.SYSTEM as ThemeType
  );

  const [focusCurrency, setFocusCurrency] = useLocalStorage<IWalletCurrency>(
    'focusCurrency',
    SUPPORTED_CURRENCIES_FOR_EXTENSION.default.walletCurrency
  );

  const [localAccounts, setLocalAccounts] = useLocalStorage<LocalAccount[]>(
    'cached-accounts',
    []
  );

  const [localOtks, setLocalOtks] = useLocalStorage<FullOtk[]>('otks', []);

  const [activeAccount, setActiveAccount] =
    useLocalStorage<LocalAccount | null>('session-account', null);

  const [cacheOtk, setCacheOtk] = useLocalStorage<FullOtk | null>(
    'cache-otk',
    null
  );

  return (
    <ThemeContext.Provider
      value={{ theme: storedTheme, setTheme: setStoredTheme }}
    >
      <LocalAccountContext.Provider
        value={{
          localAccounts,
          setLocalAccounts,
        }}
      >
        <CacheOtkContext.Provider
          value={{
            cacheOtk,
            setCacheOtk,
          }}
        >
          <LocalOtkContext.Provider
            value={{
              localOtks,
              setLocalOtks,
            }}
          >
            <ActiveAccountContext.Provider
              value={{
                activeAccount,
                setActiveAccount,
              }}
            >
              <CurrencyContext.Provider
                value={{
                  focusCurrency: focusCurrency,
                  setFocusCurrency: setFocusCurrency,
                }}
              >
                {children}
              </CurrencyContext.Provider>
            </ActiveAccountContext.Provider>
          </LocalOtkContext.Provider>
        </CacheOtkContext.Provider>
      </LocalAccountContext.Provider>
    </ThemeContext.Provider>
  );
};

/**
 * Read and update the theme context across the whole application
 */
export const useTheme: () => [
  ThemeType,
  Dispatch<ThemeType> | undefined
] = () => {
  const { theme: storedTheme, setTheme: setStoredTheme } =
    useContext(ThemeContext);

  // Match the theme set by system
  if (storedTheme === themeType.SYSTEM) {
    return [
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? themeType.DARK
        : themeType.LIGHT,
      setStoredTheme,
    ];
  }

  return [storedTheme, setStoredTheme];
};

/**
 * Read and update the currency context across the whole application
 */
export const useFocusCurrency: () => [
  IWalletCurrency,
  Dispatch<IWalletCurrency> | undefined
] = () => {
  const { focusCurrency, setFocusCurrency } = useContext(CurrencyContext);

  return [focusCurrency, setFocusCurrency];
};
