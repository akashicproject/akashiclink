import styled from '@emotion/styled';
import { type IExchangeRate, TEST_TO_MAIN } from '@helium-pay/backend';
import { IonImg } from '@ionic/react';
import Big from 'big.js';

import {
  type ICurrencyForExtension,
  type IWalletCurrency,
  SUPPORTED_CURRENCIES_FOR_EXTENSION,
} from '../../constants/currencies';
import { useAppSelector } from '../../redux/app/hooks';
import { selectTheme } from '../../redux/slices/preferenceSlice';
import { formatAmount } from '../../utils/formatAmount';
import { useExchangeRates } from '../../utils/hooks/useExchangeRates';

const CURRENCIES = [...SUPPORTED_CURRENCIES_FOR_EXTENSION.list];
const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'var(--ion-seconday-background)',
  borderRadius: '8px',
  border: '1px solid var(--ion-item-alt-border-color)',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  width: '325px',
  height: '52px',
  justifyContent: 'space-between',
});

const ContentWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const UsdValue = styled.div({
  color: 'var(--ion-text-color-alt)',
});

const TextContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const TypeIcon = styled.div({
  position: 'relative',
  width: '40px',
  height: '32px',
});

const TokenBadge = styled.img({
  position: 'absolute',
  top: '2px',
  right: '2px',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
});

const valueInUsd = (walletCurrency: IWalletCurrency, balance: string) => {
  const { exchangeRates } = useExchangeRates();
  const findExchangeRate = ({ chain, token }: IWalletCurrency) =>
    exchangeRates.find(
      (ex: IExchangeRate) =>
        !token && ex.coinSymbol === (TEST_TO_MAIN.get(chain) ?? chain)
    )?.price || 1;
  const defaultBig = Big(balance || 0);
  const conversionRate = findExchangeRate(walletCurrency);
  const priceInUsd = Big(conversionRate).times(defaultBig);
  return (
    <UsdValue className="ion-text-size-md ion-text-bold">
      {`${priceInUsd.toFixed(2)} USD`}
    </UsdValue>
  );
};

const CryptoCurrencyListItem = ({
  walletCurrency,
  currencyIcon,
  darkCurrencyIcon,
  balance,
  isShowUSDValue,
}: ICurrencyForExtension & { isShowUSDValue: boolean }) => {
  const storedTheme = useAppSelector(selectTheme);

  const tokenNetworkIcon = CURRENCIES.find(
    (c) =>
      c.walletCurrency.chain === walletCurrency.chain &&
      c.walletCurrency.token === undefined
  );
  return (
    <Container className="ion-padding-top-xs ion-padding-bottom-xs ion-padding-left-md ion-padding-right-md">
      <ContentWrapper>
        <TypeIcon>
          <IonImg
            alt=""
            src={storedTheme === 'dark' ? currencyIcon : darkCurrencyIcon}
            style={{ height: '32px', width: '32px' }}
          />
          {walletCurrency.token && (
            <TokenBadge
              alt={walletCurrency.displayName}
              src={
                storedTheme === 'dark'
                  ? tokenNetworkIcon?.currencyIcon
                  : tokenNetworkIcon?.darkCurrencyIcon
              }
            />
          )}
        </TypeIcon>
        <TextContainer>
          <div
            className="ion-text-size-sm ion-text-bold"
            style={{ color: 'var(--ion-text-color-alt)' }}
          >
            {walletCurrency.displayName}
          </div>
          <div
            className="ion-text-size-xxs"
            style={{ color: 'var(--ion-text-color-alt)' }}
          >{`${formatAmount(balance ?? '0')} ${walletCurrency.chain}`}</div>
        </TextContainer>
      </ContentWrapper>
      {isShowUSDValue && valueInUsd(walletCurrency, balance ?? '0')}
    </Container>
  );
};
export default CryptoCurrencyListItem;
