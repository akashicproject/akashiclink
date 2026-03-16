import type { CoinSymbol, CryptoCurrencySymbol } from '@akashic/core-lib';
import {
  type IBaseAcTransaction,
  type ITerriAcTransaction,
} from '@akashic/nitr0gen';

import { type ITransactionForSigning } from '../send/send-form/types';

export type ValidatedScanAddress = {
  scanAddress: string;
  scanChain?: CoinSymbol;
  //added after user has selected currency to pay fee with
  feeChain?: CoinSymbol;
  feeToken?: CryptoCurrencySymbol;
};

export const validatedScanAddressInitialState: ValidatedScanAddress = {
  scanAddress: '',
};

export interface AddressScanConfirmationTxnsDetail {
  txn: ITransactionForSigning;
  signedTxn: IBaseAcTransaction | ITerriAcTransaction;
  validatedScanAddress: ValidatedScanAddress;
  txnFinal?: AddressScanConfirmationTxnFinal;
}

export interface AddressScanConfirmationTxnFinal {
  error?: string;
  txHash?: string;
  scanFee?: string;
}
