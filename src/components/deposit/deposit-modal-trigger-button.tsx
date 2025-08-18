import { IonIcon } from '@ionic/react';
import { arrowDownOutline } from 'ionicons/icons';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsScopeAccessAllowed } from '../../utils/account';
import { WhiteButton } from '../common/buttons';
import { DepositModalContext } from './deposit-modal-context-provider';

export function DepositModalTriggerButton() {
  const { t } = useTranslation();
  const { setIsModalOpen } = useContext(DepositModalContext);
  const isDepositAllowed = useIsScopeAccessAllowed('deposit');

  return (
    <WhiteButton
      disabled={!isDepositAllowed}
      expand="block"
      onClick={() => setIsModalOpen(true)}
    >
      {t('Deposit')}
      <IonIcon slot="end" icon={arrowDownOutline}></IonIcon>
    </WhiteButton>
  );
}
