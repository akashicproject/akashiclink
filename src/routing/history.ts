import type { IBaseTransaction } from '@activeledger/sdk-bip39';
import type {
  IL1ClientSideOtkTransactionBase,
  ITerriTransaction,
  ITransactionProposalClientSideOtk,
  ITransactionVerifyResponse,
} from '@helium-pay/backend';
import { createMemoryHistory } from 'history';

import type {
  SendConfirmationTxnFinal,
  ValidatedAddressPair,
} from '../components/send-deposit/send-form/types';
import type { Url } from '../constants/urls';
import { urls } from '../constants/urls';
import type { TransferResultType } from '../pages/nft/nft-transfer-result';
import type { ITransactionRecordForExtension } from '../utils/formatTransfers';
import { akashicPayPath } from './navigation-tabs';

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
    txns: ITransactionVerifyResponse[];
    signedTxns: (IBaseTransaction | ITerriTransaction)[];
    validatedAddressPair: ValidatedAddressPair;
    amount: string;
    txnFinal?: SendConfirmationTxnFinal;
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
  activityDetails?: {
    currentTransfer?: ITransactionRecordForExtension;
  };
}

export const historyResetStackAndRedirect = (
  url: Url = urls.dashboard,
  state?: Record<string, unknown>
) => {
  history.entries = [history.entries[0]];
  history.length = 1;
  history.index = 0;
  history.replace(akashicPayPath(url), state);
};

export const historyGoBackOrReplace = (
  url: Url = urls.dashboard,
  state?: Record<string, unknown>
) => {
  history.length > 1
    ? history.goBack()
    : history.replace(akashicPayPath(url), state);
};
