import './activity.css';

import styled from '@emotion/styled';
import type { ITransactionRecord } from '@helium-pay/backend';
import type { ITransactionRecordForTable } from '@helium-pay/owners/src/components/tables/formatter';
import { transferToTableFormat } from '@helium-pay/owners/src/components/tables/formatter';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';

import { ActivityDetail } from '../components/activity/activity-detail';
import { OneActivity } from '../components/activity/one-activity';
import { WhiteButton } from '../components/buttons';
import { LoggedLayout } from '../components/layout/logged-layout';
import { urls } from '../constants/urls';
import { heliumPayPath } from '../routing/navigation-tree';
import { useTransfersMe } from '../utils/hooks/useTransfersMe';
import { lastPageStorage } from '../utils/last-page-storage';
import { WALLET_CURRENCIES } from '../utils/supported-currencies';

export const Divider = styled.div({
  boxSizing: 'border-box',
  height: '2px',
  border: '1px solid #D9D9D9',
  width: '100%',
});

export interface WalletTransactionRecord extends ITransactionRecordForTable {
  icon: string;
}

/**
 * Formats a transfer record fetched from backend to wallet format
 *
 * @param transfers fetched from backend
 */

export function formatWalletTransfer(
  transfers: ITransactionRecord[]
): WalletTransactionRecord[] {
  const formatTransfers: WalletTransactionRecord[] = [];
  transfers.forEach((transfer, id) => {
    const unpackedTransfer = transferToTableFormat(transfer, id);
    const walletSupportedCurrency = WALLET_CURRENCIES.find(
      (currency) => currency.currency[0] === transfer.coinSymbol
    );
    if (unpackedTransfer !== undefined && walletSupportedCurrency) {
      const walletUnpackedTransfer = {
        icon: walletSupportedCurrency.icon,
        ...unpackedTransfer,
      };
      formatTransfers.push(walletUnpackedTransfer);
    }
  });
  formatTransfers.sort((a, b) => +b.date - +a.date);
  return formatTransfers;
}

export function Activity() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTransfer, setCurrentTransfer] =
    useState<WalletTransactionRecord>();

  // store current page to activity page if reopen
  useEffect(() => {
    lastPageStorage.store(urls.activity);
  }, []);

  const [transferParams, _] = useState({
    startDate: dayjs().subtract(1, 'month').toDate(),
    endDate: dayjs().toDate(),
  });
  const { transfers } = useTransfersMe(transferParams);
  const walletFormatTransfers = formatWalletTransfer(transfers);

  return (
    <LoggedLayout>
      <Virtuoso
        style={{
          marginTop: '40px',
          height: '450px',
          width: '100%',
        }}
        data={walletFormatTransfers}
        itemContent={(index, transfer) => (
          <OneActivity
            transfer={transfer}
            onClick={() => {
              setIsOpen(true);
              setCurrentTransfer(transfer);
            }}
            showDetail={true}
          >
            {index === walletFormatTransfers.length - 1 ? null : <Divider />}
          </OneActivity>
        )}
      ></Virtuoso>
      <Divider style={{ marginTop: '20px' }} />
      <IonRow style={{ marginTop: '20px' }}>
        <IonCol class="ion-center">
          <WhiteButton routerLink={heliumPayPath(urls.loggedFunction)}>
            {t('GoBack')}
          </WhiteButton>
        </IonCol>
      </IonRow>
      <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{t('ContractInteraction')}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>
                {t('Close')}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent class={'dialog-content'}>
          <ActivityDetail currentTransfer={currentTransfer} />
        </IonContent>
      </IonModal>
    </LoggedLayout>
  );
}
