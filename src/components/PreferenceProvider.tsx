import type { Dispatch, ReactNode } from 'react';
import { createContext, useContext } from 'react';

import type { ThemeType } from '../theme/const';
import { themeType } from '../theme/const';
import type { LocalAccount } from '../utils/hooks/useLocalAccounts';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import type { WalletCurrency } from '../utils/supported-currencies';
import { WALLET_CURRENCIES } from '../utils/supported-currencies';

export const ThemeContext = createContext<{
  theme: ThemeType;
  setTheme: Dispatch<ThemeType>;
}>({
  theme: themeType.SYSTEM as ThemeType,
  setTheme: () => {
    console.warn('setTheme not ready');
  },
});

export const CurrencyContext = createContext<{
  focusCurrency: WalletCurrency;
  setFocusCurrency: Dispatch<WalletCurrency>;
}>({
  focusCurrency: WALLET_CURRENCIES[0].currency,
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

export const PreferenceProvider = ({ children }: { children: ReactNode }) => {
  const [storedTheme, setStoredTheme] = useLocalStorage<ThemeType>(
    'theme',
    themeType.SYSTEM as ThemeType
  );

  const [focusCurrency, setFocusCurrency] = useLocalStorage<WalletCurrency>(
    'focusCurrency',
    WALLET_CURRENCIES[0].currency
  );

  const [localAccounts, setLocalAccounts] = useLocalStorage<LocalAccount[]>(
    'cached-accounts',
    []
  );

  const [activeAccount, setActiveAccount] =
    useLocalStorage<LocalAccount | null>('session-account', null);

  console.log('app', {
    storedTheme,
    focusCurrency: focusCurrency.displayName,
    localAccounts,
    activeAccount,
  });

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

  return [storedTheme, setStoredTheme];
};

export const useFocusCurrency: () => [
  WalletCurrency,
  Dispatch<WalletCurrency> | undefined
] = () => {
  const { focusCurrency, setFocusCurrency } = useContext(CurrencyContext);

  return [focusCurrency, setFocusCurrency];
};
