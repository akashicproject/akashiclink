import type { ITransactionRecord } from '@akashic/as-backend';
import Big from 'big.js';

/**
 * Function limits the amount of decimal places:
 * e.g.
 * 0.000000002 -> 0
 * 0.0002 -> 0.0002
 * 300000.33452353254 -> 300000.334524
 */
export function formatAmount(numberString: string, precision?: number): string {
  // Return early if our numberString isn't a valid float number
  if (
    !/^[\d.]+$/.test(
      numberString.startsWith('-') ? numberString.slice(1) : numberString
    )
  )
    return numberString;

  const num = new Big(numberString);

  // Use the precision provided or work it out from the number provided
  const decimalDigits = precision ?? getPrecision(numberString);

  // Set precision
  const formattedNum = num.toFixed(decimalDigits, Big.roundDown);

  // Split the number into integer and decimal parts
  // decimalPart is mutated below so disable eslint

  let [integerPart, decimalPart] = formattedNum.split('.');

  // Ensure at least 2 decimal places, but no more than 6
  if (decimalPart) {
    decimalPart = decimalPart.replace(/0+$/, '');
    if (decimalPart.length < 2) {
      decimalPart = decimalPart.padEnd(2, '0');
    } else if (decimalPart.length > decimalDigits) {
      decimalPart = decimalPart.slice(0, decimalDigits);
    }
  } else {
    decimalPart = '00';
  }

  // Combine the formatted parts
  return `${integerPart}.${decimalPart}`;
}

/**
 * Finds which level of precision to use in displaying transaction-details, by
 * finding how many dps are needed to display full information but also keeping no
 * more than 6 dps and no less than 2
 * e.g amount=1.540000, gas = 5.823480 => Use 5 dps
 * amount=1.000000, gas = 0.123123123 => Use 6 dps (capped even though 9 is
 * needed for full gas info)
 */
export function getPrecision(amount: string, feesPaid?: string): number {
  return Math.min(
    Math.max(
      amount.split('.')[1]?.replace(/0+$/, '').length ?? 2,
      feesPaid?.split('.')[1]?.replace(/0+$/, '').length ?? 0
    ),
    6
  );
}

/**
 * Checks if gas-fee we are going to display is accurate
 * Not accurate if it is an estimate or if the actual number is longer than the
 * precision we display
 * @param precision Number of dps we will display
 */
export function isGasFeeAccurate(
  transfer: ITransactionRecord,
  precision: number
): boolean {
  const gasFee = transfer.feesPaid ?? transfer.feesEstimate;
  return !(
    (!transfer.feesPaid && !!transfer.feesEstimate) ||
    (gasFee ?? '').split('.')[1]?.replace(/0+$/, '').length > precision
  );
}
