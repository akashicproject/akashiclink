import {
  type ICurrencyForExtension,
  type IWalletCurrency,
} from '../../constants/currencies';
import CryptoCurrencyListItem from './crypto-currency-list-item';

export function CryptoCurrencyList({
  currencies,
  onClick,
  showUSDValue = false,
}: {
  currencies: ICurrencyForExtension[];
  onClick?: (walletCurrency: IWalletCurrency) => void;
  showUSDValue?: boolean;
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
          walletCurrency={currency.walletCurrency}
          onClick={onClick}
          showUSDValue={showUSDValue}
        />
      ))}
    </div>
  );
}
