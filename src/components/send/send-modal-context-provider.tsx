import { type CryptoCurrencyWithName } from '@helium-pay/backend';
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useMemo,
  useRef,
  useState,
} from 'react';

import { SUPPORTED_CURRENCIES_WITH_NAMES } from '../../constants/currencies';
import type { SendConfirmationTxnsDetail } from './send-form/types';
import { SendFormModal } from './send-form-modal';

export const SendFormContext = createContext<{
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  currency: CryptoCurrencyWithName;
  setCurrency: Dispatch<SetStateAction<CryptoCurrencyWithName>>;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  isModalLock: boolean;
  setIsModalLock: Dispatch<SetStateAction<boolean>>;
  sendConfirm?: SendConfirmationTxnsDetail;
  setSendConfirm: Dispatch<
    SetStateAction<SendConfirmationTxnsDetail | undefined>
  >;
}>({
  step: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setStep: () => {},
  currency: SUPPORTED_CURRENCIES_WITH_NAMES[0],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrency: () => {},
  isModalOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsModalOpen: () => {},
  isModalLock: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsModalLock: () => {},
  sendConfirm: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSendConfirm: () => {},
});

export function SendFormContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLock, setIsModalLock] = useState(false);
  const [sendConfirm, setSendConfirm] = useState<
    SendConfirmationTxnsDetail | undefined
  >(undefined);
  const [step, setStep] = useState(0);
  const [currency, setCurrency] = useState<CryptoCurrencyWithName>(
    SUPPORTED_CURRENCIES_WITH_NAMES[0]
  );
  const modalRef = useRef<HTMLIonModalElement>(null);

  const contextValue = useMemo(
    () => ({
      step,
      setStep,
      currency,
      setCurrency,
      isModalOpen,
      setIsModalOpen,
      isModalLock,
      setIsModalLock,
      sendConfirm,
      setSendConfirm,
    }),
    [step, isModalOpen, currency, sendConfirm, isModalLock]
  );

  return (
    <SendFormContext.Provider value={contextValue}>
      {children}
      <SendFormModal modal={modalRef} />
    </SendFormContext.Provider>
  );
}
