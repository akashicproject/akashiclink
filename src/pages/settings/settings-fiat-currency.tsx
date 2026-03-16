import { FIAT_CURRENCY_LIST } from '@akashic/as-backend';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';

import { SearchBar } from '../../components/common/search-bar';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import { SettingsWrapper } from '../../components/settings/base-components';
import { useAppDispatch } from '../../redux/app/hooks';
import { setFiatCurrencyDisplay } from '../../redux/slices/preferenceSlice';
import { useFiatCurrencyDisplay } from '../../utils/hooks/useFiatCurrencyDisplay';

export function SettingsFiatCurrency() {
  const dispatch = useAppDispatch();

  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const { fiatCurrencySymbol } = useFiatCurrencyDisplay();

  const filtered = FIAT_CURRENCY_LIST.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      t(`currency.${c.code}`).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <SettingsWrapper>
        <div>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search')}
          />
        </div>
        <Virtuoso
          style={{
            height: '100%',
            width: '100%',
            minHeight: 'calc(100vh - 180px - var(--ion-safe-area-bottom))',
          }}
          data={filtered}
          itemContent={(_, currency) => (
            <div
              key={currency.code}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                dispatch(setFiatCurrencyDisplay(currency.code));
              }}
            >
              <span
                className={`ion-text-size-sm`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px',
                  fontWeight: fiatCurrencySymbol === currency.code ? 700 : 400,
                }}
              >
                <span>
                  {currency.code} - {t(`currency.${currency.code}`)} (
                  {currency.symbol})
                </span>
                {fiatCurrencySymbol === currency.code && (
                  <CheckIcon className="ion-text-size-xs" />
                )}
              </span>
            </div>
          )}
        />
      </SettingsWrapper>
    </DashboardLayout>
  );
}
