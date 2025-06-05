import styled from '@emotion/styled';
import { IonBadge, IonText } from '@ionic/react';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';
import { formatAmountWithCommas } from 'src/utils/formatAmountWithCommas';

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

export const TotalBalance = () => {
  const { t } = useTranslation();
  const { totalBalanceInUsd } = useTotalCryptoCurrencyBalances();
  const { yesterdayBalanceUSDT } = useYesterdayHistoricBalance();

  const balanceDiff = Big(totalBalanceInUsd ?? '0').sub(
    yesterdayBalanceUSDT ?? '0'
  );

  const balanceDiffPercent = Big(balanceDiff)
    .div(
      yesterdayBalanceUSDT && !yesterdayBalanceUSDT.eq(0)
        ? yesterdayBalanceUSDT
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
      <IonText className="ion-text-size-sm ion-text-color-grey ion-text-bold">
        {t('TotalBalance')}
      </IonText>
      <IonText className="ion-text-size-xxxxl ion-text-bold">
        {`$${formatAmountWithCommas(Big(totalBalanceInUsd ?? '0').toFixed(2, Big.roundDown), 2)}`}
      </IonText>
      <div
        className={
          'ion-display-flex ion-align-items-center ion-justify-content-center ion-gap-xs'
        }
      >
        <IonText className="ion-text-size-sm">
          {`${relativeSign}$${Big(balanceDiff.abs()).toFixed(
            2,
            Big.roundDown
          )}`}
        </IonText>
        <PercentageBadge className="ion-text-size-xs">
          {`${Big(balanceDiffPercent).toFixed(2, Big.roundDown)}%`}
        </PercentageBadge>
      </div>
    </BackgroundBox>
  );
};
