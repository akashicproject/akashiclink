import {
  type CoinSymbol,
  type CryptoCurrencySymbol,
  FeeDelegationStrategy,
  type ITreasuryKeyNetworkThreshold,
  L2Regex,
} from '@akashic/as-backend';
import { useEffect, useState } from 'react';

import { BRIDGE_MESSAGE } from '../types/bridge-types';
import { responseToSite, TYPED_DATA_PRIMARY_TYPE } from '../utils/chrome';
import { AppError } from '../utils/error-utils';
import {
  useSendL1Transaction,
  useSendL2Transaction,
} from '../utils/hooks/nitr0gen';
import { useBecomeFxBp } from '../utils/hooks/useBecomeFxBp';
import { useSignMessage } from '../utils/hooks/useSignMessage';
import { useVerifyTxnAndSign } from '../utils/hooks/useVerifyTxnAndSign';
import { SignTypedDataContent } from './sign-typed-data-content';

export interface ITypedData {
  types: {
    [key: string]: { name: string; type: string }[];
  };
  primaryType: string;
  message: { [key: string]: unknown };
  // @deprecated Additional fields for specific typed data actions
  secondaryOtk: { oldPubKeyToRemove?: string; treasuryKey?: boolean };
  treasuryOtk: {
    oldPubKeyToRemove?: string;
    networkThresholds?: ITreasuryKeyNetworkThreshold[];
  };
  toSign: { identity: string; expires: string } & Record<
    string,
    string | Record<string, string>
  >;
}

export function SignTypedData() {
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);

  const [typedData, setTypedData] = useState<ITypedData>();

  const signMessage = useSignMessage();
  const becomeFxBp = useBecomeFxBp();

  const verifyTxnAndSign = useVerifyTxnAndSign();
  const { trigger: triggerSendL2Transaction } = useSendL2Transaction();
  const { trigger: triggerSendL1Transaction } = useSendL1Transaction();
  const [id, setId] = useState<number>();

  useEffect(() => {
    const url = new URL(window.location.href);
    const idParam = url.searchParams.get('id');
    const method = url.searchParams.get('method');
    const data = url.searchParams.get('data');
    if (!idParam || !data || !method) {
      throw new Error('Missing parameters');
    }
    if (idParam) setId(Number(idParam));
    const typedData = JSON.parse(decodeURIComponent(data));
    setTypedData(typedData);
  }, []);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const onClickSign = async () => {
    try {
      setIsProcessingRequest(true);
      if (!typedData) throw new Error('Missing parameters');
      const { primaryType, message, toSign } = typedData;
      let signedMsg = '';

      switch (primaryType) {
        case 'CallbackUrl':
        case 'RetryCallback':
        case 'UpdateReferenceId':
        case 'SetupWhitelistIp':
        case 'DenyTransaction':
        case 'UpdateCallbackSettings':
          signedMsg = signMessage(message);
          break;
        case TYPED_DATA_PRIMARY_TYPE.BECOME_FX_BP:
          signedMsg = await becomeFxBp();
          break;
        case TYPED_DATA_PRIMARY_TYPE.PAYOUT: {
          // TODO: Fix all this casting
          const res = await verifyTxnAndSign(
            {
              userInputToAddress: toSign.addressInput as string,
              convertedToAddress: toSign.convertedToAddress as string,
              alias: toSign.alias as string,
              initiatedToL1LedgerId: toSign.keyLedgerId as string,
            },
            toSign.amount as string,
            toSign.chain as CoinSymbol,
            toSign.token as CryptoCurrencySymbol | undefined,
            FeeDelegationStrategy.Delegate, // Force-delegate AP payouts
            toSign.approvedStream as string,
            toSign.referenceId as string
          );

          const didUserInputL2Address = L2Regex.exec(
            toSign.addressInput as string
          );

          const { txn, signedTxn: signedTx } = res;

          const response =
            toSign.isL2 === 'true'
              ? await triggerSendL2Transaction({
                  ...txn,
                  signedTx,
                  initiatedToNonL2: !didUserInputL2Address
                    ? (toSign.addressInput as string)
                    : undefined,
                })
              : await triggerSendL1Transaction({
                  ...txn,
                  signedTx,
                });

          signedMsg = `0x${response.txHash}`;
          break;
        }
        default:
          throw new Error(AppError.InvalidMethod);
      }

      await responseToSite(
        BRIDGE_MESSAGE.APPROVAL_DECISION,
        id,
        true,
        signedMsg
      );
    } catch (e) {
      datadogRum.addError(e);
      await responseToSite(
        BRIDGE_MESSAGE.APPROVAL_DECISION,
        id,
        false,
        undefined,
        e instanceof Error ? e.message : JSON.stringify(e)
      );
    } finally {
      setIsProcessingRequest(false);
    }
  };

  const onClickReject = async () => {
    await responseToSite(BRIDGE_MESSAGE.APPROVAL_DECISION, id, false);
  };

  return (
    <SignTypedDataContent
      typedData={typedData}
      isProcessingRequest={isProcessingRequest}
      onClickSign={onClickSign}
      onClickReject={onClickReject}
    />
  );
}
