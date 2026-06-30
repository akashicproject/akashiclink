import type { IBaseAcTransaction, Nitr0genApi } from '@akashic/nitr0gen';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BRIDGE_MESSAGE } from '../types/bridge-types';
import { responseErrorToSite, responseToSite } from '../utils/chrome';
import { useSignMessage } from '../utils/hooks/useSignMessage';
import { getNitr0genApi } from '../utils/nitr0gen/nitr0gen.utils';
import { SignTransactionContent } from './sign-transaction-content';

type OwnerInput = {
  $stream: string;
  add?: unknown;
  remove?: unknown;
  treasury?: unknown;
};

type PopupMessage = Record<string, string>;

const getOwnerInput = (transaction: IBaseAcTransaction) =>
  (transaction.$tx.$i as { owner?: OwnerInput }).owner;

const getOwnerMessage = (
  ownerInput: OwnerInput,
  content: string
): PopupMessage => ({
  identity: ownerInput.$stream,
  content,
});

const getTreasuryMessage = (
  transaction: IBaseAcTransaction,
  nitr0genApi: Nitr0genApi,
  t: (key: string) => string
): PopupMessage | undefined => {
  const ownerInput = getOwnerInput(transaction);
  const isTreasuryOtkContract =
    !!ownerInput &&
    nitr0genApi.isSecondaryOtkContract(transaction) &&
    ownerInput.treasury !== undefined &&
    ownerInput.treasury !== null;

  if (!isTreasuryOtkContract || !ownerInput) return undefined;

  const hasDefaultTreasuryThreshold = String(ownerInput.treasury) === '0';

  if (hasDefaultTreasuryThreshold && ownerInput.add) {
    return getOwnerMessage(ownerInput, t('Popup.AgreeToGenerateTreasuryKey'));
  }

  if (!ownerInput.add && !ownerInput.remove) {
    return getOwnerMessage(ownerInput, t('Popup.AgreeToSetMultisigThresholds'));
  }

  if (hasDefaultTreasuryThreshold && ownerInput.remove) {
    return getOwnerMessage(ownerInput, t('Popup.AgreeToRemoveTreasuryKey'));
  }

  return undefined;
};

const getOtkMessage = (
  transaction: IBaseAcTransaction,
  nitr0genApi: Nitr0genApi,
  t: (key: string) => string
): PopupMessage | undefined => {
  const treasuryMessage = getTreasuryMessage(transaction, nitr0genApi, t);
  if (treasuryMessage) return treasuryMessage;

  const ownerInput = getOwnerInput(transaction);
  if (!ownerInput) return undefined;

  const isRemoval = ownerInput.remove && !ownerInput.add;

  if (nitr0genApi.isCustomerServiceOtkUpdate(transaction)) {
    return getOwnerMessage(
      ownerInput,
      isRemoval
        ? t('Popup.AgreeToRemoveCustomerServiceKey')
        : t('Popup.AgreeToGenerateCustomerServiceKey')
    );
  }

  if (nitr0genApi.isSecondaryOtkUpdate(transaction)) {
    return getOwnerMessage(
      ownerInput,
      isRemoval
        ? t('Popup.AgreeToRemoveSecondaryKey')
        : t('Popup.AgreeToGenerateSecondaryKey')
    );
  }

  return undefined;
};

const getPopupMessage = (
  transaction: IBaseAcTransaction,
  nitr0genApi: Nitr0genApi,
  t: (key: string) => string
): PopupMessage => {
  const otkMessage = getOtkMessage(transaction, nitr0genApi, t);
  if (otkMessage) return otkMessage;

  const ownerInput = getOwnerInput(transaction);

  if (nitr0genApi.isAfxOnboardContract(transaction) && ownerInput) {
    return getOwnerMessage(ownerInput, t('Popup.AcceptTermsAndPrivacyPolicy'));
  }

  return {
    content: JSON.stringify(transaction, null, 2),
  };
};

export function SignTransaction() {
  const { t } = useTranslation();

  const [isProcessingRequest, setIsProcessingRequest] = useState(false);

  const [transaction, setTransaction] = useState<IBaseAcTransaction>();

  const [message, setMessage] = useState<Record<string, string>>();
  const signMessage = useSignMessage();

  const [id, setId] = useState<number>();

  useEffect(() => {
    (async () => {
      const url = new URL(window.location.href);
      const idParam = url.searchParams.get('id');
      const data = url.searchParams.get('data');
      if (!idParam || !data) {
        responseErrorToSite(new Error('Missing parameters'), Number(idParam));
        return;
      }
      if (idParam) setId(Number(idParam));
      const transaction = JSON.parse(
        decodeURIComponent(data)
      ) as IBaseAcTransaction;
      setTransaction(transaction);
      const nitr0genApi = await getNitr0genApi();
      setMessage(getPopupMessage(transaction, nitr0genApi, t));
    })();
    // The popup request is immutable for the lifetime of the popup window.
    // Re-running this effect can reopen the same signing flow while focus is trapped.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
