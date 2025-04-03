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
  /** LedgerId of L1 wallet if that was input but result was an L2. Helps effectivize some
   * fee-proceedings for specific L2s on AC */
  initiatedToL1LedgerId?: string;
};

export const validatedAddressPairInitialState = {
  isL2: false,
  convertedToAddress: '',
  userInputToAddress: '',
};

export interface SendConfirmationTxnsDetail {
  txn: ITransactionForSigning;
  signedTxn: IBaseTransactionWithDbIndex | ITerriTransaction;
  validatedAddressPair: ValidatedAddressPair;
  amount: string;
  txnFinal?: SendConfirmationTxnFinal;
}

export interface SendConfirmationTxnFinal {
  error?: string;
  txHash?: string;
  feesEstimate?: string;
}
