import type { IDelegatedFeeValuesReturn } from '@akashic/as-backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useL1TxnDelegatedFees = () => {
  const { data, ...response } = useSWR<IDelegatedFeeValuesReturn[], Error>(
    `/v0/l1-txn-orchestrator/delegated-fees`,
    fetcher
  );
  return { delegatedFeeList: data ?? [], ...response };
};
