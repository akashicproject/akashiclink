import {
  type CoinSymbol,
  type CurrencySymbol,
  NetworkDictionary,
  otherError,
} from '@helium-pay/backend';
import { BadRequestException } from '@nestjs/common';
import Big from 'big.js';

/** Direction of coin/token decimal conversion */
type ConversionDirection = 'to' | 'from';

/**
 * Method for safe conversion to and from coin/token decimals
 *
 * @throws BadRequestException if:
 * - the coin/token combination is not supported
 * - amount cannot be represented as an integer in the smallest denomination
 * @deprecated use {@link convertToDecimals} or {@link convertFromDecimals}
 */
export function convertToFromDecimals(
  amount: string,
  coinSymbol: CoinSymbol,
  direction: ConversionDirection,
  tokenSymbol?: CurrencySymbol
): string {
  return direction === 'to'
    ? convertToDecimals(amount, coinSymbol, tokenSymbol)
    : convertFromDecimals(amount, coinSymbol, tokenSymbol);
}

/**
 * Method for safe conversion to coin/token decimals
 *
 * @throws BadRequestException if:
 * - the coin/token combination is not supported
 * - amount cannot be represented as an integer in the smallest denomination
 */
export function convertFromDecimals(
  amount: string,
  coinSymbol: CoinSymbol,
  tokenSymbol?: CurrencySymbol
): string {
  const bigAmount = Big(amount);
  throwIfNotInteger(bigAmount);

  const conversionFactor = getConversionFactor(coinSymbol, tokenSymbol);
  return Big(10)
    .pow(conversionFactor * -1)
    .times(bigAmount)
    .toFixed(conversionFactor);
}

/**
 * Method for safe conversion from coin/token decimals
 *
 * @throws BadRequestException if:
 * - the coin/token combination is not supported
 * - amount cannot be represented as an integer in the smallest denomination
 */
export function convertToDecimals(
  amount: string,
  coinSymbol: CoinSymbol,
  tokenSymbol?: CurrencySymbol
): string {
  const conversionFactor = getConversionFactor(coinSymbol, tokenSymbol);
  const convertedAmount = Big(10).pow(conversionFactor).times(amount);
  throwIfNotInteger(convertedAmount);

  return convertedAmount.toFixed();
}

/**
 * Handle mapping amounts and fee-props in objects and arrays
 * @param object
 * @param direction 'to' or 'from' smallest denomination
 * @returns mapped object
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function convertObjectCurrencies(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  direction: 'to' | 'from'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (
    object?.coinSymbol &&
    (object.amount || object.feesEstimate || object.internalFee)
  ) {
    return {
      ...object,
      ...(object.amount
        ? {
            amount: convertToFromDecimals(
              object.amount,
              object.coinSymbol,
              direction,
              object.tokenSymbol
            ),
          }
        : undefined),
      ...(object.feesEstimate
        ? {
            feesEstimate: convertToFromDecimals(
              object.feesEstimate,
              object.coinSymbol,
              direction
            ),
          }
        : undefined),
      ...(object.feesPaid
        ? {
            feesPaid: convertToFromDecimals(
              object.feesPaid,
              object.coinSymbol,
              direction
            ),
          }
        : undefined),
      ...(object.internalFee
        ? {
            internalFee: {
              ...(object.internalFee.withdraw
                ? {
                    withdraw: convertToFromDecimals(
                      object.internalFee.withdraw,
                      object.coinSymbol,
                      direction,
                      object.tokenSymbol
                    ),
                  }
                : undefined),
              ...(object.internalFee.deposit
                ? {
                    deposit: convertToFromDecimals(
                      object.internalFee.deposit,
                      object.coinSymbol,
                      direction,
                      object.tokenSymbol
                    ),
                  }
                : undefined),
            },
          }
        : undefined),
    };
  } else if (object instanceof Array) {
    return object.map(
      (entry) =>
        entry?.amount
          ? {
              ...entry,
              amount: convertToFromDecimals(
                entry.amount,
                entry.coinSymbol,
                direction,
                entry.tokenSymbol
              ),
              ...(entry.feesEstimate
                ? {
                    feesEstimate: convertToFromDecimals(
                      entry.feesEstimate,
                      entry.coinSymbol,
                      direction
                    ),
                  }
                : undefined),
              ...(entry.feesPaid
                ? {
                    feesPaid: convertToFromDecimals(
                      entry.feesPaid,
                      entry.coinSymbol,
                      direction
                    ),
                  }
                : undefined),
              ...(entry.internalFee
                ? {
                    internalFee: {
                      ...(entry.internalFee.withdraw
                        ? {
                            withdraw: convertToFromDecimals(
                              entry.internalFee?.withdraw ?? '0',
                              entry.coinSymbol,
                              direction,
                              entry.tokenSymbol
                            ),
                          }
                        : undefined),
                      ...(entry.internalFee.deposit
                        ? {
                            deposit: convertToFromDecimals(
                              entry.internalFee?.deposit ?? '0',
                              entry.coinSymbol,
                              direction,
                              entry.tokenSymbol
                            ),
                          }
                        : undefined),
                    },
                  }
                : undefined),
            }
          : convertObjectCurrencies(entry, direction) // Handle nested objects
    );
  } else {
    // handle nested properties
    if (object) {
      const keys = Object.keys(object);
      if (typeof object === 'object' && keys?.length > 0) {
        const result = object;
        keys.forEach(
          (k) => (result[k] = convertObjectCurrencies(object[k], direction))
        );
        return result;
      }
    }
    return object;
  }
}

function getConversionFactor(
  coinSymbol: CoinSymbol,
  tokenSymbol?: CurrencySymbol
): number {
  if (!tokenSymbol) return NetworkDictionary[coinSymbol].nativeCoin.decimal;

  const token = NetworkDictionary[coinSymbol].tokens.find(
    (t) => t.symbol === tokenSymbol
  );
  if (!token) throw new BadRequestException(otherError.unsupportedCoinError);

  return token.decimal;
}

function throwIfNotInteger(amount: Big) {
  if (amount.mod(1).toString() !== '0')
    throw new BadRequestException(otherError.transactionTooSmallError);
}
