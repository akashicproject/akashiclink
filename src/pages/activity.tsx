import './activity.scss';

import styled from '@emotion/styled';
import type { ITransactionRecord } from '@helium-pay/backend';
import type { ITransactionRecordForTable } from '@helium-pay/owners/src/components/tables/formatter';
import { transferToTableFormat } from '@helium-pay/owners/src/components/tables/formatter';
import {
  IonBackdrop,
  IonButton,
  IonButtons,
  IonCard,
  IonCardTitle,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import dayjs from 'dayjs';
import { closeOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';

import { ActivityDetail } from '../components/activity/activity-detail';
import { OneActivity } from '../components/activity/one-activity';
import { LoggedLayout } from '../components/layout/logged-layout';
import { urls } from '../constants/urls';
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
  formatTransfers.sort((a, b) => b.date.getTime() - a.date.getTime());
  return formatTransfers;
}

export function Activity() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTransfer, setCurrentTransfer] =
    useState<WalletTransactionRecord>();
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
      {isOpen && <IonBackdrop />}
      {isOpen && currentTransfer && (
        <IonCard class="activity-card unselectable">
          <IonCardTitle>
            <div className="spread">
              <h2>{t('ContractInteraction')}</h2>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsOpen(false)}>
                  <IonIcon
                    class="icon-button-icon"
                    slot="icon-only"
                    icon={closeOutline}
                  />
                </IonButton>
              </IonButtons>
            </div>
          </IonCardTitle>
          <ActivityDetail currentTransfer={currentTransfer} />
        </IonCard>
      )}
      {walletFormatTransfers.length ? (
        <Virtuoso
          style={{
            minHeight: '450px',
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
              hasHoverEffect={true}
              divider={index !== walletFormatTransfers.length - 1}
            />
          )}
        />
      ) : (
        <IonSpinner
          color="primary"
          name="circular"
          class="force-center"
          style={{
            marginLeft: '50vw',
            transform: 'translateX(-100%)',
            '--webkit-transform': 'translateX(-100%)',
          }}
        ></IonSpinner>
      )}
    </LoggedLayout>
  );
}
