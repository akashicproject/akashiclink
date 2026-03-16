import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { urls } from 'src/constants/urls';
import { akashicPayPath } from 'src/routing/navigation-tabs';

import { ThemeSelect } from '../../components/layout/toolbar/theme-select';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import {
  PageHeader,
  SettingsWrapper,
} from '../../components/settings/base-components';
import { CurrentFiatCurrencyDisplay } from '../../components/settings/current-fiat-currency-display';
import { HideSmallTxnToggle } from '../../components/settings/hide-small-txn-toggle';
import {
  LanguageAccordion,
  LanguageTextCaret,
} from '../../components/settings/language-accordion';
import {
  SettingItem,
  type SettingItemProps,
} from '../../components/settings/setting-item';
import { getImageIconUrl } from '../../utils/url-utils';

export function SettingsGeneral() {
  const { t } = useTranslation();
  const history = useHistory();

  const generalMenuItems: SettingItemProps[] = [
    {
      header: t('FiatCurrency'),
      icon: getImageIconUrl('dollar-sign.svg'),
      onClick: () => {
        history.push(akashicPayPath(urls.settingsFiatCurrency));
      },
      EndComponent: CurrentFiatCurrencyDisplay,
    },
    {
      header: t('Languages'),
      icon: getImageIconUrl('language.svg'),
      children: <LanguageAccordion />,
      EndComponent: LanguageTextCaret,
      isAccordion: true,
    },
    {
      header: t('Theme'),
      icon: '/shared-assets/images/theme.svg',
      EndComponent: ThemeSelect,
    },
    {
      header: t('HideSmallTransactions'),
      icon: getImageIconUrl('visibility-off-primary-70.svg'),
      EndComponent: HideSmallTxnToggle,
    },
  ];
  return (
    <DashboardLayout>
      <SettingsWrapper>
        <PageHeader>{t('General')}</PageHeader>
        <div
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {generalMenuItems.map((gMenuItems) => {
            return (
              <SettingItem
                key={gMenuItems.header}
                backgroundColor="var(--ion-background)"
                header={gMenuItems.header}
                icon={gMenuItems.icon}
                isAccordion={gMenuItems.isAccordion}
                EndComponent={gMenuItems.EndComponent}
                onClick={gMenuItems.onClick}
              >
                {gMenuItems.children}
              </SettingItem>
            );
          })}
        </div>
      </SettingsWrapper>
    </DashboardLayout>
  );
}
