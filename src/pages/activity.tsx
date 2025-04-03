import './activity.css';

import styled from '@emotion/styled';
import { TransactionResult, TransactionStatus } from '@helium-pay/backend';
import type { ITransactionRecordForTable } from '@helium-pay/owners/src/components/tables/formatter';
import { transferToTableFormat } from '@helium-pay/owners/src/components/tables/formatter';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import dayjs from 'dayjs';
import { copyOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoggedLayout } from '../components/layout/loggedLayout';
import { useTransfersMe } from '../utils/hooks/useTransfersMe';

const MainWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '24px',
  marginTop: '30px',
});

const OneTransfer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  gap: '16px',
  height: '100px',
});

const Divider = styled.div({
  boxSizing: 'border-box',
  height: '2px',
  border: '1px solid #D9D9D9',
  width: '100%',
});

const ActivityWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  alignContent: 'center',
  padding: '0',
  gap: '12px',
  height: '40px',
});

const TimeWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  width: '122px',
  height: '40px',
  fontSize: '10px',
  lineHeight: '16px',
  fontWeight: 400,
  fontFamily: 'Nunito Sans',
  color: '#290056',
});

const Type = styled.div({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3px 8px',
  gap: '45px',
  width: '122px',
  height: '23px',
  border: '1px solid #958E99',
  borderRadius: '8px 8px 0px 0px',
});

const Time = styled.div({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  alignContent: 'center',
  padding: '3px 8px',
  gap: '45px',
  width: '122px',
  height: '18px',
  border: '1px solid #958E99',
  borderRadius: '0px 0px 8px 8px',
});

const Chain = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0px',
  gap: '8px',
  width: '100px',
  height: '40px',
  background: '#7444B6',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 700,
  fontFamily: 'Nunito Sans',
  color: '#FFFFFF',
});

const Amount = styled.div({
  boxSizing: 'border-box',
  border: '1px solid #958E99',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: '6px 16px',
  width: '100%',
  height: '80px',
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 700,
  fontFamily: 'Nunito Sans',
  color: '#290056',
});

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
  color: '#290056',
});

const TextTitle = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: '#290056',
});

export function Activity() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTransfer, setCurrentTransfer] =
    useState<ITransactionRecordForTable>();
  const [transferParams, _] = useState({
    startDate: dayjs().subtract(1, 'month').toDate(),
    endDate: dayjs().toDate(),
  });
  const { transfers } = useTransfersMe(transferParams);
  const formatTransfers: ITransactionRecordForTable[] = [];
  transfers.forEach((transfer, id) => {
    const unpackedTransfer = transferToTableFormat(transfer, id);
    if (unpackedTransfer !== undefined) formatTransfers.push(unpackedTransfer);
  });

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

  const resultString = (result: string | undefined) => {
    if (result === TransactionResult.FAILURE) return t('Failure');
    else return t('Success');
  };

  const longText = (long: string | undefined) => {
    if (long && long.length > 15) {
      return long.slice(0, 10) + '...' + long.slice(-5);
    }
  };
  return (
    <LoggedLayout>
      <MainWrapper>
        {formatTransfers.map((transfer) => (
          <OneTransfer
            key={transfer.id}
            onClick={() => {
              setIsOpen(true);
              setCurrentTransfer(transfer);
            }}
          >
            <ActivityWrapper>
              <TimeWrapper>
                <Type>{transfer.transferType}</Type>
                <Time>
                  {/** TODO: t('Locale') is not correctly recognised as string - maybe be fixed in the translations refactor */}
                  {transfer.timestamp.toLocaleString(t('Locale') as string, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                  })}
                </Time>
              </TimeWrapper>
              <Chain>{transfer.currency.displayName}</Chain>
            </ActivityWrapper>
            <Amount>{transfer.amount}</Amount>
            <Divider />
          </OneTransfer>
        ))}
        <IonModal isOpen={isOpen}>
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
            <TransferDetail>
              <DetailColumn>
                <TextTitle>{t('Status')}</TextTitle>
                <TextContent>
                  {statusString(currentTransfer?.status)}
                </TextContent>
              </DetailColumn>
              <DetailColumn>
                <TextTitle>{t('Result')}</TextTitle>
                <TextContent>
                  {resultString(currentTransfer?.result)}
                </TextContent>
              </DetailColumn>
              <DetailColumn>
                <TextTitle>{t('txHash')}</TextTitle>
                <TextContent>
                  {t('CopyTxHash')}
                  <IonButton
                    class="copy-button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        currentTransfer?.txHash ?? ''
                      )
                    }
                  >
                    <IonIcon
                      slot="icon-only"
                      class="copy-icon"
                      icon={copyOutline}
                    />
                  </IonButton>
                </TextContent>
              </DetailColumn>
              <DetailColumn>
                <TextTitle>{t('From')}</TextTitle>
                <TextContent>
                  {longText(currentTransfer?.senderAddressUrl)}
                </TextContent>
              </DetailColumn>
              <DetailColumn>
                <TextTitle>{t('To')}</TextTitle>
                <TextContent>
                  {longText(currentTransfer?.recipientAddressUrl)}
                </TextContent>
              </DetailColumn>
              <DetailColumn>
                <TextTitle>{'Gas ' + t('Fee')}</TextTitle>
                <TextContent>{currentTransfer?.feesPaid}</TextContent>
              </DetailColumn>
              <DetailColumn style={{ marginTop: '50px' }}>
                <TextContent>{t('Amount')}</TextContent>
                <TextTitle>
                  {currentTransfer?.amount +
                    ' ' +
                    currentTransfer?.currency.displayName}
                </TextTitle>
              </DetailColumn>
            </TransferDetail>
          </IonContent>
        </IonModal>
      </MainWrapper>
    </LoggedLayout>
  );
}
