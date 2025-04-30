import {
  DEFAULT_LANGUAGE,
  Language,
} from '@helium-pay/common-i18n/src/locales/supported-languages';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { APP_LANGUAGE } from '../preference-keys';
import { useLocalStorage } from './useLocalStorage';

const getLocalisationLanguage = (): Language => {
  const browserLanguage = window?.navigator?.language;
  for (const lang of Object.values(Language)) {
    if (lang === browserLanguage) return lang;
  }
  return DEFAULT_LANGUAGE;
};

export const useSetGlobalLanguage = (): [
  Language,
  (newValue: Language) => Promise<void>,
] => {
  const { i18n } = useTranslation();
  const localLanguage = getLocalisationLanguage();
  const { value: selectedLanguage, setValue: setSelectedLanguage } =
    useLocalStorage<Language>(APP_LANGUAGE);

  useEffect(() => {
    if (selectedLanguage && selectedLanguage !== i18n.language) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage, i18n]);

  return [selectedLanguage ?? localLanguage, setSelectedLanguage];
};
