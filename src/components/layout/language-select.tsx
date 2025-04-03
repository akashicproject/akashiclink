import './language-dropdown.css';

import { LANGUAGE_LIST } from '@helium-pay/common-i18n/src/locales/supported-languages';
import { IonButton, IonIcon, IonSelect, IonSelectOption } from '@ionic/react';
import { globeOutline } from 'ionicons/icons';
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

  return (
    <div style={{ display: 'flex' }}>
      <IonButton shape="round" fill="clear">
        <IonIcon slot="icon-only" icon={globeOutline} />
      </IonButton>
      <IonSelect
        id="select-language"
        style={{
          margin: 0,
          border: '0px solid transparent',
        }}
        value={selectedLanguage}
        placeholder="Select language"
        interface="popover"
        onIonChange={(event) => {
          setSelectedLanguage(event.target.value);
        }}
      >
        {LANGUAGE_LIST.map((item) => (
          <IonSelectOption key={item.locale} value={item.locale}>
            {item.locale.toUpperCase()}
          </IonSelectOption>
        ))}
      </IonSelect>
    </div>
  );
};
