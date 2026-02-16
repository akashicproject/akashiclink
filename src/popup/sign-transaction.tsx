import type { IBaseAcTransaction } from '@akashic/as-backend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BRIDGE_MESSAGE } from '../types/bridge-types';
import { responseErrorToSite, responseToSite } from '../utils/chrome';
import { useSignMessage } from '../utils/hooks/useSignMessage';
import {
  isAfxOnboardContract,
  isSecondaryOtkUpdate,
  isTreasuryOtkAddition,
  isTreasuryOtkRemoval,
  isTreasuryThresholdUpdateOnly,
} from '../utils/nitr0gen/nitr0gen-api';
import { SignTransactionContent } from './sign-transaction-content';

export function SignTransaction() {
  const { t } = useTranslation();

  const [isProcessingRequest, setIsProcessingRequest] = useState(false);

  const [transaction, setTransaction] = useState<IBaseAcTransaction>();

  const [message, setMessage] = useState<Record<string, string>>();
  const signMessage = useSignMessage();

  const [id, setId] = useState<number>();

  useEffect(() => {
    const url = new URL(window.location.href);
    const idParam = url.searchParams.get('id');
    const data = url.searchParams.get('data');
    if (!idParam || !data) {
      responseErrorToSite(new Error('Missing parameters'), Number(idParam));
      return;
    }
    if (idParam) setId(Number(idParam));
    const transaction: IBaseAcTransaction = JSON.parse(
      decodeURIComponent(data)
    );
    setTransaction(transaction);
    if (isSecondaryOtkUpdate(transaction)) {
      // Secondary OTK addition
      setMessage({
        identity: transaction.$tx.$i.owner.$stream,
        content: t('Popup.AgreeToGenerateSecondaryKey'),
      });
    } else if (isTreasuryOtkAddition(transaction)) {
      // Treasury OTK addition
      setMessage({
        identity: transaction.$tx.$i.owner.$stream,
        content: t('Popup.AgreeToGenerateTreasuryKey'),
      });
    } else if (isTreasuryThresholdUpdateOnly(transaction)) {
      // Treasury Threshold update
      setMessage({
        identity: transaction.$tx.$i.owner.$stream,
        content: t('Popup.AgreeToSetMultisigThresholds'),
      });
    } else if (isTreasuryOtkRemoval(transaction)) {
      // Treasury OTK removal
      setMessage({
        identity: transaction.$tx.$i.owner.$stream,
        content: t('Popup.ConfirmationToDisableMultisig'),
      });
    } else if (isAfxOnboardContract(transaction)) {
      // AfxOnboard contract
      setMessage({
        identity: transaction.$tx.$i.owner.$stream,
        content: t('Popup.AcceptTermsAndPrivacyPolicy'),
      });
    } else {
      // Unknown transaction type
      setMessage({
        content: JSON.stringify(transaction, null, 2),
      });
    }
  }, []);

  const onClickSign = async () => {
    try {
      if (!transaction) throw new Error('Missing parameters');
      setIsProcessingRequest(true);
      const signedMsg = signMessage(transaction.$tx);

      await responseToSite(
        BRIDGE_MESSAGE.APPROVAL_DECISION,
        id,
        true,
        signedMsg
      );
    } catch (e) {
      responseErrorToSite(e, id);
    } finally {
      setIsProcessingRequest(false);
    }
  };

  const onClickReject = async () => {
    await responseToSite(BRIDGE_MESSAGE.APPROVAL_DECISION, id, false);
  };

  return (
    <SignTransactionContent
      message={message}
      isProcessingRequest={isProcessingRequest}
      onClickSign={onClickSign}
      onClickReject={onClickReject}
    />
  );
}
