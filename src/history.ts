import type {
  IL1ClientSideOtkTransactionBase,
  ITransactionProposalClientSideOtk,
} from '@helium-pay/backend';
import { createMemoryHistory } from 'history';

import type { Url } from './constants/urls';
import { urls } from './constants/urls';
import type { TransferResultType } from './pages/nft/nft-transfer-result';
import { akashicPayPath } from './routing/navigation-tabs';

export const history = createMemoryHistory();

export interface LocationState {
  nft?: {
    nftName?: string;
  };
  nftTransferResult?: {
    transaction?: TransferResultType;
    errorMsg?: string;
  };
  sendConfirm?: {
    fromAddress: string;
    transaction?: (
      | IL1ClientSideOtkTransactionBase
      | ITransactionProposalClientSideOtk
    )[];
    currencyDisplayName?: string;
    gasFree?: boolean;
  };
  sendResult?: {
    fromAddress: string;
    transaction?: (
      | IL1ClientSideOtkTransactionBase
      | ITransactionProposalClientSideOtk
    )[];
    errorMsg?: string;
    currencyDisplayName?: string;
  };
  migrateWallet?: {
    username?: string;
    oldPassword?: string;
  };
}

export const resetHistoryStackAndRedirect = (
  url: Url = urls.loggedFunction,
  state?: Record<string, unknown>
) => {
  history.entries = [history.entries[0]];
  history.length = 1;
  history.index = 0;
  history.replace(akashicPayPath(url), state);
};
