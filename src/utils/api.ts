import type {
  IActivateWalletAccount,
  IActivateWalletAccountResponse,
  IChangePassword,
  IImportWallet,
  IImportWalletResponse,
  IKeyGeneration,
  IKeyGenerationResponse,
  IL1TransactionSigned,
  IL1TransactionSignResponse,
  ILoginUser,
  IMinimalUserResponse,
  IRegisterApiPassphrase,
  IRequestActivationCode,
  IRequestActivationCodeResponse,
  ITempShowOtkPrv,
  ITempShowOtkPrvResponse,
  ITransactionProposal,
  ITransactionSettledResponse,
  ITransactionVerifyResponse,
} from '@helium-pay/backend';

import { axiosBasePublic, axiosOwnerBase } from './axios-helper';

export const OwnersAPI = {
  importAccount: async (
    importData: IImportWallet
  ): Promise<IImportWalletResponse> => {
    const response = await axiosBasePublic.post(
      `/auth/import-wallet-account`,
      JSON.stringify(importData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },

  fetchKeyPair: async (
    importData: ITempShowOtkPrv
  ): Promise<ITempShowOtkPrvResponse> => {
    const response = await axiosBasePublic.post(
      `/auth/temp/show-otk-prv`,
      JSON.stringify(importData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return response.data;
  },

  login: async (loginData: ILoginUser): Promise<IMinimalUserResponse> => {
    const response = await axiosBasePublic.post(
      `/auth/login`,
      JSON.stringify(loginData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  logout: async (): Promise<void> => {
    const response = await axiosOwnerBase.post(`/auth/logout`);
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
  },
  registerApiPassphrase: async (
    registerData: IRegisterApiPassphrase
  ): Promise<void> => {
    const response = await axiosOwnerBase.post(
      `/auth/register-api`,
      JSON.stringify(registerData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
  },
  generateKey: async (
    keyGenerationData: IKeyGeneration
  ): Promise<IKeyGenerationResponse> => {
    const response = await axiosOwnerBase.post(
      `/key`,
      JSON.stringify(keyGenerationData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  verifyTransaction: async (
    transactionData: ITransactionProposal
  ): Promise<ITransactionVerifyResponse[]> => {
    const response = await axiosOwnerBase.post(
      `/key/verify-txns`,
      JSON.stringify(transactionData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  signTransaction: async (
    transactionToSignData: ITransactionProposal[]
  ): Promise<IL1TransactionSignResponse[]> => {
    const response = await axiosOwnerBase.post(
      `/key/sign`,
      JSON.stringify(transactionToSignData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  sendTransaction: async (
    signedTransactionData: IL1TransactionSigned[]
  ): Promise<ITransactionSettledResponse[]> => {
    const response = await axiosOwnerBase.post(
      `/key/send`,
      JSON.stringify(signedTransactionData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  changePassword: async (
    changePasswordData: IChangePassword
  ): Promise<void> => {
    const response = await axiosOwnerBase.post(
      `/auth/change-password`,
      JSON.stringify(changePasswordData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
  },

  requestActivationCode: async function (
    payload: IRequestActivationCode
  ): Promise<IRequestActivationCodeResponse> {
    const response = await axiosOwnerBase.post(
      `/auth/request-2fa-activation`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },

  activateNewAccount: async (
    payload: IActivateWalletAccount
  ): Promise<IActivateWalletAccountResponse> => {
    const response = await axiosOwnerBase.post(
      `/auth/activate-wallet-account`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return data as IActivateWalletAccountResponse;
  },
};
