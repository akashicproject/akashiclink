import { IonHeader } from '@ionic/react';
import { useHistory } from 'react-router';

import { urls } from '../../constants/urls';
import type { LocationState } from '../../routing/history';
import { history } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { HeaderLogo } from './header-logo';
import { AddressQuickAccessDropdown } from './toolbar/address-quick-access-dropdown';
import { HistoryBackButton } from './toolbar/history-back-button';
import { RefreshDataButton } from './toolbar/refresh-data-button';
export function Header() {
  // using this hook to get notified of any routing changes, and get the latest mutated `history`
  const routerHistory = useHistory<LocationState>();

  //TODO: migrate NFT transfer to modal as well
  const isInLockedPage = [
    akashicPayPath(urls.nftTransfer),
    akashicPayPath(urls.nftTransferResult),
  ].includes(routerHistory.location.pathname);

  const isCanGoBack = history.index !== 0 && !isInLockedPage;

  return (
    <IonHeader
      className="ion-no-border ion-display-flex"
      style={{
        background: 'var(--ion-background-color)',
      }}
    >
      {isCanGoBack && (
        <>
          <HistoryBackButton />
          <HeaderLogo />
        </>
      )}
      {!isCanGoBack && <AddressQuickAccessDropdown />}
      <div className={'ion-display-flex ion-gap-xxs'}>
        <RefreshDataButton />
      </div>
    </IonHeader>
  );
}
