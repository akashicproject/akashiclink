import styled from '@emotion/styled';

import { type IWalletCurrency } from '../../constants/currencies';
import { formatAmountWithCommas } from '../../utils/formatAmountWithCommas';
import { useCryptoCurrencyBalance } from '../../utils/hooks/useCryptoCurrencyBalance';
import { CryptoCurrencyIcon } from '../common/chain-icon/crypto-currency-icon';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '8px',
  border: '1px solid var(--ion-item-alt-border-color)',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  height: '52px',
  justifyContent: 'space-between',
  '&:hover': {
    boxShadow: '1px 1px 10px 0px rgba(0, 0, 0, 0.1);',
  },
});

const ContentWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const TextContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const CryptoCurrencyListItem = ({
  walletCurrency,
  showUSDValue,
  onClick,
}: {
  walletCurrency: IWalletCurrency;
  showUSDValue: boolean;
  onClick?: (walletCurrency: IWalletCurrency) => void;
}) => {
  const { balance, balanceInUsd } = useCryptoCurrencyBalance(walletCurrency);

  return (
    <Container
      className="ion-padding-top-xs ion-padding-bottom-xs ion-padding-left-sm ion-padding-right-sm"
      onClick={() => onClick && onClick(walletCurrency)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <ContentWrapper>
        <CryptoCurrencyIcon currency={walletCurrency} />
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
          >{`${formatAmountWithCommas(balance ?? '0', 2)} ${walletCurrency.token ?? walletCurrency.chain}`}</div>
        </TextContainer>
      </ContentWrapper>
      {showUSDValue && (
        <div
          className="ion-text-size-md ion-text-bold"
          style={{ color: 'var(--ion-text-color-alt)' }}
        >
          {`$${formatAmountWithCommas(balanceInUsd, 2)}`}
        </div>
      )}
    </Container>
  );
};
export default CryptoCurrencyListItem;
