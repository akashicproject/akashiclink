import styled from '@emotion/styled';
import type { CoinSymbol } from '@helium-pay/backend';
import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonGrid,
  IonRow,
  IonSearchbar,
  IonText,
} from '@ionic/react';
import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { IWalletCurrency } from '../../constants/currencies';
import { SUPPORTED_CURRENCIES_FOR_EXTENSION } from '../../constants/currencies';
import { getImageIconUrl } from '../../utils/url-utils';
import { DashboardPreferenceCurrencyGroup } from './dashboard-preference-currency-group';
import { DashboardPreferenceContext } from './dashboard-preference-modal-trigger-button';

const Searchbar = styled(IonSearchbar)({
  border: '0.0625rem solid var(--ion-item-alt-border-color)',
  borderRadius: '2rem',
  marginBottom: '0.25rem',
  background: 'transparent',
  boxShadow: 'none',
  '--background': 'transparent',
  '--box-shadow': 'none',
  '& input::placeholder': {
    textAlign: 'left',
    paddingLeft: '1.625rem',
    color: 'var(--ion-text-color-alt) !important',
  },
  '& input': {
    color: 'var(--ion-text-color-alt) !important',
  },
  '& .searchbar-search-icon': {
    right: '1.625rem',
    left: 'auto',
    position: 'absolute',
    width: '2.875rem',
    height: '2.875rem',
    top: '50%',
    transform: 'translateY(-50%)',
  },
});

const PreferenceHeader = ({ onClearAll }: { onClearAll: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="ion-display-flex ion-justify-content-between ion-align-items-center">
      <h2 className="ion-text-align-left ion-no-margin ion-no-padding ion-color-secondary-text">
        {t('Preferences')}
      </h2>
      <IonButton
        fill="clear"
        onClick={onClearAll}
        className="ion-text-size-md ion-text-color-grey ion-text-bold ion-text-capitalize"
      >
        {t('Clear')}
      </IonButton>
    </div>
  );
};

const CountDisplay = ({ count }: { count: number }) => {
  const { t } = useTranslation();
  return (
    <div className="ion-text-left ion-margin-top-xs ion-margin-bottom-sm">
      <IonText className="ion-text-size-md ion-text-bold ion-text-color-grey">
        {`${count} ${t('TokenSelected')}`}
      </IonText>
    </div>
  );
};

const AllToken = ({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="ion-display-flex ion-align-items-center ion-justify-content-between ion-padding-sm">
      <IonText
        className="ion-text-size-md ion-text-color-grey ion-text-bold
      "
      >
        {t('SelectAll')}
      </IonText>
      <IonCheckbox checked={checked} onIonChange={onToggle} />
    </div>
  );
};

export const DashboardPreferenceCurrencyFilter = () => {
  const { t } = useTranslation();
  const { hiddenCurrencies, setHiddenCurrencies } = useContext(
    DashboardPreferenceContext
  );
  const [search, setSearch] = useState('');
  const [expandedChains, setExpandedChains] = useState<string[]>([]);

  const groupedCurrencies = useMemo(() => {
    return SUPPORTED_CURRENCIES_FOR_EXTENSION.list.reduce(
      (acc, { walletCurrency }) => {
        const chain = walletCurrency.chain;
        if (!acc[chain]) {
          acc[chain] = [];
        }
        acc[chain].push(walletCurrency);
        return acc;
      },
      {} as Record<string, IWalletCurrency[]>
    );
  }, []);

  const chains = useMemo(
    () => Object.keys(groupedCurrencies),
    [groupedCurrencies]
  );

  const getCurrencyKey = (currency: IWalletCurrency) =>
    `${currency.chain}-${currency.token ?? ''}`;

  const getChainKeys = (chain: CoinSymbol) => {
    return groupedCurrencies[chain].map((c) => getCurrencyKey(c));
  };

  const allKeys = useMemo(() => {
    return SUPPORTED_CURRENCIES_FOR_EXTENSION.list.map(({ walletCurrency }) =>
      getCurrencyKey(walletCurrency)
    );
  }, []);

  const isChainAllSelected = (chain: CoinSymbol) => {
    return getChainKeys(chain).every((key) => !hiddenCurrencies.includes(key));
  };

  const getChainSelectedCount = (chain: CoinSymbol) => {
    return getChainKeys(chain).filter((key) => !hiddenCurrencies.includes(key))
      .length;
  };

  const getMainCurrency = (chain: CoinSymbol) => {
    return groupedCurrencies[chain].find((c) => !c.token);
  };

  const filteredChains = useMemo(() => {
    return chains.filter((chain) => {
      const chainCurrencies = groupedCurrencies[chain];
      return chainCurrencies.some((currency) =>
        currency.displayName.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [chains, groupedCurrencies, search]);

  const handleToggleCurrency = (currency: IWalletCurrency) => {
    const key = getCurrencyKey(currency);
    setHiddenCurrencies((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleClearAll = () => {
    setHiddenCurrencies(allKeys);
  };

  const handleSelectAll = () => {
    setHiddenCurrencies([]);
  };

  const toggleChain = (chain: CoinSymbol) => {
    setExpandedChains((prev) =>
      prev.includes(chain) ? prev.filter((c) => c !== chain) : [...prev, chain]
    );
  };

  const handleSelectChainAll = (chain: CoinSymbol) => {
    const chainKeys = getChainKeys(chain);
    const allSelected = chainKeys.every(
      (key) => !hiddenCurrencies.includes(key)
    );

    setHiddenCurrencies((prev) =>
      allSelected
        ? [...prev, ...chainKeys]
        : prev.filter((key) => !chainKeys.includes(key))
    );
  };

  const isAllSelected = hiddenCurrencies.length === 0;
  const selectedCount =
    SUPPORTED_CURRENCIES_FOR_EXTENSION.list.length - hiddenCurrencies.length;

  return (
    <IonGrid className="ion-padding-top-0 ion-padding-bottom-xxs ion-padding-left-md ion-padding-right-md">
      <IonRow className="ion-center ion-grid-row-gap-sm">
        <IonCol className="ion-text-align-center" size="12">
          <PreferenceHeader onClearAll={handleClearAll} />
          <CountDisplay count={selectedCount} />
          <Searchbar
            value={search}
            onIonInput={(e) => setSearch(e.detail.value!)}
            placeholder={t('Search')}
            searchIcon={getImageIconUrl('search-icon.svg')}
          />
          <AllToken checked={isAllSelected} onToggle={handleSelectAll} />
          <div style={{ maxHeight: 'calc(60vh - 12.5rem)', overflowY: 'auto' }}>
            {filteredChains.map((chain) => (
              <DashboardPreferenceCurrencyGroup
                key={chain}
                chain={chain as CoinSymbol}
                mainCurrency={getMainCurrency(chain as CoinSymbol)}
                currencies={groupedCurrencies[chain].filter((currency) =>
                  currency.displayName
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )}
                isExpanded={expandedChains.includes(chain)}
                selectedCount={getChainSelectedCount(chain as CoinSymbol)}
                isAllSelected={isChainAllSelected(chain as CoinSymbol)}
                hiddenCurrencies={hiddenCurrencies}
                onToggleChain={toggleChain}
                onSelectAll={handleSelectChainAll}
                onToggleCurrency={handleToggleCurrency}
              />
            ))}
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
