import styled from '@emotion/styled';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  add,
  chevronBack,
  chevronForward,
  searchOutline,
} from 'ionicons/icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';

import {
  AlertBox,
  formAlertResetState,
  type FormAlertState,
  successAlertShell,
} from '../../../components/common/alert/alert';
import { IconButton } from '../../../components/common/buttons';
import { DashboardLayout } from '../../../components/page-layout/dashboard-layout';
import { PageHeader } from '../../../components/settings/base-components';
import { ALLOWED_NETWORKS } from '../../../constants/currencies';
import { urls } from '../../../constants/urls';
import { historyGo } from '../../../routing/history';
import type { DepositChainOption } from '../../../utils/hooks/useAccountL1Address';
import {
  type AddressBookContact,
  useAddressBook,
} from '../../../utils/hooks/useAddressBook';
import { EditContactModal } from './address-book-edit-modal';
import { AddressBookEmptyState } from './address-book-empty-state';
import { SavedAddressItem } from './saved-address-item';

// Define this const to avoid sonar duplicate strings error
const PRIMARY_COLOR = '--ion-color-primary';

type AddressBookTab = 'all' | DepositChainOption;

const TabsRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  borderBottom: '1px solid var(--ion-color-step-150)',
});

const TabsHeader = styled.div({
  display: 'flex',
  gap: '24px',
  overflowX: 'auto',
  flex: 1,
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
});

const Tab = styled.button<{ isActive: boolean }>(({ isActive }) => ({
  background: 'none',
  border: 'none',
  padding: '8px 0',
  flexShrink: 0,
  fontSize: '0.875rem',
  fontWeight: isActive ? 600 : 400,
  color: isActive ? `var(${PRIMARY_COLOR})` : '#666666',
  cursor: 'pointer',
  position: 'relative',
  transition: 'color 0.2s ease',

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-1px',
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: isActive ? `var(${PRIMARY_COLOR})` : 'transparent',
    transition: 'background-color 0.2s ease',
  },

  '&:hover': {
    color: `var(${PRIMARY_COLOR})`,
  },
}));

