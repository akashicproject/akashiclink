import { IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/react';
import { arrowDownOutline, arrowForwardOutline } from 'ionicons/icons';
import { type Dispatch, type SetStateAction, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { type IWalletCurrency } from '../../constants/currencies';
import { formatAmount } from '../../utils/formatAmount';
import { useAccountL1Address } from '../../utils/hooks/useAccountL1Address';
import { useCryptoCurrencyBalance } from '../../utils/hooks/useCryptoCurrencyBalance';
import TransactionHistoryList from '../activity/transaction-history-list';
import { PrimaryButton, WhiteButton } from '../common/buttons';
import { CryptoCurrencyIcon } from '../common/chain-icon/crypto-currency-icon';
import { CopyBox } from '../common/copy-box';
import { DepositModalContext } from '../deposit/deposit-modal-context-provider';
import { SendFormContext } from '../send/send-modal-context-provider';

export function DashboardCryptoCurrencyDetail({
  setIsModalOpen,
  walletCurrency,
}: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  walletCurrency: IWalletCurrency;
}) {
  const { t } = useTranslation();
  const { address } = useAccountL1Address(walletCurrency.chain);
  const { balance, balanceInUsd } = useCryptoCurrencyBalance(walletCurrency);
  const {
    setIsModalOpen: setIsDepositModalOpen,
    setChain,
    setStep: setDepositModalStep,
  } = useContext(DepositModalContext);
  const {
    setIsModalOpen: setIsSendModalOpen,
    setCurrency,
    setStep: setSendModalStep,
  } = useContext(SendFormContext);

  const handleOnClickDeposit = () => {
    setChain(walletCurrency.chain);
    setDepositModalStep(1);
    setIsDepositModalOpen(true);
    setIsModalOpen(false);
  };

  const handleOnClickSend = () => {
    setCurrency(walletCurrency);
    setSendModalStep(1);
    setIsSendModalOpen(true);
    setIsModalOpen(false);
  };

  return (
    <IonGrid>
      <IonRow className={'ion-grid-row-gap-xxs'}>
        <IonCol size={'12'} className={'ion-text-align-center'}>
          <CryptoCurrencyIcon size={60} currency={walletCurrency} />
        </IonCol>
        <IonCol size={'12'}>
          <IonText>
            <p className="ion-text-size-xl ion-text-bold ion-text-align-center">
              {`${formatAmount(balance ?? '0')} ${walletCurrency.chain}`}
            </p>
          </IonText>
        </IonCol>
        <IonCol size={'12'}>
          <IonText>
            <p className="ion-text-size-sm ion-text-color-grey ion-text-align-center">{`$${balanceInUsd.toFixed(2)}`}</p>
          </IonText>
        </IonCol>
        <IonCol size={'10'} offset={'1'}>
          <CopyBox label={t('DepositAddress')} text={address ?? '-'} />
        </IonCol>
        <IonCol size={'5'} offset={'1'}>
          <PrimaryButton expand="block" onClick={handleOnClickSend}>
            {t('Send')}
            <IonIcon slot="end" icon={arrowForwardOutline} />
          </PrimaryButton>
        </IonCol>
        <IonCol size={'5'}>
          <WhiteButton expand="block" onClick={handleOnClickDeposit}>
            {t('Deposit')}
            <IonIcon slot="end" icon={arrowDownOutline}></IonIcon>
          </WhiteButton>
        </IonCol>
        <IonCol size={'12'}>
          <TransactionHistoryList
            isFilterLayer
            isFilterType
            minHeight={'calc(80vh - 312px - var(--ion-safe-area-bottom))'}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
