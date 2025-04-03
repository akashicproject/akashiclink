import type { IKeyExtended } from '@activeledger/sdk-bip39';
import type {
  CoinSymbol,
  IDiffconTx,
  IKeyClaimTx,
  IKeyCreateTx,
} from '@helium-pay/backend';

import { OwnersAPI } from '../../utils/api';
import { Nitr0genApi } from '../../utils/nitr0gen-api';
import type { FullOtk } from '../../utils/otk-generation';

export async function createAccountWithKeys(
  otk: IKeyExtended
): Promise<{ otk: FullOtk; keysNotCreated: CoinSymbol[] }> {
  // 1. Request account-creation
  const createAccountResponse =
    await OwnersAPI.activateNewAccountWithClientSideOtk({
      clientSidePubKey: {
        publicKey: otk.key.pub,
        name: otk.name,
        type: otk.type,
        identity: '',
      },
      otkOnboardTransaction: await Nitr0genApi.onboardOtk(otk),
    });

  const fullOtk = { ...otk, identity: createAccountResponse.identity };

  const keyClaimTxs: IKeyClaimTx[] = [];
  const keyCreationTxs: IKeyCreateTx[] = [];

  // 2. Claim any claimable-keys, or request to create new ones where not claimable
  for (const key of createAccountResponse.assignedKeys) {
    keyClaimTxs.push({
      ledgerId: key.ledgerId,
      signedTx: await Nitr0genApi.keyClaimTransaction(key.ledgerId, fullOtk),
    });
  }
  for (const coinSymbol of createAccountResponse.keysToCreate) {
    keyCreationTxs.push({
      coinSymbol,
      signedTx: await Nitr0genApi.keyCreateTransaction(coinSymbol, fullOtk),
    });
  }

  const claimKeyResponse = await OwnersAPI.claimOrCreateKeys({
    keyClaimTxs,
    keyCreationTxs,
  });

  const createdKeys = claimKeyResponse.createdKeys;

  // 2.5 If any keys failed to be claimed, create them instead
  if (claimKeyResponse.failedClaim.length > 0) {
    const keyCreationOfFailedTxs: IKeyCreateTx[] = [];
    for (const coinSymbol of claimKeyResponse.failedClaim) {
      keyCreationOfFailedTxs.push({
        coinSymbol,
        signedTx: await Nitr0genApi.keyCreateTransaction(coinSymbol, fullOtk),
      });
    }

    const claimKeyResponseAgain = await OwnersAPI.claimOrCreateKeys({
      keyClaimTxs: [],
      keyCreationTxs: keyCreationOfFailedTxs,
    });

    createdKeys.push(...claimKeyResponseAgain.createdKeys);
  }

  // 3. Diffcon-check any created keys for safety
  const keyDiffconTxs: IDiffconTx[] = [];
  for (const key of createdKeys) {
    keyDiffconTxs.push({
      ledgerId: key.ledgerId,
      coinSymbol: key.coinSymbol,
      signedTx: await Nitr0genApi.differentialConsensusTransaction(
        key,
        fullOtk
      ),
    });
  }

  let keysNotCreated: CoinSymbol[] = [];
  if (keyDiffconTxs.length > 0) {
    const diffconResponse = await OwnersAPI.diffconKeys({
      keyDiffconTxs,
    });

    // 4. If any keys fail diffcon, try to create them again (as they have been deleted)
    if (diffconResponse.failedDiffcon.length > 0) {
      keysNotCreated = await createAndDiffconKeys(
        diffconResponse.failedDiffcon,
        otk
      );
    }
  }
  return { otk: fullOtk, keysNotCreated };
}

async function createAndDiffconKeys(
  coinSymbols: CoinSymbol[],
  otk: IKeyExtended
): Promise<CoinSymbol[]> {
  const keyCreationTxs: IKeyCreateTx[] = [];

  for (const coinSymbol of coinSymbols) {
    keyCreationTxs.push({
      coinSymbol,
      signedTx: await Nitr0genApi.keyCreateTransaction(coinSymbol, otk),
    });
  }

  const claimKeyResponse = await OwnersAPI.claimOrCreateKeys({
    keyClaimTxs: [],
    keyCreationTxs,
  });

  // 3. Diffcon-check any created keys for safety
  const keyDiffconTxs: IDiffconTx[] = [];
  for (const key of claimKeyResponse.createdKeys) {
    keyDiffconTxs.push({
      ledgerId: key.ledgerId,
      coinSymbol: key.coinSymbol,
      signedTx: await Nitr0genApi.differentialConsensusTransaction(key, otk),
    });
  }

  const diffconResponse = await OwnersAPI.diffconKeys({
    keyDiffconTxs,
  });

  return diffconResponse.failedDiffcon;
}
