import { datadogRum } from '@datadog/browser-rum';
import {
  AuthError,
  KeyError,
  NftError,
  OtherError,
  UserError,
} from '@helium-pay/backend';
import axios from 'axios';

import type { I18nKeys } from '../i18n/I18nNamespaces';

export enum AppError {
  InvalidMethod = 'InvalidMethod',
  NeedPubKey = 'NeedPubKey',
  NeedThresholds = 'NeedThresholds',
  NoSelfSend = 'NoSelfSend',
  AASLinkingFailed = 'AASLinkingFailed',
  InvalidSecretPhrase = 'InvalidSecretPhrase',
}

const errorMessageMap = new Map<
  AppError | UserError | AuthError | KeyError | NftError | OtherError,
  I18nKeys
>([
  // backend error / wallet reusing backend error
  [UserError.userNotFoundError, 'UserDoesNotExist'],
  [UserError.activationCodeInvalid, 'ActivationCodeInvalid'],
  [AuthError.otkNotFoundError, 'OTKNotFound'],
  [OtherError.providerError, 'ProviderError'],
  [OtherError.unsupportedCoinError, 'UnsupportedCoinError'],
  [OtherError.transactionTooSmallError, 'TransactionTooSmall'],
  [OtherError.validationError, 'ValidationError'],
  [UserError.invalidApiPassOrPassword, 'InvalidApiPassOrPassword'],
  [UserError.invalidUserErrorMsg, 'InvalidUserOrPass'],
  [UserError.invalidPassErrorMsg, 'InvalidPassword'],
  [AuthError.newPassIsSameAsOldError, 'NewPassSameAsOld'],
  [KeyError.tokenNotFound, 'TokenNotFound'],
  [KeyError.walletIsBusy, 'WalletIsBusy'],
  [KeyError.transactionTimedOut, 'transactionTimeOut'],
  [KeyError.invalidPrivateKey, 'InvalidKeyPair'],
  [NftError.onlyOneAASLinkingAllowed, 'OnlyOneAAS'],
  // nitr0gen errors
  [KeyError.invalidL2Address, 'UserDoesNotExist'],
  [KeyError.savingsExceeded, 'ActivationCodeInvalid'],
  [OtherError.orderFailed, 'OTKNotFound'],
  [OtherError.transactionExpired, 'TransactionExpired'],
]);

const appErrorMessageMap = new Map<AppError, I18nKeys>([
  [AppError.InvalidMethod, 'InvalidMethod'],
  [AppError.NeedPubKey, 'NeedPubKey'],
  [AppError.NeedThresholds, 'NeedThresholds'],
  [AppError.NoSelfSend, 'NoSelfSend'],
  [AppError.AASLinkingFailed, 'AASLinkingFailed'],
  [AppError.InvalidSecretPhrase, 'InvalidSecretPhrase'],
]);

export const getErrorMessageTKey = (error: unknown): I18nKeys => {
  const message = axios.isAxiosError(error)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error.response?.data as any)?.message
    : (error as Error).message;
  if (errorMessageMap.has(message)) {
    return errorMessageMap.get(message)!;
  } else if (appErrorMessageMap.has(message)) {
    return appErrorMessageMap.get(message)!;
  } else {
    datadogRum.addError(error);
    return 'GenericFailureMsg';
  }
};
