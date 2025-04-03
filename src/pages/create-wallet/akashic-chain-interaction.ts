import type { IKeyExtended } from '@activeledger/sdk-bip39';
import { type IDiffconTx, type IKeyCreateTx } from '@helium-pay/backend';

import {
  type IKeysToCreate,
  useActivateNewAccount,
  useCreateKeys,
  useDiffconKeys,
} from '../../utils/hooks/nitr0gen';
import { Nitr0genApi } from '../../utils/nitr0gen/nitr0gen-api';
import type { FullOtk } from '../../utils/otk-generation';

export async function createAccountWithKeys(
  otk: IKeyExtended
): Promise<{ otk: FullOtk; keysNotCreated: IKeysToCreate[] }> {
  const nitr0gen = new Nitr0genApi();
  const { trigger: triggerActivateNewAccount } = useActivateNewAccount();
  const { trigger: triggerCreateKeys } = useCreateKeys();
  const { trigger: triggerDiffconKeys } = useDiffconKeys();

  // 1. Request account-creation
  const createAccountResponse = await triggerActivateNewAccount({
    otkOnboardTransaction: await nitr0gen.onboardOtkTransaction(otk),
    otk,
  });

  const fullOtk = { ...otk, identity: createAccountResponse.identity };

  const keyCreationTxs: IKeyCreateTx[] = [];

  // 2. Request to create new keys/wallets

  for (const key of createAccountResponse.keysToCreate) {
    keyCreationTxs.push({
      coinSymbol: key.coinSymbol,
      signedTx: key.signedTx,
    });
  }

  const createKeyResponse = await triggerCreateKeys({
    keyCreationTxs,
    otk,
  });

  const createdKeys = createKeyResponse.createdKeysToDiffcon;

  // 3. Diffcon-check any created keys for safety
  const keyDiffconTxs: IDiffconTx[] = [];
  for (const key of createdKeys) {
    keyDiffconTxs.push({
      ledgerId: key.ledgerId,
      coinSymbol: key.coinSymbol,
      signedTx: key.signedTx,
    });
  }

  let keysNotCreated: IKeysToCreate[] = [];
  if (keyDiffconTxs.length > 0) {
    const diffconResponse = await triggerDiffconKeys({
      keyDiffconTxs,
      otk,
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
  const { trigger: triggerCreateKeys } = useCreateKeys();
  const { trigger: triggerDiffconKeys } = useDiffconKeys();

  for (const key of keysToCreate) {
    keyCreationTxs.push({
      coinSymbol: key.coinSymbol,
      signedTx: key.signedTx,
    });
  }

  const createKeyResponse = await triggerCreateKeys({
    keyCreationTxs,
    otk,
  });

  // 3. Diffcon-check any created keys for safety
  const keyDiffconTxs: IDiffconTx[] = [];
  for (const key of createKeyResponse.createdKeysToDiffcon) {
    keyDiffconTxs.push({
      ledgerId: key.ledgerId,
      coinSymbol: key.coinSymbol,
      signedTx: key.signedTx,
    });
  }

  const diffconResponse = await triggerDiffconKeys({
    keyDiffconTxs,
    otk,
  });

  return diffconResponse.failedDiffcon;
}
