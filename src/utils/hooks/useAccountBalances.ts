import { useAccountMe } from './useAccountMe';

export const useAccountBalances = () => {
  const { data: account, isLoading } = useAccountMe();

  return {
    isLoading,
    totalBalances: account?.totalBalances,
  };
};
