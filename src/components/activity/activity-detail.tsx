import styled from '@emotion/styled';
import { TransactionStatus } from '@helium-pay/backend';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowForwardCircleOutline, copyOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

import type { WalletTransactionRecord } from '../../pages/activity';
import { displayLongText } from '../../utils/long-text';

const TransferDetail = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0',
  gap: '16px',
  width: '350px',
});

const DetailColumn = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0px',
  width: '350px',
  height: '24px',
});

const TextContent = styled.div({
  display: 'flex',
  alignContent: 'center',
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
});

const Link = styled.a({
  color: 'var(--ion-color-primary-10)',
});

const TextTitle = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
});

export const ActivityDetail: React.FC<{
  currentTransfer: WalletTransactionRecord;
}> = ({ currentTransfer }) => {
  const { t } = useTranslation();

  const statusString = (status: string | undefined) => {
    switch (status) {
      case 'Any':
        return t('Any');
      case TransactionStatus.CONFIRMED:
        return t('Confirmed');
      case TransactionStatus.PENDING:
        return t('Pending');
      case TransactionStatus.FAILED:
        return t('Failed');
      default:
        return t('MissingTranslationError');
    }
  };

  // TODO: once backend transaction are fetching:
  // - nonce
  // - gas limit
  // - GasLimit
  // - GasUsed
  // - PriorityFee
  // - MaxFeePerGas
  // Remove this
  const backendUpdated = false;

  return (
    <TransferDetail>
      <DetailColumn>
        <TextTitle>{t('Status')}</TextTitle>
        <TextContent>{statusString(currentTransfer.status)}</TextContent>
      </DetailColumn>
      <DetailColumn style={{ marginTop: '20px' }}>
        <TextTitle>{t('txHash')}</TextTitle>
        <TextContent>
          <Link href={currentTransfer.txHashUrl}>
            {displayLongText(currentTransfer.txHash)}
          </Link>
          <IonButton
            class="copy-button"
            onClick={() =>
              navigator.clipboard.writeText(currentTransfer.txHashUrl ?? '')
            }
          >
            <IonIcon slot="icon-only" class="copy-icon" icon={copyOutline} />
          </IonButton>
        </TextContent>
      </DetailColumn>
      <DetailColumn style={{ marginTop: '20px' }}>
        <TextTitle>{t('From')}</TextTitle>
        <TextTitle>{t('To')}</TextTitle>
      </DetailColumn>
      <DetailColumn>
        <TextContent>
          <Link href={currentTransfer.senderAddressUrl}>
            {displayLongText(currentTransfer.senderAddressUrl)}
          </Link>
          <IonButton
            class="copy-button"
            onClick={() =>
              navigator.clipboard.writeText(
                currentTransfer.senderAddressUrl ?? ''
              )
            }
          >
            <IonIcon slot="icon-only" class="copy-icon" icon={copyOutline} />
          </IonButton>
        </TextContent>
        <TextContent>
          <IonIcon icon={arrowForwardCircleOutline} />
        </TextContent>
        <TextContent>
          <Link href={currentTransfer.recipientAddressUrl}>
            {displayLongText(currentTransfer.recipientAddressUrl)}
          </Link>
          <IonButton
            class="copy-button"
            onClick={() =>
              navigator.clipboard.writeText(
                currentTransfer.recipientAddressUrl ?? ''
              )
            }
          >
            <IonIcon slot="icon-only" class="copy-icon" icon={copyOutline} />
          </IonButton>
        </TextContent>
      </DetailColumn>
      <DetailColumn style={{ marginTop: '20px' }}>
        <TextTitle>{t('Transaction')}</TextTitle>
      </DetailColumn>
      {backendUpdated && (
        <DetailColumn>
          <TextContent>{'Nonce'}</TextContent>
        </DetailColumn>
      )}
      <DetailColumn>
        <TextContent>{t('Amount')}</TextContent>
        <TextTitle>
          {currentTransfer.amount + ' ' + currentTransfer.currency.displayName}
        </TextTitle>
      </DetailColumn>
      {backendUpdated && (
        <DetailColumn>
          <TextContent>{`${t('GasLimit')} (${t('Units')})`}</TextContent>
        </DetailColumn>
      )}
      {backendUpdated && (
        <DetailColumn>
          <TextContent>{`${t('GasUsed')} (${t('Units')})`}</TextContent>
        </DetailColumn>
      )}
      <DetailColumn>
        <TextContent>{`${t('GasFee')}`}</TextContent>
        <TextContent>{currentTransfer.feesPaid}</TextContent>
      </DetailColumn>
      {backendUpdated && (
        <DetailColumn>
          <TextContent>{t('PriorityFee')}</TextContent>
        </DetailColumn>
      )}
      {backendUpdated && (
        <DetailColumn>
          <TextContent>{`${t('Total')} ${t('GasFee')}`}</TextContent>
        </DetailColumn>
      )}
      {backendUpdated && (
        <DetailColumn>
          <TextContent>{t('MaxFeePerGas')}</TextContent>
        </DetailColumn>
      )}
      <DetailColumn style={{ marginTop: '20px' }}>
        <TextContent>{'Total'}</TextContent>
        <TextTitle>
          {`${
            Number(currentTransfer.amount) + Number(currentTransfer.feesPaid)
          } ${currentTransfer.currency.displayName}`}
        </TextTitle>
      </DetailColumn>
    </TransferDetail>
  );
};
