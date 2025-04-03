import { DEFAULT_LANGUAGE } from '@helium-pay/common-i18n/src/locales/supported-languages';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './translation/en_US.json';
import translationCN from './translation/zh_CN.json';
import translationTW from './translation/zh_TW.json';

const resources = {
  en_US: {
    translation: translationEN,
  },
  zh_TW: {
    translation: translationTW,
  },
  zh_CN: {
    translation: translationCN,
  },
};

export async function initialiseTranslationLibrary() {
  await i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    keySeparator: false,
  });
}
