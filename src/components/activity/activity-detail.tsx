import './activity.scss';

import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import {
  TransactionLayer,
  TransactionStatus,
  TransactionType,
} from '@helium-pay/backend';
import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import Big from 'big.js';
import { arrowForwardCircleOutline, copyOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { WalletTransactionRecord } from '../../pages/activity';
import { Divider } from '../../pages/activity';
import { displayLongText } from '../../utils/long-text';

const DetailColumn = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0px',
  height: '24px',
  marginTop: '8px',
});

const TextContent = styled.div({
  display: 'flex',
  alignContent: 'center',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
});

const Link = styled.a({
  color: 'var(--ion-color-primary-10)',
});

export function ActivityDetail({
  currentTransfer,
}: {
  currentTransfer: WalletTransactionRecord;
}) {
  const { t } = useTranslation();
  const isLayer2 = currentTransfer.layer === TransactionLayer.L2;

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

  const displayChainName = (currentTransfer: WalletTransactionRecord) => {
    if (!currentTransfer.currency.network) return;
    if (currentTransfer.layer === TransactionLayer.L2)
      return t('Chain.AkashicChain');
    return t(`Chain.${currentTransfer.currency.network.toUpperCase()}`);
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

  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const copyData = async (data: string, e: never) => {
    await Clipboard.write({
      string: data ?? '',
    });

    if (popover.current) {
      popover.current.event = e;
    }
    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 1000);
  };

  return (
    <IonContent className="transfer-detail">
      <DetailColumn>
        <h4>{t('Status')}</h4>
        <TextContent>{statusString(currentTransfer.status)}</TextContent>
      </DetailColumn>
      <DetailColumn>
        <h4>{t('Chain.Title')}</h4>
        <TextContent>{displayChainName(currentTransfer)}</TextContent>
      </DetailColumn>
      <DetailColumn>
        <h4>{t('txHash')}</h4>
        <TextContent>
          {isLayer2 ? (
            displayLongText(currentTransfer.txHash)
          ) : (
            <>
              <Link href={currentTransfer.txHashUrl}>
                {displayLongText(currentTransfer.txHash)}
              </Link>
              <IonButton
                class="copy-button"
                onClick={async (e: never) =>
                  copyData(currentTransfer.txHashUrl, e)
                }
              >
                <IonIcon
                  slot="icon-only"
                  class="copy-icon"
                  icon={copyOutline}
                />
                <IonPopover
                  side="top"
                  alignment="center"
                  ref={popover}
                  isOpen={popoverOpen}
                  class={'copied-popover'}
                  onDidDismiss={() => setPopoverOpen(false)}
                >
                  <IonContent class="ion-padding">{t('Copied')}</IonContent>
                </IonPopover>
              </IonButton>
            </>
          )}
        </TextContent>
      </DetailColumn>
      <DetailColumn>
        <h4>{t('From')}</h4>
        <h4>{t('To')}</h4>
      </DetailColumn>
      <DetailColumn>
        {isLayer2 ? (
          <TextContent>
            {displayLongText(currentTransfer.fromAddress)}
          </TextContent>
        ) : (
          <TextContent>
            <Link href={currentTransfer.senderAddressUrl}>
              {displayLongText(currentTransfer.senderAddressUrl)}
            </Link>
            <IonButton
              class="copy-button"
              onClick={async (e: never) =>
                copyData(currentTransfer.senderAddressUrl, e)
              }
            >
              <IonIcon slot="icon-only" class="copy-icon" icon={copyOutline} />
            </IonButton>
          </TextContent>
        )}
        <TextContent>
          <IonIcon icon={arrowForwardCircleOutline} />
        </TextContent>
        {isLayer2 ? (
          <TextContent>
            {displayLongText(currentTransfer.toAddress)}
          </TextContent>
        ) : (
          <TextContent>
            <Link href={currentTransfer.recipientAddressUrl}>
              {displayLongText(currentTransfer.recipientAddressUrl)}
            </Link>
            <IonButton
              class="copy-button"
              onClick={async (e: never) =>
                copyData(currentTransfer.recipientAddressUrl, e)
              }
            >
              <IonIcon slot="icon-only" class="copy-icon" icon={copyOutline} />
            </IonButton>
          </TextContent>
        )}
      </DetailColumn>
      <Divider style={{ margin: '8px' }} />
      <DetailColumn>
        <h3>{t('Transaction')}</h3>
      </DetailColumn>
      {backendUpdated && (
        <DetailColumn>
          <TextContent>{'Nonce'}</TextContent>
        </DetailColumn>
      )}
      <DetailColumn>
        <TextContent>{t('Amount')}</TextContent>
        <h3>
          {currentTransfer.amount + ' ' + currentTransfer.currency.displayName}
        </h3>
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
        <TextContent>
          <TextContent>{`${t('GasFee')}`}</TextContent>
        </TextContent>
        <TextContent>{currentTransfer.feesPaid ?? 0}</TextContent>
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
        <h3>
          {currentTransfer.transferType === TransactionType.DEPOSIT
            ? currentTransfer.amount +
              ' ' +
              currentTransfer.currency.displayName
            : `${Big(currentTransfer.amount).add(
                currentTransfer.feesPaid ?? 0
              )} ${currentTransfer.currency.displayName}`}
        </h3>
      </DetailColumn>
    </IonContent>
  );
}
