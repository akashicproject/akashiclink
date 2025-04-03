import { otherError } from '@helium-pay/backend';

/**
 * Get a recommended amount of time to delay before re-sending a request to
 * Nitr0gen in the hope that it will succeed next time.
 * @param error the error object returned from Nitr0gen. It doesn't
 * technically need to be an {@link Error} object; a string will do.
 * @param attempts the number of failed attempts
 * @returns
 * - `null` if the error is non-transient. You shouldn't bother retrying these
 * - a number of milliseconds to wait before retrying the transaction, if the
 * error is known to be transient
 */
export function getRetryDelayInMS(error: string, attempts = 1) {
  switch (true) {
    case error.includes('Busy Locks'):
    case error.includes('Network Not Stable'):
    case error.includes('Failed to rebroadcast'):
    case error.includes('timeout'):
    case error.includes('status code 500'):
    case error === otherError.orderFailed:
      return 250;
    case error.includes('Stream Position Incorrect'):
    case error.includes('Stream(s) not found'):
      return 10_000 + 5_000 * (attempts - 1);
    default:
      return null;
  }
}

// Below is to replicate previous backend Nitr0gen error handling
// which is to make implementation of sendTransactionInsistently later easier
// TODO: refactor this with sendTransactionInsistently
// so that we don't need to declare HTTP error on frontend
export class BadGatewayException extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, BadGatewayException.prototype);
  }
}

export class NotFoundException extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class ForbiddenException extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}
