import { FileSharer } from '@byteowls/capacitor-filesharer';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import {
  IonActionSheet,
  IonContent,
  IonIcon,
  IonPopover,
  isPlatform,
} from '@ionic/react';
import { Screenshot } from 'capacitor-screenshot';
import { shareOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ShareActionButton = ({
  filename,
  link,
}: {
  filename?: string;
  link?: string;
}) => {
  const { t } = useTranslation();

  const isMobile = isPlatform('ios') || isPlatform('android');
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [isSupportWebShare, setIsSupportWebShare] = useState(false);
  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const checkCanShare = async () => {
      if (await Share.canShare()) {
        setIsSupportWebShare(true);
      }
    };
    checkCanShare();
  }, []);

  const handelOnClickButton = async () => {
    const ret = await Screenshot.take();
    setScreenshotBase64(ret.base64);

    if (isMobile) {
      setIsActionSheetOpen(true);
    } else if (isSupportWebShare) {
      handleShareLink();
    } else {
      handleCopyLink();
    }
  };

  const handleShareLink = async () => {
    Share.share({
      url: link,
    }).catch((error) => {
      console.error('Link sharing failed', error.message);
    });
  };

  const handleShareImage = async () => {
    FileSharer.share({
      filename: `${filename}.jpg`,
      contentType: 'image/jpg',
      base64Data: screenshotBase64,
    }).catch((error) => {
      console.error('File sharing failed', error.message);
    });
  };

  const handleCopyLink = async () => {
    await Clipboard.write({
      string: link ?? '',
    });

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
      {/* if share is not supported, copy the link instead and show popover */}
      {/* had to not render it due to force trigger of ion-popover */}
      {!isSupportWebShare && (
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
      )}
      {/* action sheet for mobile, let user choose what they want to share */}
      <IonActionSheet
        isOpen={isActionSheetOpen}
        buttons={[
          {
            text: t('ShareLink'),
            handler: () => {
              handleShareLink();
            },
          },
          {
            text: t('ShareScreenshot'),
            handler: () => {
              handleShareImage();
            },
          },
          {
            text: t('Cancel'),
            role: 'cancel',
            data: {
              action: 'cancel',
            },
          },
        ]}
        onDidDismiss={() => setIsActionSheetOpen(false)}
      />
    </div>
  );
};
