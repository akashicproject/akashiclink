import type { IKeyExtended } from '@activeledger/sdk-bip39';
import { isCoinSymbol } from '@akashic/as-backend';
import { BinanceSymbol, type CoinSymbol } from '@akashic/core-lib';
import { datadogRum } from '@datadog/browser-rum';

import { ALLOWED_NETWORKS } from '../constants/currencies';
import { OwnersAPI } from './api';
import { getNitr0genApi } from './nitr0gen/nitr0gen.utils';
import type { FullOtk } from './otk-generation';

// AC uses one key for all Ethereum-ecosystem wallets, so we don't have to
// create for BSC _and_ ETH
const NETWORKS_TO_CREATE_L1_ADDRESSES_FOR = ALLOWED_NETWORKS.filter(
  (n) => !isCoinSymbol(n, BinanceSymbol)
) as CoinSymbol[];

export async function createAccountWithAllL1Addresses(
  otk: IKeyExtended
): Promise<{ otk: FullOtk }> {
  // 1. Request account-creation
  const nitr0genApi = await getNitr0genApi();
  const { response, error, nodeErrors } = await nitr0genApi.onboardOtk(otk);
  if (error || !response) {
    const err = new Error(error);
    datadogRum.addError(err, { nodeErrors });
    throw err;
  }

  const fullOtk = { ...otk, identity: response.ledgerId };

  // set 1s timeout for owner creation event to arrive db
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // mainnets for production accounts and testnets for preprod and local accounts
  await bulkCreateOrAssignKeys(fullOtk, NETWORKS_TO_CREATE_L1_ADDRESSES_FOR);

  return { otk: fullOtk };
}

async function bulkCreateOrAssignKeys(
  fullOtk: IKeyExtended,
  coinSymbols: CoinSymbol[]
): Promise<void> {
  if (!fullOtk.identity) {
    throw new Error('Missing identity');
  }
  const nitr0genApi = await getNitr0genApi();
  const unassignedLedgerIds: string[] = [];
  for (const coinSymbol of coinSymbols) {
    // find existing key, or return a pre-seed key for assignment
    const { address, unassignedLedgerId } = await OwnersAPI.findOrReserveKey({
      identity: fullOtk.identity,
      coinSymbol,
    });
    if (unassignedLedgerId) {
      unassignedLedgerIds.push(unassignedLedgerId);
    } else if (!address && !unassignedLedgerId) {
      // if both do not exist, create new key and continue
      const { error, nodeErrors } = await nitr0genApi.createKey(
        fullOtk,
        coinSymbol
      );
      if (error) {
        const err = new Error(error);
        datadogRum.addError(err, { nodeErrors });
        throw err;
      }
    }
  }
  if (unassignedLedgerIds.length > 0) {
    const { error, nodeErrors } = await nitr0genApi.assignKeysToOtk(
      fullOtk,
      unassignedLedgerIds
    );
    if (error) {
      const err = new Error(error);
      datadogRum.addError(err, { nodeErrors });
      throw err;
    }
  }
}

export async function createL1Address(
  fullOtk: IKeyExtended,
  coinSymbol: CoinSymbol
): Promise<string | undefined> {
  // safeguard coinSymbol base on env
  if (!NETWORKS_TO_CREATE_L1_ADDRESSES_FOR.includes(coinSymbol)) {
    throw new Error('Coin not available');
  }
  if (!fullOtk.identity) {
    throw new Error('Missing identity');
  }

  const nitr0genApi = await getNitr0genApi();

  try {
    // find existing key, or return a pre-seed key for assignment
    const { address, unassignedLedgerId } = await OwnersAPI.findOrReserveKey({
      identity: fullOtk.identity,
      coinSymbol,
    });

    // if both do not exist, fallback to key diff in error catch
    if (!address && !unassignedLedgerId) {
      // if assign pre-seed failed, fallback to key diff
      const { response, error, nodeErrors } = await nitr0genApi.createKey(
        fullOtk,
        coinSymbol
      );
      if (error || !response) {
        const err = new Error(error);
        datadogRum.addError(err, { nodeErrors });
        throw err;
      }
      return response.address;
    }

    // if address exists without unassignedLedgerId, means user already has l1 address
    if (!unassignedLedgerId && !!address) {
      return address;
    }

    // if unassignedLedgerId exists, means no existing l1 address for this otk
    // assign the reserved key to otk
    if (!!unassignedLedgerId && !!address) {
      const { error, nodeErrors } = await nitr0genApi.assignKeysToOtk(fullOtk, [
        unassignedLedgerId,
      ]);
      if (error) {
        const err = new Error(error);
        datadogRum.addError(err, { nodeErrors });
        throw err;
      }
    }

    // safety net
    throw new Error('Unable to find or reserve key');
  } catch (error) {
    datadogRum.addError('createL1Address error', { error });
    throw error;
  }
}
