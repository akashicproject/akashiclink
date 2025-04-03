import type {
  CoinSymbol,
  CurrencySymbol,
  IExchangeRate,
} from '@helium-pay/backend';
import { TEST_TO_MAIN } from '@helium-pay/backend';
import Big from 'big.js';

/**
 * Calculates internal withdrawal fee for the specified amount to send. Fee is charged in same currency as user wants to send.
 * For details on the fee-amounts, see https://docs.google.com/spreadsheets/d/1PaCU2WOZJD-U73rmrylmgM2xvrI9XghOY1_I8FOH7O4/edit?pli=1#gid=0
 *
 * Currently only charged for L2 transactions
 */
export function calculateInternalWithdrawalFee(
  requestedAmount: string,
  exchangeRates: IExchangeRate[],
  coinSymbol: CoinSymbol,
  tokenSymbol?: CurrencySymbol
): string {
  let internalFeeBase = '0.0';
  const exchangeRate = Big(
    exchangeRates.find(
      (ex) =>
        !tokenSymbol &&
        ex.coinSymbol === (TEST_TO_MAIN.get(coinSymbol) || coinSymbol)
    )?.price || 1
  );

  // Check if not empty string
  if (requestedAmount && Big(requestedAmount).gt(0)) {
    if (Big(requestedAmount).times(exchangeRate).gt('100000')) {
      internalFeeBase = '0.4';
    } else if (Big(requestedAmount).times(exchangeRate).gt('10000')) {
      internalFeeBase = '0.3';
    } else if (Big(requestedAmount).times(exchangeRate).gt('1000')) {
      internalFeeBase = '0.2';
    } else if (Big(requestedAmount).times(exchangeRate).gt('1')) {
      internalFeeBase = '0.1';
    }
    return Big(internalFeeBase).div(exchangeRate).toPrecision(2);
  }
  return '0.0';
}
