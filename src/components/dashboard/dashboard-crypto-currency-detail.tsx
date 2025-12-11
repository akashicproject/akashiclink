import { type CryptoCurrencyWithName } from '@akashic/as-backend';
import { IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/react';
import { arrowDownOutline, arrowForwardOutline } from 'ionicons/icons';
import { type Dispatch, type SetStateAction, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { historyResetStackAndRedirect } from '../../routing/history';
import { useIsScopeAccessAllowed } from '../../utils/account';
import { formatAmountWithCommas } from '../../utils/formatAmountWithCommas';
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
  walletCurrency: CryptoCurrencyWithName;
}) {
  const { t } = useTranslation();
  const isSendAllowed = useIsScopeAccessAllowed('send');
  const isDepositAllowed = useIsScopeAccessAllowed('deposit');

  const { address } = useAccountL1Address(walletCurrency.coinSymbol);
  const { balance, balanceInUsd } = useCryptoCurrencyBalance(
    walletCurrency.coinSymbol,
    walletCurrency.tokenSymbol
  );
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
    setChain(walletCurrency.coinSymbol);
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

  const handleOnClickTxnHistoryItem = () => {
    historyResetStackAndRedirect(urls.activity);
    setIsModalOpen(false);
  };

  return (
    <IonGrid>
      <IonRow className={'ion-grid-row-gap-xxs'}>
        <IonCol size={'12'} className={'ion-text-align-center'}>
          <CryptoCurrencyIcon
            size={60}
            coinSymbol={walletCurrency.coinSymbol}
            tokenSymbol={walletCurrency.tokenSymbol}
          />
        </IonCol>
        <IonCol size={'12'}>
          <IonText>
            <p className="ion-text-size-xl ion-text-bold ion-text-align-center">
              {`${formatAmountWithCommas(balance ?? '0', 2)} ${walletCurrency.displayName}`}
            </p>
          </IonText>
        </IonCol>
        <IonCol size={'12'}>
          <IonText>
            <p className="ion-text-size-sm ion-text-color-grey ion-text-align-center">{`$${formatAmountWithCommas(balanceInUsd ?? '0')}`}</p>
          </IonText>
        </IonCol>
        <IonCol size={'10'} offset={'1'}>
          <CopyBox label={t('DepositAddress')} text={address ?? '-'} />
        </IonCol>
        <IonCol size={'5'} offset={'1'}>
          <PrimaryButton
            disabled={!isSendAllowed}
            expand="block"
            onClick={handleOnClickSend}
          >
            {t('Send')}
            <IonIcon slot="end" icon={arrowForwardOutline} />
          </PrimaryButton>
        </IonCol>
        <IonCol size={'5'}>
          <WhiteButton
            disabled={!isDepositAllowed}
            expand="block"
            onClick={handleOnClickDeposit}
          >
            {t('Deposit')}
            <IonIcon slot="end" icon={arrowDownOutline}></IonIcon>
          </WhiteButton>
        </IonCol>
        <IonCol size={'12'}>
          <TransactionHistoryList
            isFilterType
            isFilterNFT
            minHeight={'calc(80vh - 312px - var(--ion-safe-area-bottom))'}
            currency={walletCurrency}
            onClick={handleOnClickTxnHistoryItem}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
