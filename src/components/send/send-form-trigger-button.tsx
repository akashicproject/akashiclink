import { IonIcon } from '@ionic/react';
import { arrowForwardOutline } from 'ionicons/icons';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../common/buttons';
import { SendFormContext } from './send-modal-context-provider';

export function SendFormTriggerButton() {
  const { t } = useTranslation();
  const { setIsModalOpen } = useContext(SendFormContext);

  return (
    <PrimaryButton expand="block" onClick={() => setIsModalOpen(true)}>
      {t('Send')}
      <IonIcon slot="end" icon={arrowForwardOutline} />
    </PrimaryButton>
  );
}
