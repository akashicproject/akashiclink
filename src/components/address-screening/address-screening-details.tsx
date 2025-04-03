import styled from '@emotion/styled';
import { RiskLevel } from '@helium-pay/backend';
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonLabel,
  IonRow,
} from '@ionic/react';
import { helpCircleOutline } from 'ionicons/icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { SUPPORTED_CURRENCIES_FOR_EXTENSION } from '../../constants/currencies';
import {
  NoActivityText,
  NoActivityWrapper,
} from '../../pages/activity/activity';
import { useAppSelector } from '../../redux/app/hooks';
import { selectTheme } from '../../redux/slices/preferenceSlice';
import type { LocationState } from '../../routing/history';
import { themeType } from '../../theme/const';
import { useWalletScreenDetail } from '../../utils/hooks/useWalletScreenDetail';
import { Divider } from '../common/divider';
import { AlertIcon } from '../common/icons/alert-icon';

const IconWrapper = styled.div({
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
});
const Address = styled.div({
  textAlign: 'center',
  fontSize: '0.675rem',
  fontWeight: 400,
  color: 'var(--activity-dim-text)',
});
const AddressWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});
const StyledIonCard = styled(IonCard)({
  background: 'var(--ion-background-color)',
  width: '100%',
  marginInline: 'auto',
  boxShadow: 'none',
  paddingInline: '0px',
});
const StyledIonCardContent = styled(IonCardContent)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
});
const currenciesIcon = [...SUPPORTED_CURRENCIES_FOR_EXTENSION.list];

const getBadgeStyle = (riskLevel: RiskLevel) => {
  const styles = {
    Low: {
      background: 'var(--risk-level-background-low)',
      color: 'var(--risk-level-low-text)',
      borderColor: 'var(--risk-level-low-text)',
    },
    Moderate: {
      background: 'var(--risk-level-background-moderate)',
      color: 'var(--risk-level-moderate-text)',
      borderColor: 'var(--risk-level-moderate-text)',
    },
    High: {
      background: 'var(--risk-level-background-high)',
      color: 'var(--risk-level-high-text)',
      borderColor: 'var(--risk-level-high-text)',
    },
    Severe: {
      background: 'var(--risk-level-background-severe)',
      color: 'var(--risk-level-severe-text)',
      borderColor: 'var(--risk-level-severe-text)',
    },
  };
  return {
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 'bold',
    border: '1px solid',
    ...styles[riskLevel],
  };
};

interface BadgeItemProps {
  label: string;
  value: string;
  riskLevel: RiskLevel;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ label, value, riskLevel }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <IonLabel
      className="ion-text-size-xs"
      style={{ color: 'var(--ion-color-primary-10)' }}
    >
      {label}
    </IonLabel>
    <IonBadge className="ion-text-size-md" style={getBadgeStyle(riskLevel)}>
      {value}
    </IonBadge>
  </div>
);

interface OverviewItemProps {
  label: string;
  value: string;
  size?: string;
  offset?: string;
}

const OverviewItem: React.FC<OverviewItemProps> = ({
  label,
  value,
  offset,
  size,
}) => (
  <IonCol
    size={size ?? '6'}
    offset={offset ?? '0'}
    className="ion-padding-0 ion-padding-top-xs ion-padding-bottom-xs"
  >
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
      <span
        style={{
          width: '3px',
          height: '32px',
          background: 'linear-gradient(to bottom, #6a5acd 50%, #d3d3d3 50%)',
        }}
        className="ion-padding-0"
      ></span>
      <div>
        <p className="label ion-text-size-xs ion-text-bold">{label}</p>
        <p
          className="value ion-text-size-sm"
          style={{ color: 'var(--ion-color-grey)' }}
        >
          {value}
        </p>
      </div>
    </div>
  </IonCol>
);
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <IonCardHeader
    className="ion-padding-0 ion-padding-top-lg ion-padding-bottom-md ion-text-bold"
    style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '8px',
      color: 'var(--ion-color-primary-10)',
    }}
  >
    <IonCardTitle
      className="ion-text-size-sm ion-text-bold"
      style={{ color: 'var(--ion-color-primary-10)' }}
    >
      {title}
    </IonCardTitle>
    <IonIcon icon={helpCircleOutline} className="help-icon " />
  </IonCardHeader>
);

