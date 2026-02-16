import { datadogRum } from '@datadog/browser-rum';
import { useEffect, useState } from 'react';

import { BRIDGE_MESSAGE } from '../types/bridge-types';
import { responseToSite, TYPED_DATA_PRIMARY_TYPE } from '../utils/chrome';
import { AppError } from '../utils/error-utils';
import { useBecomeFxBp } from '../utils/hooks/useBecomeFxBp';
import { useSignMessage } from '../utils/hooks/useSignMessage';
import { SignTypedDataContent } from './sign-typed-data-content';

export interface ITypedData {
  types: {
    [key: string]: { name: string; type: string }[];
  };
  primaryType: string;
  message: { [key: string]: unknown };
}

export function SignTypedData() {
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);

  const [typedData, setTypedData] = useState<ITypedData>();

  const signMessage = useSignMessage();
  const becomeFxBp = useBecomeFxBp();

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
      const { primaryType, message } = typedData;
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
