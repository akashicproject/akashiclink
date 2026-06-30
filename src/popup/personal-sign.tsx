import { useEffect, useState } from 'react';

import { BRIDGE_MESSAGE } from '../types/bridge-types';
import { responseErrorToSite, responseToSite } from '../utils/chrome';
import { useSignMessage } from '../utils/hooks/useSignMessage';
import { PersonalSignContent } from './personal-sign-content';

export function PersonalSign() {
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);

  const [data, setData] = useState<Record<string, unknown>>();

  const [message, setMessage] = useState<string>('');
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

    let parsedData: Record<string, unknown>;
    try {
      parsedData = JSON.parse(decodeURIComponent(data));
    } catch (e) {
      responseErrorToSite(e, Number(idParam));
      return;
    }
    setData(parsedData);
    setMessage(parsedData.message as string);
  }, []);

  const onClickSign = async () => {
    try {
      if (!data) throw new Error('Missing parameters');
      setIsProcessingRequest(true);
      const signedMsg = signMessage(data);

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
    <PersonalSignContent
      message={message}
      isProcessingRequest={isProcessingRequest}
      onClickSign={onClickSign}
      onClickReject={onClickReject}
    />
  );
}