export const AddressScreeningDetail = () => {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();

  const { trigger, screening, isMutating } = useWalletScreenDetail();
  const storedTheme = useAppSelector(selectTheme);
  const currencyObj = currenciesIcon.find(
    (c) => c.walletCurrency.chain === screening?.coinSymbol
  );

  const addressScreeningId =
    history.location.state?.addressScreeningSearch?.id ?? undefined;

  useEffect(() => {
    if (!addressScreeningId) return;
    trigger({ id: addressScreeningId });
  }, []);

  if (!addressScreeningId) {
    return null;
  }

  return (
    <IonGrid
      className={
        'ion-grid-gap-xs ion-padding-top-xxs ion-padding-bottom-xxs ion-padding-left-md ion-padding-right-md'
      }
    >
      {!isMutating && !screening && (
        <NoActivityWrapper>
          <AlertIcon />
          <NoActivityText>{t('NoActivity')}</NoActivityText>
        </NoActivityWrapper>
      )}
      {!isMutating && screening && (
        <>
          <IconWrapper>
            <IonImg
              alt=""
              src={
                storedTheme === themeType.DARK
                  ? currencyObj?.darkCurrencyIcon
                  : currencyObj?.currencyIcon
              }
              style={{ height: '32px', width: '32px' }}
            />
            <AddressWrapper>
              <div className={'ion-text-size-xxs ion-text-bold'}>
                {screening.coinSymbol}
              </div>
              <Address>{screening.address}</Address>
            </AddressWrapper>
          </IconWrapper>

          <StyledIonCard>
            <Divider
              borderColor={'var(--activity-list-divider-light)'}
              height={'1px'}
              borderWidth={'0.5px'}
            />
            <SectionHeader title={t('RiskScore')} />
            <StyledIonCardContent className="ion-padding-0 ion-padding-top-lg ion-padding-bottom-md">
              <BadgeItem
                label={`${t('RiskScore')}:`}
                value={screening?.score.toString()}
                riskLevel={screening?.riskLevel}
              />
              <BadgeItem
                label={`${t('RiskLevel')}:`}
                value={screening?.riskLevel}
                riskLevel={screening?.riskLevel}
              />
            </StyledIonCardContent>
            <div
              style={{
                width: '100%',
                height: '150px',
                background: 'var(--ion-color-grey)',
                borderRadius: '8px',
              }}
            ></div>
          </StyledIonCard>

          {[RiskLevel.HIGH, RiskLevel.SEVERE].includes(
            screening?.riskLevel
          ) && (
            <IonCardContent
              className="ion-text-center ion-text-size-xs ion-padding-top-xs ion-padding-bottom-xs ion-padding-left-lg  ion-padding-right-lg"
              style={{
                borderRadius: '8px',
                color: 'var(--ion-color-danger-dark)',
                fontWeight: 'bold',
                border: '1px solid var(--ion-color-danger-dark)',
              }}
            >
              <strong>{t('ReceivingCryptoWarning')}</strong>
            </IonCardContent>
          )}

          <StyledIonCard>
            <SectionHeader title={t('Overview')} />
            <IonGrid className="ion-padding-0">
              <IonRow>
                <OverviewItem
                  label={t('Overview')}
                  value={`${screening?.addressOverview?.balance} ${screening.coinSymbol}`}
                />
                <OverviewItem
                  label={t('TxsCount')}
                  value={`${screening?.addressOverview?.txsCount}`}
                  offset={'1'}
                  size={'5'}
                />
              </IonRow>
              <IonRow>
                <OverviewItem
                  label={t('TotalReceived')}
                  value={`${screening?.addressOverview?.totalReceived} ${screening.coinSymbol}`}
                />
                <OverviewItem
                  label={t('TotalSpent')}
                  value={`${screening?.addressOverview?.totalSpent} ${screening.coinSymbol}`}
                  offset={'1'}
                  size={'5'}
                />
              </IonRow>
              <IonRow>
                <OverviewItem
                  label={t('IncomingCount')}
                  value={`${screening?.addressOverview?.receivedTxsCount}`}
                />
                <OverviewItem
                  label={t('OutgoingCount')}
                  value={`${screening?.addressOverview?.spentTxsCount}`}
                  offset={'1'}
                  size={'5'}
                />
              </IonRow>
            </IonGrid>
          </StyledIonCard>
        </>
      )}
    </IonGrid>
  );
};
