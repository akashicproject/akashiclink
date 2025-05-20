import { IonContent, IonPopover, isPlatform } from '@ionic/react';
import { useRef, useState } from 'react';

import { useAccountL1Address } from '../../../utils/hooks/useAccountAllAddresses';
import { useAccountStorage } from '../../../utils/hooks/useLocalAccounts';
import { ManageAccountsModal } from '../../manage-account/manage-accounts-modal';
import { AddressQuickAccessDropdownItem } from './address-quick-access-dropdown-item';

export const AddressQuickAccessDropdown = () => {
  const { activeAccount } = useAccountStorage();
  const allAddresses = useAccountL1Address();
  const isMobile = isPlatform('ios') || isPlatform('android');

  const [showModal, setShowModal] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLIonPopoverElement>(null);

  if (!activeAccount) return null;

  return (
    <>
      <AddressQuickAccessDropdownItem
        triggerId="click-trigger"
        address={activeAccount?.identity ?? ''}
        chain={'AkashicChain'}
        displayName={
          activeAccount?.alias ??
          activeAccount?.accountName ??
          `Account ${activeAccount.identity.slice(-8)}`
        }
        style={{ marginLeft: -8, paddingLeft: 8 }}
        onClickIcon={() => {
          setShowModal(true);
        }}
        onHoverLabel={(e) => {
          popoverRef.current!.event = e;
          setPopoverOpen(!popoverOpen);
        }}
      />
      <IonPopover
        trigger="click-trigger"
        triggerAction="hover"
        reference="trigger"
        ref={popoverRef}
        isOpen={popoverOpen}
        onDidDismiss={() => setPopoverOpen(false)}
        style={{ '--offset-x': isMobile ? '4px' : '-52px' }}
      >
        <IonContent style={{ backgroundColor: 'var(--ion-modal-background)' }}>
          {allAddresses.map(({ address, chain, displayName }) => (
            <AddressQuickAccessDropdownItem
              key={address}
              address={address}
              chain={chain}
              displayName={displayName}
            />
          ))}
        </IonContent>
      </IonPopover>
      <ManageAccountsModal
        modal={modal}
        isOpen={showModal}
        setIsOpen={setShowModal}
      />
    </>
  );
};
