import './language-dropdown.css';

import { LANGUAGE_LIST } from '@helium-pay/common-i18n/src/locales/supported-languages';
import { IonButton, IonIcon, IonSelect, IonSelectOption } from '@ionic/react';
import { globeOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

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
          i18n.changeLanguage(event.target.value);
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
