import styled from '@emotion/styled';
import { IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router';

import { urls } from '../../constants/urls';
import {
  historyResetStackAndRedirect,
  type LocationState,
} from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';

export const TabsBar = styled.div({
  width: '100%',
  paddingBottom: 'var(--ion-safe-area-bottom)',
  height: `calc(56px + var(--ion-safe-area-bottom))`,
  display: 'flex',
  bottom: 0,
  background: 'var(--ion-background-color)',
  boxShadow: '0px -4px 20px 0px rgba(0, 0, 0, 0.1)',
});

export const TabButton = styled(IonButton)<{ isActive: boolean }>(
  ({ isActive }) => ({
    flex: 1,
    background: 'none',
    '--background': 'none',
    color: 'var(--ion-color-primary)',
    margin: 0,
    ['&:active, &:focus, &:hover']: {
      background: 'rgba(89, 89, 146, 0.08)',
    },
    '.tab-icon-background': {
      borderRadius: '100%',
      background: isActive ? 'var(--ion-color-primary)' : 'none',
      color: isActive ? 'var(--ion-color-inverse-primary)' : 'none',
    },
  })
);

export const NavigationTabs = () => {
  const routerHistory = useHistory<LocationState>();
  const currentPage = routerHistory.location.pathname;

  const iconSize = 24;

  const tabsList = [
    { url: urls.dashboard, icon: 'homeOutline' },
    { url: urls.activity, icon: 'clipboardOutline' },
    ...(process.env.REACT_APP_ENABLE_SMART_SCAN === 'true'
      ? [{ url: urls.addressScreening, icon: 'barcodeOutline' }]
      : []),
    { url: urls.nfts, icon: 'imagesOutline' },
    { url: urls.settings, icon: 'settingsOutline' },
  ];

  return (
    <TabsBar>
      {tabsList.map((tab) => {
        const isActive = currentPage.startsWith(akashicPayPath(tab.url));
        return (
          <TabButton
            key={tab.url}
            isActive={isActive}
            onClick={() => historyResetStackAndRedirect(tab.url)}
          >
            <div
              className="tab-icon-background ion-padding-xs"
              style={{
                width: iconSize + 16,
                height: iconSize + 16,
              }}
            >
              <IonIcon
                style={{
                  width: iconSize,
                  height: iconSize,
                }}
                src={`/shared-assets/images/${tab.icon}${isActive ? '-inverse' : ''}.svg`}
              />
            </div>
          </TabButton>
        );
      })}
    </TabsBar>
  );
};
