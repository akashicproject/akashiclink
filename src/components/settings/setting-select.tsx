import './settings.scss';

import styled from '@emotion/styled';
import { IonContent, IonIcon, IonItem, IonPopover } from '@ionic/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { historyResetStackAndRedirect } from '../../routing/history';
import { useLogout } from '../../utils/hooks/useLogout';
import { getImageIconUrl } from '../../utils/url-utils';
import { SquareWhiteButton } from '../common/buttons';

const SettingsDropDownItem = styled(IonItem)`
  --min-height: 32px;
  --inner-border-width: 0px;
  padding: 4px 0;
`;
export function SettingSelect() {
  const logout = useLogout();
  const settingPopoverRef = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { t } = useTranslation();
  return (
    <>
      <SquareWhiteButton
        className="icon-button"
        onClick={(e) => {
          if (settingPopoverRef.current) {
            settingPopoverRef.current.event = e;
            setPopoverOpen(!popoverOpen);
          }
        }}
      >
        <IonIcon
          slot="icon-only"
          className="icon-button-icons"
          src={getImageIconUrl('setting-menu-primary.svg')}
        />
      </SquareWhiteButton>

      <IonPopover
        ref={settingPopoverRef}
        isOpen={popoverOpen}
        onDidDismiss={() => setPopoverOpen(false)}
      >
        <IonContent
          className="ion-padding-left"
          style={{ backgroundColor: 'var(--ion-modal-background)' }}
        >
          <SettingsDropDownItem
            className="ion-no-margin"
            button
            onClick={() => {
              historyResetStackAndRedirect(urls.settings);
              setPopoverOpen(false);
            }}
          >
            <div className="ion-align-items-center ion-display-flex ion-gap-xs">
              <IonIcon
                style={{ height: '16px', width: '16px' }}
                src={getImageIconUrl('setting-icon-primary.svg')}
              />
              <h3 className="ion-no-margin ion-text-size-sm">
                {t('Settings')}
              </h3>
            </div>
          </SettingsDropDownItem>
          <SettingsDropDownItem
            className="ion-no-margin"
            button
            onClick={logout}
            detail={false}
          >
            <div
              className="ion-align-items-center"
              style={{ display: 'flex', gap: '8px' }}
            >
              <IonIcon
                style={{ height: '16px', width: '16px' }}
                src={getImageIconUrl('lock.svg')}
              />
              <h3 className="ion-no-margin ion-text-size-sm ion-text-align-left">
                {t('LockAkashicWallet')}
              </h3>
            </div>
          </SettingsDropDownItem>
        </IonContent>
      </IonPopover>
    </>
  );
}
