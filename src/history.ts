import type { IKeyExtended } from '@activeledger/sdk-bip39';
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
    chainType?: string;
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
  changePassTwoFa?: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    email: string;
  };
  createWallet?: {
    password: string;
    otk: IKeyExtended;
  };
  migrateWallet?: {
    username: string;
    oldPassword?: string;
  };
  createPassword?: {
    isImport: boolean;
  };
}
