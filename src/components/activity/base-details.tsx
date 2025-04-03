import styled from '@emotion/styled';
import { TransactionStatus } from '@helium-pay/backend';
import { IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { List } from '../common/list/list';
import { ListCopyTxHashItem } from '../send-deposit/copy-tx-hash';
import { FromToAddressBlock } from '../send-deposit/from-to-address-block';

export const DetailColumn = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxHeight: '20px',
});

export function BaseDetails({
  currentTransfer,
}: {
  currentTransfer: ITransactionRecordForExtension;
}) {
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

  return (
    <div
      className="transfer-detail"
      style={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        marginTop: '24px',
      }}
    >
      <DetailColumn>
        <h4 className="ion-margin-0">{t('Status')}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h4 className="ion-no-margin">
            {statusString(currentTransfer.status)}
          </h4>
          <IonImg
            src={`/shared-assets/images/${currentTransfer.status.toLocaleLowerCase()}.png`}
            style={{ width: '16px', height: '16px' }}
          />
        </div>
      </DetailColumn>
      <List lines="none">
        {currentTransfer.txHash && currentTransfer.txHashUrl && (
          <ListCopyTxHashItem
            txHash={currentTransfer.txHash}
            txHashUrl={currentTransfer.txHashUrl}
            suffix={currentTransfer.coinSymbol}
          />
        )}
        {currentTransfer.l2TxnHash && (
          <ListCopyTxHashItem
            txHash={currentTransfer.l2TxnHash}
            txHashUrl={currentTransfer.l2TxnHashUrl}
            suffix="AS"
          />
        )}

        <FromToAddressBlock
          fromAddress={currentTransfer.fromAddress}
          toAddress={currentTransfer.toAddress}
          fromAddressUrl={
            currentTransfer.internalSenderUrl ??
            currentTransfer.senderAddressUrl
          }
          toAddressUrl={
            currentTransfer.internalRecipientUrl ??
            currentTransfer.recipientAddressUrl
          }
        />
      </List>
    </div>
  );
}
