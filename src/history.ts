import { createMemoryHistory } from 'history';

import type { TransferResultType } from './pages/nft/nft-transfer-result';

export const history = createMemoryHistory();

export interface LocationState {
  nftName?: string;
  chainType?: string;
  transaction?: TransferResultType;
  errorMsg?: string;
}
