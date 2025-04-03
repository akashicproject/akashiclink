import './activity.scss';

import { IonContent } from '@ionic/react';

import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { NftDetail } from './nft-details';
import { TransactionDetails } from './transactions-details';

export function ActivityDetail({
  currentTransfer,
}: {
  currentTransfer: ITransactionRecordForExtension;
}) {
  return (
    <IonContent className="transfer-detail">
      {currentTransfer.nft ? (
        <NftDetail currentTransfer={currentTransfer} />
      ) : (
        <TransactionDetails currentTransfer={currentTransfer} />
      )}
    </IonContent>
  );
}
