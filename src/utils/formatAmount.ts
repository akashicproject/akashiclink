/**
 * Function limits the amount of decimal places:
 * e.g.
 * 0.000000002 -> 0
 * 0.0002 -> 0.0002
 * 300000.33452353254 -> 300000.334524
 */
export function formatAmount(amount: string | bigint): string {
  return parseFloat(parseFloat(amount.toString()).toFixed(6)).toString();
}
