import Big from 'big.js';

import { getPrecision } from './formatAmount';

export function formatAmountWithCommas(
  numberString: string,
  precision?: number
): string {
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
  const formattedNum = num.toFixed(decimalDigits);

  // Split the number into integer and decimal parts
  // decimalPart is mutated below so disable eslint

  let [integerPart, decimalPart] = formattedNum.split('.');

  // Add thousands separators to the integer part
  const formattedIntegerPart = integerPart.replace(
    // eslint-disable-next-line regexp/no-unused-capturing-group
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );

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
  return `${formattedIntegerPart}.${decimalPart}`;
}
