import { type FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { formatDate } from '../../../utils/formatDate';
import { useRecentAddressesSentTo } from '../../../utils/hooks/useRecentAddressesSentTo';
import { displayLongText } from '../../../utils/long-text';
import { SendFormContext } from '../send-modal-context-provider';
import { AddressList, PrimaryText, SecondaryText } from './address-list-item';

interface RecentAddressListProps {
  onSelectAddress: (address: string) => void;
}

export const RecentAddressList: FC<RecentAddressListProps> = ({
  onSelectAddress,
}) => {
  const { t } = useTranslation();
  const { currency } = useContext(SendFormContext);
  const { recentAddressesWithTimestamp, isLoading } = useRecentAddressesSentTo(
    currency.coinSymbol
  );

  return (
    <AddressList
      items={recentAddressesWithTimestamp}
      keyExtractor={(item) => item.address}
      onSelectItem={(item) => onSelectAddress(item.address)}
      renderContent={(item) => (
        <>
          <PrimaryText>
            {displayLongText(item.address, 30, false, true)}
          </PrimaryText>
          <SecondaryText>
            {formatDate(new Date(item.lastInteraction))}
          </SecondaryText>
        </>
      )}
      isLoading={isLoading}
      loadingMessage={t('Loading')}
      emptyStateMessage={t('NoRecentAddresses')}
    />
  );
};
