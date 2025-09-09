import { datadogRum } from '@datadog/browser-rum';
import {
  type CoinSymbol,
  type CryptoCurrencySymbol,
  type CurrencySymbolWithNitr0genNative,
  FeeDelegationStrategy,
  type ITreasuryKeyNetworkThreshold,
  L2Regex,
  nitr0genNativeCoin,
} from '@helium-pay/backend';
import { getSdkError } from '@walletconnect/utils';
import { type Web3WalletTypes } from '@walletconnect/web3wallet';
import { useCallback, useEffect, useState } from 'react';

import {
  closePopup,
  ETH_METHOD,
  EXTENSION_ERROR,
  EXTENSION_EVENT,
  responseToSite,
  TYPED_DATA_PRIMARY_TYPE,
} from '../utils/chrome';
import { convertToSmallestUnit } from '../utils/currency';
import { AppError } from '../utils/error-utils';
import {
  useSendL1Transaction,
  useSendL2Transaction,
} from '../utils/hooks/nitr0gen';
import { useBecomeFxBp } from '../utils/hooks/useBecomeFxBp';
import { useGenerateSecondaryOtk } from '../utils/hooks/useGenerateSecondaryOtk';
import { useRemoveTreasuryOtk } from '../utils/hooks/useRemoveTreasuryOtk';
import { useSignAuthorizeActionMessage } from '../utils/hooks/useSignAuthorizeActionMessage';
import { useUpdateTreasuryOtk } from '../utils/hooks/useUpdateTreasuryOtk';
import {
  mapUSDTToTether,
  useVerifyTxnAndSign,
} from '../utils/hooks/useVerifyTxnAndSign';
import type { IAcTreasuryThresholds } from '../utils/nitr0gen/nitr0gen.interface';
import { useWeb3Wallet } from '../utils/web3wallet';
import { SignTypedDataContent } from './sign-typed-data-content';

