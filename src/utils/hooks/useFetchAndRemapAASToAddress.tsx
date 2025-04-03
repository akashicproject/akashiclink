import { useAccountStorage } from './useLocalAccounts';
import { useNftMe } from './useNftMe';

export const useFetchAndRemapAASToAddress = () => {
  const { mutateNftMe } = useNftMe();
  const { addAasToAccountByIdentity, removeAasFromAccountByIdentity } =
    useAccountStorage();

  return async (identity: string) => {
    const nfts = await mutateNftMe();
    const nft = nfts.find(
      (nft: { acns: { value: string } }) =>
        nft.acns.value !== null && nft.acns.value !== ''
    );

    nft
      ? addAasToAccountByIdentity(nft.acns.name, identity)
      : removeAasFromAccountByIdentity(identity);
  };
};
