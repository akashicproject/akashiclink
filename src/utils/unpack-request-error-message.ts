import {
  authError,
  keyError,
  otherError,
  userError,
} from '@helium-pay/backend';
import axios from 'axios';

/**
 * find the correct error message string from i18n folder, if not, return t(`GenericFailureMsg`)
 *
 *
 * @returns string for error message
 * @param error error from try catch
 */
export const unpackRequestErrorMessage = (error: unknown) => {
  const errorMsg = axios.isAxiosError(error)
    ? error?.response?.data?.message
    : '';

  switch (errorMsg) {
    case userError.userNotFoundError:
      return 'UserDoesNotExist';
    case userError.activationCodeInvalid:
      return 'ActivationCodeInvalid';
    case authError.otkNotFoundError:
      return 'OTKNotFound';
    case keyError.unownedKey:
      return 'UnownedKey';
    case otherError.providerError:
      return 'ProviderError';
    case keyError.noTransaction:
      return 'NoTransaction';
    case otherError.unsupportedCoinError:
      return 'UnsupportedCoinError';
    case otherError.transactionTooSmallError:
      return 'TransactionTooSmall';
    case otherError.validationError:
      return 'ValidationError';
    case userError.invalidApiPassOrPassword:
      return 'InvalidApiPassOrPassword';
    case userError.invalidUserErrorMsg:
      return 'InvalidUserOrPass';
    case userError.invalidPassErrorMsg:
      return 'InvalidPassword';
    case authError.newPassIsSameAsOldError:
      return 'NewPassSameAsOld';
    case keyError.savingsExceeded:
      return 'SavingsExceeded';
    case keyError.tokenNotFound:
      return 'TokenNotFound';
    default:
      return 'GenericFailureMsg';
  }
};
