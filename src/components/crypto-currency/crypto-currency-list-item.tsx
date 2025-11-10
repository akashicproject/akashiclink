import styled from '@emotion/styled';
import { type CryptoCurrencyWithName } from '@helium-pay/backend';

import { formatAmountWithCommas } from '../../utils/formatAmountWithCommas';
import { useCryptoCurrencyBalance } from '../../utils/hooks/useCryptoCurrencyBalance';
import { CryptoCurrencyIcon } from '../common/chain-icon/crypto-currency-icon';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
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
  currency,
  showUSDValue,
  onClick,
}: {
  currency: CryptoCurrencyWithName;
  showUSDValue: boolean;
  onClick?: (currency: CryptoCurrencyWithName) => void;
}) => {
  const { balance, balanceInUsd } = useCryptoCurrencyBalance(
    currency.coinSymbol,
    currency.tokenSymbol
  );

  return (
    <Container
      className="ion-padding-top-xs ion-padding-bottom-xs ion-padding-left-sm ion-padding-right-sm"
      onClick={() => onClick && onClick(currency)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <ContentWrapper>
        <CryptoCurrencyIcon
          coinSymbol={currency.coinSymbol}
          tokenSymbol={currency.tokenSymbol}
        />
        <TextContainer>
          <div
            className="ion-text-size-sm ion-text-bold"
            style={{ color: 'var(--ion-text-color-alt)' }}
          >
            {currency.displayName}
          </div>
          <div
            className="ion-text-size-xs"
            style={{ color: 'var(--ion-text-color-alt)' }}
          >{`${formatAmountWithCommas(balance ?? '0')} ${currency.tokenSymbol ?? currency.coinSymbol}`}</div>
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
