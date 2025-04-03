import { IonCol, IonRow } from '@ionic/react';
import { getSdkError } from '@walletconnect/utils';
import { type Web3WalletTypes } from '@walletconnect/web3wallet';
import { useCallback, useEffect, useState } from 'react';
import { hexToString } from 'viem';

import { BorderedBox } from '../components/common/box/border-box';
import { PurpleButton } from '../components/common/buttons';
import { List } from '../components/common/list/list';
import { ListVerticalLabelValueItem } from '../components/common/list/list-vertical-label-value-item';
import { PopupLayout } from '../components/page-layout/popup-layout';
import {
  closePopup,
  ETH_METHOD,
  EXTENSION_ERROR,
  EXTENSION_EVENT,
  responseToSite,
} from '../utils/chrome';
import { useSignBecomeBpMessage } from '../utils/hooks/useSignBecomeBpMessage';
import { useWeb3Wallet } from '../utils/web3wallet';

export function SignMessage() {
  const searchParams = new URLSearchParams(window.location.search);

  const web3wallet = useWeb3Wallet();

  const [requestContent, setRequestContent] = useState({
    id: 0,
    method: '',
    message: '',
    topic: '',
    response: {},
  });

  const signBecomeBpMessage = useSignBecomeBpMessage();

  const onSessionRequest = useCallback(
    async (event: Web3WalletTypes.SessionRequest) => {
      const { topic, params, id } = event;
      const { request } = params;
      const requestParamsMessage = request.params[0];
      const message = hexToString(requestParamsMessage);

      setRequestContent({
        id,
        message,
        method: request.method,
        topic,
        response: {},
      });
    },
    []
  );

  // Handle when sessions expires (indefinite without specifying)
  const onSessionRequestExpire = useCallback(async () => {
    await closePopup();
  }, []);

  const acceptSessionRequest = async () => {
    const { topic, id } = requestContent;

    try {
      // TODO: sign message here
      const signedMsg = await signBecomeBpMessage();

      await web3wallet?.respondSessionRequest({
        topic,
        response: {
          id,
          jsonrpc: '2.0',
          result: signedMsg, // TODO: pass out signed message here, must start with 0x
        },
      });
    } catch (e) {
      await web3wallet?.respondSessionRequest({
        topic,
        response: {
          id,
          jsonrpc: '2.0',
          error: getSdkError('INVALID_METHOD'),
        },
      });
    }
  };
  const rejectSessionRequest = async () => {
    const { topic, id } = requestContent;

    await web3wallet?.respondSessionRequest({
      topic,
      response: {
        id,
        jsonrpc: '2.0',
        error: getSdkError('USER_REJECTED'),
      },
    });
  };

  // Do NOT remove useCallback for removeEventListener to work
  const onPopupClosed = useCallback(() => {
    rejectSessionRequest();
    responseToSite({
      event: EXTENSION_EVENT.USER_CLOSED_POPUP,
      method: ETH_METHOD.PERSONAL_SIGN,
    });
  }, []);

  const onClickSign = async () => {
    window.removeEventListener('beforeunload', onPopupClosed);
    await acceptSessionRequest();
    await closePopup();
  };

  const onClickReject = async () => {
    window.removeEventListener('beforeunload', onPopupClosed);
    await rejectSessionRequest();
    await closePopup();
  };

  useEffect(() => {
    if (!web3wallet) {
      return;
    }
    const activeSessions = web3wallet?.getActiveSessions();

    if (!activeSessions || Object.values(activeSessions).length === 0) {
      // TODO: perhaps an error page?
      responseToSite({
        method: ETH_METHOD.PERSONAL_SIGN,
        error: EXTENSION_ERROR.WC_SESSION_NOT_FOUND,
      });
      closePopup();
      return;
    }

    responseToSite({
      method: ETH_METHOD.PERSONAL_SIGN,
      event: EXTENSION_EVENT.POPUP_READY,
    });

    web3wallet.on('session_request', onSessionRequest);
    web3wallet.on('session_request_expire', onSessionRequestExpire);
    window.addEventListener('beforeunload', onPopupClosed);

    return () => {
      web3wallet?.off('session_request', onSessionRequest);
      window.removeEventListener('beforeunload', onPopupClosed);
    };
  }, [onSessionRequest, web3wallet]);

  return (
    <PopupLayout>
      <IonRow>
        <IonCol size={'12'}>
          <h1 className="ion-justify-content-center ion-margin-top-lg ion-margin-bottom-xs">
            Sign Message Request
          </h1>
          <BorderedBox lines="full" className={'ion-margin-top-lg'}>
            <h4 className="w-100 ion-justify-content-center ion-margin-top-lg ion-margin-bottom-lg">
              {`${searchParams.get('appName') ?? ''} - ${
                searchParams.get('appUrl') ?? ''
              }`}
            </h4>
          </BorderedBox>
          <h4 className="ion-justify-content-center ion-margin-top-lg ion-margin-bottom-lg">
            This site is requesting to sign a message
          </h4>
        </IonCol>
        <IonCol size={'12'}>
          <List bordered lines={'none'}>
            <ListVerticalLabelValueItem
              label={'Message'}
              value={
                requestContent.message === '' ? '-' : requestContent.message
              }
            />
            <ListVerticalLabelValueItem
              label={'Chain ID'}
              value={searchParams.get('chain') ?? '11'}
            />
          </List>
        </IonCol>
      </IonRow>
      <IonRow className={'ion-margin-top-auto'}>
        <IonCol size={'6'}>
          <PurpleButton
            expand="block"
            disabled={requestContent.message === ''}
            onClick={onClickReject}
          >
            Reject
          </PurpleButton>
        </IonCol>
        <IonCol size={'6'}>
          <PurpleButton
            expand="block"
            disabled={requestContent.message === ''}
            onClick={onClickSign}
          >
            Accept
          </PurpleButton>
        </IonCol>
      </IonRow>
    </PopupLayout>
  );
}
