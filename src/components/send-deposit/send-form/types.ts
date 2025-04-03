import type {
  IBaseTransactionWithDbIndex,
  ITerriTransaction,
  ITransactionVerifyResponse,
} from '@helium-pay/backend';

export type ValidatedAddressPair = {
  convertedToAddress: string;
  userInputToAddress: string;
  acnsAlias?: string;
  userInputToAddressType?: 'l2' | 'l1' | 'alias';
};

export const validatedAddressPairInitialState = {
  convertedToAddress: '',
  userInputToAddress: '',
};

export type SendConfirmationTxnsDetail = {
  txns: ITransactionVerifyResponse[];
  signedTxns: (IBaseTransactionWithDbIndex | ITerriTransaction)[];
  validatedAddressPair: ValidatedAddressPair;
  amount: string;
};

export type SendConfirmationTxnFinal = {
  error?: string;
  txHash?: string;
  feesEstimate?: string;
};
