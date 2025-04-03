import { IonContent, IonIcon, IonModal } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React, { type RefObject, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCurrentAppInfo } from '../../utils/hooks/useCurrentAppInfo';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { getImageIconUrl } from '../../utils/url-utils';
import { ThemeSelect } from '../layout/theme-select';
import { AboutUs, AboutUsCaret } from './about-us';
import { type SettingItemProps, SettingItem } from './setting-item';

export function SettingsModal({
  modal,
  isOpen,
  setIsOpen,
}: {
  modal: RefObject<HTMLIonModalElement>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const info = useCurrentAppInfo();
  const { t } = useTranslation();
  const [isAboutUs, setAboutUs] = useState(false);
  const [updateType] = useLocalStorage('update-type', '');
  const settingsMenu: SettingItemProps[] = [
    {
      header: t('Theme'),
      iconUrl: '/shared-assets/images/theme.svg',
      endComponent: <ThemeSelect />,
    },
    {
      header: t('AboutUs'),
      iconUrl: getImageIconUrl('about-us.svg'),
      onClick: () => {
        modal.current?.setCurrentBreakpoint(updateType === 'soft' ? 0.72 : 0.6);
        setAboutUs(true);
      },
      endComponent: <AboutUsCaret appVersion={info.version ?? '0.0.0'} />,
    },
  ];
  return (
    <IonModal
      handle={false}
      className="setting-modal"
      ref={modal}
      trigger="open-modal"
      initialBreakpoint={0.3}
      breakpoints={[0, 0.25, 0.3, 0.6, 0.72]}
      isOpen={isOpen}
      onIonModalDidDismiss={() => {
        setAboutUs(false);
        setIsOpen(false);
      }}
    >
      <IonContent>
        <div
          style={{
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <h4 className="ion-text-size-xxs ion-no-margin ion-text-start ion-margin-bottom">
              {t('Settings')}
            </h4>
            <IonIcon
              onClick={() => {
                setIsOpen(false);
              }}
              className="ion-no-margin"
              slot="end"
              size="small"
              style={{
                height: '16px',
                width: '16px',
              }}
              color="var(ion-select-border)"
              src={closeOutline}
            />
          </div>
          {!isAboutUs &&
            settingsMenu.map((m, index) => {
              return (
                <SettingItem
                  key={index}
                  iconUrl={m.iconUrl}
                  header={m.header}
                  onClick={m.onClick}
                  endComponent={m.endComponent}
                  isAccordion={m.isAccordion}
                  backgroundColor={'var(--settings-popup-background-color)'}
                >
                  {m.children}
                </SettingItem>
              );
            })}
          {isAboutUs && (
            <AboutUs
              backgroundColor={'var(--settings-popup-background-color)'}
              isLoggedIn={false}
            />
          )}
        </div>
      </IonContent>
    </IonModal>
  );
}
