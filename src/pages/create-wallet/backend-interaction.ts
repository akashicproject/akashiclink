import type { IKeyExtended } from '@activeledger/sdk-bip39';
import type {
  IDiffconTx,
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

  const keyCreationTxs: IKeyCreateTx[] = [];

  // 2. Request to create new keys/wallets

  for (const key of createAccountResponse.keysToCreate) {
    keyCreationTxs.push({
      coinSymbol: key.coinSymbol,
      signedTx: await signTxBody(key.txToSign, fullOtk),
    });
  }

  const claimKeyResponse = await OwnersAPI.claimOrCreateKeys({
    keyCreationTxs,
  });

  const createdKeys = claimKeyResponse.createdKeysToDiffcon;

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
