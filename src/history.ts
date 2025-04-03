import type {
  IL1ClientSideOtkTransactionBase,
  ITransactionProposalClientSideOtk,
} from '@helium-pay/backend';
import { createMemoryHistory } from 'history';

import type { TransferResultType } from './pages/nft/nft-transfer-result';

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