export function SignTypedData() {
  const web3wallet = useWeb3Wallet();

  const [isProcessingRequest, setIsProcessingRequest] = useState(false);

  const [requestContent, setRequestContent] = useState({
    id: 0,
    method: '',
    topic: '',
    primaryType: '',
    message: {} as Record<string, string>,
    toSign: {} as { identity: string; expires: string } & Record<
      string,
      string | Record<string, string>
    >,
    secondaryOtk: {} as { oldPubKeyToRemove?: string; treasuryKey?: boolean },
    treasuryOtk: {} as {
      oldPubKeyToRemove?: string;
      networkThresholds?: ITreasuryKeyNetworkThreshold[];
    },
    response: {},
  });

  const signAuthorizeActionMessage = useSignAuthorizeActionMessage();
  const generateSecondaryOtk = useGenerateSecondaryOtk();
  const updateTreasuryOtk = useUpdateTreasuryOtk();
  const removeTreasuryOtk = useRemoveTreasuryOtk();
  const becomeFxBp = useBecomeFxBp();

  const verifyTxnAndSign = useVerifyTxnAndSign();
  const { trigger: triggerSendL2Transaction } = useSendL2Transaction();
  const { trigger: triggerSendL1Transaction } = useSendL1Transaction();

  const onSessionRequest = useCallback(
    async (event: Web3WalletTypes.SessionRequest) => {
      try {
        const { topic, params, id } = event;
        const { request } = params;

        if (request.method === ETH_METHOD.SIGN_TYPED_DATA) {
          const typedData = JSON.parse(request.params[1]);

          const { toSign, secondaryOtk, treasuryOtk, ...message } =
            typedData.message;

          setRequestContent({
            id,
            method: request.method,
            message: message,
            primaryType: typedData.primaryType,
            topic,
            toSign: toSign,
            secondaryOtk,
            treasuryOtk,
            response: {},
          });
        }
      } catch (e) {
        datadogRum.addError(e);
      }
    },
    []
  );

  const onSessionRequestExpire = useCallback(
    async (event: Web3WalletTypes.SessionRequestExpire) => {
      if (event.id === requestContent.id) {
        await responseToSite({
          method: ETH_METHOD.SIGN_TYPED_DATA,
          error: EXTENSION_ERROR.REQUEST_EXPIRED,
        });
        await closePopup();
      }
    },
    []
  );

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const acceptSessionRequest = async () => {
    const { topic, id, primaryType, toSign, secondaryOtk, treasuryOtk } =
      requestContent;

    try {
      let signedMsg = '';

      switch (primaryType) {
        case TYPED_DATA_PRIMARY_TYPE.AUTHORIZE_ACTION:
          signedMsg = await signAuthorizeActionMessage({
            ...toSign,
            identity: toSign.identity,
            expires: Number(toSign.expires),
          });
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
          if (!treasuryOtk.networkThresholds)
            throw new Error(AppError.NeedThresholds);

          let thresholds: IAcTreasuryThresholds | undefined;
          if (treasuryOtk.networkThresholds) {
            thresholds = {};
            for (const t of treasuryOtk.networkThresholds) {
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

      await web3wallet?.respondSessionRequest({
        topic,
        response: {
          id,
          jsonrpc: '2.0',
          result: signedMsg,
        },
      });

      // Need this setTimeout for respondSessionRequest to completely finish before closing itself
      setTimeout(() => {
        window.removeEventListener('beforeunload', onPopupClosed);
        closePopup();
      }, 100);
    } catch (e) {
      try {
        await web3wallet?.respondSessionRequest({
          topic,
          response: {
            id,
            jsonrpc: '2.0',
            error: getSdkError('INVALID_METHOD', (e as Error)?.message),
          },
        });
      } finally {
        console.warn('Failed to sign', e);
        datadogRum.addError(e);
        responseToSite({
          method: ETH_METHOD.SIGN_TYPED_DATA,
          error: EXTENSION_ERROR.UNKNOWN,
        });
        setTimeout(() => {
          window.removeEventListener('beforeunload', onPopupClosed);
          closePopup();
        }, 100);
      }
    }
  };
  const rejectSessionRequest = async () => {
    try {
      const { topic, id } = requestContent;

      await web3wallet?.respondSessionRequest({
        topic,
        response: {
          id,
          jsonrpc: '2.0',
          error: getSdkError('USER_REJECTED'),
        },
      });
    } catch (e) {
      datadogRum.addError(e);
    }
  };

  // Do NOT remove useCallback for removeEventListener to work
  const onPopupClosed = useCallback(() => {
    rejectSessionRequest();
    responseToSite({
      method: ETH_METHOD.SIGN_TYPED_DATA,
      event: EXTENSION_EVENT.USER_CLOSED_POPUP,
    });
  }, []);

  const onClickSign = async () => {
    setIsProcessingRequest(true);
    await acceptSessionRequest();
    setIsProcessingRequest(false);
  };

  const onClickReject = async () => {
    try {
      await rejectSessionRequest();
    } finally {
      setTimeout(() => {
        window.removeEventListener('beforeunload', onPopupClosed);
        closePopup();
      }, 100);
    }
  };

  useEffect(() => {
    const initRequestPopup = async () => {
      try {
        if (!web3wallet) {
          console.log('waiting for web3wallet to be ready');
          datadogRum.addAction('Signing popup: Waiting for web3wallet');
          return;
        }

        const activeSessions = web3wallet?.getActiveSessions();

        if (!activeSessions || Object.values(activeSessions).length === 0) {
          datadogRum.addError('Signing popup: activeSessions not found');
          await responseToSite({
            method: ETH_METHOD.SIGN_TYPED_DATA,
            error: EXTENSION_ERROR.WC_SESSION_NOT_FOUND,
          });
          setTimeout(() => {
            closePopup();
          }, 100);
          return;
        }

        //check for old requests
        const pendingSessionRequests = web3wallet?.getPendingSessionRequests();
        if (pendingSessionRequests && pendingSessionRequests.length > 1) {
          datadogRum.addError(
            'Signing popup: more than 1 pending requests are found'
          );
        }

        web3wallet.on('session_request', onSessionRequest);
        web3wallet.on('session_request_expire', onSessionRequestExpire);
        window.addEventListener('beforeunload', onPopupClosed);

        await responseToSite({
          method: ETH_METHOD.SIGN_TYPED_DATA,
          event: EXTENSION_EVENT.POPUP_READY,
        });
      } catch (e) {
        datadogRum.addError(e);
      }
    };
    initRequestPopup();

    return () => {
      if (!web3wallet) return;
      web3wallet?.off('session_request', onSessionRequest);
      web3wallet?.off('session_request_expire', onSessionRequestExpire);
      window.removeEventListener('beforeunload', onPopupClosed);
    };
  }, [onSessionRequest, web3wallet]);

  const isWaitingRequestContent = requestContent.method === '';

  return (
    <SignTypedDataContent
      isWaitingRequestContent={isWaitingRequestContent}
      requestContent={requestContent}
      isProcessingRequest={isProcessingRequest}
      onClickSign={onClickSign}
      onClickReject={onClickReject}
    />
  );
}
