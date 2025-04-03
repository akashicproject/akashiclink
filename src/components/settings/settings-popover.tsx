import { LANGUAGE_LIST } from '@helium-pay/common-i18n/src/locales/supported-languages';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
} from '@ionic/react';
import { caretBackOutline, settingsOutline } from 'ionicons/icons';
import type { MouseEventHandler, ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { urls } from '../../constants/urls';
import { heliumPayPath } from '../../routing/navigation-tree';
import { OwnersAPI } from '../../utils/api';
import { lastPageStorage } from '../../utils/last-page-storage';

/** Styling the display text */
function SettingsText({ text, id }: { text: string; id?: string }) {
  return (
    <IonLabel
      class="ion-text-right"
      id={id}
      style={{
        fontWeight: 700,
        fontSize: '14px',
        lineHeight: '20px',
        fontFamily: 'Nunito Sans',
        color: '#290056',
      }}
    >
      {text}
    </IonLabel>
  );
}

/** Styling the clickable settings containers */
const SettingsItemCss = {
  '--background-hover': 'var(--ion-color-primary)',
  '--background-hover-opacity': '12%',
  '--ripple-color': 'var(--ion-color-tertiary)',

  // Turn of default grey highlight on focus
  '--background-focused': 'none',
};

/** Container for grouping related settings */
function SettingsList(props: { children: ReactNode }) {
  return (
    <IonList
      lines="none"
      style={{
        padding: 0,
        border: '2px solid var(--ion-color-dark)',
        borderRadius: '4px',
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
  const [focus, _] = useState<string>();
  const { t, i18n } = useTranslation();
  const history = useHistory();

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
    // TODO: Inclued these to set focus manually
    // onClick = {() => setFocus && setFocus(id)}
    // onDidDismiss={() => (focus === id) && setFocus(undefined)}
    // isOpen = { focus === id}
    return (
      <>
        <IonItem button={true} detail={false} id={id} style={SettingsItemCss}>
          <IonIcon
            slot="start"
            class="icon-arrow"
            icon={caretBackOutline}
            style={{
              fontSize: '10px',
              display: focus === id ? 'visible' : 'none',
            }}
          />
          <SettingsText text={displayText} />
        </IonItem>
        <IonPopover
          dismissOnSelect={true}
          side="left"
          alignment="start"
          size="cover"
          trigger={id}
          style={{
            '--offset-x': '-2px',
          }}
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
        button={true}
        detail={false}
        routerLink={routerLink}
        style={SettingsItemCss}
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

  async function logout() {
    try {
      await OwnersAPI.logout();
    } catch {
      console.log('Account already logged out');
    } finally {
      lastPageStorage.clear();
      history.push('/');
    }
  }

  return (
    <>
      <IonButton
        class="icon-button"
        onClick={(e) => setShowPopover({ open: true, event: e.nativeEvent })}
      >
        <IonIcon
          slot="icon-only"
          class="icon-button-icon"
          icon={settingsOutline}
        />
      </IonButton>
      <IonPopover
        backdrop-dismiss={true}
        isOpen={showPopover.open}
        event={showPopover.event}
        onDidDismiss={() => setShowPopover({ open: false, event: undefined })}
        side="bottom"
        alignment="end"
      >
        <IonContent>
          <SettingsList>
            <SettingSubmenu displayText={t('General')} id="general-menu">
              <SettingsList>
                <IonItem
                  style={{
                    ...SettingsItemCss,
                    '--ion-item-background': 'var(--ion-color-secondary)',
                  }}
                  detail={false}
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

            <SettingSubmenu displayText={t('Advanced')} id="settings-advanced">
              <SettingsList>
                <SettingsItem
                  displayText="Backup"
                  routerLink={heliumPayPath(urls.settingsBackup)}
                />
              </SettingsList>
            </SettingSubmenu>

            <SettingSubmenu displayText="Naming Service" id="nested-trigger">
              <SettingsList>
                <SettingsItem
                  routerLink={`${heliumPayPath(
                    urls.settingsNaming
                  )}?service=hp`}
                  displayText="ANs"
                />
                <SettingsItem displayText="SquareNs" disabled={true} />
              </SettingsList>
            </SettingSubmenu>

            <SettingSubmenu displayText="Security" id="settings-security">
              <SettingsList>
                <SettingsItem
                  displayText="Recovery"
                  routerLink={heliumPayPath(urls.recover)}
                />
              </SettingsList>
            </SettingSubmenu>

            <SettingSubmenu displayText="Information" id="settings-information">
              <SettingsList>
                <SettingsItem
                  displayText="Version Info"
                  routerLink={heliumPayPath(urls.settingsVersion)}
                />
                <SettingsItem
                  displayText="Links"
                  routerLink={heliumPayPath(urls.settingsInfo)}
                />
              </SettingsList>
            </SettingSubmenu>

            <SettingsItem displayText="Lock" onClick={logout} />
          </SettingsList>
        </IonContent>
      </IonPopover>
    </>
  );
}
