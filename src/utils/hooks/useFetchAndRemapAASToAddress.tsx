import { useAccountStorage } from './useLocalAccounts';
import { useNftMe } from './useNftMe';

export const useFetchAndRemapAASToAddress = () => {
  const { mutateNftMe } = useNftMe();
  const { addAasToActiveAccount, removeAasFromActiveAccount } =
    useAccountStorage();

  return async () => {
    const nfts = await mutateNftMe();
    const nft = nfts.find(
      (nft: { acns: { value: string } }) =>
        nft.acns.value !== null && nft.acns.value !== ''
    );

    nft ? addAasToActiveAccount(nft.acns.name) : removeAasFromActiveAccount();
  };
};
