import styled from '@emotion/styled';
import type { CoinSymbol, CryptoCurrencyWithName } from '@helium-pay/backend';
import { NetworkDictionary } from '@helium-pay/backend/src/modules/api-interfaces/networks/networks.model';
import { IonCheckbox, IonIcon, IonText } from '@ionic/react';
import { caretDown } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

import { CryptoCurrencyIcon } from '../common/chain-icon/crypto-currency-icon';

const TokenGroup = styled.div<{ selected: boolean }>((props) => ({
  border: `0.125rem solid ${props.selected ? 'var(--ion-color-primary)' : 'var(--ion-item-alt-border-color)'}`,
  borderRadius: '0.75rem',
  padding: '0.25rem',
  marginBottom: '0.75rem',
  transition: 'border-color 0.3s ease',
}));

const GroupContainer = styled.div({
  display: 'flex',
  padding: '0.5rem',
  cursor: 'pointer',
});

const TokenHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  flex: 1,
});

const CountBadge = styled.div({
  background: 'var(--ion-color-primary)',
  color: 'var(--ion-color-on-primary)',
  borderRadius: '50%',
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 700,
  marginLeft: '0.5rem',
});

const TokenContainer = styled.div({
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  marginTop: '0.5rem',
});

const TokenItem = styled.div<{ checked: boolean }>((props) => ({
  border: `0.0625rem solid ${props.checked ? 'var(--ion-color-primary)' : 'var(--ion-item-alt-border-color)'}`,
  borderRadius: '0.5rem',
  padding: '0.75rem',
  marginBottom: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  outline: 'none',
}));

const TokenSymbolIconAlignment = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
});

const SelectAllItem = styled.div<{ checked: boolean }>((props) => ({
  border: `0.0625rem solid ${props.checked ? 'var(--ion-color-primary)' : 'var(--ion-item-alt-border-color)'}`,
  borderRadius: '0.5rem',
  padding: '0.75rem',
  marginBottom: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  outline: 'none',
}));

interface CurrencyGroupProps {
  chain: CoinSymbol;
  mainCurrency: CryptoCurrencyWithName | undefined;
  currencies: CryptoCurrencyWithName[];
  isExpanded: boolean;
  selectedCount: number;
  isAllSelected: boolean;
  hiddenCurrencies: string[];
  onToggleChain: (chain: CoinSymbol) => void;
  onSelectAll: (chain: CoinSymbol) => void;
  onToggleCurrency: (currency: CryptoCurrencyWithName) => void;
}

export const DashboardPreferenceCurrencyGroup = ({
  chain,
  mainCurrency,
  currencies,
  isExpanded,
  selectedCount,
  isAllSelected,
  hiddenCurrencies,
  onToggleChain,
  onSelectAll,
  onToggleCurrency,
}: CurrencyGroupProps) => {
  const { t } = useTranslation();
  const isSelected = selectedCount > 0;

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      action();
      e.preventDefault();
    }
  };

  return (
    <TokenGroup selected={isSelected}>
      <GroupContainer
        onClick={() => onToggleChain(chain)}
        onKeyDown={(e) => handleKeyDown(e, () => onToggleChain(chain))}
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <TokenHeader>
          {mainCurrency && (
            <CryptoCurrencyIcon
              coinSymbol={mainCurrency.coinSymbol}
              tokenSymbol={mainCurrency.tokenSymbol}
              size={24}
            />
          )}
          <h5 className="ion-no-margin ion-text-size-md ion-text-bold">
            {NetworkDictionary[chain]?.displayName ?? chain}
          </h5>
          {selectedCount > 0 && <CountBadge>{selectedCount}</CountBadge>}
        </TokenHeader>
        <IonIcon
          icon={caretDown}
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      </GroupContainer>
      {isExpanded && (
        <TokenContainer>
          <SelectAllItem
            checked={isAllSelected}
            onClick={() => onSelectAll(chain)}
            onKeyDown={(e) => handleKeyDown(e, () => onSelectAll(chain))}
            tabIndex={0}
          >
            <IonText className={'ion-text-size-sm ion-text-bold'}>
              {t('SelectAll')}
            </IonText>
            <IonCheckbox
              checked={isAllSelected}
              onIonChange={(e) => e.stopPropagation()}
            />
          </SelectAllItem>
          {currencies.map((currency) => {
            const isChecked = !hiddenCurrencies.includes(
              `${currency.coinSymbol}-${currency.tokenSymbol ?? ''}`
            );
            return (
              <TokenItem
                key={`${currency.coinSymbol}-${currency.tokenSymbol ?? ''}`}
                checked={isChecked}
                onClick={() => onToggleCurrency(currency)}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => onToggleCurrency(currency))
                }
                tabIndex={0}
              >
                <TokenSymbolIconAlignment>
                  <CryptoCurrencyIcon
                    coinSymbol={currency.coinSymbol}
                    tokenSymbol={currency.tokenSymbol}
                    size={24}
                  />
                  <h5 className="ion-no-margin ion-text-size-sm ion-text-bold">
                    {currency.displayName}
                  </h5>
                </TokenSymbolIconAlignment>
                <IonCheckbox
                  checked={isChecked}
                  onIonChange={(e) => e.stopPropagation()}
                />
              </TokenItem>
            );
          })}
        </TokenContainer>
      )}
    </TokenGroup>
  );
};
