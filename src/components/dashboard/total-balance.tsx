import styled from '@emotion/styled';
import { IonBadge, IonText } from '@ionic/react';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';

import { formatAmountWithCommas } from '../../utils/formatAmountWithCommas';
import { useFiatCurrencyDisplay } from '../../utils/hooks/useFiatCurrencyDisplay';
import { useTotalCryptoCurrencyBalances } from '../../utils/hooks/useTotalCryptoCurrencyBalances';
import { useYesterdayHistoricBalance } from '../../utils/hooks/useYesterdayHistoricBalance';

const BackgroundBox = styled.div({
  backgroundColor: 'var(--ion-color-primary-08)',
  borderRadius: '16px',
  textAlign: 'center',
});
const PercentageBadge = styled(IonBadge)({
  backgroundColor: 'var(--ion-color-primary-container)',
  color: 'var(--ion-color-primary-on-container)',
  padding: '4px 8px',
  borderRadius: '16px',
});

const RelativeSign = styled.div({
  color: 'var(--ion-color-outline)',
});

export const TotalBalance = () => {
  const { t } = useTranslation();
  const { totalBalanceInFiat } = useTotalCryptoCurrencyBalances();
  const { yesterdayBalanceInFiat } = useYesterdayHistoricBalance();

  const { fiatCurrencySign } = useFiatCurrencyDisplay();

  const balanceDiff = Big(totalBalanceInFiat ?? '0').sub(
    yesterdayBalanceInFiat ?? '0'
  );

  const balanceDiffPercent = Big(balanceDiff)
    .div(
      yesterdayBalanceInFiat && !yesterdayBalanceInFiat.eq(0)
        ? yesterdayBalanceInFiat
        : '1'
    )
    .times(100);

  const relativeSign = balanceDiff?.gte(0) ? '+' : '-';

  return (
    <BackgroundBox
      className={
        'ion-display-flex ion-padding-block-md ion-flex-direction-column ion-gap-xxs'
      }
    >
      <IonText className="ion-text-size-lg ion-text-color-grey ion-text-bold">
        {t('TotalBalance')}
      </IonText>
      <IonText className="ion-text-size-xxxxl ion-text-bold ">
        {`${fiatCurrencySign}${totalBalanceInFiat ? formatAmountWithCommas(totalBalanceInFiat.toFixed(2, Big.roundDown), 2) : '-'}`}
      </IonText>
      <div
        className={
          'ion-display-flex ion-align-items-center ion-justify-content-center ion-gap-xs'
        }
      >
        <RelativeSign className="ion-text-size-md ion-text-bold">
          {`${relativeSign}${fiatCurrencySign}${Big(balanceDiff.abs()).toFixed(
            2,
            Big.roundDown
          )}`}
        </RelativeSign>
        <PercentageBadge className="ion-text-size-md">
          {`${Big(balanceDiffPercent).toFixed(2, Big.roundDown)}%`}
        </PercentageBadge>
      </div>
    </BackgroundBox>
  );
};
