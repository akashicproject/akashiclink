import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import { TransactionStatus } from '@helium-pay/backend';
import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import { arrowForwardCircleOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
export function NftDetail({
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
        <Header>{t('txHash')}</Header>
        <TextContent>
          {displayLongText(currentTransfer.l2TxnHash)}
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
        </TextContent>
      </DetailColumn>
      <DetailColumn>
        <Header>{t('From')}</Header>
        <Header>{t('To')}</Header>
      </DetailColumn>
      <DetailColumn>
        <TextContent>
          {displayLongText(currentTransfer.fromAddress)}
        </TextContent>

        <TextContent>
          <IonIcon icon={arrowForwardCircleOutline} />
        </TextContent>
        <TextContent>{displayLongText(currentTransfer.toAddress)}</TextContent>
      </DetailColumn>
    </>
  );
}
