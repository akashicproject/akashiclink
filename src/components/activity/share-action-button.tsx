import { IonContent, IonIcon, IonPopover } from '@ionic/react';
import { shareOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCopyToClipboard } from '../../utils/hooks/useCopyToClipboard';

export const ShareActionButton = ({ link }: { link?: string }) => {
  const { t } = useTranslation();
  const copyToClipboard = useCopyToClipboard();

  const [popoverOpen, setPopoverOpen] = useState(false);

  const handelOnClickButton = () => {
    handleCopyLink();
  };

  const handleCopyLink = async () => {
    await copyToClipboard(link ?? '');
    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 1000);
  };

  return (
    <div className={'ion-display-flex'}>
      <IonIcon
        id={'share-box'}
        className={
          'ion-padding-left-xxs ion-padding-right-xxs ion-padding-top-xxs ion-padding-bottom-xxs'
        }
        style={{
          cursor: 'pointer',
          background: 'var(--ion-color-primary)',
          color: 'var(--ion-color-on-primary)',
          borderRadius: '100%',
        }}
        icon={shareOutline}
        onClick={handelOnClickButton}
      />
      <IonPopover
        trigger="share-box"
        side="bottom"
        alignment="end"
        isOpen={popoverOpen}
        className={'copied-popover'}
        onDidDismiss={() => setPopoverOpen(false)}
      >
        <IonContent>{t('Copied')}</IonContent>
      </IonPopover>
    </div>
  );
};
