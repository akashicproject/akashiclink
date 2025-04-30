import { type MouseEvent, useContext } from 'react';

import { type DepositChainOption } from '../../utils/hooks/useAccountL1Address';
import { IconButton } from '../common/buttons';
import { CopyIcon } from '../common/icons/copy-icon';
import { DepositModalContext } from '../deposit/deposit-modal-context-provider';

export function CurrencyAccessDepositModalTriggerButton({
  initialChain,
}: {
  initialChain: DepositChainOption;
}) {
  const { setStep, setChain, setIsModalOpen } = useContext(DepositModalContext);

  const handleOnClick = (e: MouseEvent<Element>) => {
    e.stopPropagation();
    setChain(initialChain);
    setStep(1);
    setIsModalOpen(true);
  };

  return (
    <IconButton size={18} onClick={handleOnClick}>
      <CopyIcon className={'ion-margin-0'} isGrey size={18} slot="icon-only" />
    </IconButton>
  );
}
