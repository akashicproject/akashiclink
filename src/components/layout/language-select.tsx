import './language-dropdown.css';

import { LANGUAGE_LIST } from '@helium-pay/common-i18n/src/locales/supported-languages';
import { IonButton, IonIcon, IonItem, IonList, IonPopover } from '@ionic/react';
import { caretDownOutline, globeOutline } from 'ionicons/icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useLocalStorage } from '../../utils/hooks/useLocalStorage';

export const LanguageDropdown = () => {
  const { i18n } = useTranslation();

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
  const [selectedLanguage, setSelectedLanguage, _] = useLocalStorage(
    'language',
    getLocalisationLanguage()
  );

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  const triggerId = 'popover-trigger';

  return (
    <div style={{ display: 'flex' }}>
      <IonButton class="language-button" fill="clear" id={triggerId}>
        <IonIcon slot="icon-only" icon={globeOutline} />
        <IonIcon slot="end" icon={caretDownOutline} />
      </IonButton>
      <IonPopover
        class="language-popover"
        dismissOnSelect={true}
        trigger={triggerId}
      >
        <IonList
          lines="none"
          style={{
            padding: 0,
          }}
        >
          {LANGUAGE_LIST.map((item) => (
            <IonItem
              key={item.locale}
              button={true}
              detail={false}
              onClick={(_) => setSelectedLanguage(item.locale)}
            >
              {item.locale.toUpperCase()}
            </IonItem>
          ))}
        </IonList>
      </IonPopover>
    </div>
  );
};
