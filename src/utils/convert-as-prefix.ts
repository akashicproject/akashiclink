import { L2Regex } from '@helium-pay/backend';

type ConversionDirection = 'to' | 'from';

const L2RegexWithoutPrefix = /^[A-Fa-f\d]{64}$/;

export function convertToFromASPrefix(
  umid: string,
  direction: ConversionDirection
): string {
  if (direction === 'to') {
    if (L2Regex.exec(umid)) {
      return umid;
    } else if (L2RegexWithoutPrefix.exec(umid)) {
      return 'AS' + umid;
    }
  } else {
    if (L2Regex.exec(umid)) {
      return umid.slice(2);
    } else if (L2RegexWithoutPrefix.exec(umid)) {
      return umid;
    }
  }
  throw new Error(`${umid} does not match regex with or without prefix`);
}
