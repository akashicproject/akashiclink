import { useEffect, useState } from 'react';

import { BRIDGE_MESSAGE } from '../types/bridge-types';
import { responseErrorToSite, responseToSite } from '../utils/chrome';
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

  const [id, setId] = useState<number>();

  useEffect(() => {
    const url = new URL(window.location.href);
    const idParam = url.searchParams.get('id');
    const method = url.searchParams.get('method');
    const data = url.searchParams.get('data');
    if (!idParam || !data || !method) {
      responseErrorToSite(new Error('Missing parameters'), Number(idParam));
      return;
    }
    if (idParam) setId(Number(idParam));
    let typedData: ITypedData | undefined;
    try {
      typedData = JSON.parse(decodeURIComponent(data));
    } catch (e) {
      responseErrorToSite(e, Number(idParam));
      return;
    }
    setTypedData(typedData);
  }, []);

  const onClickSign = async () => {
    try {
      setIsProcessingRequest(true);
      if (!typedData) throw new Error('Missing parameters');

      const { message } = typedData;
      const signedMsg = signMessage(message);

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
    <SignTypedDataContent
      typedData={typedData}
      isProcessingRequest={isProcessingRequest}
      onClickSign={onClickSign}
      onClickReject={onClickReject}
    />
  );
}
