import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useMemo,
  useRef,
  useState,
} from 'react';

import { type DepositChainOption } from '../../utils/hooks/useAccountL1Address';
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

export function DepositModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
      {children}
      <DepositModal modal={modalRef} />
    </DepositModalContext.Provider>
  );
}
