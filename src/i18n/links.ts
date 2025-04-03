import { Language } from '@helium-pay/common-i18n/src/locales/supported-languages';

import { useSetGlobalLanguage } from '../utils/hooks/useSetGlobalLanguage';

const INFO_SITE_LINKS = {
  [Language.enUS]: 'https://www.akashiclink.com/en',
  [Language.zhCN]: 'https://www.akashiclink.com/zh-TW',
  [Language.zhTW]: 'https://www.akashiclink.com/zh-TW',
};

const TERMS_OF_USE_LINKS = {
  [Language.enUS]:
    'https://docs.akashicpay.com/akashiclink/terms-of-use-and-privacy-policy',
  [Language.zhCN]:
    'https://docs.akashicpay.com/akashiclink/fan-ti-zhong-wen/shi-yong-tiao-kuan-yu-yin-si-quan-zheng-ce',
  [Language.zhTW]:
    'https://docs.akashicpay.com/akashiclink/fan-ti-zhong-wen/shi-yong-tiao-kuan-yu-yin-si-quan-zheng-ce',
};

const PRIVACY_POLICY_LINKS = {
  [Language.enUS]:
    'https://docs.akashicpay.com/akashiclink/terms-of-use-and-privacy-policy',
  [Language.zhCN]:
    'https://docs.akashicpay.com/akashiclink/fan-ti-zhong-wen/shi-yong-tiao-kuan-yu-yin-si-quan-zheng-ce',
  [Language.zhTW]:
    'https://docs.akashicpay.com/akashiclink/fan-ti-zhong-wen/shi-yong-tiao-kuan-yu-yin-si-quan-zheng-ce',
};

const QUICK_GUIDE_LINKS = {
  [Language.enUS]: 'https://docs.akashicpay.com/akashiclink',
  [Language.zhCN]: 'https://docs.akashicpay.com/akashiclink/fan-ti-zhong-wen',
  [Language.zhTW]: 'https://docs.akashicpay.com/akashiclink/fan-ti-zhong-wen',
};

export const LINK_TYPE = {
  PrivacyPolicy: 'PrivacyPolicy',
  TermsOfUse: 'TermsOfUse',
  InfoSite: 'InfoSite',
  QuickGuide: 'QuickGuide',
};

export const useI18nInfoUrls = (): Record<
  typeof LINK_TYPE[keyof typeof LINK_TYPE],
  string
> => {
  const [globalLanguage] = useSetGlobalLanguage();

  return {
    [LINK_TYPE.PrivacyPolicy]: PRIVACY_POLICY_LINKS[globalLanguage],
    [LINK_TYPE.TermsOfUse]: TERMS_OF_USE_LINKS[globalLanguage],
    [LINK_TYPE.InfoSite]: INFO_SITE_LINKS[globalLanguage],
    [LINK_TYPE.QuickGuide]: QUICK_GUIDE_LINKS[globalLanguage],
  };
};
