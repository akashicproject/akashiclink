import { Virtuoso } from 'react-virtuoso';

import { type IWalletCurrency } from '../../constants/currencies';
import CryptoCurrencyListItem from './crypto-currency-list-item';

export function CryptoCurrencyList({
  minHeight,
  currencies,
  onClick,
  showUSDValue = false,
}: {
  minHeight?: string; // for render inside modal which does not have a height for Virtuoso to work with
  currencies: IWalletCurrency[];
  onClick?: (walletCurrency: IWalletCurrency) => void;
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
            key={`${currency.chain}-${currency.token ?? ''}`}
            walletCurrency={currency}
            showUSDValue={showUSDValue}
            onClick={onClick}
          />
        </div>
      )}
    />
  );
}
