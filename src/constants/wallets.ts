import type { IOwnerBalancesResponse } from '@akashic/as-backend';

/**
 * Information about user wallet formatted for display in the extension
 */
export type UserWallet = Omit<IOwnerBalancesResponse, 'balance'> & {
  balance?: string;
  address?: string;
};
