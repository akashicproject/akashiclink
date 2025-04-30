import type { ICurrencyForExtension } from '../../constants/currencies';
import CryptoCurrencyListItem from './crypto-currency-list-item';

export function CryptoCurrencyList({
  currencies,
  isShowUSDValue,
}: {
  currencies: ICurrencyForExtension[];
  isShowUSDValue: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      {currencies.map((currency) => (
        <CryptoCurrencyListItem
          key={`${currency.walletCurrency.chain}-${currency.walletCurrency.token}`}
          {...currency}
          isShowUSDValue={isShowUSDValue}
        />
      ))}
    </div>
  );
}
