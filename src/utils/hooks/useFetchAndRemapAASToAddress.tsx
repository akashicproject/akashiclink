import { type OtkType } from '@akashic/as-backend';

import { useAccountStorage } from './useLocalAccounts';
import { useNftMe } from './useNftMe';

// BE AWARE THAT THIS HOOK "SNAPSHOT" `localAccounts` (or addAasToAccountByIdentity to be exact),
// choose wisely WHEN you initialize this hook, or you might be using an older copy of localAccounts
export const useFetchAndRemapAASToAddress = () => {
  const { mutateNftMe } = useNftMe();
  const { addAasToAccountByIdentity, removeAasFromAccountByIdentity } =
    useAccountStorage();

  return async ({
    identity,
    otkType,
  }: {
    identity: string;
    otkType?: OtkType;
  }) => {
    const nfts = await mutateNftMe();
    const nft = nfts?.find((nft) => !!nft.aas?.linked);

    nft
      ? await addAasToAccountByIdentity({
          identity,
          otkType,
          alias: nft.alias,
          ledgerId: nft.ledgerId,
        })
      : await removeAasFromAccountByIdentity({ identity, otkType });
  };
};
