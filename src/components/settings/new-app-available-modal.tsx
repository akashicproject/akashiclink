import { Browser } from '@capacitor/browser';
import { IonIcon, IonModal, IonNote, isPlatform } from '@ionic/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getImageIconUrl } from '../../utils/url-utils';
import { PrimaryButton } from '../common/buttons';

export const NewAppAvailableModal = () => {
  const { t } = useTranslation();
  const isMobile = isPlatform('ios') || isPlatform('android');

  const modalRef = useRef<HTMLIonModalElement>(null);
  const [isOpen, setIsOpen] = useState(isMobile);

  const downloadUrl = isPlatform('ios')
    ? 'https://apps.apple.com/us/app/akashiclink-2-0/id6753808452'
    : 'https://www.akashiclink.com/en-US/download';

  return (
    <IonModal
      className="popup-modal"
      ref={modalRef}
      isOpen={isOpen}
      onIonModalDidDismiss={() => {
        setIsOpen(false);
      }}
    >
      <div className="ion-padding-left-lg ion-padding-right-lg ion-padding-top-lg ion-padding-bottom-lg">
        <div style={{ maxWidth: 260 }}>
          <IonIcon
            src={getImageIconUrl('akashiclink-2-icon.svg')}
            style={{
              height: '56px',
              width: '100%',
              position: 'relative',
              margin: '0 auto',
            }}
          />
          <h3 className="ion-color-secondary-text ion-padding-bottom-0">
            {t('NewAppAvailable')}
          </h3>
          <h4 className="ion-color-secondary-text ion-padding-bottom-0 ion-margin-left-auto ion-margin-right-auto ion-margin-top-xs ion-margin-bottom-md">
            {t('NewAppAvailableDesc')}
          </h4>
          <IonNote
            className="alert-box ion-margin-bottom-md"
            style={{
              flexDirection: 'column',
              border: `1px solid var(--ion-color-primary)`,
              padding: '0 5%',
            }}
          >
            <div
              className={
                'ion-display-flex ion-gap-xxs ion-align-items-center ion-justify-content-center ion-margin-top-sm ion-margin-bottom-xxs'
              }
            >
              <IonIcon
                src={'/shared-assets/images/key-primary.svg'}
                style={{ width: '16px', height: '16px' }}
              />
              <h4
                className={
                  'ion-text-color-primary ion-margin-bottom-0 ion-margin-top-0'
                }
              >
                {t('AccountTransfer')}
              </h4>
            </div>
            <p
              className={
                'ion-text-color-primary ion-margin-top-xxs ion-margin-bottom-sm ion-text-align-center'
              }
            >
              {t('AccountTransferInfo')}
            </p>
          </IonNote>
          <IonNote
            className="alert-box"
            style={{
              flexDirection: 'column',
              border: `1px solid var(--ion-color-danger)`,
              padding: '0 5%',
            }}
          >
            <div
              className={
                'ion-display-flex ion-gap-xxs ion-align-items-center ion-justify-content-center ion-margin-top-sm ion-margin-bottom-xxs'
              }
            >
              <IonIcon
                src={'/shared-assets/images/danger-outline.svg'}
                style={{ width: '16px', height: '16px' }}
              />
              <h4
                className={
                  'ion-color-danger ion-margin-bottom-0 ion-margin-top-0'
                }
              >
                {t('OldAppDeprecation')}
              </h4>
            </div>
            <p
              className={
                'ion-color-danger ion-margin-top-xxs ion-margin-bottom-sm ion-text-align-center'
              }
            >
              {t('OldAppDeprecationNotice')}
            </p>
          </IonNote>
          <PrimaryButton
            className="ion-margin-top-lg"
            style={{ width: '100%' }}
            onClick={async () => {
              setIsOpen(false);
              await Browser.open({
                url: downloadUrl,
              });
            }}
          >
            {t('DownloadNewAkashicLink')}
          </PrimaryButton>
        </div>
      </div>
    </IonModal>
  );
};
