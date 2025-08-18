import type { IKeyExtended } from '@activeledger/sdk-bip39';
import type { CoinSymbol } from '@helium-pay/backend';

import { ALLOWED_NETWORKS } from '../constants/currencies';
import { OwnersAPI } from './api';
import { Nitr0genApi } from './nitr0gen/nitr0gen-api';
import type { FullOtk } from './otk-generation';

export async function createAccountWithAllL1Addresses(
  otk: IKeyExtended
): Promise<{ otk: FullOtk }> {
  const nitr0gen = new Nitr0genApi();

  // 1. Request account-creation
  const { ledgerId } = await nitr0gen.onboardOtk(otk);

  const fullOtk = { ...otk, identity: ledgerId };

  // set 1s timeout for owner creation event to arrive db
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // mainnets for production accounts and testnets for staging and local accounts
  await Promise.all(
    ALLOWED_NETWORKS.map(async (coinSymbol) => {
      await createL1Address(fullOtk, coinSymbol);
    })
  );

  return { otk: fullOtk };
}

export async function createL1Address(
  fullOtk: IKeyExtended,
  coinSymbol: CoinSymbol
): Promise<string | undefined> {
  // safeguard coinSymbol base on env
  if (!ALLOWED_NETWORKS.includes(coinSymbol)) {
    throw new Error('Coin not available');
  }
  if (!fullOtk.identity) {
    throw new Error('Missing identity');
  }

  const nitr0gen = new Nitr0genApi();

  try {
    // find existing key, or return a pre-seed key for assignment
    const { address, unassignedLedgerId } = await OwnersAPI.findOrReserveKey({
      identity: fullOtk.identity,
      coinSymbol,
    });

    // if both do not exist, fallback to key diff in error catch
    if (!address && !unassignedLedgerId) {
      throw new Error('Unable to find or reserve key');
    }

    // if address exists without unassignedLedgerId, means user already has l1 address
    if (!unassignedLedgerId && !!address) {
      return address;
    }

    // if unassignedLedgerId exists, means no existing l1 address for this otk
    // assign the reserved key to otk
    if (!!unassignedLedgerId && !!address) {
      await nitr0gen.assignKeyToOtk(fullOtk, unassignedLedgerId);
      return address;
    }

    // safety net
    throw new Error('Unable to find or reserve key');
  } catch {
    // if assign pre-seed failed, fallback to key diff
    const { address } = await nitr0gen.createKey(fullOtk, coinSymbol);
    return address;
  }
}
