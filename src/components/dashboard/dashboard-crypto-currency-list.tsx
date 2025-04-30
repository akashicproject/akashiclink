import { IonText, isPlatform } from '@ionic/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { IWalletCurrency } from '../../constants/currencies';
import { useCryptoCurrencyBalancesList } from '../../utils/hooks/useCryptoCurrencyBalancesList';
import { useInterval } from '../../utils/hooks/useInterval';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import {
  CURRENCIES_SORT_MODE,
  HIDDEN_CURRENCIES,
} from '../../utils/preference-keys';
import { CryptoCurrencyList } from '../crypto-currency/crypto-currency-list';
import { DashboardCryptoCurrencyDetailModal } from './dashboard-crypto-currency-detail-modal';
import {
  DASHBOARD_LIST_SORTING_MODE,
  type DashboardListSortingMode,
  DashboardPreferenceModalTriggerButton,
} from './dashboard-preference-modal-trigger-button';

export const DashboardCryptoCurrencyList = () => {
  const { t } = useTranslation();
  const isMobile = isPlatform('ios') || isPlatform('android');

  const [detailWalletCurrency, setDetailWalletCurrency] = useState<
    IWalletCurrency | undefined
  >();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLIonModalElement>(null);

  const { balances } = useCryptoCurrencyBalancesList();
  const { value: sortMode, refreshValue: loadSortMode } =
    useLocalStorage<DashboardListSortingMode>(CURRENCIES_SORT_MODE);
  const { value: hiddenCurrencies, refreshValue: loadHiddenCurrencies } =
    useLocalStorage<DashboardListSortingMode>(HIDDEN_CURRENCIES);

  const sortedCurrencies = balances
    .filter(
      (currency) =>
        !hiddenCurrencies?.includes(`${currency.chain}-${currency.token ?? ''}`)
    )
    .sort((a, b) =>
      sortMode === DASHBOARD_LIST_SORTING_MODE.Value
        ? b.balanceInUsd.minus(a.balanceInUsd).toNumber()
        : a.displayName.localeCompare(b.displayName)
    );

  useInterval(() => {
    loadSortMode();
    loadHiddenCurrencies();
  }, 100);

  const handleOnClickItem = (walletCurrency: IWalletCurrency) => {
    setDetailWalletCurrency(walletCurrency);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-100 ion-display-flex ion-align-items-center ion-justify-content-between">
        <IonText className="ion-text-color-grey ion-text-size-xs">
          {t('Assets')}
        </IonText>
        <DashboardPreferenceModalTriggerButton />
      </div>
      <div
        style={{
          height: `calc(100vh - ${isMobile ? '456px - var(--ion-safe-area-bottom)' : '392px'})`,
        }}
      >
        <CryptoCurrencyList
          currencies={sortedCurrencies}
          showUSDValue
          onClick={handleOnClickItem}
        />
      </div>
      <DashboardCryptoCurrencyDetailModal
        walletCurrency={detailWalletCurrency}
        modalRef={modalRef}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};
