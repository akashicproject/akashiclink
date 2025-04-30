import { filterOutline } from 'ionicons/icons';
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import {
  CURRENCIES_SORT_MODE,
  HIDDEN_CURRENCIES,
  HIDE_SMALL_BALANCES,
} from '../../utils/preference-keys';
import { IconButton } from '../common/buttons';
import { DashboardPreferenceModal } from './dashboard-preference-modal';

export const DASHBOARD_LIST_SORTING_MODE = {
  Alphabetical: 'Alphabetical',
  Value: 'Value',
} as const;

export type DashboardListSortingMode =
  (typeof DASHBOARD_LIST_SORTING_MODE)[keyof typeof DASHBOARD_LIST_SORTING_MODE];

export const DashboardPreferenceContext = createContext<{
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  currenciesSortMode: DashboardListSortingMode;
  setCurrenciesSortMode: Dispatch<SetStateAction<DashboardListSortingMode>>;
  hideSmallBalance: boolean;
  setHideSmallBalance: Dispatch<SetStateAction<boolean>>;
  hiddenCurrencies: string[];
  setHiddenCurrencies: Dispatch<SetStateAction<string[]>>; //array of `${currency.chain}-${currency.token}`
}>({
  step: 0,
  setStep: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  currenciesSortMode: DASHBOARD_LIST_SORTING_MODE.Alphabetical,
  setCurrenciesSortMode: () => {},
  hideSmallBalance: false,
  setHideSmallBalance: () => {},
  hiddenCurrencies: [],
  setHiddenCurrencies: () => {},
});

export function DashboardPreferenceModalTriggerButton() {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const modalRef = useRef<HTMLIonModalElement>(null);

  // Load preferences from capacitor Preference
  const {
    value: localStorageHideSmallBalance,
    refreshValue: refreshLocalStorageHideSmallBalance,
  } = useLocalStorage<boolean>(HIDE_SMALL_BALANCES, false);

  const {
    value: localStorageHiddenCurrencies,
    refreshValue: refreshLocalStorageHiddenCurrencies,
  } = useLocalStorage<string[]>(HIDDEN_CURRENCIES, []);

  const {
    value: localStorageCurrenciesSortMode,
    refreshValue: refreshLocalStorageCurrenciesSortMode,
  } = useLocalStorage<DashboardListSortingMode>(
    CURRENCIES_SORT_MODE,
    DASHBOARD_LIST_SORTING_MODE.Alphabetical
  );

  // Seperated states as the preference is only saved upon clicking confirm
  const [currenciesSortMode, setCurrenciesSortMode] = useState(
    localStorageCurrenciesSortMode
  );
  const [hideSmallBalance, setHideSmallBalance] = useState(
    localStorageHideSmallBalance
  );
  const [hiddenCurrencies, setHiddenCurrencies] = useState(
    localStorageHiddenCurrencies
  );

  // Update component state once localStorage is loaded
  useEffect(() => {
    localStorageCurrenciesSortMode !== currenciesSortMode &&
      setCurrenciesSortMode(localStorageCurrenciesSortMode);
    localStorageHideSmallBalance !== hideSmallBalance &&
      setHideSmallBalance(localStorageHideSmallBalance);
    localStorageHiddenCurrencies !== hiddenCurrencies &&
      setHiddenCurrencies(localStorageHiddenCurrencies);
  }, [
    localStorageHideSmallBalance,
    localStorageHiddenCurrencies,
    localStorageCurrenciesSortMode,
    isModalOpen,
  ]);

  useEffect(() => {
    refreshLocalStorageCurrenciesSortMode();
    refreshLocalStorageHideSmallBalance();
    refreshLocalStorageHiddenCurrencies();
  }, [isModalOpen]);

  const contextValue = useMemo(
    () => ({
      step,
      setStep,
      isModalOpen,
      setIsModalOpen,
      currenciesSortMode,
      setCurrenciesSortMode,
      hideSmallBalance,
      setHideSmallBalance,
      hiddenCurrencies,
      setHiddenCurrencies,
    }),
    [step, isModalOpen, currenciesSortMode, hideSmallBalance, hiddenCurrencies]
  );

  const handleOnClickButton = () => {
    setIsModalOpen(true);
  };

  return (
    <DashboardPreferenceContext.Provider value={contextValue}>
      <IconButton
        onClick={handleOnClickButton}
        icon={filterOutline}
        size={24}
      />
      <DashboardPreferenceModal modal={modalRef} />
    </DashboardPreferenceContext.Provider>
  );
}
