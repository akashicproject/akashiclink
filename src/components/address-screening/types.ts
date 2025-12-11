import {
  type CoinSymbol,
  type CryptoCurrencySymbol,
  type IBaseAcTransaction,
  type ITerriAcTransaction,
} from '@akashic/as-backend';

import type { ITransactionForSigning } from '../../utils/nitr0gen/nitr0gen.interface';

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
