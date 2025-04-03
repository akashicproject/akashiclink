import type { Dispatch, ReactNode } from 'react';
import { createContext, useContext } from 'react';

import type { IWalletCurrency } from '../../constants/currencies';
import { SUPPORTED_CURRENCIES_FOR_EXTENSION } from '../../constants/currencies';
import type { ThemeType } from '../../theme/const';
import { themeType } from '../../theme/const';
import { useIdleTime } from '../../utils/hooks/useIdleTime';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import type { FullOtk } from '../../utils/otk-generation';

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

const AutoLockContext = createContext<{
  autoLockTime: number;
  setAutoLockTime: Dispatch<number>;
}>({
  autoLockTime: 0,
  setAutoLockTime: () => {
    console.warn('setAutoLock not ready');
  },
});

export const toggleDarkTheme = (setDark: boolean) => {
  document.body.classList.toggle('dark', setDark);
  document.body.classList.toggle('light', !setDark);
};
export const PreferenceProvider = ({ children }: { children: ReactNode }) => {
  const [lockTime, setLockTime] = useLocalStorage<number>('auto-lock', 10);
  useIdleTime(lockTime);
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
              <AutoLockContext.Provider
                value={{
                  autoLockTime: lockTime,
                  setAutoLockTime: setLockTime,
                }}
              >
                {children}
              </AutoLockContext.Provider>
            </CurrencyContext.Provider>
          </ActiveAccountContext.Provider>
        </CacheOtkContext.Provider>
      </LocalAccountContext.Provider>
    </ThemeContext.Provider>
  );
};

export const useTheme: () => [
  ThemeType,
  Dispatch<ThemeType> | undefined
] = () => {
  const { theme: storedTheme, setTheme: setStoredTheme } =
    useContext(ThemeContext);

  if (storedTheme !== themeType.SYSTEM) {
    // Theme is explicitly light or dark
    toggleDarkTheme(storedTheme === themeType.DARK);
  } else {
    // Infer theme to set based on users OS
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    toggleDarkTheme(prefersDark.matches);
    prefersDark.addEventListener('change', (mediaQuery) => {
      toggleDarkTheme(mediaQuery.matches);
    });
  }

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

export const useLockTime: () => [number, Dispatch<number>] = () => {
  const { autoLockTime: autoLockTime, setAutoLockTime: setAutoLockTime } =
    useContext(AutoLockContext);
  return [autoLockTime, setAutoLockTime];
};

export const useFocusCurrency: () => [
  IWalletCurrency,
  Dispatch<IWalletCurrency> | undefined
] = () => {
  const { focusCurrency, setFocusCurrency } = useContext(CurrencyContext);

  return [focusCurrency, setFocusCurrency];
};

export const useFocusCurrencyDetail: () => IWalletCurrency = () => {
  const [currency] = useFocusCurrency();
  const currentWalletMetadata =
    SUPPORTED_CURRENCIES_FOR_EXTENSION.lookup(currency);

  return currentWalletMetadata.walletCurrency;
};

export const useCacheOtk: () => [
  FullOtk,
  Dispatch<FullOtk | null> | undefined
] = () => {
  const { cacheOtk, setCacheOtk } = useContext(CacheOtkContext);
  if (!cacheOtk) {
    throw new Error('No otk stored!');
  }

  return [cacheOtk, setCacheOtk];
};