export function AddressBook() {
  const { t } = useTranslation();
  const { contacts, deleteContact, updateContact } = useAddressBook();
  const [activeTab, setActiveTab] = useState<AddressBookTab>('all');
  const [editingContact, setEditingContact] =
    useState<AddressBookContact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastAlert, setToastAlert] =
    useState<FormAlertState>(formAlertResetState);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const dismissToast = useCallback(
    () => setToastAlert(formAlertResetState),
    []
  );

  // Create a stable reference by defining this component here instead
  // of directly in the itemContent prop to avoid react/no-unstable-nested-components warning
  const itemContent = useCallback(
    (_: number, contact: AddressBookContact) => (
      <SavedAddressItem
        contact={contact}
        onClick={() => setEditingContact(contact)}
      />
    ),
    []
  );

  useEffect(() => {
    if (!toastAlert.visible) return;
    const timer = setTimeout(dismissToast, 4000);
    return () => clearTimeout(timer);
  }, [toastAlert.visible, dismissToast]);

  const filteredContacts = contacts.filter((c) => {
    const matchesTab = activeTab === 'all' || c.network === activeTab;
    if (!matchesTab) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q)
    );
  });

  const tabs: { value: AddressBookTab; label: string }[] = [
    { value: 'all', label: t('All') },
    { value: 'AkashicChain', label: t('Chain.AkashicChain') },
    ...ALLOWED_NETWORKS.map((chain) => ({
      value: chain as AddressBookTab,
      label: t(`Chain.${chain.toUpperCase()}`),
    })),
  ];

  return (
    <DashboardLayout>
      <IonGrid style={{ padding: '0 16px' }}>
        <IonRow>
          <IonCol size="12">
            <PageHeader>{t('AddressBook')}</PageHeader>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol
            size="12"
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <IconButton
              shape="round"
              style={{
                width: 48,
                height: 48,
                '--background': `var(${PRIMARY_COLOR})`,
                '--color': 'var(--ion-color-primary-contrast)',
              }}
              onClick={() => historyGo(urls.addressBookNew)}
            >
              <IonIcon
                slot="icon-only"
                icon={add}
                style={{
                  width: 40,
                  height: 40,
                }}
                onClick={() => historyGo(urls.addressBookNew)}
              />
            </IconButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12">
            <TabsRow>
              <IonIcon
                icon={chevronBack}
                style={{
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: 'var(--ion-color-on-surface-variant)',
                  flexShrink: 0,
                }}
                onClick={() =>
                  tabsScrollRef.current?.scrollBy({
                    left: -150,
                    behavior: 'smooth',
                  })
                }
              />
              <TabsHeader ref={tabsScrollRef}>
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    isActive={activeTab === tab.value}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </Tab>
                ))}
              </TabsHeader>
              <IonIcon
                icon={chevronForward}
                style={{
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: 'var(--ion-color-on-surface-variant)',
                  flexShrink: 0,
                }}
                onClick={() =>
                  tabsScrollRef.current?.scrollBy({
                    left: 150,
                    behavior: 'smooth',
                  })
                }
              />
            </TabsRow>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12">
            {filteredContacts.length === 0 ? (
              <div
                style={{
                  height:
                    'calc(100vh - 135px - 80px - var(--ion-safe-area-bottom))',
                }}
              >
                <AddressBookEmptyState />
              </div>
            ) : (
              <div
                style={{
                  height:
                    'calc(100vh - 280px - 80px - var(--ion-safe-area-bottom))',
                }}
              >
                <Virtuoso
                  style={{ height: '100%', width: '100%' }}
                  data={filteredContacts}
                  itemContent={itemContent}
                />
              </div>
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
      {toastAlert.visible && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(56px + var(--ion-safe-area-bottom) + 24px)',
            left: 0,
            right: 0,
            maxWidth: 600,
            margin: '0 auto',
            padding: '0 16px',
            zIndex: 11,
          }}
        >
          <AlertBox
            state={toastAlert}
            customStyle={{
              container: {
                borderTop: '1px solid var(--ion-color-status-active)',
                borderBottom: '1px solid var(--ion-color-status-active)',
                borderRight: '1px solid var(--ion-color-status-active)',
                borderLeft: '8px solid var(--ion-color-status-active)',
                borderRadius: '8px',
                padding: '12px 16px',
                background: 'var(--ion-background-color)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              },
              text: {
                margin: 0,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--ion-color-primary-10)',
              },
            }}
            iconOverride={
              <CheckCircleIcon
                style={{
                  width: '24px',
                  height: '24px',
                  flexShrink: 0,
                  marginRight: '8px',
                  color: 'var(--ion-color-status-active)',
                }}
              />
            }
            onDismiss={dismissToast}
          />
        </div>
      )}
      {filteredContacts.length !== 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(56px + var(--ion-safe-area-bottom) + 24px)',
            left: 0,
            right: 0,
            maxWidth: 600,
            margin: '0 auto',
            padding: '0 16px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '24px',
              border: '1px solid var(--ion-color-outline)',
              background: 'var(--ion-background-color)',
              padding: '0 16px',
              height: '48px',
            }}
          >
            <IonIcon
              icon={searchOutline}
              style={{
                color: 'var(--ion-color-on-inverse-surface)',
                fontSize: '20px',
                flexShrink: 0,
              }}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('SearchByNameAddress')}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '1rem',
                fontWeight: 400,
                color: 'var(--ion-text-color)',
                caretColor: 'var(--ion-text-color)',
              }}
            />
          </div>
        </div>
      )}
      <EditContactModal
        isOpen={editingContact !== null}
        contact={editingContact}
        onClose={() => setEditingContact(null)}
        onSave={(original, updated) => {
          const result = updateContact(
            original.network,
            original.address,
            updated
          );
          if (result.success) {
            setToastAlert(successAlertShell('AddressModified'));
          }
          return result;
        }}
        onDelete={(network, address) => {
          deleteContact(network, address);
          setToastAlert(successAlertShell('AddressRemoved'));
        }}
      />
    </DashboardLayout>
  );
}
