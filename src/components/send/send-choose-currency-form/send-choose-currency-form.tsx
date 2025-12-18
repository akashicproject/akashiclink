import { ALL_CURRENCIES_BY_MARKET_CAP, type CryptoCurrencyWithName, NetworkDictionary, sortCompareFnForMarketCap } from '@akashic/as-backend';
import { IonChip, IonCol, IonGrid, IonIcon, IonInput, IonRow } from '@ionic/react';
import { checkmark, searchOutline } from 'ionicons/icons';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyIcon } from 'src/components/common/chain-icon/crypto-currency-icon';

import { useCryptoCurrencyBalancesList } from '../../../utils/hooks/useCryptoCurrencyBalancesList';
import { CryptoCurrencyList } from '../../crypto-currency/crypto-currency-list';
import { SendFormContext } from '../send-modal-context-provider';

export const SendChooseCurrencyForm = () => {
  const { setStep, step, setCurrency } = useContext(SendFormContext);
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  const { balances } = useCryptoCurrencyBalancesList();

  const handleChooseCurrency = (walletCurrency: CryptoCurrencyWithName) => {
    setCurrency(walletCurrency);
    setStep(step + 1);
  };

  const availableNetworks = Array.from(
    new Set(balances.map((item) => item.coinSymbol))
  ).sort((a, b) => {
    const aIndex = ALL_CURRENCIES_BY_MARKET_CAP.findIndex(
      (c: CryptoCurrencyWithName) => c.coinSymbol === a
    );
    const bIndex = ALL_CURRENCIES_BY_MARKET_CAP.findIndex(
      (c: CryptoCurrencyWithName) => c.coinSymbol === b
    );
    return aIndex - bIndex;
  });

  const sortedCurrencies = balances.slice().sort((a, b) => {
    const usdA = Number(a.balanceInUsd ?? 0);
    const usdB = Number(b.balanceInUsd ?? 0);
    if (usdA !== usdB) {
      return usdB - usdA;
    }
    return sortCompareFnForMarketCap(a, b);
  });

  const filteredCurrencies = sortedCurrencies.filter((c) => {
    const searchLower = searchText.toLowerCase();
    const matchesSearch =
      !searchText ||
      c.coinSymbol?.toLowerCase().includes(searchLower) ||
      c.tokenSymbol?.toLowerCase().includes(searchLower) ||
      c.displayName?.toLowerCase().includes(searchLower);

    const matchesNetwork =
      !selectedNetwork || c.coinSymbol === selectedNetwork;

    return matchesSearch && matchesNetwork;
  });

  return (
    <IonGrid
      className={
        'ion-padding-top-md ion-padding-bottom-xxs ion-padding-left-md ion-padding-right-md'
      }
    >
      <IonRow>
        <IonCol size={'12'}>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 4, textAlign: 'center' }}>
            {t('SelectCurrency')}
          </div>
          <div style={{ position: 'relative', margin: '16px 0 12px 0' }}>
            <IonInput
              value={searchText}
              onIonInput={(e) => {
                const target = e.target as HTMLIonInputElement;
                setSearchText(target.value as string || '');
              }}
              placeholder={t('Search')}
              style={{
                borderRadius: '24px',
                fontSize: '1rem',
                fontWeight: 400,
                border: '1px solid var(--ion-color-outline)',
                background: 'transparent',
                '--highlight-color': 'transparent',
                '--highlight-height': '0px',
                '--placeholder-color': 'var(--ion-color-inverse-surface)',
              } as React.CSSProperties}
            />
            <IonIcon
              icon={searchOutline}
              style={{  
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--ion-color-on-inverse-surface)',
                fontSize: '20px',
                pointerEvents: 'none'
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              marginBottom: '16px',
              overflowX: 'auto',
              gap: '8px',
              paddingBottom: '4px',
            }}
          >
            <IonChip
              outline={selectedNetwork !== null}
              onClick={() => setSelectedNetwork(null)}
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 16px 6px 8px',
                whiteSpace: 'nowrap',
                width: 'auto',
                minWidth: 'fit-content',
                backgroundColor: selectedNetwork === null ? 'var(--ion-color-secondary-container)' : 'transparent',
                gap: '10px',
              }}
            >
              <IonIcon icon={checkmark} color='var(--ion-color-on-surface-variant)' />
              {t('All')}
            </IonChip>
            {availableNetworks.map((network) => (
              <IonChip
                key={network}
                outline={selectedNetwork !== network}
                onClick={() => setSelectedNetwork(network)}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px 16px 6px 8px',
                  whiteSpace: 'nowrap',
                  width: 'auto',
                  minWidth: 'fit-content',
                  backgroundColor: selectedNetwork === network ? 'var(--ion-color-secondary-container)' : 'transparent',
                  gap: '8px',
                }}
              >
                <CryptoCurrencyIcon coinSymbol={network} size={18} />
                {NetworkDictionary[network]?.displayName ?? network}
              </IonChip>
            ))}
          </div>
          <div
            style={{
              maxHeight: '60vh',
              overflowY: 'auto',
              marginBottom: '30px',
            }}
          >
            <CryptoCurrencyList
              minHeight={'80vh'}
              currencies={filteredCurrencies}
              showUSDValue
              onClick={(walletCurrency) => handleChooseCurrency(walletCurrency)}
            />
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
