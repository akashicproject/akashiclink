import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import {
  TransactionLayer,
  TransactionStatus,
  TransactionType,
} from '@helium-pay/backend';
import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import Big from 'big.js';
import { arrowForwardCircleOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider } from '../../pages/activity';
import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { displayLongText } from '../../utils/long-text';

const darkColor = {
  color: 'var(--ion-color-primary-dark)',
};
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
  ...darkColor,
});
const Header = styled.h4(darkColor);
const Header3 = styled.h3(darkColor);
const Link = styled.a(darkColor);

export function TransactionDetails({
  currentTransfer,
}: {
  currentTransfer: ITransactionRecordForExtension;
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

  // TODO: once backend transaction are fetching:
  // - nonce
  // - gas limit
  // - GasLimit
  // - GasUsed
  // - PriorityFee
  // - MaxFeePerGas
  // Remove this
  const backendUpdated = false;

  const displayChainName = (
    currentTransfer: ITransactionRecordForExtension
  ) => {
    if (!currentTransfer?.currency?.chain) return;
    if (currentTransfer.layer === TransactionLayer.L2)
      return t('Chain.AkashicChain');
    return t(`Chain.${currentTransfer.currency.chain.toUpperCase()}`);
  };
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
    <>
      <DetailColumn>
        <Header>{t('Status')}</Header>
        <TextContent>{statusString(currentTransfer.status)}</TextContent>
      </DetailColumn>
      <DetailColumn>
        <Header>{t('Chain.Title')}</Header>
        <TextContent>{displayChainName(currentTransfer)}</TextContent>
      </DetailColumn>
      <DetailColumn>
        <Header>{t('txHash')}</Header>
        <TextContent>
          {isLayer2 ? (
            displayLongText(currentTransfer.txHash)
          ) : (
            <>
              <Link href={currentTransfer.txHashUrl}>
                {displayLongText(currentTransfer.txHash)}
              </Link>
              <IonButton
                style={{ height: '22px', width: '19px' }}
                class="copy-button"
                onClick={async (e: never) =>
                  copyData(currentTransfer.l2TxnHashUrl, e)
                }
              >
                <IonIcon
                  slot="icon-only"
                  class="copy-icon"
                  src={`/shared-assets/images/copy-icon-dark.svg`}
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
        <Header>{t('From')}</Header>
        <Header>{t('To')}</Header>
      </DetailColumn>
      <DetailColumn>
        {isLayer2 ? (
          <TextContent>
            {displayLongText(currentTransfer.fromAddress)}
          </TextContent>
        ) : (
          <TextContent>
            <Link href={currentTransfer.senderAddressUrl}>
              {displayLongText(currentTransfer.fromAddress)}
            </Link>
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
              {displayLongText(currentTransfer.toAddress)}
            </Link>
          </TextContent>
        )}
      </DetailColumn>
      <Divider style={{ margin: '8px' }} />
      <DetailColumn>
        <Header3>{t('Transaction')}</Header3>
      </DetailColumn>
      {backendUpdated && (
        <DetailColumn>
          <TextContent>{'Nonce'}</TextContent>
        </DetailColumn>
      )}
      {currentTransfer.transferType === TransactionType.WITHDRAWAL && (
        <DetailColumn>
          <TextContent>{t('InternalFee')}</TextContent>
          <Header3>{currentTransfer.internalFee?.withdraw}</Header3>
        </DetailColumn>
      )}
      <DetailColumn>
        <TextContent>{t('Amount')}</TextContent>
        <Header3>
          {currentTransfer.amount +
            ' ' +
            currentTransfer?.currency?.displayName}
        </Header3>
      </DetailColumn>
      {backendUpdated && (
        <>
          <DetailColumn>
            <TextContent>{`${t('GasLimit')} (${t('Units')})`}</TextContent>
          </DetailColumn>
          <DetailColumn>
            <TextContent>{`${t('GasUsed')} (${t('Units')})`}</TextContent>
          </DetailColumn>
        </>
      )}
      {currentTransfer.transferType === TransactionType.DEPOSIT || isLayer2 ? (
        <></>
      ) : (
        <DetailColumn>
          <TextContent>
            <TextContent>{`${t('GasFee')}`}</TextContent>
          </TextContent>
          <TextContent>{currentTransfer.feesPaid ?? 0}</TextContent>
        </DetailColumn>
      )}
      {backendUpdated && (
        <>
          <DetailColumn>
            <TextContent>{t('PriorityFee')}</TextContent>
          </DetailColumn>
          <DetailColumn>
            <TextContent>{`${t('Total')} ${t('GasFee')}`}</TextContent>
          </DetailColumn>
          <DetailColumn>
            <TextContent>{t('MaxFeePerGas')}</TextContent>
          </DetailColumn>
        </>
      )}
      <DetailColumn style={{ marginTop: '20px' }}>
        <TextContent>{'Total'}</TextContent>
        <Header3>
          {currentTransfer.transferType === TransactionType.DEPOSIT
            ? currentTransfer.amount +
              ' ' +
              currentTransfer?.currency?.displayName
            : `${Big(currentTransfer.amount).add(
                currentTransfer.feesPaid ?? 0
              )} ${currentTransfer?.currency?.displayName}`}
        </Header3>
      </DetailColumn>
      {isLayer2 && currentTransfer.initiatedToL1Address ? (
        <>
          <Divider style={{ margin: '8px' }} />
          <DetailColumn style={{ marginTop: '20px' }}>
            <Header>{t('Remark')}</Header>
            <TextContent>
              {t('SentTo')}
              {': '}
              {displayLongText(currentTransfer.initiatedToL1Address)}
            </TextContent>
          </DetailColumn>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
