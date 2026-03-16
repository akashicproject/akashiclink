import { FeeDelegationStrategy } from '@akashic/as-backend';
import type { CoinSymbol, CryptoCurrencySymbol } from '@akashic/core-lib';
import { useContext, useEffect, useState } from 'react';

import { SendFormContext } from '../components/send/send-modal-context-provider';
import { SUPPORTED_CURRENCIES_WITH_NAMES } from '../constants/currencies';
import { responseErrorToSite } from '../utils/chrome';
import { useAccountMe } from '../utils/hooks/useAccountMe';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import { useVerifyTxnAndSign } from '../utils/hooks/useVerifyTxnAndSign';
import { SendTransactionContent } from './send-transaction-content';

export interface ISendTransactionData {
  identity: string;
  coinSymbol: CoinSymbol;
  toAddress: string;
  amount: string;
  tokenSymbol?: CryptoCurrencySymbol;
  addressInput: string;
  alias?: string;
  isL2?: boolean;
  approvedStream?: string;
  referenceId?: string;
  keyLedgerId?: string;
}

export function SendTransaction() {
  const [sendTransactionData, setSendTransactionData] =
    useState<ISendTransactionData>();

  const verifyTxnAndSign = useVerifyTxnAndSign();
  const [id, setId] = useState<number>();
  const { setSendConfirm, setCurrency, step } = useContext(SendFormContext);
  const { activeAccount, cacheOtk } = useAccountStorage();
  const { data: account } = useAccountMe();

  useEffect(() => {
    const url = new URL(window.location.href);
    const idParam = url.searchParams.get('id');
    const method = url.searchParams.get('method');
    const data = url.searchParams.get('data');
    if (!idParam || !data || !method) {
      responseErrorToSite(new Error('Missing parameters'), Number(idParam));
      return;
    }
    setId(Number(idParam));
    let parsed: ISendTransactionData | undefined;
    try {
      parsed = JSON.parse(decodeURIComponent(data));
    } catch (e) {
      responseErrorToSite(e, Number(idParam));
      return;
    }
    setSendTransactionData(parsed);
  }, []);

  useEffect(() => {
    // only do this in the confirmation step
    if (
      step === 3 ||
      !sendTransactionData ||
      !activeAccount ||
      !account ||
      !cacheOtk
    ) {
      return;
    }

    const handleSendTransaction = async () => {
      try {
        const currency = SUPPORTED_CURRENCIES_WITH_NAMES.find(
          (c) =>
            c.coinSymbol === sendTransactionData.coinSymbol &&
            (sendTransactionData.tokenSymbol
              ? c.tokenSymbol === sendTransactionData.tokenSymbol
              : true)
        );
        if (currency) setCurrency(currency);

        const res = await verifyTxnAndSign(
          {
            userInputToAddress: sendTransactionData.addressInput,
            convertedToAddress: sendTransactionData.toAddress,
            alias: sendTransactionData.alias,
            initiatedToL1LedgerId: sendTransactionData.keyLedgerId,
          },
          sendTransactionData.amount,
          sendTransactionData.coinSymbol,
          sendTransactionData.tokenSymbol,
          FeeDelegationStrategy.Delegate,
          sendTransactionData.approvedStream,
          sendTransactionData.referenceId
        );
        setSendConfirm({
          txn: res.txn,
          signedTxn: res.signedTxn,
          delegatedFee: res.delegatedFee,
          isFirstTimeInteractionWithAddress:
            res.isFirstTimeInteractionWithAddress,
          validatedAddressPair: {
            userInputToAddress: sendTransactionData.addressInput,
            convertedToAddress: sendTransactionData.toAddress,
            alias: sendTransactionData.alias,
            isL2: sendTransactionData.isL2,
          },
          amount: sendTransactionData.amount,
        });
      } catch (e) {
        await responseErrorToSite(e, id);
      }
    };

    handleSendTransaction();
  }, [activeAccount, cacheOtk, account, sendTransactionData]);

  return <SendTransactionContent />;
}
