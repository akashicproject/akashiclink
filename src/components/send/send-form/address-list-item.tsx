import styled from '@emotion/styled';
import { IonIcon, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import { listOutline } from 'ionicons/icons';
import { type ReactNode } from 'react';

export const AddressListContainer = styled.div({
  flex: 1,
  overflowY: 'auto',
  maxHeight: 'calc(92vh - 240px)',
});

export const AddressItem = styled(IonItem)({
  ['&::part(native)']: {
    '--background': 'transparent',
    '--padding-start': '8px',
    '--padding-end': '8px',
    '--inner-padding-end': '0',
    cursor: 'pointer',
    minHeight: '48px',
  },

  ['&:hover::part(native)']: {
    '--background': 'var(--ion-color-light)',
  },
});

export const AddressIcon = styled(IonIcon)({
  width: '14px',
  height: '14px',
  fontSize: '12px',
  color: 'var(--ion-color-primary)',
  marginRight: '8px',
  border: '2px solid var(--ion-color-primary)',
  padding: '2px',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const AddressInfo = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
});

export const PrimaryText = styled(IonText)({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--ion-color-dark)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const SecondaryText = styled(IonText)({
  fontSize: '0.625rem',
  color: 'var(--ion-color-medium)',
  marginTop: '2px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const EmptyState = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  color: 'var(--ion-color-medium)',
  fontSize: '0.75rem',
});

interface AddressListItemProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  onSelectItem: (item: T) => void;
  renderContent: (item: T) => ReactNode;
  emptyStateMessage?: string;
  isLoading?: boolean;
  loadingMessage?: string;
}

export const AddressList = <T,>({
  items,
  keyExtractor,
  onSelectItem,
  renderContent,
  emptyStateMessage,
  isLoading,
  loadingMessage,
}: AddressListItemProps<T>): JSX.Element => {
  const handleSelectItem = (item: T) => () => {
    onSelectItem(item);
  };

  if (isLoading && items.length === 0 && loadingMessage) {
    return (
      <AddressListContainer>
        <EmptyState>{loadingMessage}</EmptyState>
      </AddressListContainer>
    );
  }

  if (items.length === 0 && emptyStateMessage) {
    return (
      <AddressListContainer>
        <EmptyState>{emptyStateMessage}</EmptyState>
      </AddressListContainer>
    );
  }

  return (
    <AddressListContainer>
      <IonList lines="none" style={{ padding: 0, background: 'transparent' }}>
        {items.map((item) => (
          <AddressItem
            key={keyExtractor(item)}
            onClick={handleSelectItem(item)}
            button
            detail={false}
          >
            <AddressIcon icon={listOutline} slot="start" />
            <IonLabel>
              <AddressInfo>{renderContent(item)}</AddressInfo>
            </IonLabel>
          </AddressItem>
        ))}
      </IonList>
    </AddressListContainer>
  );
};
