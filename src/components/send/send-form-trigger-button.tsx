import { IonIcon } from '@ionic/react';
import { arrowForwardOutline } from 'ionicons/icons';
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../common/buttons';
import { type SendConfirmationTxnsDetail } from './send-form/types';
import { SendFormModal } from './send-form-modal';

export const SendFormContext = createContext<{
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
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
  setStep: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  isModalLock: false,
  setIsModalLock: () => {},
  sendConfirm: undefined,
  setSendConfirm: () => {},
});

export function SendFormTriggerButton() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLock, setIsModalLock] = useState(false);
  const [sendConfirm, setSendConfirm] = useState<
    SendConfirmationTxnsDetail | undefined
  >(undefined);
  const [step, setStep] = useState(0);
  const modalRef = useRef<HTMLIonModalElement>(null);

  const contextValue = useMemo(
    () => ({
      step,
      setStep,
      isModalOpen,
      setIsModalOpen,
      isModalLock,
      setIsModalLock,
      sendConfirm,
      setSendConfirm,
    }),
    [step, isModalOpen, sendConfirm, isModalLock]
  );

  return (
    <SendFormContext.Provider value={contextValue}>
      <PrimaryButton expand="block" onClick={() => setIsModalOpen(true)}>
        {t('Send')}
        <IonIcon slot="end" icon={arrowForwardOutline} />
      </PrimaryButton>
      <SendFormModal modal={modalRef} />
    </SendFormContext.Provider>
  );
}
