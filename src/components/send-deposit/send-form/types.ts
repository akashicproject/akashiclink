import type {
  IBaseTransactionWithDbIndex,
  ITerriTransaction,
} from '@helium-pay/backend';

import type { ITransactionForSigning } from '../../../utils/nitr0gen/nitr0gen.interface';

export type ValidatedAddressPair = {
  convertedToAddress: string;
  userInputToAddress: string;
  isL2?: boolean;
  initiatedToNonL2?: string;
  acnsAlias?: string;
  userInputToAddressType?: 'l2' | 'l1' | 'alias';
};

export const validatedAddressPairInitialState = {
  isL2: false,
  convertedToAddress: '',
  userInputToAddress: '',
};

export type SendConfirmationTxnsDetail = {
  txns: ITransactionForSigning[];
  signedTxns: (IBaseTransactionWithDbIndex | ITerriTransaction)[];
  validatedAddressPair: ValidatedAddressPair;
  amount: string;
};

export type SendConfirmationTxnFinal = {
  error?: string;
  txHash?: string;
  feesEstimate?: string;
};
