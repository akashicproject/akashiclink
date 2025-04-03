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
 */
export function convertToFromDecimals(
  amount: string,
  coinSymbol: CoinSymbol,
  direction: ConversionDirection,
  tokenSymbol?: CurrencySymbol
): string {
  const conversionFactor = !tokenSymbol
    ? NetworkDictionary[coinSymbol].nativeCoin.decimal
    : NetworkDictionary[coinSymbol].tokens.find((t) => t.symbol === tokenSymbol)
        ?.decimal;
  if (!conversionFactor)
    throw new BadRequestException(otherError.unsupportedCoinError);

  const convertedAmount =
    direction === 'to'
      ? Big(10).pow(conversionFactor).times(amount)
      : Big(amount);

  if (convertedAmount.mod(1).toString() !== '0')
    throw new BadRequestException(otherError.transactionTooSmallError);

  return direction === 'to'
    ? convertedAmount.toFixed()
    : Big(10)
        .pow(conversionFactor * -1)
        .times(convertedAmount)
        .toFixed(conversionFactor);
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
