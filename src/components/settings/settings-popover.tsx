import './settings-popover.scss';

import { LANGUAGE_LIST } from '@helium-pay/common-i18n/src/locales/supported-languages';
import { IonIcon, IonItem, IonLabel, IonList, IonPopover } from '@ionic/react';
import { caretBackOutline, settingsOutline } from 'ionicons/icons';
import type { MouseEventHandler, ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { SquareWhiteButton } from '../buttons';
import { useLogout } from '../logout';

/** Styling the display text */
function SettingsText({ text, id }: { text: string; id?: string }) {
  return (
    <IonLabel class="ion-text-right settings-text" id={id}>
      {text}
    </IonLabel>
  );
}

/** Container for grouping related settings */
function SettingsList(props: { children: ReactNode; isSubmenu?: boolean }) {
  return (
    <IonList
      class="settings-list"
      lines="none"
      style={{
        // Style corners depending on depth of setting
        borderRadius: props.isSubmenu ? '4px 0px 0px 4px' : '4px',
      }}
    >
      {props.children}
    </IonList>
  );
}

/**
 * Popover exposing settings that user can toggle
 */
export function SettingsPopover() {
  const { t, i18n } = useTranslation();

  const logout = useLogout();

  /** Grouping of the settings in the popover menu
   * @param displayText
   * @param unique id to handle clicks and visibility
   */
  function SettingSubmenu({
    displayText,
    id,
    children,
  }: {
    children: ReactNode;
    displayText: string;
    id: string;
  }) {
    return (
      <>
        <IonItem class="settings-item" button={true} detail={false} id={id}>
          <IonIcon class="settings-icon" icon={caretBackOutline} />
          <SettingsText text={displayText} />
        </IonItem>
        <IonPopover
          className="settings-submenu"
          dismissOnSelect={true}
          side="left"
          alignment="start"
          size="cover"
          trigger={id}
        >
          {children}
        </IonPopover>
      </>
    );
  }

  /** Single settings entry */
  function SettingsItem({
    routerLink,
    displayText,
    disabled,
    onClick,
    id,
  }: {
    routerLink?: string;
    displayText: string;
    disabled?: boolean;
    onClick?: MouseEventHandler;
    id?: string;
  }) {
    return (
      <IonItem
        class="settings-item"
        button={true}
        detail={false}
        routerLink={routerLink}
        disabled={disabled}
        onClick={(e) => {
          if (onClick) onClick(e);
          setShowPopover({ open: false, event: e.nativeEvent });
        }}
      >
        <SettingsText text={displayText} id={id} />
      </IonItem>
    );
  }

  const [showPopover, setShowPopover] = useState<{
    open: boolean;
    event: Event | undefined;
  }>({
    open: false,
    event: undefined,
  });

  // eslint-disable-next-line
  const changeLanguage = (event: any) => {
    if (event.target.id) {
      i18n.changeLanguage(event.target.id);
    }
  };

  return (
    <>
      <SquareWhiteButton
        class="icon-button"
        onClick={(e) => setShowPopover({ open: true, event: e.nativeEvent })}
      >
        <IonIcon
          slot="icon-only"
          class="icon-button-icon"
          icon={settingsOutline}
        />
      </SquareWhiteButton>
      <IonPopover
        className="settings-main"
        backdrop-dismiss={true}
        isOpen={showPopover.open}
        event={showPopover.event}
        onDidDismiss={() => setShowPopover({ open: false, event: undefined })}
        side="bottom"
        alignment="end"
      >
        <SettingsList>
          <SettingSubmenu displayText={t('General')} id="general-menu">
            <SettingsList isSubmenu={true}>
              <IonItem
                style={{
                  '--background': 'var(--ion-color-secondary)',
                }}
              >
                <SettingsText text="Languages" />
              </IonItem>
              {LANGUAGE_LIST.map((l) => (
                <SettingsItem
                  key={l.locale}
                  displayText={l.title}
                  id={l.locale}
                  onClick={(event) => changeLanguage(event)}
                />
              ))}
            </SettingsList>
          </SettingSubmenu>

          <SettingSubmenu displayText="Naming Service" id="naming-service">
            <SettingsList isSubmenu={true}>
              <SettingsItem
                routerLink={`${akashicPayPath(urls.settingsNaming)}?service=hp`}
                displayText="ACNS"
              />
            </SettingsList>
          </SettingSubmenu>

          <SettingSubmenu displayText="Security" id="settings-security">
            <SettingsList isSubmenu={true}>
              <SettingsItem
                displayText="Key Pair Backup"
                routerLink={akashicPayPath(urls.settingsBackup)}
              />
              {/**
               * <SettingsItem
               * displayText="Recovery"
               * routerLink={akashicPayPath(urls.recover)}
               * />
               */}
            </SettingsList>
          </SettingSubmenu>

          <SettingSubmenu displayText="Information" id="settings-information">
            <SettingsList isSubmenu={true}>
              <SettingsItem
                displayText="Version Info"
                routerLink={akashicPayPath(urls.settingsVersion)}
              />
            </SettingsList>
          </SettingSubmenu>

          <SettingsItem displayText="Lock" onClick={logout} />
        </SettingsList>
      </IonPopover>
    </>
  );
}
