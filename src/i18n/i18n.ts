import {
  DEFAULT_LANGUAGE,
  Language,
} from '@helium-pay/common-i18n/src/locales/supported-languages';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationBD from './translation/bn_BD.json';
import translationEN from './translation/en_US.json';
import translationCN from './translation/zh_CN.json';
import translationTW from './translation/zh_TW.json';
// import translationES from './translation/es_ES.json';
// import translationID from './translation/id_ID.json';
// import translationKR from './translation/ko_KR.json';
// import translationPT from './translation/pt_PT.json';
// import translationTH from './translation/th_TH.json';

type Translation = typeof translationEN;

const resources: { [key in Language]: { translation: Translation } } = {
  [Language.enUS]: {
    translation: translationEN,
  },
  [Language.zhTW]: {
    translation: translationTW,
  },
  [Language.zhCN]: {
    translation: translationCN,
  },
  [Language.bnBD]: {
    translation: translationBD,
  },
  // [Language.idID]: {
  //   translation: translationID,
  // },
  // [Language.thTH]: {
  //   translation: translationTH,
  // },
  // [Language.esES]: {
  //   translation: translationES,
  // },
  // [Language.ptPT]: {
  //   translation: translationPT,
  // },
  // [Language.koKR]: {
  //   translation: translationKR,
  // },
};

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  keySeparator: '.',
});

export default i18n;
