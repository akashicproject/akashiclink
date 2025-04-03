import type {
  IAcnsSearch,
  IActivateWalletAccount,
  IActivateWalletAccountResponse,
  IChangePassword,
  ICheckL2Address,
  ICheckL2AddressResponse,
  IConfirmPassword,
  IImportWallet,
  IImportWalletResponse,
  IKeyGeneration,
  IKeyGenerationResponse,
  ILoginUser,
  IMinimalUserResponse,
  IRegisterApiPassphrase,
  IRequestActivationCode,
  IRequestActivationCodeResponse,
  ISearchAcnsResponse,
  ITempShowOtkPrv,
  ITempShowOtkPrvResponse,
  ITransactionBase,
  ITransactionProposal,
  ITransactionSettledResponse,
  ITransactionVerifyResponse,
  ITransferNft,
  ITransferNftResponse,
  IUpdateAcns,
} from '@helium-pay/backend';

import { axiosBase } from './axios-helper';

export const OwnersAPI = {
  importAccount: async (
    importData: IImportWallet
  ): Promise<IImportWalletResponse> => {
    const response = await axiosBase.post(
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
    const response = await axiosBase.post(
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
    const response = await axiosBase.post(
      `/auth/login`,
      JSON.stringify(loginData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  confirmPassword: async (
    loginData: IConfirmPassword
  ): Promise<IMinimalUserResponse> => {
    const response = await axiosBase.post(
      `/auth/confirm-password`,
      JSON.stringify(loginData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  registerApiPassphrase: async (
    registerData: IRegisterApiPassphrase
  ): Promise<void> => {
    const response = await axiosBase.post(
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
    const response = await axiosBase.post(
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
    const response = await axiosBase.post(
      `/key/verify-txns`,
      JSON.stringify(transactionData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  sendL1Transaction: async (
    transactionToSendData: ITransactionBase[]
  ): Promise<ITransactionSettledResponse[]> => {
    const response = await axiosBase.post(
      `/key/send/l1`,
      JSON.stringify(transactionToSendData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  sendL2Transaction: async (
    signedTransactionData: ITransactionProposal
  ): Promise<ITransactionSettledResponse> => {
    const response = await axiosBase.post(
      `/key/send/l2`,
      JSON.stringify(signedTransactionData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  checkL2Address: async (
    l2Check: ICheckL2Address
  ): Promise<ICheckL2AddressResponse> => {
    let requestUrl = `/owner/check-l2-address?to=${l2Check.to}`;
    if (l2Check.coinSymbol) requestUrl += `&coinSymbol=${l2Check.coinSymbol}`;
    const response = await axiosBase.get(requestUrl);
    console.log(response);
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return response.data;
  },

  checkL2AddressByAlias: async (
    l2Check: ICheckL2Address
  ): Promise<ICheckL2AddressResponse> => {
    const response = await axiosBase.get(
      `/nft/acns/check-l2-address?to=${l2Check.to}`
    );
    console.log(response);
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return response.data;
  },

  changePassword: async (
    changePasswordData: IChangePassword
  ): Promise<void> => {
    const response = await axiosBase.post(
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
    const response = await axiosBase.post(
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
    const response = await axiosBase.post(
      `/auth/activate-wallet-account`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return data as IActivateWalletAccountResponse;
  },

  nftSearch: async (iAcnsSearch: IAcnsSearch): Promise<ISearchAcnsResponse> => {
    const requestUrl = `/nft/acns/search?searchValue=${iAcnsSearch.searchValue}`;
    const response = await axiosBase.get(requestUrl);
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return response.data;
  },

  nftTransfer: async (payload: ITransferNft): Promise<ITransferNftResponse> => {
    const response = await axiosBase.post(
      `/nft/transfer`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return response.data;
  },

  updateAcns: async (updateAcns: IUpdateAcns) => {
    const response = await axiosBase.post(
      `/nft/acns`,
      JSON.stringify(updateAcns)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
  },

  deleteAccount: async () => {
    const response = await axiosBase.post(`/owner/me/delete`);
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
  },
};
