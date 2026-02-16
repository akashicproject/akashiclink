import type { CoinSymbol } from '@akashic/as-backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';
import { useAccountStorage } from './useLocalAccounts';
import { useOwnerKeys } from './useOwnerKeys';

const RECENT_ADDRESSES_LIMIT = 30;

interface RecentAddressItem {
  address: string;
  lastInteraction: Date;
}

interface RecentAddressesResponse {
  addresses: RecentAddressItem[];
}

/**
 * Hook to get recent addresses from transaction history.
 * Returns unique addresses the user has sent to, sorted by most recent first.
 * Excludes the active account's address and local account addresses.
 *
 * @param coinSymbol - Optional filter for specific network (e.g., TRX_SHASTA, ETH_SEPOLIA)
 */
export const useRecentAddressesSentTo = (coinSymbol?: CoinSymbol) => {
  const { activeAccount, cacheOtk, localAccounts } = useAccountStorage();
  const { keys: ownerKeys } = useOwnerKeys(activeAccount?.identity ?? '');

  const queryParams = new URLSearchParams({
    identity: activeAccount?.identity ?? '',
    limit: RECENT_ADDRESSES_LIMIT.toString(),
    ...(coinSymbol && { coinSymbol }),
  });

  const { data, isLoading, error, mutate } = useSWR<
    RecentAddressesResponse,
    Error
  >(
    activeAccount?.identity && cacheOtk
      ? `/owner/recent-addresses-sent-to?${queryParams.toString()}`
      : null,
    fetcher as (url: string) => Promise<RecentAddressesResponse>
  );

  // Filter out self addresses on the client side for additional safety
  const excludeAddresses = new Set<string>([
    activeAccount?.identity ?? '',
    activeAccount?.alias ?? '',
    ...ownerKeys.map((key) => key.address),
    ...localAccounts.map((acc) => acc.identity),
  ]);

  // Filter and map addresses, maintaining chronological order by lastInteraction
  const filteredAddresses: RecentAddressItem[] =
    data?.addresses?.filter((item) => !excludeAddresses.has(item.address)) ??
    [];

  return {
    recentAddressesWithTimestamp: filteredAddresses,
    isLoading,
    error,
    refresh: mutate,
  };
};
