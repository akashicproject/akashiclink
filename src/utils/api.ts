import type {
  IChangePassword,
  IImportWallet,
  IImportWalletResponse,
  IKeyGeneration,
  IKeyGenerationResponse,
  ILoginUser,
  IMinimalUserResponse,
  IRegisterApiPassphrase,
  ITempShowOtkPrv,
  ITempShowOtkPrvResponse,
  ITransaction,
  ITransactionVerifyResponse,
} from '@helium-pay/backend';

import { axiosBasePublic, axiosOwnerBase } from '../utils/axiosHelper';

export const OwnersAPI = {
  importWallet: async (
    importData: IImportWallet
  ): Promise<IImportWalletResponse> => {
    const response = await axiosBasePublic.post(
      `/auth/import-wallet-with-otk-prv`,
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
    transactionData: ITransaction
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
};
