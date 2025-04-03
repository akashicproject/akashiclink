import {
  authError,
  keyError,
  otherError,
  userConst,
} from '@helium-pay/backend';
import { useTranslation } from 'react-i18next';

/**
 * find the correct error message string from i18n folder, if not, return t(`GenericFailureMsg`)
 *
 * @param errorMsg Backend error message string
 *
 * @returns string for error message
 */
export const handleErrorMessage = (errorMsg: string) => {
  const { t } = useTranslation();
  switch (errorMsg) {
    case userConst.userNotFoundError:
      return t('UserDoesNotExist');
    case authError.otkNotFoundError:
      return t('OTKNotFound');
    case keyError.unownedKey:
      return t('UnownedKey');
    case otherError.providerError:
      return t('ProviderError');
    case keyError.noTransaction:
      return t('NoTransaction');
    case otherError.unsupportedCoinError:
      return t('UnsupportedCoinError');
    case otherError.transactionTooSmallError:
      return t('TransactionTooSmall');
    case otherError.validationError:
      return t('ValidationError');
    default:
      return t('GenericFailureMsg');
  }
};
