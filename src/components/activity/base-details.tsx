import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import { TransactionStatus } from '@helium-pay/backend';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonImg,
  IonPopover,
} from '@ionic/react';
import { arrowForwardCircleOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { displayLongText } from '../../utils/long-text';
export const darkColor = {
  color: 'var(--ion-color-primary-10)',
  margin: 0,
};

export const DetailColumn = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxHeight: '20px',
});
export const TextContent = styled.div({
  display: 'flex',
  alignContent: 'center',
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '16px',
  ...darkColor,
});
export const Header = styled.h4(darkColor);
export const Link = styled.a(darkColor);
export function BaseDetails({
  currentTransfer,
}: {
  currentTransfer: ITransactionRecordForExtension;
}) {
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
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
        <Header>{t('Status')}</Header>
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
      {currentTransfer.txHash && currentTransfer.txHashUrl && (
        <DetailColumn>
          <Header>
            {t('txHash')} ({currentTransfer.coinSymbol})
          </Header>
          <TextContent style={{ display: 'flex', alignItems: 'center' }}>
            {displayLongText(currentTransfer.txHash)}
            <IonButton
              style={{ height: 'auto', width: '19px' }}
              className="copy-button"
              onClick={async (e: never) =>
                copyData(currentTransfer.txHashUrl || '', e)
              }
            >
              <IonIcon
                slot="icon-only"
                className="copy-icon"
                src={`/shared-assets/images/copy-icon-dark.svg`}
              />
              <IonPopover
                side="top"
                alignment="center"
                ref={popover}
                isOpen={popoverOpen}
                className={'copied-popover'}
                onDidDismiss={() => setPopoverOpen(false)}
              >
                <IonContent class="ion-padding">{t('Copied')}</IonContent>
              </IonPopover>
            </IonButton>
          </TextContent>
        </DetailColumn>
      )}
      <DetailColumn>
        <Header style={currentTransfer.txHash ? { color: '#B0A9B3' } : {}}>
          {t('txHash')} (AS)
        </Header>
        <TextContent
          style={{
            color: currentTransfer.txHash ? '#B0A9B3' : '',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {displayLongText(currentTransfer.l2TxnHash)}
          <IonButton
            style={{ height: '22px', width: '19px' }}
            className="copy-button"
            onClick={async (e: never) =>
              copyData(currentTransfer.l2TxnHashUrl, e)
            }
          >
            <IonIcon
              slot="icon-only"
              className="copy-icon"
              src={`/shared-assets/images/copy-icon-${
                currentTransfer.txHash ? 'light' : 'dark'
              }.svg`}
            />
            <IonPopover
              side="top"
              alignment="center"
              ref={popover}
              isOpen={popoverOpen}
              className={'copied-popover'}
              onDidDismiss={() => setPopoverOpen(false)}
            >
              <IonContent class="ion-padding">{t('Copied')}</IonContent>
            </IonPopover>
          </IonButton>
        </TextContent>
      </DetailColumn>
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <DetailColumn>
            <Header>{t('From')}</Header>
            <Header>{t('To')}</Header>
          </DetailColumn>
          <DetailColumn>
            <TextContent>
              <Link href={currentTransfer.internalSenderUrl}>
                {displayLongText(currentTransfer.fromAddress)}
              </Link>
            </TextContent>
            <IonIcon
              style={{ height: '24px', width: '24px', color: '#CCC4CF' }}
              icon={arrowForwardCircleOutline}
            />
            <TextContent>
              <Link href={currentTransfer.internalRecipientUrl}>
                {displayLongText(currentTransfer.toAddress)}
              </Link>
            </TextContent>
          </DetailColumn>
        </div>
      </div>
    </div>
  );
}
