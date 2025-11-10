import { type CryptoCurrencyWithName } from '@helium-pay/backend';
import { Virtuoso } from 'react-virtuoso';

import CryptoCurrencyListItem from './crypto-currency-list-item';

export function CryptoCurrencyList({
  minHeight,
  currencies,
  onClick,
  showUSDValue = false,
}: {
  minHeight?: string; // for render inside modal which does not have a height for Virtuoso to work with
  currencies: CryptoCurrencyWithName[];
  onClick?: (walletCurrency: CryptoCurrencyWithName) => void;
  showUSDValue?: boolean;
}) {
  return (
    <Virtuoso
      style={{
        height: '100%',
        width: '100%',
        minHeight: minHeight ?? 'auto',
      }}
      data={currencies}
      itemContent={(index, currency) => (
        <div
          key={index}
          className="ion-padding-bottom-xxs ion-margin-bottom-xxs"
        >
          <CryptoCurrencyListItem
            key={`${currency.coinSymbol}-${currency.tokenSymbol ?? ''}`}
            currency={currency}
            showUSDValue={showUSDValue}
            onClick={onClick}
          />
        </div>
      )}
    />
  );
}
