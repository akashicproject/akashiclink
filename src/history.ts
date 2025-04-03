import type { ITransactionVerifyResponse } from '@helium-pay/backend';
import { createMemoryHistory } from 'history';

import type { View } from './pages/import-wallet';
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
    transaction?: ITransactionVerifyResponse[];
    currencyDisplayName?: string;
    gasFree?: boolean;
    signedTx?: string;
  };
  sendResult?: {
    transaction?: ITransactionVerifyResponse[];
    errorMsg?: string;
    currencyDisplayName?: string;
  };
  changePassTwoFa?: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    email: string;
  };
  importView?: View;
}
