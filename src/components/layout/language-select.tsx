import './language-select.scss';

import { LANGUAGE_LIST } from '@helium-pay/common-i18n/src/locales/supported-languages';
import { IonButton, IonIcon, IonItem, IonList, IonPopover } from '@ionic/react';
import { caretDownOutline, globeOutline } from 'ionicons/icons';
import type { SyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLocalStorage } from '../../utils/hooks/useLocalStorage';

export const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  /**
   * Get language of the user's browser
   */
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
  const popover = useRef<HTMLIonPopoverElement>(null);
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  const openPopover = (e: SyntheticEvent) => {
    popover.current!.event = e;
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <IonButton
        className="language-button"
        fill="clear"
        onClick={(e) => {
          openPopover(e);
        }}
      >
        <IonIcon
          style={{ fontSize: 24 }}
          slot="icon-only"
          icon={globeOutline}
        />
        <IonIcon style={{ fontSize: 14 }} slot="end" icon={caretDownOutline} />
      </IonButton>
      <IonPopover
        side="bottom"
        alignment="end"
        className="language-popover"
        dismissOnSelect={true}
        onDidDismiss={() => {
          setIsOpen(false);
        }}
        ref={popover}
        isOpen={isOpen}
      >
        <IonList
          lines="none"
          style={{
            padding: 0,
          }}
        >
          {LANGUAGE_LIST.map((item) => (
            <IonItem
              className={item.locale === selectedLanguage ? 'ion-focused' : ''}
              key={item.locale}
              button={true}
              detail={false}
              onClick={(_) => setSelectedLanguage(item.locale)}
            >
              {item.title.toUpperCase()}
            </IonItem>
          ))}
        </IonList>
      </IonPopover>
    </div>
  );
};
