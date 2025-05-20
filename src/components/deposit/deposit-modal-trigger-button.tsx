import { IonIcon } from '@ionic/react';
import { arrowDownOutline } from 'ionicons/icons';
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { type DepositChainOption } from '../../utils/hooks/useAccountL1Address';
import { WhiteButton } from '../common/buttons';
import { DepositModal } from './deposit-modal';

export const DepositModalContext = createContext<{
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  chain: DepositChainOption | undefined;
  setChain: Dispatch<SetStateAction<DepositChainOption | undefined>>;
}>({
  step: 0,
  setStep: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  chain: undefined,
  setChain: () => {},
});

export function DepositModalTriggerButton() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [chain, setChain] = useState<DepositChainOption | undefined>();

  const modalRef = useRef<HTMLIonModalElement>(null);

  const contextValue = useMemo(
    () => ({
      step,
      setStep,
      isModalOpen,
      setIsModalOpen,
      chain,
      setChain,
    }),
    [step, isModalOpen, chain]
  );

  return (
    <DepositModalContext.Provider value={contextValue}>
      <WhiteButton expand="block" onClick={() => setIsModalOpen(true)}>
        {t('Deposit')}
        <IonIcon slot="end" icon={arrowDownOutline}></IonIcon>
      </WhiteButton>
      <DepositModal modal={modalRef} />
    </DepositModalContext.Provider>
  );
}
