import type { IKeyExtended } from '@activeledger/sdk-bip39';
import type {
  IDiffconTx,
  IKeyClaimTx,
  IKeyCreateTx,
  IKeysToCreate,
} from '@helium-pay/backend';

import { OwnersAPI } from '../../utils/api';
import { Nitr0genApi, signTxBody } from '../../utils/nitr0gen-api';
import type { FullOtk } from '../../utils/otk-generation';

export async function createAccountWithKeys(
  otk: IKeyExtended
): Promise<{ otk: FullOtk; keysNotCreated: IKeysToCreate[] }> {
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
      coinSymbol: key.coinSymbol,
      signedTx: await signTxBody(key.txToSign, fullOtk),
    });
  }
  for (const key of createAccountResponse.keysToCreate) {
    keyCreationTxs.push({
      coinSymbol: key.coinSymbol,
      signedTx: await signTxBody(key.txToSign, fullOtk),
    });
  }

  const claimKeyResponse = await OwnersAPI.claimOrCreateKeys({
    keyClaimTxs,
    keyCreationTxs,
  });

  const createdKeys = claimKeyResponse.createdKeysToDiffcon;

  // 2.5 If any keys failed to be claimed, create them instead
  if (claimKeyResponse.failedClaimToCreate.length > 0) {
    const keyCreationOfFailedTxs: IKeyCreateTx[] = [];
    for (const key of claimKeyResponse.failedClaimToCreate) {
      keyCreationOfFailedTxs.push({
        coinSymbol: key.coinSymbol,
        signedTx: await signTxBody(key.txToSign, fullOtk),
      });
    }

    const claimKeyResponseAgain = await OwnersAPI.claimOrCreateKeys({
      keyClaimTxs: [],
      keyCreationTxs: keyCreationOfFailedTxs,
    });

    createdKeys.push(...claimKeyResponseAgain.createdKeysToDiffcon);
  }

  // 3. Diffcon-check any created keys for safety
  const keyDiffconTxs: IDiffconTx[] = [];
  for (const key of createdKeys) {
    keyDiffconTxs.push({
      ledgerId: key.ledgerId,
      coinSymbol: key.coinSymbol,
      signedTx: await signTxBody(key.txToSign, fullOtk),
    });
  }

  let keysNotCreated: IKeysToCreate[] = [];
  if (keyDiffconTxs.length > 0) {
    const diffconResponse = await OwnersAPI.diffconKeys({
      keyDiffconTxs,
    });

    // 4. If any keys fail diffcon, try to create them again (as they have been deleted)
    if (diffconResponse.failedDiffcon.length > 0) {
      keysNotCreated = await createAndDiffconKeys(
        diffconResponse.failedDiffcon,
        fullOtk
      );
    }
  }
  return { otk: fullOtk, keysNotCreated };
}

async function createAndDiffconKeys(
  keysToCreate: IKeysToCreate[],
  otk: IKeyExtended
): Promise<IKeysToCreate[]> {
  const keyCreationTxs: IKeyCreateTx[] = [];

  for (const key of keysToCreate) {
    keyCreationTxs.push({
      coinSymbol: key.coinSymbol,
      signedTx: await signTxBody(key.txToSign, otk),
    });
  }

  const claimKeyResponse = await OwnersAPI.claimOrCreateKeys({
    keyClaimTxs: [],
    keyCreationTxs,
  });

  // 3. Diffcon-check any created keys for safety
  const keyDiffconTxs: IDiffconTx[] = [];
  for (const key of claimKeyResponse.createdKeysToDiffcon) {
    keyDiffconTxs.push({
      ledgerId: key.ledgerId,
      coinSymbol: key.coinSymbol,
      signedTx: await signTxBody(key.txToSign, otk),
    });
  }

  const diffconResponse = await OwnersAPI.diffconKeys({
    keyDiffconTxs,
  });

  return diffconResponse.failedDiffcon;
}
