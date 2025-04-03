import type { IBaseTransaction } from '@activeledger/sdk-bip39';
import type {
  ITerriTransaction,
  ITransactionVerifyResponse,
} from '@helium-pay/backend';

export type ValidatedAddressPair = {
  convertedToAddress: string;
  userInputToAddress: string;
};

export const validatedAddressPairInitialState = {
  convertedToAddress: '',
  userInputToAddress: '',
};

export type SendConfirmationTxnsDetail = {
  txns: ITransactionVerifyResponse[];
  signedTxns: (IBaseTransaction | ITerriTransaction)[];
  validatedAddressPair: ValidatedAddressPair;
  amount: string;
};

export type SendConfirmationTxnFinal = {
  error?: string;
  txHash?: string;
  feesEstimate?: string;
};
