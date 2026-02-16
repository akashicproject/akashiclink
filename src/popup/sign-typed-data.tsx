import {
  type CoinSymbol,
  type CryptoCurrencySymbol,
  type CurrencySymbolWithNitr0genNative,
  FeeDelegationStrategy,
  type ITreasuryKey,
  type ITreasuryKeyNetworkThreshold,
  L2Regex,
  nitr0genNativeCoin,
} from '@akashic/as-backend';
import { datadogRum } from '@datadog/browser-rum';
import { useEffect, useState } from 'react';

import { BRIDGE_MESSAGE } from '../types/bridge-types';
import { responseToSite, TYPED_DATA_PRIMARY_TYPE } from '../utils/chrome';
import { convertToSmallestUnit } from '../utils/currency';
import { AppError } from '../utils/error-utils';
import {
  useSendL1Transaction,
  useSendL2Transaction,
} from '../utils/hooks/nitr0gen';
import { useBecomeFxBp } from '../utils/hooks/useBecomeFxBp';
import { useGenerateSecondaryOtk } from '../utils/hooks/useGenerateSecondaryOtk';
import { useRemoveTreasuryOtk } from '../utils/hooks/useRemoveTreasuryOtk';
import { useSignMessage } from '../utils/hooks/useSignMessage';
import { useUpdateTreasuryOtk } from '../utils/hooks/useUpdateTreasuryOtk';
import {
  mapUSDTToTether,
  useVerifyTxnAndSign,
} from '../utils/hooks/useVerifyTxnAndSign';
import type { IAcTreasuryThresholds } from '../utils/nitr0gen/nitr0gen.interface';
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
  const generateSecondaryOtk = useGenerateSecondaryOtk();
  const updateTreasuryOtk = useUpdateTreasuryOtk();
  const removeTreasuryOtk = useRemoveTreasuryOtk();
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
  const acceptSessionRequest = async () => {
    if (!typedData) throw new Error('Missing parameters');

    const { primaryType, message, secondaryOtk, treasuryOtk, toSign } =
      typedData;
    try {
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
        case TYPED_DATA_PRIMARY_TYPE.GENERATE_SECONDARY_OTK:
          signedMsg = await generateSecondaryOtk(secondaryOtk);
          break;
        case TYPED_DATA_PRIMARY_TYPE.REMOVE_TREASURY_OTK:
          if (!treasuryOtk.oldPubKeyToRemove)
            throw new Error(AppError.NeedPubKey);
          signedMsg = await removeTreasuryOtk({
            oldPubKeyToRemove: treasuryOtk.oldPubKeyToRemove,
          });
          break;
        case TYPED_DATA_PRIMARY_TYPE.UPDATE_TREASURY_OTK:
          const treasuryOtkTyped = treasuryOtk as ITreasuryKey;
          if (!treasuryOtkTyped.networkThresholds)
            throw new Error(AppError.NeedThresholds);

          let thresholds: IAcTreasuryThresholds | undefined;
          if (treasuryOtkTyped.networkThresholds) {
            thresholds = {};
            for (const t of treasuryOtkTyped.networkThresholds) {
              // TODO: Fix casting
              thresholds[
                `${t.coinSymbol}.${t.tokenSymbol ? (mapUSDTToTether(t.coinSymbol, t.tokenSymbol) as CurrencySymbolWithNitr0genNative) : nitr0genNativeCoin}`
              ] =
                t.threshold !== '-1'
                  ? convertToSmallestUnit(
                      t.threshold,
                      t.coinSymbol,
                      t.tokenSymbol
                    )
                  : t.threshold;
            }
          }
          signedMsg = await updateTreasuryOtk({
            networkThresholds: thresholds,
          });
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

      responseToSite(BRIDGE_MESSAGE.APPROVAL_DECISION, id, true, signedMsg);
    } catch (e) {
      datadogRum.addError(e);
      responseToSite(
        BRIDGE_MESSAGE.APPROVAL_DECISION,
        id,
        false,
        undefined,
        e instanceof Error ? e.message : JSON.stringify(e)
      );
    }
  };
  const rejectSessionRequest = async () => {
    responseToSite(BRIDGE_MESSAGE.APPROVAL_DECISION, id, false);
  };

  const onClickSign = async () => {
    setIsProcessingRequest(true);
    await acceptSessionRequest();
    setIsProcessingRequest(false);
  };

  const onClickReject = async () => {
    await rejectSessionRequest();
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
