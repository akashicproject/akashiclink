import './settings-popover.scss';

import { LANGUAGE_LIST } from '@helium-pay/common-i18n/src/locales/supported-languages';
import { IonIcon, IonItem, IonLabel, IonList, IonPopover } from '@ionic/react';
import { caretBackOutline } from 'ionicons/icons';
import type { MouseEventHandler, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { themeType } from '../../theme/const';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { SquareWhiteButton } from '../buttons';
import { useLogout } from '../logout';
import { useTheme } from '../PreferenceProvider';

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
        // Style margin depending on depth of setting
        marginRight: props.isSubmenu ? '0' : '1px',
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
  const [storedTheme] = useTheme();
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
        <IonItem className="settings-item" button={true} detail={false} id={id}>
          <IonIcon className="settings-icon" icon={caretBackOutline} />
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
        className="settings-item ion-no-padding"
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
  const [buttonBackground, setButtonBackground] = useState(false);

  const handleButtonClick = () => {
    setButtonBackground(!buttonBackground);
  };
  const [showPopover, setShowPopover] = useState<{
    open: boolean;
    event: Event | undefined;
  }>({
    open: false,
    event: undefined,
  });

  const getLocalisationLanguage = (): string => {
    const browserLanguage = window.navigator.language;
    for (const lang of LANGUAGE_LIST)
      if (lang.locale === browserLanguage) return lang.locale;
    // Default to english
    return LANGUAGE_LIST[0].locale;
  };
  const [selectedLanguage, setSelectedLanguage] = useLocalStorage(
    'language',
    getLocalisationLanguage()
  );

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  return (
    <>
      <SquareWhiteButton
        className="icon-button"
        onClick={(e) => {
          handleButtonClick();
          setShowPopover({ open: true, event: e.nativeEvent });
        }}
        forceStyle={
          buttonBackground ? { background: '#EDDCFF', transition: 'none' } : {}
        }
      >
        <IonIcon
          slot="icon-only"
          className="icon-button-icons"
          src={`/shared-assets/images/${
            storedTheme === themeType.DARK && !buttonBackground
              ? 'setting-icon-white.svg'
              : 'setting-icon-purple.svg'
          }`}
        />
      </SquareWhiteButton>
      <IonPopover
        className="settings-main"
        backdrop-dismiss={true}
        isOpen={showPopover.open}
        event={showPopover.event}
        onDidDismiss={() => {
          setButtonBackground(false);
          setShowPopover({ open: false, event: undefined });
        }}
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
                <SettingsText text={t('Languages')} />
              </IonItem>
              {LANGUAGE_LIST.map((l) => (
                <SettingsItem
                  key={l.locale}
                  displayText={l.title}
                  id={l.locale}
                  onClick={(_) => setSelectedLanguage(l.locale)}
                />
              ))}
            </SettingsList>
          </SettingSubmenu>
          <SettingSubmenu displayText={t('Security')} id="settings-security">
            <SettingsList isSubmenu={true}>
              <SettingsItem
                displayText={t('KeyPairBackup')}
                routerLink={akashicPayPath(urls.settingsBackup)}
              />
              <SettingsItem
                displayText={t('ChangePassword')}
                routerLink={akashicPayPath(urls.changePassword)}
              />
            </SettingsList>
          </SettingSubmenu>

          <SettingSubmenu
            displayText={t('Information')}
            id="settings-information"
          >
            <SettingsList isSubmenu={true}>
              <SettingsItem
                displayText={t('AboutUs')}
                routerLink={akashicPayPath(urls.settingsVersion)}
              />
            </SettingsList>
          </SettingSubmenu>

          <SettingsItem displayText={t('Lock')} onClick={logout} />
        </SettingsList>
      </IonPopover>
    </>
  );
}
