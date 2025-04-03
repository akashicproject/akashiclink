import Big from 'big.js';

/**
 * Check if a number and currency symbol fit into 10 characters
 * If not, set precision to 5 sf
 * @param amount
 * @param currency
 */
export function displayLongCurrencyAmount(
  amount: string,
  currency: string
): string {
  const combined = `${amount} ${currency}`;
  if (combined.length <= 10) return combined;
  const truncated = Big(amount).toPrecision(5);
  return `${truncated} ${currency}`;
}
